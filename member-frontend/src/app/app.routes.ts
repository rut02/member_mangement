import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/members', pathMatch: 'full' },
  {
    path: 'members',
    loadComponent: () => import('./components/members-list/members-list.component').then(m => m.MembersListComponent),
  },
  {
    path: 'members/new',
    loadComponent: () => import('./components/member-form/member-form.component').then(m => m.MemberFormComponent),
  },
  {
    path: 'members/edit/:id',
    loadComponent: () => import('./components/member-form/member-form.component').then(m => m.MemberFormComponent),
  },
  {
    path: 'report',
    loadComponent: () => import('./components/age-report/age-report.component').then(m => m.AgeReportComponent),
  },
];