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

	private _openviduApi: OpenViduDirective;

	@ViewChild(OpenViduDirective)
	get openviduApi(): OpenViduDirective { return this._openviduApi; }
	set openviduApi(openviduApi: OpenViduDirective) {
		if (this._openviduApi || !openviduApi) return;
		this._openviduApi = openviduApi;

		this._openviduApi.onUpdateMainSpeaker.subscribe((streamEvent: StreamEvent) => {
			this.handleOnUpdateMainSpeaker(streamEvent);
		});
		this._openviduApi.onCameraAccessChange.subscribe((cameraEvent: CameraAccessEvent) => {
			this.handleOnCameraAccessChange(cameraEvent);
		});
		this._openviduApi.onStreamAdded.subscribe((streamEvent: StreamEvent) => {
			this.handleOnStreamAdded(streamEvent);
		});
		this._openviduApi.onStreamRemoved.subscribe((streamEvent: StreamEvent) => {
			this.handleOnStreamRemoved(streamEvent);
		});
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
	}

	handleOnCameraAccessChange(cameraEvent: CameraAccessEvent) {
		if (cameraEvent.access) {
			// All good :)
			if (this.streams.indexOf(this.myCamera) < 0) {
				this.streams.push(this.myCamera);
			}
		} else if (!cameraEvent.access) {
			// No camera :(
		}
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

}
