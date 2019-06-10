import { Component, OnInit } from '@angular/core';
import { Validators, FormGroup, FormBuilder } from '@angular/forms';
import { EventsService } from 'src/app/shared/events/events.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  statusForm: FormGroup;
  idevent: any;
  darft: any;

  urlimg = 'http://localhost:5618/';

  constructor(private fb: FormBuilder, private event: EventsService) { }

  ngOnInit() {
    this.getDarftEvent();
  }

  getDarftEvent() {
    this.event.getDarftEvent().subscribe(
      (data) => {
        if (!data) {
          console.log('error data not found.');
        } else {
          console.log(data);
          this.darft = data.events;
          this.setStatusForm();
        }
      }
    );
  }

  setStatusForm() {
    this.statusForm = this.fb.group({
      event_id: [this.idevent, [Validators.required]]
    });
  }

  status(value: any) {

    this.idevent = value;
    console.log(this.idevent);

    this.event.setStatusPublish(this.idevent).subscribe(
      (data) => {
        console.log(data);
        if (!data) {
          console.log('error data not found.');
        } else {
          if (data.result === 'success') {
            console.log('ok status');
            this.getDarftEvent();
          }
        }
      }
    );
  }

}
