import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private user = new BehaviorSubject({});
  userSource = this.user.asObservable();
  constructor(private http:HttpClient) { }

  registerUser(user)
  {
    return this.http.post(environment.API_ENPOINT+'/users',user);
  }

  getAllUsers()
  {
    return this.http.get(environment.API_ENPOINT+'/users/');
  }
  getUser(userId)
  {
    return this.http.get(environment.API_ENPOINT+'/users/'+userId);
  }

  editUserProfile(userObj)
  {
    return this.http.put(environment.API_ENPOINT+'/users/'+userObj.id,userObj);
  }

  updateUser(data)
  {
    this.user.next(data);
  }
}
