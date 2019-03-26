// Base Modules
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

// Angular Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
	MatButtonModule,
	MatDialogModule,
	MatIconModule,
	MatInputModule,
	MatSelectModule,
	MatSidenavModule,
	MatTabsModule,
	MatToolbarModule,
	MatTooltipModule
} from '@angular/material';

// Internal components
import { OpenViduInternalComponent } from './openvidu-internal/openvidu-internal.component';
import { StreamInternalComponent } from './openvidu-internal/stream-internal.component';

// Helper components
import { OpenViduHelperComponent } from './openvidu-helper.component';


// OpenVidu logic for custom template
import { OpenViduDirective } from './openvidu.directive';

// OpenVidu Hangouts
import { OpenViduHangoutsIntl } from './openvidu-hangouts/openvidu-hangouts-intl';
import { DialogHangoutsComponent } from './openvidu-hangouts/dialog-hangouts/dialog-hangouts.component';
import { StreamHangoutsComponent } from './openvidu-hangouts/stream-hangouts/stream-hangouts.component';
import { OpenViduHangoutsComponent } from './openvidu-hangouts/openvidu-hangouts.component';

// OpenVidu Appearin
import { OpenViduAppearinIntl } from './openvidu-appearin/openvidu-appearin-intl';
import { StreamAppearinComponent } from './openvidu-appearin/stream-appearin/stream-appearin.component';
import { OpenViduAppearinComponent } from './openvidu-appearin/openvidu-appearin.component';

// OpenVidu GoToMeeting
import { OpenViduGoToMeetingIntl } from './openvidu-gotomeeting/openvidu-gotomeeting-intl';
import { StreamGoToMeetingComponent } from './openvidu-gotomeeting/stream-gotomeeting/stream-gotomeeting.component';
import { OpenViduGoToMeetingComponent } from './openvidu-gotomeeting/openvidu-gotomeeting.component';

// Fullscreen Service
import { BigScreenModule } from 'angular-bigscreen';

// ObjNgFor Pipe
import { ObjNgForPipe } from './utils/objngfor-pipe';

// SafeURL Pipe
import { SafeUrlPipe } from './utils/safe-url.pipe';

// SplitPane Module
import { SplitPaneModule } from 'ng2-split-pane/lib/ng2-split-pane';

@NgModule({
	imports: [
		/* Angular core Modules */
		CommonModule,
		FormsModule,

		/* Material Modules */
		NoopAnimationsModule,
		MatButtonModule,
		MatDialogModule,
		MatIconModule,
		MatInputModule,
		MatSelectModule,
		MatSidenavModule,
		MatTabsModule,
		MatToolbarModule,
		MatTooltipModule,

		/* SpliPane Module */
		SplitPaneModule,

		/* Fullscreen Module */
		BigScreenModule
	],
	declarations: [
		/* OpenVidu Directive */
		OpenViduDirective,

		/* OpenVidu Hangouts */
		DialogHangoutsComponent,
		StreamHangoutsComponent,
		OpenViduHangoutsComponent,

		/* OpenVidu Appearin */
		StreamAppearinComponent,
		OpenViduAppearinComponent,

		/* OpenVidu GoToMeeting */
		StreamGoToMeetingComponent,
		OpenViduGoToMeetingComponent,

		/* ObjNgFor Pipe */
		ObjNgForPipe,

		/* SafeUrl Pipe */
		SafeUrlPipe
	],
	exports: [
		/* OpenVidu Directive */
		OpenViduDirective,

		/* OpenVidu Hangouts */
		OpenViduHangoutsComponent,

		/* OpenVidu Appearin */
		OpenViduAppearinComponent,

		/* OpenVidu GoToMeeting */
		OpenViduGoToMeetingComponent,

		/* SafeUrl Pipe */
		SafeUrlPipe
	],
	providers: [
		/* OpenVidu Hangouts i18n */
		OpenViduHangoutsIntl,

		/* OpenVidu Appearin i18n */
		OpenViduAppearinIntl,

		/* OpenVidu GoToMeeting i18n */
		OpenViduGoToMeetingIntl,

		/* Fullscreen Service */
		// BigScreenService,

		/* SafeUrl Pipe */
		SafeUrlPipe
	],
	entryComponents: [
		/* OpenVidu Hangouts Aux. Component */
		DialogHangoutsComponent
	]
})
export class OpenViduModule {

}
