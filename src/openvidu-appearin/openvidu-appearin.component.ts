import {
	Component, ElementRef, EventEmitter, HostListener, Input, OnInit, OnDestroy,
	Output, QueryList, Renderer2, ViewChild, ViewChildren
} from '@angular/core';
import { MdSidenav } from '@angular/material';
import { Participant, Session, Stream } from 'openvidu-browser';

import { BigScreenService } from 'angular-bigscreen';

import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	ParticipantEvent, RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

import { StreamAppearinComponent } from './stream-appearin/stream-appearin.component';

export enum ConnectionState {
	NOT_CONNECTED = 0,
	CONNECTED_TO_SERVER = 1,
	CONNECTED_TO_ROOM = 2,
	REQUESTING_CAMERA_ACCESS = 3,
	CAMERA_ACCESS_GRANTED = 4,
	CAMERA_ACCESS_DENIED = 5
};

@Component({
	selector: 'openvidu-appearin',
	templateUrl: './openvidu-appearin.component.html',
	styleUrls: [ './openvidu-appearin.component.css' ],
	providers: [ BigScreenService ]
})
export class OpenViduAppearinComponent implements OnInit, OnDestroy {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;

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

	/** @deprecated */
	@Output() onCloseSession: EventEmitter<void> = this.onLeaveRoom;
	@Output() onCustomNotification: EventEmitter<any> = new EventEmitter();

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
	@ViewChild('panelVideo') panelVideo: ElementRef;
	@ViewChildren('streamAppearin') streamAppearin: QueryList<StreamAppearinComponent>;

	// Responsive streams
	streamMaxWidth: string = '100%';
	streamMaxHeight: string = '100%';

	// Flags for HTML elements
	userMessage: string = '';
	isFullscreen: boolean = false;
	welcome: boolean = true;
	showChat: boolean = false;

	// Main screen
	mainStream: Stream;

	// Rest of peers
	streams: Stream[] = [];

	// Chat
	chatMessages: any[] = [];

	// Animations
	chatButtonState: string = 'show';

	// Connection stats
	ConnectionState = ConnectionState;
	connectionUiState: ConnectionState = ConnectionState.NOT_CONNECTED;

	// Session
	private session: Session;

	// Participants
	private participants: { [id: string]: Participant } = {};

	// My camera
	private myCamera: Stream;

	// Last chats
	/*lastChats: any[] = [
		{name: "SessionA", num_people: 4},
		{name: "SessionB", num_people: 2},
		{name: "Sessionc", num_people: 1},
	];*/

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService) {
		this.setUserMessage('Loading...');
		this.welcome = true;
	}

	ngOnInit() {
		// Display message
		this.setUserMessage('Connecting...');

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

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.resizeStreamsManually();
	}

	resizeStreamsManually() {
		if (!this.panelVideo) return;

		var clientRect = this.panelVideo.nativeElement.getBoundingClientRect();

		var maxW = 0;
		var maxH = 0;
		this.streamAppearin.forEach(function (streamAppearinEl) {
			var videoEl = streamAppearinEl.videoStream.nativeElement;
			if (videoEl.videoWidth > maxW) {
				if (videoEl.videoHeight > maxH) {
					maxW = videoEl.videoWidth;
					maxH = videoEl.videoHeight;
				}
			}
		});

		var defaultWidth = 640;
		var numCols = Math.ceil(clientRect.width / Math.min(maxW, defaultWidth));
		var numRows = Math.ceil(clientRect.height / Math.min(maxH, ((defaultWidth * maxH) / maxW)));

		this.streamMaxWidth = (Math.round((100 / Math.ceil(this.streams.length / numRows)) * 100) / 100).toString() + '%';
		this.streamMaxHeight = (Math.round((100 / Math.ceil(this.streams.length / numCols)) * 100) / 100).toString() + '%';
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

	onSidenavOpenStart() {
		// TODO: Retrive chats

		this.chatButtonState = 'hide';
	}

	sendMessage(text: string) {
		// Clean input
		this.messageInput.nativeElement.value = null;
		//this.renderer.setValue(this.messageInput, null);
		// Send to OpenVidu server
		this.openviduApi.sendMessage(text);
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
		this.setUserMessage('You left the room');
		this.openviduApi.leaveRoom();
	}

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
		this.setUserMessage('Connecting to room...');
		this.connectionUiState = ConnectionState.CONNECTED_TO_SERVER;
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

		this.connectionUiState = ConnectionState.CONNECTED_TO_ROOM;
	}

	handleOnErrorRoom() {
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

			this.welcome = false;

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_GRANTED;

		} else if (!cameraEvent.access) {
			// No camera :(

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_DENIED;
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

		// Resize manually
		this.resizeStreamsManually();
	}

	handleOnParticipantLeft(participantEvent: ParticipantEvent) {
		var oldParticipant = participantEvent.participant;
		delete this.participants[oldParticipant.getId()];

		// Emit event
		this.onParticipantLeft.emit({
			participantId: oldParticipant.getId()
		});

		// Resize manually
		this.resizeStreamsManually();
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

	handleOnCustomNotification(object: any) {
		this.onCustomNotification.emit(object);
	}

	handleOnLeaveRoom() {
		// Emit event
		this.onLeaveRoom.emit();
	}

	handleOnNewMessage(messageEvent: MessageEvent) {
		// Handle message
		this.chatMessages.push({
			username: messageEvent.participant.getId(),
			message: messageEvent.message,
			date: new Date() // Use current date
		});

		this.onNewMessage.emit(messageEvent);
	}

	private setUserMessage(msg: string) {
		this.userMessage = msg;
	}

}
