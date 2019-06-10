import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Users } from './user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  alluserUrl = 'http://localhost:5618/getUser';
  adduserUrl = 'http://localhost:5618/addUser';
  oneuserUrl = 'http://localhost:5618/getUser/:id';
  deluserUrl = 'http://localhost:5618/delUser/:id';

  constructor(private http: HttpClient) {

  }

  postUser(data): Observable<Users> {
    return this.http.post<Users>(this.adduserUrl, data);
  }
  getAllUser(): Observable<any[]> {
    return this.http.get<Users[]>(this.alluserUrl);
  }
  getOneUser(): Observable<Users> {
    return this.http.get<Users>(this.oneuserUrl);
  }
  delUser(data): Observable<any> {
    return this.http.delete<any>(this.deluserUrl, data);
  }

}
