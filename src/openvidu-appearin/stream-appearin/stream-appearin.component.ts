import { Component, EventEmitter, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, Renderer, Output } from '@angular/core';
import { Stream } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { ParticipantData } from '../../openvidu.directive';
import { OpenViduAppearinIntl } from '../openvidu-appearin-intl';

@Component({
	selector: 'stream-appearin',
	styleUrls: [ './stream-appearin.component.css' ],
	template: `
		<div class="participant">
			<span #name></span>
			<video #videoStream autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`,
	encapsulation: ViewEncapsulation.None
})
export class StreamAppearinComponent implements OnInit {

	@Output() onSourceAdded: EventEmitter<void> = new EventEmitter<void>();

	// HTML elements
	@ViewChild('name') name: ElementRef;
	@ViewChild('videoStream') videoStream: ElementRef;

	// Video attributes
	videoSrc: SafeUrl;
	muted: boolean;

	// Private variables
	private _stream: Stream;

	constructor(private domSanitizer: DomSanitizer, private renderer: Renderer,
		private _intl: OpenViduAppearinIntl) {}

	@Input('stream')
	get stream(): Stream { return this._stream; }
	set stream(val: Stream) {
		if (val === null || val === undefined) return;

		this._stream = val;

		// Loop until you get a WrStream
		let int = setInterval(() => {
			if (this.stream.getWrStream()) {
				this.videoSrc = this.domSanitizer.bypassSecurityTrustUrl(
					URL.createObjectURL(this.stream.getWrStream())
				);
				console.log('Video tag src = ' + this.videoSrc);

				clearInterval(int);

				// Fix: manually call OnInit
				this.ngOnInit();
			}
		}, 1000);

		// If local, mute video
		this.muted = this.stream.isLocalMirrored();

		// If local, flip screen
		this.renderer.setElementClass(this.videoStream.nativeElement, 'flip-screen', this.stream.isLocalMirrored());

		// If local, show nice name
		let dataObj: ParticipantData = JSON.parse(this.stream.getParticipant().data);
		this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? this._intl.you : dataObj.username;
	}

	ngOnInit() {
		this.videoStream.nativeElement.addEventListener('loadeddata', () => {
			// Emit event
			this.onSourceAdded.emit();
		}, false);

		if (!this.stream) return;

		// Listen for changes in the src
		// For example, if the participants wants to change camera
		this.stream.addEventListener('src-added', () => {
			this.videoSrc = this.domSanitizer.bypassSecurityTrustUrl(
				URL.createObjectURL(this.stream.getWrStream())
			);
		});
	}

}
