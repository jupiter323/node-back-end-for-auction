import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class CarsService {

  constructor(private http: HttpClient) { }
  // url = environment.externalUrl;
  // getUsers() {
  //   return this.http.get(this.url + 'api/companies');
  // }
  url = 'http://localhost:4000';
  getUsers() {
    return this
      .http
      .get(`${this.url}/results`);
  }
}
