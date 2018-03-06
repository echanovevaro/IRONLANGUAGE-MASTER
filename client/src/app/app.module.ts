import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';
import { SessionService } from "./services/session.service";
import { CollectionsService } from "./services/collections.service";
import { ProfileService } from "./services/profile.service";
import { MeetupService } from "./services/meetup.service";
import { RouterModule } from "@angular/router";
import { FileSelectDirective } from "ng2-file-upload";
import { routes } from './routes';
import { AppComponent } from './app.component';
import { AuthLoginComponent } from './auth-login/auth-login.component';
import { AuthSignupComponent } from './auth-signup/auth-signup.component';
import { ProfileComponent } from './profile/profile.component';
import { ProfileSearchComponent } from './profile-search/profile-search.component';
import { MeetupComponent } from './meetup/meetup.component';
import { MeetupListComponent } from './meetup-list/meetup-list.component';
import { MeetupDetailComponent } from './meetup-detail/meetup-detail.component';
import { AgmCoreModule } from '@agm/core';



//importar este módulo HttpClient en el fichero app.module.ts


@NgModule({
  declarations: [
    AppComponent,
    AuthLoginComponent,
    AuthSignupComponent,

    FileSelectDirective,
    ProfileComponent,
    ProfileSearchComponent,

    MeetupComponent,
    MeetupListComponent,
    MeetupDetailComponent,

  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    RouterModule.forRoot(routes),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyDlq0n-GhsBi575QJmwr9i8O3kzY0xiyi0',
      libraries: ['places']
    })
  ],
  providers: [SessionService, CollectionsService, ProfileService,
    , MeetupService ],
  bootstrap: [AppComponent]
})
export class AppModule { }
// intancia unica accesible desde toda la aplicacion
// exporta todo
