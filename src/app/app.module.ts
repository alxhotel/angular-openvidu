import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

// Angular Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';

// OpenVidu dependencies
// import { OpenViduModule, OpenViduHangoutsIntl } from 'angular-openvidu';
// import { MySpanishOpenViduHangoutsIntl } from './my-spanish-openvidu-hangouts-intl';
// import 'hammerjs';

import { AppComponent } from './app.component';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,

    /* OpenVidu Module */
    // OpenViduModule,

    /* Material Module */
    NoopAnimationsModule,
    MatButtonModule,
    MatCardModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatSnackBarModule,
    MatToolbarModule
  ],
  providers: [
    // {provide: OpenViduHangoutsIntl, useClass: MySpanishOpenViduHangoutsIntl},
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }

