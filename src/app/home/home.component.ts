import { Component, OnInit } from '@angular/core';
import { EventsService } from '../shared/events/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  all: any;
  sumEvent: Number = 0;

  urlimg = 'http://localhost:5618/';

  constructor(private event: EventsService) { }

  ngOnInit() {
    this.getDarftEvent();
  }

  getDarftEvent() {
    this.event.getEvent().subscribe(
      (data) => {
        if (!data) {
          console.log('error data not found.');
        } else {
          console.log(data);
          this.all = data.events;
          this.sumEvent = this.all.length;
        }
      }
    );
  }

}
