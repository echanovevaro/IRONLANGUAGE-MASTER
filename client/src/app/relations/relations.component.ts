import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { Router } from '@angular/router';
import * as _ from 'underscore';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})
export class RelationsComponent implements OnInit {
  BASE_URL: string = 'http://localhost:3000';
  currentUser: any;
  messages: any;
  error: string = "";
  constructor(private session: SessionService, private relation: RelationService, private router: Router) { }

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
        } else {
          this.relation.getRelations().subscribe(
            (user) => {
              this.currentUser = user;

              this.messages = _.groupBy(user.messages, function (message: any) {
                return message.from != this.currentUser._id ? message.from : message.to;
              }, this);

              this.messages = _.mapObject(this.messages, function (list: any[], key) {
                return _.sortBy(list, list['created']).reverse();
              });

              this.messages = _.mapObject(this.messages, function (list: any[], key) {
                let news = _.reduce(list, function(news, msg) {
                  if (!msg.checked && msg.to == this.currentUser._id) { return ++news; }
                  return news;
                }, 0, this);
                return { 'messages': list, 'news': news }
              }, this);

            },
            (err) => {
              this.error = err;
            });
        }
      });
  }

}
