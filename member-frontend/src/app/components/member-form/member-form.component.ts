import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink, RouterOutlet } from '@angular/router';
import { MembersService, Member } from '../../services/members.service';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';

@Component({
  selector: 'app-member-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatButtonModule,
    MatCardModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatSnackBarModule,
        
  ],
  templateUrl: './member-form.component.html',
  styleUrl: './member-form.component.scss',
})
export class MemberFormComponent implements OnInit {
  form: FormGroup;
  memberId?: number;
  file?: File;

  prefixes = ['นาย', 'นาง', 'นางสาว'];

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private membersService: MembersService,
    private snackBar: MatSnackBar,
  ) {
    this.form = this.fb.group({
      prefix: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      birthDate: ['', Validators.required],
      profilePicture: [null],
    });
  }

  ngOnInit() {
    this.memberId = +this.route.snapshot.params['id'];
    if (this.memberId) {
      this.membersService.getMember(this.memberId).subscribe({
        next: (member) => {
          this.form.patchValue({
            prefix: member.prefix,
            firstName: member.firstName,
            lastName: member.lastName,
            birthDate: member.birthDate,
          });
        },
        error: () => this.snackBar.open('เกิดข้อผิดพลาดในการโหลดข้อมูล', 'ปิด', { duration: 3000 }),
      });
    }
  }

  onFileChange(event: any) {
    if (event.target.files.length > 0) {
      this.file = event.target.files[0];
    }
  }
public cancel(): void {
  this.router.navigate(['/members']);
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
    formData.append('birthDate', this.form.get('birthDate')?.value);
    if (this.file) {
      formData.append('profilePicture', this.file);
    }

    const action = this.memberId
      ? this.membersService.updateMember(this.memberId, formData)
      : this.membersService.createMember(formData);

    action.subscribe({
      next: () => {
        this.snackBar.open(this.memberId ? 'แก้ไขสมาชิกสำเร็จ' : 'เพิ่มสมาชิกสำเร็จ', 'ปิด', { duration: 2000 });
        this.router.navigate(['/members']);
      },
      error: () => this.snackBar.open('เกิดข้อผิดพลาดในการบันทึก', 'ปิด', { duration: 3000 }),
    });
  }
}