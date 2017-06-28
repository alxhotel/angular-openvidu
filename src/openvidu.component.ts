import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

// OpenVidu Directive
import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	OpenViduNotificationType, ParticipantData, ParticipantEvent,
	RoomConnectedEvent, StreamEvent
} from './openvidu.directive';

// OpenVidu Browser
import { Connection, Session, Stream } from 'openvidu-browser';

export enum ConnectionState {
	NOT_CONNECTED = 0,
	CONNECTED_TO_SERVER = 1,
	CONNECTED_TO_ROOM = 2,
	REQUESTING_CAMERA_ACCESS = 3,
	CAMERA_ACCESS_GRANTED = 4,
	CAMERA_ACCESS_DENIED = 5
};

export interface ToolbarOption {
	label?: string;
	icon: string;
	onClick?: Function;
}

export abstract class OpenViduComponent {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;
	@Input() apiKey: string;
	@Input() token: string;

	// Outputs
	@Output() onServerConnected: EventEmitter<void> = new EventEmitter<void>();
	@Output() onErrorServer: EventEmitter<any> = new EventEmitter();
	@Output() onRoomConnected: EventEmitter<void> = new EventEmitter<void>();
	@Output() onErrorRoom: EventEmitter<any> = new EventEmitter();
	@Output() onRoomClosed: EventEmitter<void> = new EventEmitter<void>();
	@Output() onLostConnection: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantJoined: EventEmitter<any> = new EventEmitter();
	@Output() onParticipantLeft: EventEmitter<any> = new EventEmitter();
	@Output() onErrorMedia: EventEmitter<any> = new EventEmitter();
	@Output() onLeaveRoom: EventEmitter<void> = new EventEmitter<void>();
	@Output() onNewMessage: EventEmitter<any> = new EventEmitter();
	@Output() onCustomNotification: EventEmitter<any> = new EventEmitter();

	// Unused events
	//@Output() onStreamAdded: EventEmitter<any> = new EventEmitter();
	//@Output() onStreamRemoved: EventEmitter<any> = new EventEmitter();
	//@Output() onParticpantPublished: EventEmitter<any> = new EventEmitter();
	//@Output() onParticipantEvicted: EventEmitter<any> = new EventEmitter();
	//@Output() onUpodateMainSpeaker: EventEmitter<any> = new EventEmitter();

	// OpenVidu API
	@ViewChild('openviduApi') openviduApi: OpenViduDirective;

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

	// Session
	protected session: Session;

	// Participants
	protected participants: { [id: string]: Connection } = {};

	// My camera
	protected myCamera: Stream;

	// Connection state
	ConnectionState = ConnectionState;
	connectionUiState: ConnectionState = ConnectionState.NOT_CONNECTED;

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

	sendCustomNotification(obj: any, callback: any) {
		this.openviduApi.sendCustomNotification(obj, callback);
	}

	leaveRoom(callLeaveRoom?: boolean) {
		// Reset
		this.mainStream = null;
		this.streams = [];
		this.chatMessages = [];
		this.session = null;
		this.participants = {};

		if (callLeaveRoom !== false) {
			this.openviduApi.leaveRoom();
		}
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

	/*-------------------*/
	/* PROTECTED METHODS */
	/*-------------------*/

	protected setUserMessage(msg: string) {
		this.userMessage = msg;
	}

	/*-----------------*/
	/* PRIVATE METHODS */
	/*-----------------*/

	/**
	 * Function to resize the video elements based on the container
	 * @return Object {width?: number, height?: number, error?: boolean}
	 */
	protected auxResizeStreamsManually(container: ElementRef, boxes: ElementRef[]): {width?: number, height?: number, error?: boolean} {
		if (!container || !boxes || boxes.length === 0) return {error: true};

		var maxDimensions = {
			maxW: 0,
			maxH: 0
		};
		boxes.forEach((box: any) => {
			var videoEl = box.nativeElement;
			if (videoEl.videoWidth > maxDimensions.maxW) {
				if (videoEl.videoHeight > maxDimensions.maxH) {
					maxDimensions.maxW = videoEl.videoWidth;
					maxDimensions.maxH = videoEl.videoHeight;
				}
			}
		});

		//console.log(maxDimensions);

		var clientRect = container.nativeElement.getBoundingClientRect();
		var numElements = boxes.length;
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
