import { Component, ElementRef, EventEmitter, Input, OnInit, Output, Renderer, ViewChild, ViewEncapsulation } from '@angular/core';
import { MdButton } from '@angular/material';
import { OpenVidu, Participant, Session, Stream } from 'openvidu-browser';

import { BigScreenService } from 'angular-bigscreen';

@Component({
	selector: 'openvidu',
	templateUrl: './openvidu.component.html',
	styleUrls: ['./openvidu.component.less'],
	providers: [ BigScreenService ],
	encapsulation: ViewEncapsulation.None
})
export class OpenViduComponent implements OnInit {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;

	// Outputs
	@Output() onRoomConnected: EventEmitter<any> = new EventEmitter();
	@Output() onRoomClosed: EventEmitter<any> = new EventEmitter();
	@Output() onLostConnection: EventEmitter<any> = new EventEmitter();
	//@Output() onErrorRoom: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamAdded: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamRemoved: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantJoined: EventEmitter<any> = new EventEmitter();
	//@Output() onParticpantPublished: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantLeft: EventEmitter<any> = new EventEmitter();
	//@Output() onParticipantEvicted: EventEmitter<any> = new EventEmitter();
	//@Output() onUpodateMainSpeaker: EventEmitter<any> = new EventEmitter();
	//@Output() onNewMessage: EventEmitter<any> = new EventEmitter();
	@Output() onErrorMedia: EventEmitter<any> = new EventEmitter();
	//@Output() onCustomMessageReceived: EventEmitter<any> = new EventEmitter();

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('toggleMicView') toggleMicElement: MdButton;
	@ViewChild('toggleCameraView') toggleCameraElement: MdButton;

	// Next verion: make it an input
	private toolbarColor: string = 'primary';

	// Openvidu object
	private openVidu: OpenVidu;

	// Session
	private session: Session;

	// Participants
	private participants: Participant[] = [];

	// My camera
	private myCamera: Stream;

	// Big screen
	private mainStream: Stream;

	// Rest of peers
	private streams: Stream[] = [];

	private joinedRoom: boolean = false;
	private connected: boolean = false;

	// Flags for HTML elements
	private userMessage: string = 'Loading OpenViudu...';
	private micDisabled: boolean = false;
	private cameraDisabled: boolean = false;
	private isFullscreen: boolean = false;

	constructor(private renderer: Renderer, private bigScreenService: BigScreenService) {
	}

	ngOnInit() {
		// Set listeners
		window.onbeforeunload = (() => {
			if (this.openVidu) {
				this.openVidu.close(true);
			}
		});

		// Display message
		this.userMessage = 'Connecting...';

		// Setup connection to server
		this.openVidu = new OpenVidu(this.wsUrl);
		this.openVidu.connect((error, openVidu) => {
			if (error) return console.log(error);

			console.log(openVidu);
			this.connected = true;

			// Display message
			this.userMessage = 'Joining room...';

			this.joinSession(this.sessionId, this.participantId, (error: any) => {
				if (error) console.log(error);

				// All correct :)

			});
		});

		// Set listener
		this.bigScreenService.onchange(() => {
			// TODO: check if mainElement is the one with fullscreen
			this.isFullscreen = this.bigScreenService.isFullscreen();
		});
	}

	private setListeners() {
		// Set listeners
		this.session.addEventListener('update-main-speaker', (participantEvent: any) => {
			console.warn('Update main speaker');

			// TODO.: make a fix in Openvidu ?
			// "participantId" is not a participant ID, is a stream ID
			if (this.streams === null) this.streams = [];

			for (let stream of this.streams) {
				console.log(stream.getId());
				if (stream.getId() === participantEvent.participantId) {
					var realParticipantId = stream.getParticipant().getId();
					//this.participants.indexOf(oldParticipant)
					var streams = this.participants[realParticipantId].getStreams();
					// Use any stream
					this.mainStream = streams[Object.keys(streams)[0]];
					break;
				}
			}
		});
		this.session.addEventListener('error-room', () => {
			console.warn('error-room');

			// Emit event
			//this.onErrorRoom.emit();
		});
		this.session.addEventListener('room-connected', () => {
			console.warn('Room connected');
			this.joinedRoom = true;

			// Emit event
			this.onRoomConnected.emit();
		});
		this.session.addEventListener('stream-added', (streamEvent: any) => {
			console.warn('Stream added');

			var newStream = streamEvent.stream;
			this.streams.push(newStream);
			// Also add to participant
			this.participants[newStream.getParticipant().getId()].addStream(newStream);
		});
		this.session.addEventListener('participant-published', () => {
			console.warn('Participant published');

		});
		this.session.addEventListener('participant-joined', (participantEvent: any) => {
			console.warn('participant-joined');

			var newParticipant = participantEvent.participant;
			this.participants[newParticipant.id] = newParticipant;

			// Emit event
			this.onParticipantJoined.emit({
				participantId: newParticipant.id
			});
		});
		this.session.addEventListener('participant-left', (participantEvent: any) => {
			console.warn('Participant Left');

			// TODO: manually update main speaker
			var oldParticipant = participantEvent.participant;
			this.participants.splice(this.participants.indexOf(oldParticipant), 1);

			// Emit event
			this.onParticipantLeft.emit({
				participantId: oldParticipant.id
			});
		});
		this.session.addEventListener('stream-removed', (streamEvent: any) => {
			console.warn('stream-removed');

			// TODO: manually update main speaker
			var oldStream = streamEvent.stream;
			this.streams.splice(this.streams.indexOf(oldStream), 1);
		});
		this.session.addEventListener('participant-evicted', (participantEvent: any) => {
			console.warn('participant-evicted');

			var localParticipant = participantEvent.localParticipant;

			// Emit event
			//this.onParticipantEvicted.emit({
			//	participantId: localParticipant.id
			//});
		});
		this.session.addEventListener('newMessage', () => {
			console.warn('newMessage');

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

	private toggleMic() {
		var toggleMicButton = this.toggleMicElement._getHostElement();
		if (this.micDisabled) {
			this.renderer.setElementClass(toggleMicButton, 'disabled', false);
			this.myCamera.getWebRtcPeer().audioEnabled = true;
		} else {
			this.renderer.setElementClass(toggleMicButton, 'disabled', true);
			this.myCamera.getWebRtcPeer().audioEnabled = false;
		}
		this.micDisabled = !this.micDisabled;
	}

	private toggleCamera() {
		var toggleCameraButton = this.toggleCameraElement._getHostElement();
		if (this.cameraDisabled) {
			this.renderer.setElementClass(toggleCameraButton, 'disabled', false);
			this.myCamera.getWebRtcPeer().videoEnabled = true;
		} else {
			this.renderer.setElementClass(toggleCameraButton, 'disabled', true);
			this.myCamera.getWebRtcPeer().videoEnabled = false;
		}
		this.cameraDisabled = !this.cameraDisabled;
	}

	private toggleFullscreen() {
		if (this.bigScreenService.isFullscreen()) {
			this.bigScreenService.exit();
		} else {
			this.bigScreenService.request(this.mainElement.nativeElement);
		}
	}

	/*private onLostConnection() {
		if (!this.joinedRoom) {
			console.warn('Not connected to room, ignoring lost connection notification');
			return false;
		}
	}*/

	private leaveSession() {
		this.mainStream = null;
		this.session = null;
		this.streams = [];
		this.participants = [];
		this.userMessage = 'You left the room';
		this.joinedRoom = false;
		if (this.openVidu) {
			this.openVidu.close(true);
		}
	}

}
