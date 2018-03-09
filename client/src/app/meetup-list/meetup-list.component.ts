import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { MeetupService } from "./../services/meetup.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-meetup-list',
  templateUrl: './meetup-list.component.html',
  styleUrls: ['./meetup-list.component.css']
})
export class MeetupListComponent implements OnInit {
  error: String = "";
  meetups: any[] = [];
  assistMeetups: any[] = [];
  currentUser: any;
  constructor(private meetupService: MeetupService,
    private session: SessionService, private router: Router) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        } else {
          this.currentUser = user;

          this.meetupService.get()
            .subscribe(meetups => {
              this.meetups = meetups;
            });

          this.meetupService.getAssist()
            .subscribe(meetups => {
              this.assistMeetups = meetups;
            });
        }
      });
  }

}
