import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MaterialModule } from '@angular/material';

// OpenVidu logic for custom template
import { OpenViduDirective } from './openvidu.directive';

// OpenVidu common
//import { OpenViduComponent } from './openvidu.component';

// OpenVidu Hangouts
import { StreamHangoutsComponent } from './openvidu-hangouts/stream-hangouts/stream-hangouts.component';
import { OpenViduHangoutsComponent } from './openvidu-hangouts/openvidu-hangouts.component';

import { StreamAppearinComponent } from './openvidu-appearin/stream-appearin/stream-appearin.component';
import { OpenViduAppearinComponent } from './openvidu-appearin/openvidu-appearin.component';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		MaterialModule
	],
	declarations: [
		OpenViduDirective,
		StreamHangoutsComponent,
		OpenViduHangoutsComponent,
		StreamAppearinComponent,
		OpenViduAppearinComponent
	],
	exports: [
		OpenViduDirective,
		StreamHangoutsComponent,
		OpenViduHangoutsComponent,
		StreamAppearinComponent,
		OpenViduAppearinComponent
	]
})
export class OpenViduModule {

}
