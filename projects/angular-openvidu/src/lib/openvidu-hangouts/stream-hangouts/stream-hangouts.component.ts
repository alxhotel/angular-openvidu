import { Component, EventEmitter, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, Renderer2, Output } from '@angular/core';
import { Stream } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ParticipantData } from '../../openvidu.directive';
import { OpenViduHangoutsIntl } from '../openvidu-hangouts-intl';

import { StreamInternalComponent } from '../../openvidu-internal/stream-internal.component';

import { SafeUrlPipe } from '../../utils/safe-url.pipe';

@Component({
	selector: 'opv-stream-hangouts',
	styleUrls: [ './stream-hangouts.component.css' ],
	template: `
		<div class="participant">
			<span #name class="name"></span>
			<video #videoStream autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`
})
export class StreamHangoutsComponent extends StreamInternalComponent {

	@ViewChild('name') name: ElementRef;
	@ViewChild('videoStream') videoStream: ElementRef;

	constructor(protected safeUrlPipe: SafeUrlPipe, protected renderer: Renderer2, protected intl: OpenViduHangoutsIntl) {
		super(safeUrlPipe, renderer);
	}

	protected setStreamCallback(val: Stream): void {
		// If local, show nice name
		const dataObj: ParticipantData = JSON.parse(this.stream.getParticipant().data);
		this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? this.intl.you : dataObj.username;
	}

}
