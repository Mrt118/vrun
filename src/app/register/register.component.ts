import { Component, OnInit } from '@angular/core';
import { UserService } from '../shared/users/user.service';
import { Users } from '../shared/users/user.model';


@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  allUsers: Users[];
  // allUsers: any[];
  addUers: Users;
  selectUser: Users;
  del: any;


  constructor(private userServ: UserService) { }

  postUser(addUers) {
    this.userServ.postUser(addUers).subscribe(result => {
      // alert(JSON.stringify(result));
      this.getUsers();
    });
  }

  getUsers() {
    this.userServ.getAllUser().subscribe(result => {
        this.allUsers = result;
    });
  }

  selectUsers() {
    this.userServ.getOneUser().subscribe(result => {
        this.selectUser = result;
    });
  }

  // delUser(data) {
  //   this.userServ.delUser(data).subscribe(result => {
  //     console.log(JSON.stringify(result));
  //     this.getUsers();
  //   });
  // }


  ngOnInit() {
    this.getUsers();
  }

}
