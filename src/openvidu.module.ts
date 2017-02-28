import { NgModule } from '@angular/core';
import { MaterialModule } from '@angular/material';

import { StreamComponent } from "./stream.component";
import { OpenViduComponent } from "./openvidu.component";

const COMPONENTS_DIRECTIVES = [
	StreamComponent,
	OpenViduComponent,
	MaterialModule
];

@NgModule({
	imports: [
		MaterialModule.forRoot()
	],
	declarations: [COMPONENTS_DIRECTIVES],
	exports: [COMPONENTS_DIRECTIVES],
	providers: []
})
export class OpenViduModule {
	
}
