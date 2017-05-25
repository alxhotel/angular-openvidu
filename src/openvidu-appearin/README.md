# openvidu-appearin

<p align="center">
	<img src="https://github.com/alxhotel/angular-openvidu/blob/master/docs/screenshots/openvidu_appearin.png?raw=true"/>
</p>

### Table of contents

- [About](#about)
- [Selector](#selector)
- [Properties](#properties)
- [Methods](#methods)
- [Events](#events)
- [i18n - Localizing labels and messages](#i18n---localizing-labels-and-messages)
- [Example](#example)

### About

`openvidu-appearin` is an Appearin-styled component with a predefined layout, which you can use out-of-the-box.
In addition, you have multiple methods and events you can use to personalized the user experience.

### Selector

- `openvidu-appearin`

### Properties

| Name | Type | Optional | Description |
|---|---|---|---|
| `wsUrl`			| `String` | required | Websocket URL pointing to your [OpenVidu Server][openvidu-server] |
| `sessionId`		| `String` | required | An id for a session |
| `participantId`	| `String` | required | An id for the current participant joining the session |

### Methods

| Name | Params | Description |
|---|---|---|
| `sendMessage`				| `(text: string)` | Broadcast a text message to all participants (including the sender) |
| `leaveRoom`				| `()` | Disconnect from the room |

### Events

These events are coming from `openvidu-browser`, AngularOpenVidu uses them to implement the logic.

These are the events AngularOpenVidu exposes for the user of the module.

| Name | Params | Description |
|---|---|---|
| `onRoomConnected`          | `No params` | triggers when the client has established a session with the server |
| `onRoomClosed`             | `No params` | triggers when the admin closes the room                            |
| `onLostConnection`         | `No params` | triggers when you can't establish a connection to the server       |
| `onErrorRoom`              | `({error: any})` | triggers when there's an error, like a "time out" with the server       |
| `onParticipantJoined`      | `({participantId: string})` | triggers when a participant has joined your room   |
| `onParticipantLeft`        | `({participantId: string})` | triggers when a participant has left your room     |
| `onErrorMedia`             | `({error: any})` | triggers when an error occurs while trying to retrieve some media  |
| `onLeaveRoom`              | `No params` | triggers when the current user leaves the room |
| `onNewMessage`             | `({room: string, user: string, message: string})` | triggers when a message from a participant is received |
| `onCustomNotification`     | `(customObject)` | triggers when a custom notification from a participant is received |

### i18n - Localizing labels and messages

*By default the labels and messages are in English*

The various text strings used by the component are provided through `OpenViduHangoutsIntl`.
Localization of these messages can be done by providing a subclass with translated values in your application root module.

Here is an example for an Spanish locale:

```js
import { Injectable } from '@angular/core';
import { OpenViduHangoutsIntl } from 'angular-openvidu';

@Injectable()
export class MySpanishOpenViduHangoutsIntl extends OpenViduHangoutsIntl {
	loadingLabel = 'Cargando...';
	connectingLabel = 'Connectando...';
	connectingToRoomLabel = 'Entrando en la sala...';
	youLeftTheRoomLabel = 'Has salido de la sala';
	...
}
```

And then add it to your `NgModule`, like this:

```js
import { OpenViduModule, OpenViduHangoutsIntl } from 'angular-openvidu';

@NgModule({
	imports: [ OpenViduModule ],
	providers: [
		{provide: OpenViduHangoutsIntl, useClass: MySpanishOpenViduHangoutsIntl},
	]
})
export class AppModule {

}
```

And you are good to go.

### Example

Follow the installation steps at [this README](/README.md#installation). 

```html
<openvidu-appearin
	[wsUrl]="wsUrl"
	[sessionId]="sessionId"
	[participantId]="participantId"
	(eventName)="myEventHandler($event)">

	Loading openvidu...

</openvidu-appearin>
```

[openvidu-server]: https://github.com/OpenVidu/openvidu/tree/master/openvidu-server
