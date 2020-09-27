import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material';

// OpenVidu Hanguts i18n
import { OpenViduHangoutsIntl } from '../openvidu-hangouts-intl';

interface VideoInput {
	label: string;
	deviceId: string;
}

@Component({
	selector: 'opv-dialog-hangouts',
	templateUrl: './dialog-hangouts.component.html',
})
export class DialogHangoutsComponent implements OnInit {

	selectedVideoInput: string;

	videoInputs: VideoInput[] = [];

	constructor(public dialogRef: MatDialogRef<DialogHangoutsComponent>, public intl: OpenViduHangoutsIntl) {

	}

	ngOnInit(): void {
		const that = this;
		navigator.mediaDevices.enumerateDevices().then((deviceInfos: MediaDeviceInfo[]) => {
			that.gotDevices(deviceInfos);
		}).catch((error: any) => {
			this.handleError(error);
		});
	}

	onSubmit(): void {
		this.dialogRef.close(this.selectedVideoInput);
	}

	private gotDevices(deviceInfos: MediaDeviceInfo[]): void {
		for (const deviceInfo of deviceInfos) {
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

	private handleError(error: any): void {
		console.log('navigator.getUserMedia error: ', error);
	}

}
