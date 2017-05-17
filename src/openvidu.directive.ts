import { Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { OpenVidu, Participant, Session, Stream } from 'openvidu-browser';

export interface RoomConnectedEvent {
	session?: Session;
}

export interface CameraAccessEvent {
	access: boolean;
	camera?: Stream;
	error?: any;
}

export interface ParticipantEvent {
	participant: Participant;
}

export interface StreamEvent {
	stream: Stream;
}

export interface MessageEvent {
	session: Session;
	participant: Participant;
	message: string;
}

export interface ErrorEvent {
	error: any;
}

@Directive({
	selector: 'openvidu-template, [openvidu-template]',
	exportAs: 'openviduApi'
})
export class OpenViduDirective implements OnDestroy {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;

	// Outputs
	@Output() onRoomConnected: EventEmitter<RoomConnectedEvent> = new EventEmitter();
	@Output() onErrorRoom: EventEmitter<ErrorEvent> = new EventEmitter();
	@Output() onLeaveRoom: EventEmitter<void> = new EventEmitter<void>();
	@Output() onErrorMedia: EventEmitter<ErrorEvent> = new EventEmitter();
	@Output() onLostConnection: EventEmitter<void> = new EventEmitter<void>();
	@Output() onNewMessage: EventEmitter<MessageEvent> = new EventEmitter();
	@Output() onParticipantJoined: EventEmitter<ParticipantEvent> = new EventEmitter();
	@Output() onParticipantLeft: EventEmitter<ParticipantEvent> = new EventEmitter();
	@Output() onRoomClosed: EventEmitter<void> = new EventEmitter<void>();
	
	// New Output
	@Output() onParticipantEvicted: EventEmitter<ParticipantEvent> = new EventEmitter();
	@Output() onParticipantPublished: EventEmitter<ParticipantEvent> = new EventEmitter();
	@Output() onStreamAdded: EventEmitter<StreamEvent> = new EventEmitter();
	@Output() onStreamRemoved: EventEmitter<StreamEvent> = new EventEmitter();
	@Output() onUpdateMainSpeaker: EventEmitter<StreamEvent> = new EventEmitter();
	@Output() onCustomNotification: EventEmitter<any> = new EventEmitter();

	@Output() onServerConnected: EventEmitter<void> = new EventEmitter<void>();
	@Output() onErrorServer: EventEmitter<ErrorEvent> = new EventEmitter();
	@Output() onCameraAccessChange: EventEmitter<CameraAccessEvent> = new EventEmitter();

	// Openvidu object
	private openVidu: OpenVidu;

	// Session
	private session: Session;

	// Dcitionary of Participants
	private participants: Map<string, Participant> = new Map();

	// Array of all streams
	private streams: Map<string, Stream> = new Map();

	// Main screen
	private mainStream: Stream;

	// My camera stream
	private myCamera: Stream;
	
	// Flags
	private connectedToServer: boolean = false;

	ngOnDestroy() {
		this.leaveRoom();
	}

	// Listen for changes in variables
	ngOnChanges() {
		// Check if we have all of the required params
		if (this.wsUrl && this.sessionId && this.participantId) {
			// Connect to server
			this.openVidu = new OpenVidu(this.wsUrl);
			this.openVidu.connect((error) => {
				if (error) {
					// Emit event
					this.onErrorServer.emit({
						error: error
					});
					return console.log(error);
				}

				// Set flag
				this.connectedToServer = true;

				// Emit event
				this.onServerConnected.emit()

				// [Debug]
				console.log(this.openVidu);

				// Connect to Room
				this.joinRoom();
			});
		}
	}

	sendMessage(text: string) {
		this.openVidu.sendMessage(this.sessionId, this.participantId, text);
	}
	
	get micEnabled() {
		return (this.myCamera && this.myCamera.getWebRtcPeer().audioEnabled);
	}

	set micEnabled(enabled: boolean) {
		this.myCamera.getWebRtcPeer().audioEnabled = enabled;
	}
	
	get camEnabled() {
		return (this.myCamera && this.myCamera.getWebRtcPeer().videoEnabled);
	}
	
	set camEnabled(enabled: boolean) {
		this.myCamera.getWebRtcPeer().videoEnabled = enabled;
	}

	leaveRoom() {
		if (this.connectedToServer) {
			// Emit event
			this.onLeaveRoom.emit();
		}

		// Reset
		if (this.openVidu) {
			this.openVidu.close(!this.connectedToServer);
		}
		this.session = null;
		this.participants = new Map();
		this.streams = new Map();
		this.mainStream = null;
		this.connectedToServer = false;
	}

	private joinRoom() {
		// Check that we are connected
		if (!this.connectedToServer) {
			this.onErrorRoom.emit({
				error: new Error('Not connected to server yet')
			});
			return;
		}

		// Set attributes
		var sessionOptions = {
			sessionId: this.sessionId,
			participantId: this.participantId
		};

		// Enter session
		this.openVidu.joinSession(sessionOptions, (error, session) => {
			if (error) {
				// Emit event
				this.onErrorRoom.emit({
					error: error
				});
				return console.log(error);
			}

			// Get session for this room
			this.session = session;
			this.setListeners();

			// Fix: manually emit event
			this.onRoomConnected.emit({
				session: this.session
			});

			let camera = this.openVidu.getCamera({
				recvAudio: true,
				recvVideo: true,
				audio: true,
				video: true,
				data: true
			});

			// Show camera
			camera.requestCameraAccess((error, camera) => {
				// User didn't allow access
				if (error) {
					this.onCameraAccessChange.emit({
						access: false,
						error: error
					});
					return console.log(error);
				}

				// Set myCamera
				this.myCamera = camera;
				this.myCamera.mirrorLocalStream(this.myCamera.getWrStream());
				
				// By default, current user is main speaker
				this.mainStream = this.myCamera;
				this.streams.set(this.myCamera.getId(), this.myCamera);
				this.participants.set(this.myCamera.getParticipant().getId(), this.myCamera.getParticipant());

				// Emit event
				this.onUpdateMainSpeaker.emit({
					stream: this.mainStream
				});

				// [Debug]
				var allStreams = session.getStreams();
				console.log('MY CAMERA APPROVED: ', camera);
				console.log('Other streams: ', allStreams);

				// Publish my camera to session
				this.myCamera.publish();

				// Emit event
				this.onCameraAccessChange.emit({
					access: true,
					camera: camera
				});
			});
		});
	}

	private setListeners() {
		// Set listeners
		this.session.addEventListener('update-main-speaker', (streamEvent: any) => {
			console.warn('update-main-speaker');

			// [PR] make a fix in Openvidu ? PR #2
			// "participantId" is not a participant ID, is a stream ID
			var mainStream: Stream = this.streams.get(streamEvent.participantId);
			if (mainStream) {
				// Check participant if it exists
				if (!this.participants.has(mainStream.getParticipant().getId())) {
					this.participants.set(mainStream.getParticipant().getId(), mainStream.getParticipant());
				}
				
				// Set main speaker
				this.mainStream = mainStream;

				// Emit event
				this.onUpdateMainSpeaker.emit({
					stream: mainStream
				});
			}
		});
		this.session.addEventListener('room-connected', () => {
			console.warn('room-connected');

			// Emit event
			this.onRoomConnected.emit();
		});
		this.session.addEventListener('error-room', (errorEvent: any) => {
			console.warn('error-room');

			// Emit event
			this.onErrorRoom.emit({
				error: errorEvent
			});
		});
		this.session.addEventListener('participant-published', (participantEvent: any) => {
			console.warn('participant-published');

			// Emit event
			this.onParticipantPublished.emit({
				participant: participantEvent.participant
			});
		});
		this.session.addEventListener('participant-joined', (participantEvent: any) => {
			console.warn('participant-joined');

			var newParticipant: Participant = participantEvent.participant;
			this.participants.set(newParticipant.getId(), newParticipant);

			// Emit event
			this.onParticipantJoined.emit({
				participant: newParticipant
			});
		});
		this.session.addEventListener('participant-left', (participantEvent: any) => {
			console.warn('participant-left');

			// Remove from  array
			var oldParticipant: Participant = participantEvent.participant;
			this.participants.delete(oldParticipant.getId());

			console.log(this.mainStream);
			console.log(oldParticipant);

			// Manually update main speaker if it was the main speaker
			if (this.mainStream === null ||
				(this.mainStream !== null && this.mainStream.getParticipant().getId() === oldParticipant.getId())) {

				// Update main speaker locally
				this.autoUpdateMainSpeaker();
			}
			
			// Emit event
			this.onParticipantLeft.emit({
				participant: oldParticipant
			});
		});
		this.session.addEventListener('participant-evicted', (participantEvent: any) => {
			console.warn('participant-evicted');

			// Emit event
			this.onParticipantEvicted.emit({
				participant: participantEvent.participant
			});
		});
		this.session.addEventListener('stream-added', (streamEvent: any) => {
			console.warn('stream-added');

			var newStream: Stream = streamEvent.stream;
			this.streams.set(newStream.getId(), newStream);
			
			// Also add to participant
			if (!this.participants.has(newStream.getParticipant().getId())) {
				this.participants.set(newStream.getParticipant().getId(), newStream.getParticipant());
			}
			this.participants.get(newStream.getParticipant().getId()).addStream(newStream);
			
			// Emit event
			this.onStreamAdded.emit({
				stream: newStream
			});
		});
		this.session.addEventListener('stream-removed', (streamEvent: any) => {
			console.warn('stream-removed');

			// Remove from array
			var oldStream: Stream = streamEvent.stream;
			this.streams.delete(oldStream.getId());

			// TODO: remove from participant

			// Manually update main speaker if it was the main speaker
			if (this.mainStream === null ||
				(this.mainStream !== null && this.mainStream.getId() === oldStream.getId())) {

				// Update main speaker locally
				this.autoUpdateMainSpeaker();
			}

			// Emit event
			this.onStreamRemoved.emit({
				stream: oldStream
			});
		});
		this.session.addEventListener('newMessage', (messageEvent: any) => {
			console.warn('new-message');

			// Emit event
			this.onNewMessage.emit({
				session: this.session,
				participant: this.participants.get(messageEvent.user),
				message: messageEvent.message
			});
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
		this.session.addEventListener('custom-message-received', (customNotificationEvent: any) => {
			console.warn('error-media');

			// Emit event
			this.onCustomNotification.emit(customNotificationEvent.params);
		});
	}

	private autoUpdateMainSpeaker() {
		// Consensus: choose next speaker based on participantId
		var firstParticipant: Participant = null;
		for (let key in this.participants) {
			if (firstParticipant == null || this.participants.get(key).getId() < firstParticipant.getId()) {
				firstParticipant = this.participants.get(key);
			}
		}

		if (firstParticipant) {
			// Get his stream
			var firstStream: Stream = firstParticipant.getStreams()[Object.keys(firstParticipant.getStreams())[0]];

			// Set new main speaker
			this.mainStream = firstStream;
			
			// Emit event
			this.onUpdateMainSpeaker.emit({
				stream: firstStream
			});	
		}
	}

}
