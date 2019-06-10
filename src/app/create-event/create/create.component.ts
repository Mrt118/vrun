import { Component, OnInit } from '@angular/core';
import { EventsService } from 'src/app/shared/events/events.service';
import { FormBuilder, FormGroup, FormArray, FormControl, Validator, Validators } from '@angular/forms';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';

// import { Event } from '../shared/events/event.model';

@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent implements OnInit {
  eventForm: FormGroup;
  form: FormGroup;

  myVar = true;
  mySwitch = true;
  before: boolean;
  send = true;

  digitalC: boolean;
  shirtC: boolean;
  cupC: boolean;
  coinC: boolean;
  moneyC: boolean;

  goldofruns: string[] = [
    'Fun Run',
    'Charity',
    'Competition'
  ];
  descriptionLength = 0;
  addEvent: any[];


  selectedFile: File = null;
  selectedFile2: File = null;

  constructor(private eventsService: EventsService, private fb: FormBuilder) {
    // Create a new array with a form control for each order
    // const controls = this.distances.map(c => new FormControl(false));
    // controls[0].setValue(true); // Set the first checkbox to true (checked)

    // this.form = this.fb.group({
    //   distances: new FormArray(controls, this.minSelectedCheckboxes(1))
    // });

  }

  ngOnInit() {

    this.dataset();


    this.eventForm = this.fb.group({
      ogz_id: [''],
      eventName: ['', [Validators.required, Validators.minLength(1), Validators.maxLength(60)]],
      description: ['' , [Validators.maxLength(120)]],
      startDate: ['', [Validators.required]],
      endDate: ['', [Validators.required]],
      goldofrun: ['', [Validators.required]],
      distances: this.fb.group({
        distance: ['', [Validators.required]],
        price: ['', [Validators.required]]
      }),
      runTime: ['Single Time'],
      fileBg: [''],
      detailEvent: [''],
      detailJoin: [''],
      detailAward: [''],
      awords: this.fb.group({
        aDigiCoin: this.fb.group({
          fileDigicoin: [''],
          name: [''],
          description: ['']
        }),
        aShirt: [''],
        aSizeShirt: [''],
        aCup: [''],
        aCoin: [''],
        aMoney: ['']
      }),
      deliveryPrice: [0],
      status: ['darft'],
      limitdate: [''],
      limitjoin: [''],
      bibNumber: [''],
      stat:  this.fb.group({
        view: [0],
        rate: [0],
        like: [0],
        join: [0]
      })
    });

    this.d.valueChanges.subscribe((value: string) => {
      this.descriptionLength = value.length;
    });
  }

  // easy call
  get e() { return this.eventForm.get('eventName'); }
  get d() { return this.eventForm.get('description'); }
  get s() { return this.eventForm.get('startDate'); }
  get n() { return this.eventForm.get('endDate'); }
  get g() { return this.eventForm.get('goldofrun'); }
  get t() { return this.eventForm.get('distance'); }
  get p() { return this.eventForm.get('price'); }

  // submit() {
  //   const selectedOrderIds = this.form.value.distances
  //     .map((v, i) => v ? this.distances[i].distance : null)
  //     .filter(v => v !== null);

  //   return selectedOrderIds;
  // }

  // dis() {
  //   const disString = this.submit();
  //   const data = disString.toString;
  //   return data;
  // }

  dataset() {
    this.before = true;

    this.digitalC = false;
    this.shirtC = true;
    this.cupC = true;
    this.coinC = true;
    this.moneyC = true;
  }
  showData() {
    this.mySwitch = !this.mySwitch;
  }
  switchData() {
    this.myVar = !this.myVar;
  }
  haveb() {
    this.before = true;
  }
  haveb_f() {
    this.before = false;
  }
  sendFree() {
    this.send = true;
  }
  sendPrice() {
    this.send = false;
  }
  showdigitalC() {
    this.digitalC = !this.digitalC;

    console.log(this.digitalC);
  }
  showshirtC() {
    this.shirtC = !this.shirtC;
  }
  showcupC() {
    this.cupC = !this.cupC;
  }
  showcoinC() {
    this.coinC = !this.coinC;
  }
  showmoneyC() {
    this.moneyC = !this.moneyC;
  }

  onFileSelected(event) {
    // console.log(event);
    this.selectedFile = <File>event.target.files[0];
  }

  onFileSelected2(event) {
    // console.log(event);
    this.selectedFile2 = <File>event.target.files[0];
  }

  // createEvent(fd) {
  //   this.eventsService.createEvent(fd).subscribe(res => {
  //     console.log(res);
  //   });
  // }

  createEvent() {
    const fd = new FormData();
    fd.append('eventName', this.eventForm.get('eventName').value);
    fd.append('description', this.eventForm.get('description').value);
    fd.append('startDate', this.eventForm.get('startDate').value);
    fd.append('endDate', this.eventForm.get('endDate').value);
    fd.append('goldofrun', this.eventForm.get('goldofrun').value);
    fd.append('distances.distance', this.eventForm.get('distances.distance').value);
    fd.append('distances.price', this.eventForm.get('distances.price').value);
    fd.append('runTime', this.eventForm.get('runTime').value);
    fd.append('fileBg', this.selectedFile, this.selectedFile.name);
    fd.append('detailEvent', this.eventForm.get('detailEvent').value);
    fd.append('detailJoin', this.eventForm.get('detailJoin').value);
    fd.append('detailAward', this.eventForm.get('detailAward').value);

    fd.append('awords.aShirt', this.eventForm.get('awords.aShirt').value);
    fd.append('awords.aSizeShirt', this.eventForm.get('awords.aSizeShirt').value);
    fd.append('awords.aCup', this.eventForm.get('awords.aCup').value);
    fd.append('awords.aCoin', this.eventForm.get('awords.aCoin').value);
    fd.append('awords.aMoney', this.eventForm.get('awords.aMoney').value);
    fd.append('deliveryPrice', this.eventForm.get('deliveryPrice').value);

    if (this.before === false && this.digitalC === false) {
      // awords.aDigiCoin.
      fd.append('fileDigicoin', this.selectedFile2, this.selectedFile2.name);
      fd.append('awords.aDigiCoin.name', this.eventForm.get('awords.aDigiCoin.name').value);
      fd.append('awords.aDigiCoin.description', this.eventForm.get('awords.aDigiCoin.description').value);

      // console.log(fd);
      this.eventsService.createEvent(fd).subscribe(
        (res) => {
          if (res.type === HttpEventType.UploadProgress) {
            console.log('Upload Progress:', Math.round(res.loaded / res.total * 100), '%');
          } else {
            console.log(res);
          }

      });
    } else {
      // console.log(fd);
      this.eventsService.createEvent(fd).subscribe(
        (res) => {
          if (res.type === HttpEventType.UploadProgress) {
            console.log('Upload Progress:', Math.round(res.loaded / res.total * 100), '%');
          } else {
            console.log(res);
          }

      });
    }
  }


}
