import { Component, OnInit, AfterViewInit, ViewChild, Inject } from '@angular/core';
import { MembersService, Member } from '../../services/members.service';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { debounceTime } from 'rxjs/operators';
import { DatePipe } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-members-list',
  standalone: true,
  imports: [
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatSnackBarModule,
    ReactiveFormsModule,
    MatDialogModule,
    DatePipe,
  ],
  templateUrl: './members-list.component.html',
  styleUrl: './members-list.component.scss',
})
export class MembersListComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['id', 'prefix', 'firstName', 'lastName', 'birthDate', 'age', 'actions'];
  dataSource = new MatTableDataSource<Member>([]);
  total = 0;
  pageSize = 10;
  pageIndex = 0;
  searchControl = new FormControl<string>('');

  @ViewChild(MatPaginator) paginator!: MatPaginator;

  constructor(
    private membersService: MembersService,
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
  ) {}

  ngOnInit() {
    this.loadMembers();
    this.searchControl.valueChanges.pipe(debounceTime(300)).subscribe((search) => {
      this.pageIndex = 0;
      this.loadMembers(search || undefined);
    });
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  loadMembers(search?: string) {
    this.membersService.getMembers(search, this.pageIndex + 1, this.pageSize).subscribe({
      next: ({ data, total }) => {
        console.log('Loaded members:', data, 'Total:', total);
        this.dataSource.data = data;
        this.total = total;
      },
      error: (err) => {
        console.error('Load members error:', err);
        this.snackBar.open('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'ปิด', { duration: 3000 });
      },
    });
  }

  openMemberDialog(member?: Member) {
    const dialogRef = this.dialog.open(MemberDialogComponent, {
      width: '500px',
      data: member ? { ...member } : null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.loadMembers(this.searchControl.value || undefined);
      }
    });
  }

  deleteMember(id: number) {
    if (confirm('ยืนยันการลบสมาชิก?')) {
      this.membersService.deleteMember(id).subscribe({
        next: () => {
          this.snackBar.open('ลบสมาชิกสำเร็จ', 'ปิด', { duration: 2000 });
          this.loadMembers(this.searchControl.value || undefined);
        },
        error: () => this.snackBar.open('เกิดข้อผิดพลาดในการลบ', 'ปิด', { duration: 3000 })
      });
    }
  }

  onPageChange(event: any) {
    this.pageIndex = event.pageIndex;
    this.pageSize = event.pageSize;
    this.loadMembers(this.searchControl.value || undefined);
  }
}

@Component({
  selector: 'app-member-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatDatepickerModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    MatSelectModule,
    MatOptionModule,
  ],
   template: `
    <h2 mat-dialog-title>{{ data ? 'แก้ไขสมาชิก' : 'เพิ่มสมาชิก' }}</h2>
    <mat-dialog-content>
      <form [formGroup]="form">
        <mat-form-field appearance="outline">
          <mat-label>คำนำหน้า</mat-label>
          <input matInput formControlName="prefix">
          <mat-error *ngIf="form.get('prefix')?.hasError('required')">กรุณากรอกคำนำหน้า</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>ชื่อ</mat-label>
          <input matInput formControlName="firstName">
          <mat-error *ngIf="form.get('firstName')?.hasError('required')">กรุณากรอกชื่อ</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>นามสกุล</mat-label>
          <input matInput formControlName="lastName">
          <mat-error *ngIf="form.get('lastName')?.hasError('required')">กรุณากรอกนามสกุล</mat-error>
        </mat-form-field>
        <mat-form-field appearance="outline">
          <mat-label>วันเกิด</mat-label>
          <input matInput [matDatepicker]="picker" formControlName="birthDate">
          <mat-datepicker-toggle matSuffix [for]="picker"></mat-datepicker-toggle>
          <mat-datepicker #picker></mat-datepicker>
          <mat-error *ngIf="form.get('birthDate')?.hasError('required')">กรุณาเลือกวันเกิด</mat-error>
        </mat-form-field>
        <input type="file" (change)="onFileChange($event)" accept="image/*">
      </form>
    </mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button (click)="dialogRef.close()">ยกเลิก</button>
      <button mat-button [disabled]="form.invalid" (click)="submit()">บันทึก</button>
    </mat-dialog-actions>
  `,
  styles: `
    mat-form-field {
      width: 100%;
      margin-bottom: 16px;
    }
    input[type="file"] {
      margin-top: 16px;
    }
  `,
})
export class MemberDialogComponent {
  form: FormGroup;
  file?: File;

  constructor(
    private fb: FormBuilder,
    private membersService: MembersService,
    private snackBar: MatSnackBar,
    public dialogRef: MatDialogRef<MemberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Member | null,
  ) {
    this.form = this.fb.group({
      prefix: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
    });

    if (data) {
      this.form.patchValue({
        ...data,
        birthDate: data.birthDate ? new Date(data.birthDate) : '',
      });
      console.log('Form patched with data:', this.form.value);
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }

  submit() {
    if (this.form.invalid) {
      this.snackBar.open('กรุณากรอกข้อมูลให้ครบถ้วน', 'ปิด', { duration: 3000 });
      return;
    }

    const formData = new FormData();
    formData.append('prefix', this.form.get('prefix')?.value);
    formData.append('firstName', this.form.get('firstName')?.value);
    formData.append('lastName', this.form.get('lastName')?.value);
    formData.append('birthDate', new Date(this.form.get('birthDate')?.value).toISOString().split('T')[0]);
    if (this.file) {
      formData.append('profilePicture', this.file);
    }

    const action = this.data?.id
      ? this.membersService.updateMember(this.data.id, formData)
      : this.membersService.createMember(formData);

    action.subscribe({
      next: () => {
        this.snackBar.open(this.data ? 'แก้ไขสมาชิกสำเร็จ' : 'เพิ่มสมาชิกสำเร็จ', 'ปิด', { duration: 2000 });
        this.dialogRef.close(true);
      },
      error: (err) => {
        console.error('Submit error:', err);
        this.snackBar.open('เกิดข้อผิดพลาดในการบันทึก', 'ปิด', { duration: 3000 });
      },
    });
  }
}