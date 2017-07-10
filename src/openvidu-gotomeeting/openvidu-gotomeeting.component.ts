import {
	Component, ElementRef, EventEmitter, HostListener, Input, OnInit, OnDestroy,
	Output, QueryList, Renderer2, ViewChild, ViewChildren
} from '@angular/core';

// Parent component
import { ConnectionState, OpenViduInternalComponent, ToolbarOption } from '../openvidu-internal/openvidu-internal.component';

// Angular Material
import { MdSidenav } from '@angular/material';

// Fullscreen Service
import { BigScreenService } from 'angular-bigscreen';

import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	ParticipantData, ParticipantEvent, RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

import { StreamGoToMeetingComponent } from './stream-gotomeeting/stream-gotomeeting.component';

// i18n Labels and Messages
import { OpenViduGoToMeetingIntl } from './openvidu-gotomeeting-intl';

@Component({
	selector: 'openvidu-gotomeeting',
	templateUrl: './openvidu-gotomeeting.component.html',
	styleUrls: [ './openvidu-gotomeeting.component.css' ]
})
export class OpenViduGoToMeetingComponent extends OpenViduInternalComponent implements OnInit, OnDestroy {

	// Inputs
	// To set new options in menu
	@Input() toolbarOptions: ToolbarOption[] = [];
	// To show secondary content
	@Input() showSecondaryContent: boolean = false;

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('sidenav') sidenav: MdSidenav;
	@ViewChild('messageInput') messageInput: ElementRef;
	@ViewChild('panelVideo') panelVideo: ElementRef;
	@ViewChildren('streamGoToMeeting') streamGoToMeeting: QueryList<StreamGoToMeetingComponent>;

	// Responsive streams
	streamMaxWidth: string = '100%';
	streamMaxHeight: string = '100%';

	// Flags for HTML elements
	welcome: boolean = true;
	showChat: boolean = false;
	showPeople: boolean = false;

	// Web API access inside template
	JSON: any;

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService,
		public _intl: OpenViduGoToMeetingIntl) {

		super();
		this.JSON = JSON;
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

	togglePeople() {
		if (!this.showPeople) {
			this.showChat = false;
			this.showPeople = true;
			this.sidenav.open();
		} else {
			this.sidenav.close();
		}
	}

	toggleChat() {
		if (!this.showChat) {
			this.showPeople = false;
			this.showChat = true;
			this.sidenav.open();
		} else {
			this.sidenav.close();
		}
	}

	toggleFullscreen() {
		if (this.bigScreenService.isFullscreen()) {
			this.bigScreenService.exit();
		} else {
			this.bigScreenService.request(this.mainElement.nativeElement);
		}
	}

	onSidenavCloseStart() {
		this.showPeople = false;
		this.showChat = false;
	}

	onChangeSplitPane() {
		// Fix: manually resize panel
		this.resizeStreamsManually();
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
		super.handleOnCameraAccessChange(cameraEvent);
		if (cameraEvent.access) {
			this.welcome = false;
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
		let videoStreams = this.streamGoToMeeting.map((stream: StreamGoToMeetingComponent) => {
			return stream.videoStream;
		});
		var obj = this.auxResizeStreamsManually(this.panelVideo, videoStreams);

		if (!obj.error) {
			this.streamMaxWidth = obj.width + 'px';
			this.streamMaxHeight = obj.height + 'px';
		}
	}

}
