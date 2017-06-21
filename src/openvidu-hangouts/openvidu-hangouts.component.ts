import {
	Component, ElementRef, EventEmitter, Input, OnDestroy,
	OnInit, Output, Renderer2, ViewChild
} from '@angular/core';

// Angular Material
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MdDialog, MdSidenav } from '@angular/material';

// Fullscreen Service
import { BigScreenService } from 'angular-bigscreen';

// OpenVidu Browser
import { Connection, Session, Stream } from 'openvidu-browser';

// OpenVidu Directive
import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	ParticipantData, ParticipantEvent, RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

// i18n Labels and Messages
import { OpenViduHangoutsIntl } from './openvidu-hangouts-intl';

// OpenVidu Hangouts Dialog
import { DialogHangoutsComponent } from './dialog-hangouts/dialog-hangouts.component';

export interface ToolbarOption {
	label?: string;
	icon: string;
	onClick?: Function;
}

export enum OpenViduNotificationType {
	MIC_CHANGED = 1,
	CAM_CHANGED = 2
};

@Component({
	selector: 'openvidu, openvidu-hangouts',
	templateUrl: './openvidu-hangouts.component.html',
	styleUrls: [ './openvidu-hangouts.component.css' ],
	animations: [
		trigger('chatButtonAnimation', [
			state('hide', style({
				left: '-60px'
			})),
			state('show', style({
				left: '0px'
			})),
			transition('* => hide', [
				animate('0.225s ease-in-out')
			]),
			transition('* => show', [
				animate('0.225s ease-in-out')
			])
		])
	]
})
export class OpenViduHangoutsComponent implements OnInit, OnDestroy {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;
	@Input() apiKey: string;
	@Input() token: string;

	// Unique Inputs
	// To set new options in menu
	@Input() toolbarOptions: ToolbarOption[] = [];

	// Outputs
	@Output() onRoomConnected: EventEmitter<void> = new EventEmitter<void>();
	@Output() onErrorRoom: EventEmitter<any> = new EventEmitter();
	@Output() onRoomClosed: EventEmitter<void> = new EventEmitter<void>();
	@Output() onLostConnection: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantJoined: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantLeft: EventEmitter<any> = new EventEmitter();
	@Output() onNewMessage: EventEmitter<any> = new EventEmitter();
	@Output() onErrorMedia: EventEmitter<any> = new EventEmitter();
	@Output() onLeaveRoom: EventEmitter<void> = new EventEmitter<void>();
	@Output() onCustomNotification: EventEmitter<any> = new EventEmitter();

	// Unused events
	//@Output() onStreamAdded: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamRemoved: EventEmitter<any> = new EventEmitter();
	//@Output() onParticpantPublished: EventEmitter<any> = new EventEmitter();
	//@Output() onParticipantEvicted: EventEmitter<any> = new EventEmitter();
	//@Output() onUpodateMainSpeaker: EventEmitter<any> = new EventEmitter();

	// OpenVidu api
	@ViewChild('openviduApi') openviduApi: OpenViduDirective;

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('sidenav') sidenav: MdSidenav;
	@ViewChild('messageInput') messageInput: ElementRef;

	// Flags for HTML elements
	userMessage: string = '';
	isFullscreen: boolean = false;

	// Participnats who have enabled/disabled their mic
	micOffParticipants: Connection[] = [];

	// Participnats who have enabled/disabled their cam
	camOffParticipants: Connection[] = [];

	// Main screen
	mainStream: Stream;

	// Rest of peers
	streams: Stream[] = [];

	// Chat
	chatMessages: any[] = [];

	// Animations
	chatButtonState: string = 'show';

	// Session
	private session: Session;

	// Participants
	private participants: { [id: string]: Connection } = {};

