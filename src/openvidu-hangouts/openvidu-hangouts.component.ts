import {
	Component, ElementRef, EventEmitter, Input, OnDestroy,
	OnInit, Output, Renderer2, ViewChild
} from '@angular/core';

// Parent component
import { ConnectionState, OpenViduInternalComponent, ToolbarOption } from '../openvidu-internal/openvidu-internal.component';

// Angular Material
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatDialog, MatSidenav } from '@angular/material';

// Fullscreen Service
import { BigScreenService } from 'angular-bigscreen';

// i18n Labels and Messages
import { OpenViduHangoutsIntl } from './openvidu-hangouts-intl';

// OpenVidu Hangouts Dialog
import { DialogHangoutsComponent } from './dialog-hangouts/dialog-hangouts.component';

@Component({
	selector: 'openvidu, openvidu-hangouts',
	templateUrl: './openvidu-hangouts.component.html',
	styleUrls: [ './openvidu-hangouts.component.css' ],
	animations: [
		trigger('chatButtonAnimation', [
			state('hide', style({
				left: '-60px'
			})),
			state('show', style({
				left: '0px'
			})),
			transition('* => hide', [
				animate('0.225s ease-in-out')
			]),
			transition('* => show', [
				animate('0.225s ease-in-out')
			])
		])
	]
})
export class OpenViduHangoutsComponent extends OpenViduInternalComponent implements OnInit, OnDestroy {

	// Inputs
	// To set new options in menu
	@Input() toolbarOptions: ToolbarOption[] = [];

	// HTML elements
	@ViewChild('main') mainElement: ElementRef;
	@ViewChild('sidenav') sidenav: MatSidenav;
	@ViewChild('messageInput') messageInput: ElementRef;

	// Animations
	chatButtonState: string = 'show';

	// Connection stats
	connectionUiState: ConnectionState = ConnectionState.NOT_CONNECTED;

	// Web API access inside template
	JSON: any;

	constructor(private renderer: Renderer2, private bigScreenService: BigScreenService,
		public _intl: OpenViduHangoutsIntl, public dialog: MatDialog) {

		super();
		this.JSON = JSON;
		this.setUserMessage(this._intl.loadingLabel);
	}

	ngOnInit() {
		// Display message
		this.setUserMessage(this._intl.connectingLabel);

		// Set fullscreen listener
		this.bigScreenService.onChange(() => {
			// No need to check if mainElement is the one with fullscreen
			this.isFullscreen = this.bigScreenService.isFullscreen();
		});
	}

	ngOnDestroy() {
		this.bigScreenService.exit();
		this.leaveRoom(false);
	}

	/*---------------------*/
	/* GUI RELATED METHODS */
	/*---------------------*/

	toggleMic() {
		this.openviduApi.micEnabled = !this.openviduApi.micEnabled;
	}

	toggleCamera() {
		this.openviduApi.camEnabled = !this.openviduApi.camEnabled;
	}

	toggleFullscreen() {
		if (this.bigScreenService.isFullscreen()) {
			this.bigScreenService.exit();
		} else {
			this.bigScreenService.request(this.mainElement.nativeElement);
		}
	}

	toggleChat() {
		this.sidenav.toggle();
	}

	openSettings() {
		let dialogRef = this.dialog.open(DialogHangoutsComponent);
		// On change video input
		dialogRef.afterClosed().subscribe((result) => {
			if (result) {
				this.openviduApi.setCamera(result);
			} else {
				console.log('No camera selected');
			}
		});
	}

	onSidenavOpenStart() {
		this.chatButtonState = 'hide';
	}

	onSidenavCloseStart() {
		this.chatButtonState = 'show';
	}

	sendMessage(text: string) {
		// Clean input
		this.messageInput.nativeElement.value = null;
		//this.renderer.setValue(this.messageInput, null);
		// Send to OpenVidu server
		this.openviduApi.sendMessage(text);
	}

	leaveRoom(callLeaveRoom?: boolean) {
		super.leaveRoom(callLeaveRoom);

		// Reset button
		this.chatButtonState = 'show';
		// Display message
		this.setUserMessage(this._intl.youLeftTheRoomLabel);
	}

	/*------------------------*/
	/* HANDLE OPENVIDU EVENTS */
	/*------------------------*/

	handleOnServerConnected() {
		super.handleOnServerConnected();

		this.setUserMessage(this._intl.connectingToRoomLabel);
	}

	handleOnErrorRoom() {
		super.handleOnErrorRoom();

		this.setUserMessage(this._intl.errorRoom);
	}

}
