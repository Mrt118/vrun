import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpErrorResponse, HttpEventType } from '@angular/common/http';

import { Observable, throwError  } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ajax } from 'rxjs/ajax';

@Injectable({
  providedIn: 'root'
})
export class EventsService {

  addeventUrl = 'http://localhost:5618/createEvent';
  getalleventUrl = 'http://localhost:5618/getAllEvent';
  getdarfteventUrl = 'http://localhost:5618/getDarftEvent';
  setPublishUrl = 'http://localhost:5618/setPublish';

  constructor(private http: HttpClient) { }

  createEvent(data) {
    return this.http.post<any>(this.addeventUrl, data, {
      reportProgress: true,
      observe: 'events'
    });
  }

  getEvent(): Observable<any> {
    return this.http.get<any>(this.getalleventUrl);
  }

  getDarftEvent(): Observable<any> {
    return this.http.get<any>(this.getdarfteventUrl);
  }

  setStatusPublish(evid: any): Observable<any> {
    const setHeader = { 'Content-Type': 'application/json' };

    const body = {
      'event_id': evid
    };
    return this.http.post<any>(this.setPublishUrl , body,  {headers: setHeader});
  }
}
