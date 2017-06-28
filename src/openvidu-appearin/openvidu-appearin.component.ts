import {
	Component, ElementRef, EventEmitter, HostListener, Input, OnInit, OnDestroy,
	Output, QueryList, Renderer2, ViewChild, ViewChildren
} from '@angular/core';

// Parent component
import { ConnectionState, OpenViduComponent, ToolbarOption } from '../openvidu.component';

// Angular Material
import { MdSidenav } from '@angular/material';

// Fullscreen Service
import { BigScreenService } from 'angular-bigscreen';

import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	ParticipantData, ParticipantEvent, RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

import { StreamAppearinComponent } from './stream-appearin/stream-appearin.component';

// i18n Labels and Messages
import { OpenViduAppearinIntl } from './openvidu-appearin-intl';

@Component({
	selector: 'openvidu-appearin',
	templateUrl: './openvidu-appearin.component.html',
	styleUrls: [ './openvidu-appearin.component.css' ]
})
export class OpenViduAppearinComponent extends OpenViduComponent implements OnInit, OnDestroy {

	// Inputs
	// To set new options in menu
	@Input() toolbarOptions: ToolbarOption[] = [];

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('sidenav') sidenav: MdSidenav;
	@ViewChild('messageInput') messageInput: ElementRef;
	@ViewChild('panelVideo') panelVideo: ElementRef;
	@ViewChildren('streamAppearin') streamAppearin: QueryList<StreamAppearinComponent>;

	// Responsive streams
	streamMaxWidth: string = '100%';
	streamMaxHeight: string = '100%';

	// Flags for HTML elements
	welcome: boolean = true;
	showChat: boolean = false;

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService,
		public _intl: OpenViduAppearinIntl) {

		super();
		this.welcome = true;
		this.setUserMessage(this._intl.loadingLabel);
	}

	ngOnInit() {
		// Display message
		this.setUserMessage(this._intl.connectingLabel);

		// Set fullscreen listener
		this.bigScreenService.onChange(() => {
			// No need to check if mainElement is the one with fullscreen
			this.isFullscreen = this.bigScreenService.isFullscreen();
			// Fix: Resize videos
			setTimeout(() => {
				this.resizeStreamsManually();
			}, 1000);
		});
	}

	ngOnDestroy() {
		this.bigScreenService.exit();
		this.leaveRoom(false);
	}

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

	@HostListener('window:resize', ['$event'])
	onResize() {
		this.resizeStreamsManually();
	}

	toggleMic() {
		this.openviduApi.micEnabled = !this.openviduApi.micEnabled;
	}

	toggleCamera() {
		this.openviduApi.camEnabled = !this.openviduApi.camEnabled;
	}

	toggleFullscreen() {
		if (this.bigScreenService.isFullscreen()) {
			this.bigScreenService.exit();
		} else {
			this.bigScreenService.request(this.mainElement.nativeElement);
		}
	}

	toggleChat() {
		//this.sidenav.toggle();
		this.showChat = !this.showChat;
	}

	sendMessage(text: string) {
		// Clean input
		this.messageInput.nativeElement.value = null;
		//this.renderer.setValue(this.messageInput, null);
		// Send to OpenVidu server
		this.openviduApi.sendMessage(text);
	}

	leaveRoom(callLeaveRoom?: boolean) {
		super.leaveRoom(callLeaveRoom);

		// Display message
		this.setUserMessage(this._intl.youLeftTheRoomLabel);
	}

	/*------------------------*/
	/* HANDLE OPENVIDU EVENTS */
	/*------------------------*/

	handleOnServerConnected() {
		super.handleOnServerConnected();

		this.setUserMessage(this._intl.connectingToRoomLabel);
	}

	handleOnErrorRoom() {
		super.handleOnErrorRoom();

		this.setUserMessage(this._intl.errorRoom);
	}

	handleOnCameraAccessChange(cameraEvent: CameraAccessEvent) {
		if (cameraEvent.access) {
			// All good :)
			this.myCamera = cameraEvent.camera;
			if (this.streams.indexOf(this.myCamera) < 0) {
				this.streams.push(this.myCamera);
			}

			this.welcome = false;

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_GRANTED;

		} else if (!cameraEvent.access) {
			// No camera :(

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_DENIED;
		}
	}

	handleOnParticipantJoined(participantEvent: ParticipantEvent) {
		super.handleOnParticipantJoined(participantEvent);

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnParticipantLeft(participantEvent: ParticipantEvent) {
		super.handleOnParticipantLeft(participantEvent);

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnStreamAdded(streamEvent: StreamEvent) {
		super.handleOnStreamAdded(streamEvent);

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnStreamRemoved(streamEvent: StreamEvent) {
		super.handleOnStreamRemoved(streamEvent);

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnSourceAdded() {
		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	/*-----------------*/
	/* PRIVATE METHODS */
	/*-----------------*/

	private resizeStreamsManually() {
		let videoStreams = this.streamAppearin.map((stream: StreamAppearinComponent) => {
			return stream.videoStream;
		});
		var obj = this.auxResizeStreamsManually(this.panelVideo, videoStreams);

		if (!obj.error) {
			this.streamMaxWidth = obj.width + 'px';
			this.streamMaxHeight = obj.height + 'px';
		}
	}

}
