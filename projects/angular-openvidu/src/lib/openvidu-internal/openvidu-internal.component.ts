import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';

// OpenVidu Directive
import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	OpenViduNotificationType, ParticipantData, ParticipantEvent,
	RoomConnectedEvent, StreamEvent
} from '../openvidu.directive';

// OpenVidu Browser
import { Connection, Session, Stream } from 'openvidu-browser';

export enum ConnectionState {
	NOT_CONNECTED = 0,
	CONNECTED_TO_SERVER = 1,
	CONNECTED_TO_ROOM = 2,
	REQUESTING_CAMERA_ACCESS = 3,
	CAMERA_ACCESS_GRANTED = 4,
	CAMERA_ACCESS_DENIED = 5
}

export interface ToolbarOption {
	label?: string;
	icon: string;
	onClick?: () => void;
}

export abstract class OpenViduInternalComponent {

	// Inputs
	@Input() wsUrl: string;
	@Input() sessionId: string;
	@Input() participantId: string;
	@Input() apiKey: string;
	@Input() token: string;

	// Outputs
	@Output() serverConnected: EventEmitter<any> = new EventEmitter();
	@Output() errorServer: EventEmitter<any> = new EventEmitter();
	@Output() roomConnected: EventEmitter<any> = new EventEmitter();
	@Output() errorRoom: EventEmitter<any> = new EventEmitter();
	@Output() roomClosed: EventEmitter<any> = new EventEmitter();
	@Output() lostConnection: EventEmitter<any> = new EventEmitter();
	@Output() participantJoined: EventEmitter<any> = new EventEmitter();
	@Output() participantLeft: EventEmitter<any> = new EventEmitter();
	@Output() errorMedia: EventEmitter<any> = new EventEmitter();
	@Output() leaveRoom: EventEmitter<any> = new EventEmitter();
	@Output() newMessage: EventEmitter<any> = new EventEmitter();
	@Output() customNotification: EventEmitter<any> = new EventEmitter();

	// Unused events
	// @Output() streamAdded: EventEmitter<any> = new EventEmitter();
	// @Output() streamRemoved: EventEmitter<any> = new EventEmitter();
	// @Output() particpantPublished: EventEmitter<any> = new EventEmitter();
	// @Output() participantEvicted: EventEmitter<any> = new EventEmitter();
	// @Output() upodateMainSpeaker: EventEmitter<any> = new EventEmitter();

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
	session: Session;

	// Participants
	participants: { [id: string]: Connection } = {};

	// My camera
	myCamera: Stream;

	// Connection state
	ConnectionState = ConnectionState;
	connectionUiState: ConnectionState = ConnectionState.NOT_CONNECTED;

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

	sendCustomNotification(obj: any, callback: any): void {
		this.openviduApi.sendCustomNotification(obj, callback);
	}

