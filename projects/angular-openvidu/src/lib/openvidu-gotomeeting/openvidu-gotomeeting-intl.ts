import { Injectable } from '@angular/core';

/** OpenVidu data that requires internationalization. */
@Injectable()
export class OpenViduGoToMeetingIntl {

	youAreEnteringRoomLabel: string = 'You\'re about to enter a video conversation room';

	/* A label for the loading the component. */
	loadingLabel: string = 'Loading...';

	loadingCameraLabel: string = 'Loading camera...';

	joiningRoomLabel: string = 'Joining room...';

	/* A label when connecting to the server. */
	connectingLabel: string = 'Connecting...';

	/* A label when connecting to the room. */
	connectingToRoomLabel: string = 'Connecting to room...';

	/* A label when the current participant leaves the room. */
	youLeftTheRoomLabel: string = 'You left the room';

	browserBlockingLabel: string = 'The browser is blocking your camera and microphone';

	browserBlockingExplainOneLabel: string = 'To enter the the video conversation, click'
		+ ' the camera icon next to the star in the right of the address bar.';

	browserBlockingExplainTwoLabel: string = 'From there, check "Always allow to access camera and microphone."';

	peopleLabel: string = 'People';

	chatLabel: string = 'Chat';

	leaveRoomLabel: string = 'Leave Room';

	muteLabel: string = 'Mute';

	unmuteLabel: string = 'Unmute';

	videoOffLabel: string = 'Video Off';

	videoOnLabel: string = 'Video On';

	fullscreenLabel: string = 'Fullscreen';

	exitFullscreenLabel: string = 'Exit Fullscreen';

	sendAMessageLabel: string = 'Send a message';

	errorRoom: string = 'Error connecting to the server';

	/* A label fro the streams */
	you: string = 'You';

}
