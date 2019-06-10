import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title = 'vrun';
  showDropDown = false;
  alertShow = false;
  bel = false;
  numBel: Number = 5;

  constructor() {  }

  ngOnInit() {
    this.showBel();
  }

  toggleDropDown() {
    this.showDropDown = !this.showDropDown;
    this.alertShow = false;
    console.log('clicked');
  }

  alertDropDown() {
    this.alertShow = !this.alertShow;
    this.showDropDown = false;
    this.numBel = 0;
    this.showBel();
    console.log('clicked');
  }

  showBel() {
    if (this.numBel > 0) {
      this.bel = true;
    } else {
      this.bel = false;
    }
  }

}
