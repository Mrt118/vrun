import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { OrganizerRoutingModule } from './organizer-routing.module';
import { HomeComponent } from './home/home.component';
import { NgCircleProgressModule } from 'ng-circle-progress';

@NgModule({
  declarations: [HomeComponent],
  imports: [
    CommonModule,
    OrganizerRoutingModule,
    NgCircleProgressModule.forRoot({
      'backgroundOpacity': 0.3,
      'backgroundStrokeWidth': 0,
      'backgroundPadding': 3,
      'radius': 67,
      'space': -10,
      'toFixed': 1,
      'maxPercent': 100,
      'unitsFontWeight': '500',
      'outerStrokeGradient': true,
      'outerStrokeWidth': 10,
      'outerStrokeColor': '#1e42ec',
      'outerStrokeGradientStopColor': '#6ce6e2',
      'innerStrokeColor': '#f9f9f9',
      'innerStrokeWidth': 10,
      'titleFontSize': '30',
      'titleFontWeight': '600',
      'subtitleFontSize': '13',
      'subtitleFontWeight': '500',
      'imageHeight': 123,
      'imageWidth': 133,
      'animationDuration': 500,
      'showTitle': true,
      'showUnits': true,
      'showBackground': false,
      'responsive': true
    })
  ]
})
export class OrganizerModule { }
