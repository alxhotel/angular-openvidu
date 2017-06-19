import {
	Component, ElementRef, EventEmitter, HostListener, Input, OnInit, OnDestroy,
	Output, QueryList, Renderer2, ViewChild, ViewChildren
} from '@angular/core';

// Angular Material
import { MdSidenav } from '@angular/material';

// OpenVidu Browser
import { Connection, Session, Stream } from 'openvidu-browser';

//import { BigScreenService } from 'angular-bigscreen';

import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	ParticipantData, ParticipantEvent, RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

import { StreamAppearinComponent } from './stream-appearin/stream-appearin.component';

import { OpenViduAppearinIntl } from './openvidu-appearin-intl';

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
	styleUrls: [ './openvidu-appearin.component.css' ]
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
	private participants: { [id: string]: Connection } = {};

	// My camera
	private myCamera: Stream;

	constructor(private renderer: Renderer2,// private bigScreenService: BigScreenService,
		public _intl: OpenViduAppearinIntl) {
		this.setUserMessage(this._intl.loadingLabel);
		this.welcome = true;
	}

	ngOnInit() {
		// Display message
		this.setUserMessage(this._intl.connectingLabel);

		// Set fullscreen listener
		//this.bigScreenService.onChange(() => {
			// No need to check if mainElement is the one with fullscreen
		//	this.isFullscreen = this.bigScreenService.isFullscreen();
		//});
	}

	ngOnDestroy() {
		//this.bigScreenService.exit();
		this.leaveRoom();
	}

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

	@HostListener('window:resize', ['$event'])
	onResize(event: any) {
		this.resizeStreamsManually();
	}

	toggleMic() {
		this.openviduApi.micEnabled = !this.openviduApi.micEnabled;
	}

	toggleCamera() {
		this.openviduApi.camEnabled = !this.openviduApi.camEnabled;
	}

	toggleFullscreen() {
		//if (this.bigScreenService.isFullscreen()) {
		//	this.bigScreenService.exit();
		//} else {
		//	this.bigScreenService.request(this.mainElement.nativeElement);
		//}
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

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnParticipantLeft(participantEvent: ParticipantEvent) {
		var oldParticipant = participantEvent.participant;
		delete this.participants[oldParticipant.getId()];

		// Emit event
		this.onParticipantLeft.emit({
			participantId: oldParticipant.getId()
		});

		// Fix: manually resize panel
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

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnStreamRemoved(streamEvent: StreamEvent) {
		var oldStream = streamEvent.stream;
		this.streams.splice(this.streams.indexOf(oldStream), 1);

		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	handleOnCustomNotification(object: any) {
		this.onCustomNotification.emit(object);
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

	handleOnSourceAdded() {
		// Fix: manually resize panel
		this.resizeStreamsManually();
	}

	private setUserMessage(msg: string) {
		this.userMessage = msg;
	}

	private resizeStreamsManually() {
		var obj = this.auxResizeStreamsManually();

		//console.log(obj);

		if (!obj.error) {
			this.streamMaxWidth = obj.width + 'px';
			this.streamMaxHeight = obj.height + 'px';
		}
	}

	private auxResizeStreamsManually(): {width?: number, height?: number, error?: boolean} {
		if (!this.panelVideo) return;

		var clientRect = this.panelVideo.nativeElement.getBoundingClientRect();

		var maxDimensions = {
			maxW: 0,
			maxH: 0
		};
		this.streamAppearin.forEach(function (streamGoToMeetingEl) {
			var videoEl = streamGoToMeetingEl.videoStream.nativeElement;
			if (videoEl.videoWidth > maxDimensions.maxW) {
				if (videoEl.videoHeight > maxDimensions.maxH) {
					maxDimensions.maxW = videoEl.videoWidth;
					maxDimensions.maxH = videoEl.videoHeight;
				}
			}
		});

		//console.log(maxDimensions);

		var numElements = this.streamAppearin.length;
		var width = clientRect.width;
		var height = clientRect.height;
		var area = height * width;
		var elementArea = parseInt((area / numElements) + '');

		// Calculate proportions
		var maxProportions = {
			maxW: 0,
			maxH: 0,
		};
		if (width > height) {
			// It'a horizontal rectangle
			maxProportions.maxW = maxDimensions.maxW / maxDimensions.maxH;
			maxProportions.maxH = ((maxDimensions.maxW / maxDimensions.maxH) * maxDimensions.maxH) / maxDimensions.maxW;
		} else if (height > width) {
			// It'a vertcal rectangle
			maxProportions.maxW = ((maxDimensions.maxH / maxDimensions.maxW) * maxDimensions.maxW) / maxDimensions.maxH;
			maxProportions.maxH = maxDimensions.maxH / maxDimensions.maxW;
		} else {
			// It's a square
			maxProportions.maxW = maxDimensions.maxW / maxDimensions.maxH;
			maxProportions.maxH = ((maxDimensions.maxW / maxDimensions.maxH) * maxDimensions.maxH) / maxDimensions.maxW;
		}

		//console.log(maxProportions);

		var elementWidth = parseInt(Math.sqrt(elementArea * (maxProportions.maxW / maxProportions.maxH)) + '');
		var elementHeight = parseInt(Math.sqrt(elementArea * (maxProportions.maxH / maxProportions.maxW)) + '');

		//console.log(elementWidth);

		// We now need to fit the squares. Let's reduce the square size
		// so an integer number fits the width.
		var numX = Math.ceil(width / elementWidth);
		elementWidth = width / numX;
		elementHeight = elementWidth * (maxProportions.maxH / maxProportions.maxW);
		while (numX <= numElements) {
			// With a bit of luck, we are done.
			if (Math.floor(height / elementHeight) * numX >= numElements) {
				// They all fit! We are done!
				return {width: elementWidth, height: elementHeight};
			}
			// They don't fit. Make room for one more square i each row.
			numX++;
			elementWidth = width / numX;
			elementHeight = elementWidth * (maxProportions.maxH / maxProportions.maxW);
		}
		// Still doesn't fit? The window must be very wide
		// and low.
		elementHeight = height;
		return {width: elementWidth, height: elementHeight};
	}

}
