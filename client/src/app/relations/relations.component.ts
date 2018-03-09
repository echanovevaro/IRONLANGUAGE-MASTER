import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { RelationService } from "./../services/relation.service";
import { Router } from '@angular/router';

@Component({
  selector: 'app-relations',
  templateUrl: './relations.component.html',
  styleUrls: ['./relations.component.css']
})
export class RelationsComponent implements OnInit {
  currentUser: any;
  error: string = "";

  constructor(private session: SessionService,
    private relation: RelationService, private router: Router) { }

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
            },
            (err) => {
              this.error = err;
            }
          );
        }
      });
  }

  accept(id) {
    this.relation.accept(id)
      .subscribe(
      (user) => {
        this.currentUser = user;
      },
      (err) => {
        this.error = err;
      });
  }
}
