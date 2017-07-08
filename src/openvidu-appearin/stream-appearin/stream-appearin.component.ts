import { Component, EventEmitter, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, Renderer, Output } from '@angular/core';
import { Stream } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ParticipantData } from '../../openvidu.directive';
import { OpenViduAppearinIntl } from '../openvidu-appearin-intl';

import { StreamInternalComponent } from '../../openvidu-internal/stream-internal.component';

import { SafeUrlPipe } from '../../utils/safe-url.pipe';

@Component({
	selector: 'stream-appearin',
	styleUrls: [ './stream-appearin.component.css' ],
	template: `
		<div class="participant">
			<span #name></span>
			<video #videoStream autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`
})
export class StreamAppearinComponent extends StreamInternalComponent implements OnInit {

	@ViewChild('name') name: ElementRef;
	@ViewChild('videoStream') videoStream: ElementRef;

	constructor(protected safeUrlPipe: SafeUrlPipe, protected renderer: Renderer,
		protected _intl: OpenViduAppearinIntl) {
		super(safeUrlPipe, renderer);
	}

	protected setStreamCallback(val: Stream) {
		// If local, show nice name
		let dataObj: ParticipantData = JSON.parse(this.stream.getParticipant().data);
		this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? this._intl.you : dataObj.username;
	}

}
