import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Stream, Session } from 'openvidu-browser';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

@Component({
    selector: 'stream',
    styles: [`
		.main-stream video {
			width: 100%;
		}
        /*.participant {
	        float: left;
	        width: 20%;
	        margin: 10px;
        }
        .participant video {
	        width: 100%;
	        height: auto;
        }*/`],
    template: `
		<div class='participant'>
			<span>{{stream.getId()}}</span>
			<video autoplay="true" [src]="videoSrc" [muted]="muted"></video>
        </div>`
})
export class StreamComponent {

    @Input()
    stream: Stream;

    videoSrc: SafeUrl;
	
	muted: boolean;

    constructor(private sanitizer: DomSanitizer) { }

    ngOnInit() {
        let int = setInterval(() => {
            if (this.stream.getWrStream()) {
                this.videoSrc = this.sanitizer.bypassSecurityTrustUrl(
                    URL.createObjectURL(this.stream.getWrStream())
				);
                console.log("Video tag src=" + this.videoSrc);
				
				this.muted = this.stream.isLocalMirrored();
				
                clearInterval(int);
            }
        }, 1000);

        //this.stream.addEventListener('src-added', () => {
        //    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
        //});
    }
	

}