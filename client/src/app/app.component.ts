import { Component, OnInit } from '@angular/core';
import { Observable } from "rxjs/Rx";
import { SessionService } from "./services/session.service";
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';
import { ChatService } from './services/chat.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  userLogged: boolean = false;

  constructor(private sessionService: SessionService, private router: Router) { }

  ngOnInit() {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.initialise();
      }
    });
  }

  initialise() {
    this.sessionService.isLogged()
      .subscribe(
        (user) => {
          if (user) {
            this.userLogged = true;
          } else {
            this.userLogged = false;
          }
      });
  }

  logout() {
    this.sessionService.logout()
      .subscribe(
        () => {
          this.userLogged = false;
          this.router.navigate(['/login']);
      });
  }

}
