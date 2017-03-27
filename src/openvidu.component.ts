import { Component, ViewEncapsulation, Input, OnInit, Renderer, ElementRef, ViewChild } from '@angular/core';
import { MdButton } from '@angular/material';
import { OpenVidu, Session, Stream, Participant } from 'openvidu-browser';
import EventEmitter = require('wolfy87-eventemitter');
import screenfull = require('screenfull');

@Component({
	selector: 'openvidu',
	templateUrl: './openvidu.component.html',
	styleUrls: ['./openvidu.component.less']
})
export class OpenViduComponent implements OnInit {

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('toggleMicView') toggleMicElement: MdButton;
	@ViewChild('toggleCameraView') toggleCameraElement: MdButton;

	private ee = new EventEmitter();
	
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
	private userMessage: string = "Loading OpenViudu...";
	private micDisabled: boolean = false;
	private cameraDisabled: boolean = false;
	private isFullscreen: boolean = false;

	//Join form
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;

	constructor(private renderer: Renderer) {
		
	}
	
	ngOnInit() {
		// Set listeners
		window.onbeforeunload = () => {
			if (this.openVidu) {
				this.openVidu.close(true);
			}
		}
		
		// Display message
		this.userMessage = "Connecting...";
		
		// Setup connection to server
		this.openVidu = new OpenVidu(this.wsUrl);
		this.openVidu.connect((error, openVidu) => {
			if (error) return console.log(error);
			
			console.log(openVidu);
			this.connected = true;
			
			// Display message
			this.userMessage = "Joining room...";
			
			this.joinSession(this.sessionId, this.participantId, (error: any) => {
				if (error) console.log(error);

				// All correct :)

			})
		});
	}
	
	addEventListener(eventName: any, listener: any) {
        this.ee.addListener(eventName, listener);
    }

    emitEvent(eventName: any, eventsArray: any) {
        this.ee.emitEvent(eventName, eventsArray);
    }
	
	private setListeners() {
		// Set listeners
		this.session.addEventListener('update-main-speaker', (participantEvent: any) => {
			console.warn("Update main speaker");

			// TODO.: make a fix in Openvidu ?
			// "participantId" is not a participant ID, is a stream ID
			if (this.streams == null) this.streams = []; 
			
			for (let stream of this.streams) {
				console.log(stream.getId());
				if (stream.getId() == participantEvent.participantId) {
					var streams = this.participants[stream.getParticipant().getId()].getStreams();
					// Use any stream
					this.mainStream = streams[Object.keys(streams)[0]];
					break;
				}
			}
		});
		this.session.addEventListener('error-room', () => {
			console.warn("error-room");
			
		});
		this.session.addEventListener('room-connected', () => {
			console.warn("Room connected");
			
			this.joinedRoom = true;
		});
		this.session.addEventListener('stream-added', (streamEvent: any) => {
			console.warn("Stream added");
			
			var newStream = streamEvent.stream;
			this.streams.push(newStream);
			// Also add to participant
			this.participants[newStream.getParticipant().getId()].addStream(newStream);
		});
		this.session.addEventListener('participant-published', () => {
			console.warn("Participant published");
			
		});
		this.session.addEventListener('participant-joined', (participantEvent: any) => {
			console.warn("participant-joined");
			
			var newParticipant = participantEvent.participant;
			this.participants[newParticipant.id] = newParticipant;
		});
		this.session.addEventListener('participant-left', (participantEvent: any) => {
			console.warn("Participant Left");
			
			var oldParticipant = participantEvent.participant;
			this.participants.splice(this.participants.indexOf(oldParticipant), 1);
		});
		this.session.addEventListener('stream-removed', (streamEvent: any) => {
			console.warn("stream-removed");
			
			var oldStream = streamEvent.stream;
			this.streams.splice(this.streams.indexOf(oldStream), 1);
		});
		this.session.addEventListener('participant-evicted', () => {
			console.warn("participant-evicted");
			
		});
		this.session.addEventListener('newMessage', () => {
			console.warn("newMessage");
			
		});
		this.session.addEventListener('room-closed', () => {
			console.warn("room-closed");
			
		});
		this.session.addEventListener('lost-connection', () => {
			console.warn("lost-connection");
			
		});
		this.session.addEventListener('error-media', () => {
			console.warn("error-media");
			
		});
	}

	private joinSession(sessionId: string, participantId: string, callback: any) {
		if (!this.connected) callback(new Error("Not connected to server yet"));
		
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
				console.log("MY CAMERA APPROVED: ", camera);
				console.log("Other streams: ", allStreams);

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
		if (screenfull.isFullscreen) {
			screenfull.exit();
		} else {
			screenfull.request(this.mainElement.nativeElement);
		}
		this.isFullscreen = screenfull.isFullscreen;
	}

	private onLostConnection() {
		if (!this.joinedRoom) {
			console.warn('Not connected to room, ignoring lost connection notification');
			return false;
		}
	}

	private leaveSession() {
		this.mainStream = null;
		this.session = null;
		this.streams = [];
		this.participants = [];
		this.userMessage = "You left the room";
		this.joinedRoom = false;
		if (this.openVidu) {
			this.openVidu.close(true);
		}
	}

}
