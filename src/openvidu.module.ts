import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
	MdButtonModule,
	MdDialogModule,
	MdIconModule,
	MdInputModule,
	MdSelectModule,
	MdSidenavModule,
	MdToolbarModule,
	MdTooltipModule
} from '@angular/material';

// OpenVidu logic for custom template
import { OpenViduDirective } from './openvidu.directive';

// OpenVidu Hangouts i18n
import { OpenViduHangoutsIntl } from './openvidu-hangouts/openvidu-hangouts-intl';

// OpenVidu Hangouts
import { DialogHangoutsComponent } from './openvidu-hangouts/dialog-hangouts/dialog-hangouts.component';
import { StreamHangoutsComponent } from './openvidu-hangouts/stream-hangouts/stream-hangouts.component';
import { OpenViduHangoutsComponent } from './openvidu-hangouts/openvidu-hangouts.component';

// OpenVidu Appearin
//import { StreamAppearinComponent } from './openvidu-appearin/stream-appearin/stream-appearin.component';
//import { OpenViduAppearinComponent } from './openvidu-appearin/openvidu-appearin.component';

// Fullscreen Service
import { BigScreenService } from 'angular-bigscreen';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,

		/* Material Module */
		NoopAnimationsModule,
		MdButtonModule,
		MdDialogModule,
		MdIconModule,
		MdInputModule,
		MdSelectModule,
		MdSidenavModule,
		MdToolbarModule,
		MdTooltipModule
	],
	declarations: [
		OpenViduDirective,

		/* OpenVidu Hangouts */
		DialogHangoutsComponent,
		StreamHangoutsComponent,
		OpenViduHangoutsComponent,

		/* OpenVidu Appearin */
		//StreamAppearinComponent,
		//OpenViduAppearinComponent
	],
	exports: [
		OpenViduDirective,

		/* OpenVidu Hangouts */
		//OpenViduHangoutsIntl,
		StreamHangoutsComponent,
		OpenViduHangoutsComponent,

		/* OpenVidu Appearin */
		//StreamAppearinComponent,
		//OpenViduAppearinComponent
	],
	providers: [
		/* OpenVidu Hangouts i18n */
		OpenViduHangoutsIntl,

		/* Fullscreen Service */
		BigScreenService
	],
	entryComponents: [
		/* OpenVidu Hangouts Aux. Component */
		DialogHangoutsComponent
	]
})
export class OpenViduModule {

}
