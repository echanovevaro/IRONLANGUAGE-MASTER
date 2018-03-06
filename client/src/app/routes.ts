import { Routes } from '@angular/router';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { MeetupComponent } from './meetup/meetup.component';
import { MeetupListComponent } from './meetup-list/meetup-list.component';
import { MeetupDetailComponent } from './meetup-detail/meetup-detail.component';

export const routes: Routes = [

  { path: 'login', component: AuthLoginComponent },
  { path: 'signup', component: AuthSignupComponent },
  { path: 'edit', component: AuthSignupComponent },
  { path: 'private', component: ProfileComponent },
  { path: 'search', component: ProfileSearchComponent },
  { path: 'meetup/new', component: MeetupComponent },
  { path: 'meetup/list', component: MeetupListComponent },
  { path: 'meetup/:id', component: MeetupDetailComponent },
  { path: '**', redirectTo: 'private' }
];
// path ruta
