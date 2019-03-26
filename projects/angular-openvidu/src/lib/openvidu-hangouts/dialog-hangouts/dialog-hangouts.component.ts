import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// OpenVidu Hanguts i18n
import { OpenViduHangoutsIntl } from '../openvidu-hangouts-intl';

@Component({
	selector: 'dialog-hangouts',
	templateUrl: './dialog-hangouts.component.html',
})
export class DialogHangoutsComponent implements OnInit {

	selectedVideoInput: string;

	videoInputs: Object[] = [];

	constructor(public dialogRef: MatDialogRef<DialogHangoutsComponent>,
		public _intl: OpenViduHangoutsIntl) {

	}

	ngOnInit() {
		var that = this;
		navigator.mediaDevices.enumerateDevices().then((deviceInfos: MediaDeviceInfo[]) => {
			that.gotDevices(deviceInfos);
		}).catch((error: any) => {
			this.handleError(error);
		});
	}

	onSubmit() {
		this.dialogRef.close(this.selectedVideoInput);
	}

	private gotDevices(deviceInfos: MediaDeviceInfo[]) {
		for (let deviceInfo of deviceInfos) {
			/*if (deviceInfo.kind === 'audioinput') {
				option.text = deviceInfo.label ||
					 'microphone ' + (audioInputSelect.length + 1);
				audioInputSelect.appendChild(option);
			} else if (deviceInfo.kind === 'audiooutput') {
				option.text = deviceInfo.label || 'speaker ' +
					 (audioOutputSelect.length + 1);
				audioOutputSelect.appendChild(option);
			} else*/

			if (deviceInfo.kind === 'videoinput') {
				this.videoInputs.push({
					label: deviceInfo.label || 'WebCam ' + (this.videoInputs.length + 1),
					deviceId: deviceInfo.deviceId,
				});
			} else {
				console.log('Some other kind of source/device: ', deviceInfo);
			}
		}
	}

	private handleError(error: any) {
		console.log('navigator.getUserMedia error: ', error);
	}

}