	// My camera
	private myCamera: Stream;

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService,
		public _intl: OpenViduHangoutsIntl, public dialog: MdDialog) {

		this.setUserMessage(this._intl.loadingLabel);
	}

	ngOnInit() {
		// Display message
		this.setUserMessage(this._intl.connectingLabel);

		// Set fullscreen listener
		this.bigScreenService.onChange(() => {
			// No need to check if mainElement is the one with fullscreen
			this.isFullscreen = this.bigScreenService.isFullscreen();
		});
	}

	ngOnDestroy() {
		this.bigScreenService.exit();
		this.leaveRoom();
	}

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

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
		this.sidenav.toggle();
	}

	openSettings() {
		let dialogRef = this.dialog.open(DialogHangoutsComponent);
		// On change video input
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.openviduApi.setCamera(result);
			} else {
				console.log('No camera selected');
			}
		});
	}

	onSidenavOpenStart() {
		this.chatButtonState = 'hide';
	}

	onSidenavCloseStart() {
		this.chatButtonState = 'show';
	}

	sendMessage(text: string) {
		// Clean input
		this.messageInput.nativeElement.value = null;
		//this.renderer.setValue(this.messageInput, null);
		// Send to OpenVidu server
		this.openviduApi.sendMessage(text);
	}

	sendCustomNotification(obj: any, callback: any) {
		this.openviduApi.sendCustomNotification(obj, callback);
	}

	leaveRoom() {
		// Reset
		this.mainStream = null;
		this.streams = [];
		this.chatMessages = [];
		this.chatButtonState = 'show';
		this.session = null;
		this.participants = {};

		// Display message
		this.setUserMessage(this._intl.youLeftTheRoomLabel);
		this.openviduApi.leaveRoom();
	}

	/*------------------------*/
	/* HANDLE OPENVIDU EVENTS */
	/*------------------------*/

	handleOnUpdateMainSpeaker(streamEvent: StreamEvent) {
		// Check if stream exists
		if (this.streams.indexOf(streamEvent.stream) < 0) {
			this.streams.push(streamEvent.stream);
		}

		// Set main stream
		this.mainStream = streamEvent.stream;

		// Check if participant exists
		if (!this.participants[this.mainStream.getParticipant().getId()]) {
			this.participants[this.mainStream.getParticipant().getId()] = this.mainStream.getParticipant();
		}
	}

	handleOnServerConnected() {
		this.setUserMessage(this._intl.connectingToRoomLabel);
	}

	handleOnErrorServer(errorEvent: ErrorEvent) {
		if (errorEvent.error) {
			this.setUserMessage(errorEvent.error.message);
		}
	}

	handleOnRoomConnected(roomConnectedEvent: RoomConnectedEvent) {
		if (roomConnectedEvent && roomConnectedEvent.session) {
			this.session = roomConnectedEvent.session;
		}

		// Emit event
		this.onRoomConnected.emit();
	}

	handleOnErrorRoom() {
		this.setUserMessage(this._intl.errorRoom);
		// Emit event
		this.onErrorRoom.emit();
	}

	handleOnCameraAccessChange(cameraEvent: CameraAccessEvent) {
		if (cameraEvent.access) {
			// All good :)
			this.myCamera = cameraEvent.camera;
			if (this.streams.indexOf(this.myCamera) < 0) {
				this.streams.push(this.myCamera);
			}
		} else if (!cameraEvent.access) {
			// No camera :(
		}
	}

	handleOnRoomClosed() {
		this.session = null;

		// Emit event
		this.onRoomClosed.emit();
	}

	handleOnLostConnection() {
		if (!this.session) {
			// Emit event
			this.onLostConnection.emit({
				error: new Error('Lost connection with the server')
			});
		} else {
			// Emit event
			this.onLostConnection.emit();
		}
	}

	handleOnParticipantJoined(participantEvent: ParticipantEvent) {
		var newParticipant = participantEvent.participant;
		this.participants[newParticipant.getId()] = newParticipant;

		// Emit event
		this.onParticipantJoined.emit({
			participantId: newParticipant.getId()
		});
	}

	handleOnParticipantLeft(participantEvent: ParticipantEvent) {
		var oldParticipant = participantEvent.participant;
		delete this.participants[oldParticipant.getId()];

		// Emit event
		this.onParticipantLeft.emit({
			participantId: oldParticipant.getId()
		});
	}

	handleOnErrorMedia(errorEvent: ErrorEvent) {
		// Emit event
		this.onErrorMedia.emit({
			error: errorEvent.error
		});
	}

	handleOnStreamAdded(streamEvent: StreamEvent) {
		var newStream = streamEvent.stream;
		if (this.streams.indexOf(newStream) < 0) {
			this.streams.push(newStream);
		}
	}

	handleOnStreamRemoved(streamEvent: StreamEvent) {
		var oldStream = streamEvent.stream;
		this.streams.splice(this.streams.indexOf(oldStream), 1);
	}

	handleOnLeaveRoom() {
		// Emit event
		this.onLeaveRoom.emit();
	}

	handleOnNewMessage(messageEvent: MessageEvent) {
		// Fix: to get usernam
		var dataObj: ParticipantData = JSON.parse(messageEvent.participant.data);

		// Handle message
		this.chatMessages.push({
			username: dataObj.username,
			message: messageEvent.message,
			date: new Date() // Use current date
		});

		this.onNewMessage.emit(messageEvent);
	}

	handleOnCustomNotification(obj: any) {
		if (obj.openviduType) {
			// TODO: Internal custom notification
			switch (obj.openviduType) {
				case OpenViduNotificationType.MIC_CHANGED:
					if (obj.micEnabled) {
						// Remove participant from micOffParticipant
					} else {
						// Add participant to micOffParticipant
					}
					break;
				case OpenViduNotificationType.CAM_CHANGED:
					if (obj.micEnabled) {
						// Remove participant from camOffParticipant
					} else {
						// Add participant to camOffParticipant
					}
					break;
			}
		} else {
			this.onCustomNotification.emit(obj);
		}
	}

	/*-----------------*/
	/* PRIVATE METHODS */
	/*-----------------*/

	private setUserMessage(msg: string) {
		this.userMessage = msg;
	}

}
