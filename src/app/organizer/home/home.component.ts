import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  persent: Number = 80;

  constructor() { }

  ngOnInit() {
  }

  returnPersent() {
    return this.persent;
  }

}
