import { Directive, EventEmitter, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { Connection, OpenVidu, Session, Subscriber, Publisher, Stream } from 'openvidu-browser';

/**
 * Export interfaces of the events for the user of the module
 */
export interface RoomConnectedEvent {
	session?: Session;
}

export interface CameraAccessEvent {
	access: boolean;
	camera?: Stream;
	error?: any;
}

export interface ParticipantEvent {
	participant: Connection;
}

export interface StreamEvent {
	stream: Stream;
}

export interface MessageEvent {
	session: Session;
	participant: Connection;
	message: string;
}

export interface ErrorEvent {
	error: any;
}

export interface ParticipantData {
	username: string;
}

export enum OpenViduNotificationType {
	MIC_CHANGED = 1,
	CAM_CHANGED = 2
};

/**
 * AngularOpenVidu Directive to create your own template
 * - Exports an API called: openviduApi
 */
@Directive({
	selector: 'openvidu-template, [openvidu-template]',
	exportAs: 'openviduApi'
})
export class OpenViduDirective implements OnDestroy, OnChanges {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;
	@Input() apiKey: string;
	@Input() token: string;

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
	private openvidu: OpenVidu;

	// Session
	private session: Session;

	// Dictionary of Subscribers
	private participants: Map<string, Connection> = new Map();

	// Array of all streams
	private streams: Map<string, Stream> = new Map();

	// Main screen
	private mainStream: Stream;

	// My camera stream
	private myCamera: Stream;
	private myCameraId: string = null;

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
			this.openvidu = new OpenVidu(this.wsUrl);

			if (this.apiKey) {
				this.session = this.openvidu.initSession(this.apiKey, this.sessionId);
			} else {
				this.session = this.openvidu.initSession(this.sessionId);
			}

			/*if (error) {
				// Emit event
				this.onErrorServer.emit({
					error: error
				});
				return console.log(error);
			}*/

			// Start listening for events
			this.setListeners();

			// Set flag
			this.connectedToServer = true;

			// Emit event
			this.onServerConnected.emit();

			// [Debug]
			console.log(this.openvidu);

			// Connect to Room
			this.joinRoom();
		}
	}

	get micEnabled() {
		return (this.myCamera && this.myCamera.getWebRtcPeer() && this.myCamera.getWebRtcPeer().audioEnabled);
	}

	set micEnabled(enabled: boolean) {
		this.myCamera.getWebRtcPeer().audioEnabled = enabled;
	}

	get camEnabled() {
		return (this.myCamera && this.myCamera.getWebRtcPeer() && this.myCamera.getWebRtcPeer().videoEnabled);
	}

	set camEnabled(enabled: boolean) {
		this.myCamera.getWebRtcPeer().videoEnabled = enabled;
	}

	sendMessage(text: string) {
		this.openvidu.openVidu.sendMessage(this.sessionId, this.getCurrentToken(), text);
	}

	sendCustomNotification(obj: any, callback: any) {
		this.openvidu.openVidu.sendCustomRequest(obj, callback);
	}

	/**
	 * Set new camera device for current user.
	 * @param deviceId - if null the camera is the default one
	 */
	setCamera(deviceId: string) {
		// Set camera options
		let cameraOptions = null;
		if (deviceId === null) {
			cameraOptions = {
				recvAudio: true,
				recvVideo: true,
				audio: true,
				video: true,
				data: true,
				mediaConstraints: {
					audio: true,
					video: { width: { ideal: 1280 } }
				}
			};
		} else {
			cameraOptions = {
				recvAudio: true,
				recvVideo: true,
				audio: {deviceId: { exact: deviceId }},
				video: {deviceId: { exact: deviceId }},
				data: true,
				mediaConstraints: {
					audio: true,
					video: { width: { ideal: 1280 } }
				}
			};
		}

		// Create stream with the options
		let camera = this.openvidu.openVidu.getCamera(cameraOptions);

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

			console.log('CAMERA CHANGED TO: ' + deviceId);

			this.myCameraId = deviceId;

			// User wants to change camera
			if (deviceId !== null) {
				// Ugly fix: leave room and re-enter
				this.openvidu.openVidu.close(false);
				setTimeout(() => {
					this.joinRoom(false);
				}, 1000);
				return;
			}

			// Fix: manually emit event
			this.onRoomConnected.emit({
				session: this.session
			});

			// Set myCamera
			this.myCamera = camera;
			this.myCamera.mirrorLocalStream(this.myCamera.getWrStream());

			// By default, current user is main speaker
			this.mainStream = this.myCamera;
			this.streams.set(this.myCamera.getId(), this.myCamera);
			this.participants.set(this.myCamera.getParticipant().getId(), this.myCamera.getParticipant());

			// Publish new camera
			this.myCamera.isReady = true;
			this.myCamera.publish();

			// [Debug]
			var allStreams = this.session.connection.getStreams();
			console.log('MY CAMERA APPROVED: ', camera);
			console.log('All streams: ', allStreams);

			// Emit event
			this.onUpdateMainSpeaker.emit({
				stream: this.mainStream
			});

			// Emit event
			this.onCameraAccessChange.emit({
				access: true,
				camera: camera
			});
		});
	}

	leaveRoom() {
		if (this.connectedToServer) {
			// Emit event
			this.onLeaveRoom.emit();
		}

		// Reset
		if (this.openvidu) {
			this.openvidu.openVidu.close(!this.connectedToServer);
		}
		this.session = null;
		this.participants = new Map();
		this.streams = new Map();
		this.mainStream = null;
		this.connectedToServer = false;
	}

	private joinRoom(setCamera?: boolean) {
		// Check that we are connected
		if (!this.connectedToServer) {
			this.onErrorRoom.emit({
				error: new Error('Not connected to server yet')
			});
			return;
		}

		// Set attributes
		var token = this.getCurrentToken();
		var participantData: ParticipantData = {
			username: this.participantId
		};

		// Enter session
		this.session.connect(token, JSON.stringify(participantData), (error: any) => {
			if (error) {
				if (typeof error === 'string') {
					error = new Error(error);
				}

				// Emit event
				this.onErrorRoom.emit({
					error: error
				});
				return console.log(error);
			}

			if (setCamera !== false) {
				this.setCamera(this.myCameraId);
			}
		});
	}

	private setListeners() {
		// Set listeners
		this.session.on('update-main-speaker', (streamEvent: any) => {
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
		this.session.on('room-connected', () => {
			console.warn('room-connected');

			// Emit event
			this.onRoomConnected.emit();
		});
		this.session.on('error-room', (errorEvent: any) => {
			console.warn('error-room');

			// Emit event
			this.onErrorRoom.emit({
				error: errorEvent
			});
		});
		this.session.on('participant-published', (participantEvent: any) => {
			console.warn('participant-published');

			// Emit event
			this.onParticipantPublished.emit({
				participant: participantEvent.participant
			});
		});
		this.session.on('participant-joined', (participantEvent: any) => {
			console.warn('participant-joined');
			console.log(participantEvent.connection);

			var newParticipant: Connection = participantEvent.connection;
			this.participants.set(newParticipant.getId(), newParticipant);

			// Emit event
			this.onParticipantJoined.emit({
				participant: newParticipant
			});
		});
		this.session.on('participant-left', (participantEvent: any) => {
			console.warn('participant-left');

			// Remove from  array
			var oldParticipant: Connection = participantEvent.connection;
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
		this.session.on('participant-evicted', (participantEvent: any) => {
			console.warn('participant-evicted');

			// Emit event
			this.onParticipantEvicted.emit({
				participant: participantEvent.participant
			});
		});
		this.session.on('stream-added', (streamEvent: any) => {
			console.warn('stream-added');

			// Subscribe to be able to receive stream
			var newStream: Stream = streamEvent.stream;
			newStream.subscribe();

			this.streams.set(newStream.getId(), newStream);

			// Also add to participant
			if (!this.participants.has(newStream.getParticipant().getId())) {
				this.participants.set(newStream.getParticipant().getId(), newStream.getParticipant());
			}
			this.participants.get(newStream.getParticipant().getId()).addStream(newStream);

			// Consensus: Update main speaker by new participant
			this.updateMainSpeakerManually(newStream);

			// Emit event
			this.onStreamAdded.emit({
				stream: newStream
			});
		});
		this.session.on('stream-removed', (streamEvent: any) => {
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
		this.session.on('newMessage', (messageEvent: any) => {
			console.warn('new-message');

			// Emit event
			this.onNewMessage.emit({
				session: this.session,
				participant: this.participants.get(messageEvent.user),
				message: messageEvent.message
			});
		});
		this.session.on('room-closed', () => {
			console.warn('room-closed');

			// Emit event
			this.onRoomClosed.emit();
		});
		this.session.on('lost-connection', () => {
			console.warn('lost-connection');

			// Emit event
			this.onLostConnection.emit();
		});
		this.session.on('error-media', (errorEvent: any) => {
			console.warn('error-media');

			// Emit event
			this.onErrorMedia.emit({
				error: errorEvent.error
			});
		});
		this.session.on('custom-message-received', (customNotificationEvent: any) => {
			console.warn('custom-message-received');

			// Emit event
			this.onCustomNotification.emit(customNotificationEvent.params);
		});
	}

	/**
	 * Update main speaker based on a established consensus
	 */
	private autoUpdateMainSpeaker() {
		// Consensus: choose next speaker based on participantId
		var firstParticipant: Connection = null;
		for (let key in this.participants) {
			if (firstParticipant === null || this.participants.get(key).getId() < firstParticipant.getId()) {
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

	/**
	 * Update main speaker and emit event
	 */
	private updateMainSpeakerManually(stream: Stream) {
		this.mainStream = stream;

		// Emit event
		this.onUpdateMainSpeaker.emit({
			stream: stream
		});
	}

	/**
	 * Get current token to connect to OpenVidu server
	 */
	private getCurrentToken() {
		return (this.token)
			? this.token
			: 'dummytoken' + this.participantId;
	}

}
