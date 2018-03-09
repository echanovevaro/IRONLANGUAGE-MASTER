import { Injectable } from '@angular/core';
import { Http, Response } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/catch';
import { Observable } from 'rxjs/Rx';
import { RequestOptions } from '@angular/http';
import { Headers } from '@angular/http';
import { environment } from '../../environments/environment';

let headers = new Headers({ 'Content-Type': 'application/json' });
let options = new RequestOptions({ headers: headers, withCredentials: true });

@Injectable()
export class MeetupService {
  BASE_URL: string = `${environment.BASE_URL}/api/meetups`;
  constructor(private http: Http) { }

  handleError(e) {
    return Observable.throw(e.json().message);
  }

  create(meetup) {
    return this.http.post(`${this.BASE_URL}`, meetup, options)
      .map(res => res.json())
      .catch(this.handleError);
  }

  get() {
    return this.http.get(`${this.BASE_URL}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getDetail(id) {
    return this.http.get(`${this.BASE_URL}/detail/${id}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  assist(meetupId) {
    return this.http.post(`${this.BASE_URL}/assist`, {meetup: meetupId} ,options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getAssist() {
    return this.http.get(`${this.BASE_URL}/assist`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  getMessages(id) {
    return this.http.get(`${this.BASE_URL}/messages/${id}`, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }

  sendMessage(message) {
    return this.http.post(`${this.BASE_URL}/messages/${message.meetup}`, { message }, options)
      .map((res) => res.json())
      .catch(this.handleError);
  }
}
