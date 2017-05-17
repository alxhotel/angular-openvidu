import { Component, ViewEncapsulation, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Stream } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'stream-hangouts',
	styleUrls: [ './stream-hangouts.component.css' ],
	template: `
		<div class="participant">
			<span #name></span>
			<video #videoStream autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`,
	encapsulation: ViewEncapsulation.None
})
export class StreamHangoutsComponent implements OnInit {

	// HTML elements
	@ViewChild('name') name: ElementRef;
	@ViewChild('videoStream') videoStream: ElementRef;

	// Video attributes
	videoSrc: SafeUrl;
	muted: boolean;

	// Private variables
	private _stream: Stream;

	constructor(private domSanitizer: DomSanitizer, private renderer: Renderer) {}

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
			}
		}, 1000);

		// If local, mute video
		this.muted = this.stream.isLocalMirrored();

		// If local, flip screen
		this.renderer.setElementClass(this.videoStream.nativeElement, 'flip-screen', this.stream.isLocalMirrored());

		// If local, show nice name
		this.name.nativeElement.textContent = (this.stream.isLocalMirrored()) ? 'You' : this.stream.getParticipant().getId();
	}

	ngOnInit() {
		//this.stream.addEventListener('src-added', () => {
		//    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
		//});
	}

}
