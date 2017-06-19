import { Injectable } from '@angular/core';

/** OpenVidu data that requires internationalization. */
@Injectable()
export class OpenViduHangoutsIntl {

	/* A label for the loading the component. */
	loadingLabel: string = 'Loading...';

	/* A label when connecting to the server. */
	connectingLabel: string = 'Connecting...';

	/* A label when connecting to the room. */
	connectingToRoomLabel: string = 'Connecting to room...';

	/* A label when the current participant leaves the room. */
	youLeftTheRoomLabel: string = 'You left the room';

	/* A label for the fullscreen label. */
	fullscreenLabel: string = 'Fullscreen';

	/* A label for the exit fullscreen label. */
	exitFullscreenLabel: string = 'Exit fullscreen';

	/* A label for the settings label. */
	settingsLabel: string = 'Settings';

	/* A label for "You" in the chat. */
	youLabel: string = 'You';

	/* A label for selecting video inputs. */
	selectVideoInputLabel: string = 'Select video input';

	/* A label for submitting form as "Ready". */
	readyLabel: string = 'Ready';

	/* A label for when an "room error" occurs */
	errorRoom: string = 'Error connecting to the server';

	/* A label fro the streams */
	you: string = 'You';

}
