import { ViewChild } from '@angular/core';

// OpenVidu Directive
import {
	OpenViduDirective, CameraAccessEvent, ErrorEvent, MessageEvent,
	OpenViduNotificationType, ParticipantData, ParticipantEvent,
	RoomConnectedEvent, StreamEvent
} from './openvidu.directive';

// OpenVidu Browser
import { Stream } from 'openvidu-browser';

export abstract class OpenViduHelperComponent {

	// Main screen
	mainStream: Stream;

	// Rest of peers
	streams: Stream[] = [];

	// My camera
	myCamera: Stream;

	private openviduApi: OpenViduDirective;

	@ViewChild(OpenViduDirective)
	get openviduApi(): OpenViduDirective { return this.openviduApi; }
	set openviduApi(openviduApi: OpenViduDirective): void {
		if (this.openviduApi || !openviduApi) {
			return;
		}

		this.openviduApi = openviduApi;

		this.openviduApi.onUpdateMainSpeaker.subscribe((streamEvent: StreamEvent) => {
			this.handleOnUpdateMainSpeaker(streamEvent);
		});
		this.openviduApi.onCameraAccessChange.subscribe((cameraEvent: CameraAccessEvent) => {
			this.handleOnCameraAccessChange(cameraEvent);
		});
		this.openviduApi.onStreamAdded.subscribe((streamEvent: StreamEvent) => {
			this.handleOnStreamAdded(streamEvent);
		});
		this.openviduApi.onStreamRemoved.subscribe((streamEvent: StreamEvent) => {
			this.handleOnStreamRemoved(streamEvent);
		});
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
	}

	handleOnCameraAccessChange(cameraEvent: CameraAccessEvent): void {
		if (cameraEvent.access) {
			// All good :)
			if (this.streams.indexOf(this.myCamera) < 0) {
				this.streams.push(this.myCamera);
			}
		} else if (!cameraEvent.access) {
			// No camera :(
		}
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

}
