import { Injectable } from '@angular/core';

/** OpenVidu data that requires internationalization. */
@Injectable()
export class OpenViduAppearinIntl {

	/** A label for the loading the component. */
	loadingLabel: string = 'Loading...';

	/** A label when connecting to the server. */
	connectingLabel: string = 'Connecting...';

	/** A label when connecting to the room. */
	connectingToRoomLabel: string = 'Connecting to room...';

	/** A label when the current participant leaves the room. */
	youLeftTheRoomLabel: string = 'You left the room';

}
