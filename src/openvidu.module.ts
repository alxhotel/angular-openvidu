import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '@angular/material';

import { StreamComponent } from './stream.component';
import { OpenViduComponent } from './openvidu.component';

@NgModule({
	imports: [
		CommonModule,
		MaterialModule.forRoot()
	],
	declarations: [
		StreamComponent,
		OpenViduComponent
	],
	exports: [
		OpenViduComponent
	]
})
export class OpenViduModule {

}
