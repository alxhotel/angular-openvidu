import { Component, ViewEncapsulation, Input, OnInit } from '@angular/core';
import { OpenVidu, Session, Stream, Participant } from 'openvidu-browser';
import EventEmitter = require('wolfy87-eventemitter');
import screenfull = require('screenfull');

@Component({
	selector: 'openvidu',
	templateUrl: './openvidu.component.html',
	styleUrls: ['./css/openvidu.component.css'],
	encapsulation: ViewEncapsulation.None
})
export class OpenViduComponent implements OnInit {

	private ee = new EventEmitter();
	
	private openVidu: OpenVidu;

	private loading: boolean;
	
	private connected = false;
	
	private joinedRoom = false;

	//Session
	private session: Session;

	// Participants
	private participants: Participant[] = [];

	// My camera
	private myCamera: Stream;

	// Big screen
	private mainStream: Stream;

	// Rest of peers
	private streams: Stream[] = [];

	private micDisabled: boolean = false;
	private cameraDisabled: boolean = false;

	//Join form
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;

	constructor() {
		
	}
	
	ngOnInit() {
		// Loading...
		this.loading = true;

		window.onbeforeunload = () => {
			if (this.openVidu) {
				this.openVidu.close(true);
			}
		}
		
		// Setup connection to server
		this.openVidu = new OpenVidu(this.wsUrl);
		this.openVidu.connect((error, openVidu) => {
			if (error) return console.log(error);
			
			console.log(openVidu);
			
			this.connected = true;
			
			this.joinSession(this.sessionId, this.participantId, (error: any) => {
				if (error) console.log(error);

				// All correct :)

			})
		});

		// Finish loading
		this.loading = false;
	}
	
	addEventListener(eventName: any, listener: any) {
        this.ee.addListener(eventName, listener);
    }

    emitEvent(eventName: any, eventsArray: any) {
        this.ee.emitEvent(eventName, eventsArray);
    }
	
	private setListeners() {
		// Set listeners
		this.session.addEventListener('update-main-speaker', this.updateMainSpeaker);
		this.session.addEventListener('error-room', () => {
			console.warn("error-room");
			
		});
		this.session.addEventListener('room-connected', () => {
			console.warn("Room connected");
			
			this.joinedRoom = true;
		});
		this.session.addEventListener('stream-added', (streamEvent: any) => {
			console.warn("Stream added");
			
			this.streams.push(streamEvent.stream);
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
			
			delete this.participants[participantEvent.participant.id];
		});
		this.session.addEventListener('stream-removed', () => {
			console.warn("stream-removed");
			
			//this.removeVideoTag(streamEvent.stream);
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
	
	private updateMainSpeaker(participantEvent: any) {
		console.warn("Update main speaker");
		
		var streams = this.participants[participantEvent.participantId].getStreams();
		this.mainStream = streams[Object.keys(streams)[0]];
	}

	private removeVideoTag(stream: Stream) {
		console.log("Stream removed");
		this.streams.slice(this.streams.indexOf(stream), 1);
	}

	joinSession(sessionId: string, participantId: string, callback: any) {
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
	
	toggleMic() {
		var toggleMicButton = document.getElementsByClassName("toggle-mic")[0];
		if (this.micDisabled) {
			toggleMicButton.className = toggleMicButton.className.replace(/(?:^|\s)disabled(?!\S)/g , '')
			this.myCamera.getWebRtcPeer().audioEnabled = true;
		} else {
			toggleMicButton.className += " disabled";
			this.myCamera.getWebRtcPeer().audioEnabled = false;
		}
		this.micDisabled = !this.micDisabled;
		
		console.log(this.myCamera);
	}
	
	toggleCamera() {
		var toggleCameraButton = document.getElementsByClassName("toggle-camera")[0];
		if (this.cameraDisabled) {
			toggleCameraButton.className = toggleCameraButton.className.replace(/(?:^|\s)disabled(?!\S)/g , '')
			this.myCamera.getWebRtcPeer().videoEnabled = true;
		} else {
			toggleCameraButton.className += " disabled";
			this.myCamera.getWebRtcPeer().videoEnabled = false;
		}
		this.cameraDisabled = !this.cameraDisabled;
		
		console.log(this.myCamera);
	}
	
	toggleFullscreen() {
		// TODO
		screenfull.request(document.getElementsByClassName('openvidu')[0]);
	}

	onLostConnection() {
		if (!this.joinedRoom) {
			console.warn('Not connected to room, ignoring lost connection notification');
			return false;
		}
	}

	leaveSession() {
		this.session = null;
		this.streams = [];
		this.connected = false;
		this.joinedRoom = false;
		if (this.openVidu) {
			this.openVidu.close(true);
		}
	}

}