	leaveRoom(callLeaveRoom?: boolean): void {
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

	handleOnUpdateMainSpeaker(streamEvent: StreamEvent): void {
		// Check if stream exists
		if (this.streams.indexOf(streamEvent.stream) < 0) {
			this.streams.push(streamEvent.stream);
		}

		// Set main stream
		this.mainStream = streamEvent.stream;

		// Check if participant exists
		if (!this.participants[this.mainStream.getParticipant().connectionId]) {
			this.participants[this.mainStream.getParticipant().connectionId] = this.mainStream.getParticipant();
		}
	}

	handleOnServerConnected(): void {
		this.connectionUiState = ConnectionState.CONNECTED_TO_SERVER;
	}

	handleOnErrorServer(errorEvent: ErrorEvent): void {
		if (errorEvent.error) {
			this.setUserMessage(errorEvent.error.message);
		}
	}

	handleOnRoomConnected(roomConnectedEvent: RoomConnectedEvent): void {
		if (roomConnectedEvent && roomConnectedEvent.session) {
			this.session = roomConnectedEvent.session;
		}

		// Emit event
		this.roomConnected.emit();

		this.connectionUiState = ConnectionState.CONNECTED_TO_ROOM;
	}

	handleOnErrorRoom(errorEvent: ErrorEvent): void {
		// Emit event
		this.errorRoom.emit({
			error: errorEvent.error
		});
	}

	handleOnCameraAccessChange(cameraEvent: CameraAccessEvent): void {
		if (cameraEvent.access) {
			// All good :)
			this.handleOnStreamRemoved({
				stream: this.myCamera
			});

			this.myCamera = cameraEvent.camera;
			this.handleOnStreamAdded({
				stream: this.myCamera
			});

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_GRANTED;
		} else if (!cameraEvent.access) {
			// No camera :(

			this.connectionUiState = ConnectionState.CAMERA_ACCESS_DENIED;
		}
	}

	handleOnRoomClosed(): void {
		this.session = null;

		// Emit event
		this.roomClosed.emit();
	}

	handleOnLostConnection(): void {
		if (!this.session) {
			// Emit event
			this.lostConnection.emit({
				error: new Error('Lost connection with the server')
			});
		} else {
			// Emit event
			this.lostConnection.emit();
		}
	}

	handleOnParticipantJoined(participantEvent: ParticipantEvent): void {
		const newParticipant = participantEvent.participant;
		this.participants[newParticipant.connectionId] = newParticipant;

		// Emit event
		this.participantJoined.emit({
			participantId: newParticipant.connectionId
		});
	}

	handleOnParticipantLeft(participantEvent: ParticipantEvent): void {
		const oldParticipant = participantEvent.participant;
		delete this.participants[oldParticipant.connectionId];

		// Emit event
		this.participantLeft.emit({
			participantId: oldParticipant.connectionId
		});
	}

	handleOnErrorMedia(errorEvent: ErrorEvent): void {
		// Emit event
		this.errorMedia.emit({
			error: errorEvent.error
		});
	}

	handleOnStreamAdded(streamEvent: StreamEvent): void {
		const newStream = streamEvent.stream;
		if (this.streams.indexOf(newStream) < 0) {
			this.streams.push(newStream);
		}
	}

	handleOnStreamRemoved(streamEvent: StreamEvent): void {
		const oldStream = streamEvent.stream;
		this.streams.splice(this.streams.indexOf(oldStream), 1);
	}

	handleOnLeaveRoom(): void {
		this.session = null;
		this.participants = {};
		this.streams = [];
		this.mainStream = null;

		// Emit event
		this.leaveRoom.emit();
	}

	handleOnNewMessage(messageEvent: MessageEvent): void {
		// Fix: to get usernam
		const dataObj: ParticipantData = JSON.parse(messageEvent.participant.data);

		// Handle message
		this.chatMessages.push({
			username: dataObj.username,
			message: messageEvent.message,
			date: new Date() // Use current date
		});

		this.newMessage.emit(messageEvent);
	}

	handleOnCustomNotification(obj: any): void {
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
			this.customNotification.emit(obj);
		}
	}

	/*-------------------*/
	/* PROTECTED METHODS */
	/*-------------------*/

	protected setUserMessage(msg: string): void {
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
		if (!container || !boxes || boxes.length === 0) {
			return { error: true };
		}

		const maxDimensions = {
			maxW: 0,
			maxH: 0
		};
		boxes.forEach((box: any) => {
			const videoEl = box.nativeElement;
			if (videoEl.videoWidth > maxDimensions.maxW) {
				if (videoEl.videoHeight > maxDimensions.maxH) {
					maxDimensions.maxW = videoEl.videoWidth;
					maxDimensions.maxH = videoEl.videoHeight;
				}
			}
		});

		// console.log(maxDimensions);

		const clientRect = container.nativeElement.getBoundingClientRect();
		const numElements = boxes.length;
		const width = clientRect.width;
		const height = clientRect.height;
		const area = height * width;
		const elementArea = parseInt((area / numElements) + '', 10);

		// Calculate proportions
		const maxProportions = {
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

		// console.log(maxProportions);

		let elementWidth = parseInt(Math.sqrt(elementArea * (maxProportions.maxW / maxProportions.maxH)) + '', 10);
		let elementHeight = parseInt(Math.sqrt(elementArea * (maxProportions.maxH / maxProportions.maxW)) + '', 10);

		// console.log(elementWidth);

		// We now need to fit the squares. Let's reduce the square size
		// so an integer number fits the width.
		let numX = Math.ceil(width / elementWidth);
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
