import { Component, OnInit } from '@angular/core';
import { SessionService } from "./../services/session.service";
import { ProfileService } from "./../services/profile.service";
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  BASE_URL:string='http://localhost:3000'
  currentUser: any;
  user: any;
  error: string;

  constructor(private session: SessionService, private profile: ProfileService, 
    private router: Router, private route: ActivatedRoute ) { }
  //contructor depende se si necesitas sevicios dentro
  // . suscribe esperar a que ternine, metodo pra obsebables

  ngOnInit() {
    this.session.isLogged()
      .subscribe(
      (currentUser) => {
        if (!currentUser) {
          this.router.navigate(['/login']);
        } else {
          this.currentUser = currentUser;
          this.route.params.subscribe(params => {
            if (params['id']) {
              this.profile.get(params['id'])
                .subscribe(
                (user) => {
                  this.user = user;
                });
            } else {
              this.user = currentUser;
            }
          });
        }
      });
  }

  
}
