import { Component, OnInit } from '@angular/core';
import { SessionService } from './services/session.service';
import { Router } from '@angular/router';
import { NavigationEnd } from '@angular/router';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor(private sessionService: SessionService, private router: Router) { }
  userLogged: boolean = false;
  connection;

  ngOnInit() {
    this.router.events.subscribe((e: any) => {
      if (e instanceof NavigationEnd) {
        this.actualize();
      }
    });
  }




  actualize(){
    this.sessionService.isLogged()
    .subscribe(
      (user) => {
        if(user){
          this.userLogged = true;
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
