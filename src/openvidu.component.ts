import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer, ViewChild } from '@angular/core';
import { animate, keyframes, state, style, transition, trigger } from '@angular/animations';
import { MdButton, MdInputDirective, MdSidenav } from '@angular/material';
import { OpenVidu, Participant, Session, Stream } from 'openvidu-browser';

import { BigScreenService } from 'angular-bigscreen';

@Component({
	selector: 'openvidu',
	templateUrl: './openvidu.component.html',
	styleUrls: ['./openvidu.component.less'],
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
export class OpenViduComponent implements OnInit, OnDestroy {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;
	// TODO: [Next verion] make it an input
	@Input() toolbarColor: string = 'primary';

	// Outputs
	@Output() onRoomConnected: EventEmitter<any> = new EventEmitter();
	@Output() onRoomClosed: EventEmitter<any> = new EventEmitter();
	@Output() onLostConnection: EventEmitter<any> = new EventEmitter();
	@Output() onErrorRoom: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamAdded: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamRemoved: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantJoined: EventEmitter<any> = new EventEmitter();
	//@Output() onParticpantPublished: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantLeft: EventEmitter<any> = new EventEmitter();
	//@Output() onParticipantEvicted: EventEmitter<any> = new EventEmitter();
	//@Output() onUpodateMainSpeaker: EventEmitter<any> = new EventEmitter();
	@Output() onNewMessage: EventEmitter<any> = new EventEmitter();
	@Output() onErrorMedia: EventEmitter<any> = new EventEmitter();
	@Output() onCloseSession: EventEmitter<any> = new EventEmitter();

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('sidenav') sidenav: MdSidenav;
	@ViewChild('toggleMicButton') toggleMicButton: MdButton;
	@ViewChild('toggleCameraButton') toggleCameraButton: MdButton;
	@ViewChild('toggleChatButton') toggleChatButton: MdButton;
	@ViewChild('messageInput') messageInput: MdInputDirective;
	@ViewChild('sendMessageButton') sendMessageButton: MdButton;

	// Flags for HTML elements
	userMessage: string = '';
	micDisabled: boolean = false;
	cameraDisabled: boolean = false;
	isFullscreen: boolean = false;

	// Main screen
	mainStream: Stream;

	// Rest of peers
	streams: Stream[] = [];

	// Chat
	chatMessages: any[] = [];

	// Animations
	chatButtonState: string = 'show';

	// Openvidu object
	private openVidu: OpenVidu;

	// Session
	private session: Session;

	// Participants
	private participants: { [id: string]: Participant } = {};

	// My camera
	private myCamera: Stream;

	private joinedRoom: boolean = false;
	private connected: boolean = false;

	constructor(private renderer: Renderer, private bigScreenService: BigScreenService) {
		this.setUserMessage('Loading OpenViudu...');
	}

	ngOnInit() {
		// Display message
		this.setUserMessage('Connecting...');

		// Setup connection to server
		this.openVidu = new OpenVidu(this.wsUrl);
		this.openVidu.connect((error, openVidu) => {
			if (error) return console.log(error);

			console.log(openVidu);
			this.connected = true;

			// Display message
			this.setUserMessage('Joining room...');

			this.joinSession(this.sessionId, this.participantId, (error: any) => {
				if (error) {
					console.log(error);
					this.setUserMessage(error.message);
				}

				// All correct :)

			});
		});

		// Set fullscreen listener
		this.bigScreenService.onChange(() => {
			// No need to check if mainElement is the one with fullscreen
			this.isFullscreen = this.bigScreenService.isFullscreen();
		});
	}

	ngOnDestroy() {
		this.bigScreenService.exit();
		this.leaveSession();
	}

	toggleMic() {
		var toggleMicButton = this.toggleMicButton._getHostElement();
		if (this.micDisabled) {
			this.renderer.setElementClass(toggleMicButton, 'disabled', false);
			this.myCamera.getWebRtcPeer().audioEnabled = true;
		} else {
			this.renderer.setElementClass(toggleMicButton, 'disabled', true);
			this.myCamera.getWebRtcPeer().audioEnabled = false;
		}
		this.micDisabled = !this.micDisabled;
	}

	toggleCamera() {
		var toggleCameraButton = this.toggleCameraButton._getHostElement();
		if (this.cameraDisabled) {
			this.renderer.setElementClass(toggleCameraButton, 'disabled', false);
			this.myCamera.getWebRtcPeer().videoEnabled = true;
		} else {
			this.renderer.setElementClass(toggleCameraButton, 'disabled', true);
			this.myCamera.getWebRtcPeer().videoEnabled = false;
		}
		this.cameraDisabled = !this.cameraDisabled;
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
		this.renderer.setElementAttribute(this.messageInput, 'value', null);
		// Send to OpenVidu server
		this.openVidu.sendMessage(this.sessionId, this.participantId, text);
	}

	leaveSession() {
		this.mainStream = null;
		this.session = null;
		this.streams = [];
		this.participants = {};
		this.setUserMessage('You left the room');
		this.joinedRoom = false;
		if (this.openVidu) {
			this.openVidu.close(false);
		}
		// Emit event
		this.onCloseSession.emit();
	}

	/*private onLostConnection() {
		if (!this.joinedRoom) {
			console.warn('Not connected to room, ignoring lost connection notification');
			return false;
		}
	}*/

	private setUserMessage(msg: string) {
		this.userMessage = msg;
	}

	private setListeners() {
		// Set listeners
		this.session.addEventListener('update-main-speaker', (participantEvent: any) => {
			console.warn('update-main-speaker');

			// TODO: make a fix in Openvidu ? PR #2
			// "participantId" is not a participant ID, is a stream ID
			if (this.streams === null) this.streams = [];

			for (let stream of this.streams) {
				console.log(stream.getId());
				if (stream.getId() === participantEvent.participantId) {
					var realParticipantId = stream.getParticipant().getId();

					// Check if it exists
					if (this.participants[realParticipantId] === undefined) {
						this.participants[realParticipantId] = stream.getParticipant();
					}

					// Use first stream of participant
					this.mainStream = stream;
					break;
				}
			}
		});
		this.session.addEventListener('error-room', (errorEvent: any) => {
			console.warn('error-room');

			// Emit event
			this.onErrorRoom.emit(errorEvent);
		});
		this.session.addEventListener('room-connected', () => {
			console.warn('room-connected');
			this.joinedRoom = true;

			// Emit event
			this.onRoomConnected.emit();
		});
		this.session.addEventListener('stream-added', (streamEvent: any) => {
			console.warn('stream-added');

			var newStream: Stream = streamEvent.stream;
			this.streams.push(newStream);
			// Also add to participant
			if (this.participants[newStream.getParticipant().getId()] !== undefined) {
				this.participants[newStream.getParticipant().getId()].addStream(newStream);
			}
		});
		this.session.addEventListener('participant-published', () => {
			console.warn('participant-published');

		});
		this.session.addEventListener('participant-joined', (participantEvent: any) => {
			console.warn('participant-joined');

			var newParticipant: Participant = participantEvent.participant;
			this.participants[newParticipant.getId()] = newParticipant;

			// Emit event
			this.onParticipantJoined.emit({
				participantId: newParticipant.getId()
			});
		});
		this.session.addEventListener('participant-left', (participantEvent: any) => {
			console.warn('Participant Left ' + participantEvent.participant);

			// TODO: manually update main speaker
			var oldParticipant: Participant = participantEvent.participant;
			delete this.participants[oldParticipant.getId()];

			// Emit event
			this.onParticipantLeft.emit({
				participantId: oldParticipant.getId()
			});
		});
		this.session.addEventListener('stream-removed', (streamEvent: any) => {
			console.warn('stream-removed');

			// TODO: manually update main speaker
			var oldStream: Stream = streamEvent.stream;
			this.streams.splice(this.streams.indexOf(oldStream), 1);
		});
		this.session.addEventListener('participant-evicted', (participantEvent: any) => {
			console.warn('participant-evicted');

			var localParticipant: Participant = participantEvent.localParticipant;

		});
		this.session.addEventListener('newMessage', (messageEvent: any) => {
			console.warn('newMessage');

			// TODO: handle message
			if (messageEvent.message !== null) {
				this.chatMessages.push({
					username: messageEvent.user,
					message: messageEvent.message,
					date: new Date()
				});
			}

			this.onNewMessage.emit(messageEvent);
		});
		this.session.addEventListener('room-closed', () => {
			console.warn('room-closed');

			// Emit event
			this.onRoomClosed.emit();
		});
		this.session.addEventListener('lost-connection', () => {
			console.warn('lost-connection');

			// Emit event
			this.onLostConnection.emit();
		});
		this.session.addEventListener('error-media', (errorEvent: any) => {
			console.warn('error-media');

			// Emit event
			this.onErrorMedia.emit({
				error: errorEvent.error
			});
		});
	}

	private joinSession(sessionId: string, participantId: string, callback: any) {
		if (!this.connected) callback(new Error('Not connected to server yet'));

		// Set attributes
		this.sessionId = sessionId;
		this.participantId = participantId;

		var sessionOptions = {
			sessionId: this.sessionId,
			participantId: this.participantId
		};

		// Enter session
		this.openVidu.joinSession(sessionOptions, (error, session) => {
			if (error) return callback(error);

			// Get session for this room
			this.session = session;
			this.setListeners();

			let camera = this.openVidu.getCamera({
				recvAudio: true,
				recvVideo: true,
				audio: true,
				video: true,
				data: true
			});

			// Show camera
			camera.requestCameraAccess((error, camera) => {
				if (error) return callback(error);

				this.myCamera = camera;
				this.myCamera.mirrorLocalStream(this.myCamera.getWrStream());
				this.mainStream = this.myCamera;
				this.streams.push(this.myCamera);

				// Debug
				var allStreams = session.getStreams();
				console.log('MY CAMERA APPROVED: ', camera);
				console.log('Other streams: ', allStreams);

				// Publish my camera to session
				this.myCamera.publish();

				return callback(error);
			});
		});
	}
}
