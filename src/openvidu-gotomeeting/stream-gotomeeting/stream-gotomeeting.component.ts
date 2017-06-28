import { Component, EventEmitter, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, Renderer, Output } from '@angular/core';
import { Stream } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ParticipantData } from '../../openvidu.directive';
import { OpenViduGoToMeetingIntl } from '../openvidu-gotomeeting-intl';

import { StreamComponent } from '../../stream.component';

@Component({
	selector: 'stream-gotomeeting',
	styleUrls: [ './stream-gotomeeting.component.css' ],
	template: `
		<div class="participant">
			<span #name></span>
			<video #videoStream autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`
})
export class StreamGoToMeetingComponent extends StreamComponent {

	constructor(protected domSanitizer: DomSanitizer, protected renderer: Renderer,
		protected _intl: OpenViduGoToMeetingIntl) {
		super(domSanitizer, renderer);
	}

	chidSetterStream(val: Stream) {
		// If local, show nice name
		let dataObj: ParticipantData = JSON.parse(this.stream.getParticipant().data);
		this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? this._intl.you : dataObj.username;
	}

}
