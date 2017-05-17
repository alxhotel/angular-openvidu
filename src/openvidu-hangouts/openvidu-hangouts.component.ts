import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild } from '@angular/core';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MdButton, MdSidenav } from '@angular/material';
import { Participant, Session, Stream } from 'openvidu-browser';

import { BigScreenService } from 'angular-bigscreen';

import { OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent, ParticipantEvent, RoomConnectedEvent, StreamEvent } from '../openvidu.directive';

@Component({
	selector: 'openvidu, openvidu-hangouts',
	templateUrl: './openvidu-hangouts.component.html',
	styleUrls: [ './openvidu-hangouts.component.css' ],
	providers: [ BigScreenService ],
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
export class OpenViduHangoutsComponent {

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

	// Flags for HTML elements
	userMessage: string = '';
	isFullscreen: boolean = false;

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
	private participants: { [id: string]: Participant } = {};

	// My camera
	private myCamera: Stream;

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService) {
		this.setUserMessage('Loading...');
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
		this.setUserMessage('Connecting to room...')
	}

	handleOnErrorServer(errorEvent: ErrorEvent) {
		if (errorEvent.error) {
			this.setUserMessage(errorEvent.error.message)
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
		
		console.log(this.streams);
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
