import { Routes } from '@angular/router';
import { DiscoverJobsComponent } from './user/discover-jobs/discover-jobs.component';
// import { NotFoundComponent } from './not-found/not-found.component';
import { adminAuthGuard } from './admin/guards/admin-auth.guard';
import { JobDetailsComponent } from './user/job-details/job-details.component';
import { ApplyPageComponent } from './user/apply-page/apply-page.component';

export const routes: Routes = [
  // { path: '', redirectTo: 'jobs', pathMatch: 'full' },
  { path: '', component: DiscoverJobsComponent },
  { path: 'jobs/:id', component: JobDetailsComponent },
  { path: 'jobs/apply/:id', component: ApplyPageComponent },
  {
    path: 'login',
    loadComponent: () =>
      import('./user/login/login.component').then((mod) => mod.LoginComponent),
  },
  {
    path: 'register',
    loadComponent: () =>
      import('./user/register/register.component').then(
        (mod) => mod.RegisterComponent,
      ),
  },
  // { path: 'profile', component: ProfileComponent },
  {
    path: 'profile',
    loadComponent: () =>
      import('./user/profile/profile.component').then(
        (mod) => mod.ProfileComponent,
      ),
  },
  {
    path: 'profile/update-password',
    loadComponent: () =>
      import('./user/change-password/change-password.component').then(
        (mod) => mod.ChangePasswordComponent,
      ),
  },
  {
    path: 'verify_mail',
    loadComponent: () =>
      import('./user/account-verification/account-verification.component').then(
        (mod) => mod.AccountVerificationComponent,
      ),
  },
  // { path: 'verify_mail', component: AccountVerificationComponent },

  {
    path: 'admin',
    children: [
      {
        path: 'login',
        loadComponent: () =>
          import('./admin/login/login.component').then(
            (mod) => mod.LoginComponent,
          ),
      },
      {
        path: 'dashboard',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./admin/dashboard/dashboard.component').then(
            (mod) => mod.DashboardComponent,
          ),
      },
      {
        path: 'dashboard/jobs',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./admin/jobs/jobs.component').then(
            (mod) => mod.JobsComponent,
          ),
      },
      {
        path: 'dashboard/archived-jobs',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./admin/archived-jobs/archived-jobs.component').then(
            (mod) => mod.ArchivedJobsComponent,
          ),
      },
      {
        path: 'dashboard/jobs/:id',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./admin/job-details/job-details.component').then(
            (mod) => mod.JobDetailsComponent,
          ),
      },
      {
        path: 'dashboard/job/applicants/:id',
        canActivate: [adminAuthGuard],
        loadComponent: () =>
          import('./admin/job-applicants/job-applicants.component').then(
            (mod) => mod.JobApplicantsComponent,
          ),
      },
      {
        path: 'dashboard/new-job',
        canActivate: [adminAuthGuard],

        loadComponent: () =>
          import('./admin/new-job/new-job.component').then(
            (mod) => mod.NewJobComponent,
          ),
      },
    ],
  },
  // { path: '**', component: NotFoundComponent, title: '404 Not Found' },
  { path: '**', redirectTo: '/', pathMatch: 'full' },
];
