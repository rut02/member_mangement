import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface Member {
  id: number;
  prefix: 'นาย' | 'นาง' | 'นางสาว';
  firstName: string;
  lastName: string;
  birthDate: string;
  profilePicture?: string | null;
  createdAt: string;
  updatedAt: string;
  age: number;
}

@Injectable({ providedIn: 'root' })
export class MembersService {
  private apiUrl = 'http://localhost:3000/members';

  constructor(private http: HttpClient) {}

  getMembers(search?: string, page = 1, limit = 10): Observable<{ data: Member[]; total: number }> {
    let params: any = { page: page.toString(), limit: limit.toString() };
    if (search) params.search = search;
    return this.http.get<{ data: Member[]; total: number }>(this.apiUrl, { params });
  }

  createMember(member: FormData): Observable<Member> {
    return this.http.post<Member>(this.apiUrl, member);
  }

  getMember(id: number): Observable<Member> {
    return this.http.get<Member>(`${this.apiUrl}/${id}`);
  }

  updateMember(id: number, member: FormData): Observable<Member> {
    return this.http.put<Member>(`${this.apiUrl}/${id}`, member);
  }

  deleteMember(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getAgeReport(): Observable<{ age: number; count: number }[]> {
    return this.http.get<{ age: number; count: number }[]>(`${this.apiUrl}/report/age`);
  }
}