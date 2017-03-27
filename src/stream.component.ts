import { Component, OnInit, Input, ViewChild, ElementRef, Renderer } from '@angular/core';
import { Stream, Session } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
	selector: 'stream',
	styleUrls: ['./stream.component.less'],
	template: `
		<div class='participant'>
			<span>{{stream.getParticipant().id}}</span>
			<video #videoStream class="" autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`
})
export class StreamComponent {

	// HTML elements
	@ViewChild('videoStream') videoStream: ElementRef;

	videoSrc: SafeUrl;

	muted: boolean;

	constructor(private domSanitizer: DomSanitizer, private renderer: Renderer) {}

	private _stream: Stream;
	get stream(): Stream {
		return this._stream;
	}

	@Input('stream')
	set stream(val: Stream) {
		this._stream = val;

		// Loop until you get a WrStream
		let int = setInterval(() => {
			if (this.stream.getWrStream()) {
				this.videoSrc = this.domSanitizer.bypassSecurityTrustUrl(
					URL.createObjectURL(this.stream.getWrStream())
				);
				console.log("Video tag src = " + this.videoSrc);

				clearInterval(int);
			}
		}, 1000);

		// If local, mute video
		this.muted = this.stream.isLocalMirrored();
		
		// If local, flip screen
		this.renderer.setElementClass(this.videoStream.nativeElement, 'flip-screen', this.stream.isLocalMirrored());
	}

	ngOnInit() {
		//this.stream.addEventListener('src-added', () => {
		//    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
		//});
	}
	
}