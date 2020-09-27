# opv-template

### Table of contents

- [About](#about)
- [Selector](#selector)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [Create your own layout](#create-your-own-layout)
- [Example](#example)

### About

`opv-template` is a directive which provides most of the logic behind AngularOpenVidu.
It exports properties, methods and events to let you implement your own videochat layout.

### Selector

- `opv-template`

### Properties

| Name | Type | Optional | Description |
|---|---|---|---|
| `wsUrl`			| `String` | required | Websocket URL pointing to your [OpenVidu Server][openvidu-server] |
| `sessionId`		| `String` | required | An id for a session |
| `participantId`	| `String` | required | An id for the current participant joining the session |
| `micEnabled`		| `Boolean` | optional | A boolean to enable/disable the current participant's microphone |
| `camEnabled`		| `Boolean` | optional | A boolean to enable/disable the current participant's camera |

### Methods

To call these methods, use the exported API named `openviduApi`.

| Name | Params | Description |
|---|---|---|
| `sendMessage`				| `(text: string)` | Broadcast a text message to all participants (including the sender) |
| `leaveRoom`				| `()` | Disconnect from the room |

### Events

These events are coming from `openvidu-browser`, AngularOpenVidu uses them to implement the logic.

These are the events AngularOpenVidu exposes for the user of the module.

| Name | Params | Description |
|---|---|---|
| `onRoomConnected`          | `({session: Session})` | triggers when the client has established a session with the server |
| `onErrorRoom`              | `({error: any})` | triggers when there's an error, like a "time out" with the server       |
| `onLeaveRoom`              | `No params` | triggers when the current user leaves the room |
| `onErrorMedia`             | `({error: any})` | triggers when an error occurs while trying to retrieve some media  |
| `onLostConnection`         | `No params` | triggers when you can't establish a connection to the server       |
| `onNewMessage`             | `({session: Session, participant: Participant, message: string})` | triggers when a message from a participant is received |
| `onParticipantJoined`      | `({participant: Participant})` | triggers when a participant has joined your room   |
| `onParticipantLeft`        | `({participant: Participant})` | triggers when a participant has left your room     |
| `onRoomClosed`             | `No params` | triggers when the admin closes the room                            |
| `onParticipantEvicted`     | `({participant: Participant})` | triggers when a participant is evicted |
| `onParticipantPublished`   | `({participant: Participant})` | triggers when a participant has published |
| `onStreamAdded`            | `({stream: Stream})` | triggers when a new stream has been added to the room |
| `onStreamRemoved`          | `({stream: Stream})` | triggers when a stream has been removed from the room |
| `onUpdateMainSpeaker`      | `({stream: Stream})` | triggers when a participant is set to be the main speaker, based on the audio |
| `onCustomNotification`     | `(customObject)` | triggers when a custom notification from a participant is received |
| `onServerConnected`        | `No params` | triggers when a the client has established a connection with the server |
| `onErrorServer`            | `({error: any})` | triggers when the client couldn't establish a connection with the server |
| `onCameraAccessChange`     | `({access: boolean, camera?: Stream, error?: any)` | triggers when the access to the camera of the client has change. `access` is true if we have permissions to access the user's camera. If yes then `camera` will be sent. If not, `error` will be set with an object Error and `camera` will be `null`. |

### Create your own layout

First, follow the installation steps at [this README](/README.md#installation). Then continue with these steps:

1. Add `opv-template` with the required properties to your current app template:

	```html
	<opv-template
		[wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">
		...
	</opv-template>
	```

2. You can now build your template between the `opv-template` tags.

	```html
	<opv-template
		[wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId"
		(roomConnected)="myRoomConnectedHandler($event)">

		<mat-toolbar>My app</mat-toolbar>

		<my-custom-stream *ngFor="let s of streams" [stream]="s"></my-custom-stream>

	</opv-template>
	```

	**NOTE:**

	When starting to create your own layout, keep in mind that you will need to show streams (videos) of the participants.

	To do this, the clean way is to create a **new component** to display each stream (with a separate stylesheet).

	You can get a WebRTC URL pointing to the participant's stream like this:

	```js
	let videoURL = URL.createObjectURL(this.streamObject.getWrStream())
	```
	
	To display it, just insert that `videoURL` as `src` attribute in an HTML `video` tag.

	You can take a look at how [OpenViduHangoutsComponent](openvidu-hangouts/stream-hangouts/stream-hangouts.component.ts) does it.

3. Use the `openviduApi` in your template or in your code to implement your logic. For example:

	```html
	<opv-template
		#openviduApi="openviduApi"
		[wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId"
		(roomConnected)="myRoomConnectedHandler($event)">
		...
		<button (click)="openvdiuApi.micEnabled = !openviduApu.micEnabled">
			<span [hidden]="!openviduApi.micEnabled">Mute mic</span>
			<span [hidden]="openviduApi.micEnabled">Unmute mic</span>
		</button>
		...
	</opv-template>
	```

	or

	```js
	import { OpenViduDirective } from 'angular-openvidu';

	export class MyComponent {
		...
		// OpenVidu api
		@ViewChild('openviduApi') openviduApi: OpenViduDirective;

		toggleMic() {
			this.openvdiuApi.micEnabled = !this.openviduApu.micEnabled;
		}
		...
	}
	```

For a real-world implementation of a custom component, take a look at the source for the [OpenViduHangoutsComponent](openvidu-hangouts/openvidu-hangouts.component.ts).

### Example

This is an example of a template:

```html
<opv-template
	#openviduApi="openviduApi"
	[wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId"
	(eventName)="myEventHandler($event)">

	<mat-toolbar>My app</mat-toolbar>

	<my-custom-stream *ngFor="let s of streams" [stream]="s"></my-custom-stream>

	<button (click)="openvdiuApi.micEnabled = !openviduApu.micEnabled">
		<span [hidden]="!openviduApi.micEnabled">Mute mic</span>
		<span [hidden]="openviduApi.micEnabled">Unmute mic</span>
	</button>

</opv-template>
```
