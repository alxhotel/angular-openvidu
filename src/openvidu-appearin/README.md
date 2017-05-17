# openvidu-appearin

<p align="center">
	<img src="https://github.com/alxhotel/angular-openvidu/blob/master/docs/screenshots/openvidu_appearin.png?raw=true"/>
</p>

### Selector

- `openvidu-appearin`

### Properties

| Name | Type | Optional | Description |
|---|---|---|---|
| `wsUrl`			| `String` | required | Websocket URL pointing to your [OpenVidu Server][openvidu-server] |
| `sessionId`		| `String` | required | An id for a session |
| `participantId`	| `String` | required | An id for the current participant joining the session |

### Events

This events are coming from `openvidu-browser`, AngularOpenVidu uses them to implement the logic.

These are the events AngularOpenVidu exposes for the user of the module.

To use them just do:

```html
<openvidu-appearin [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId" (eventName)="myEventHandler($event)">
	Loading openvidu...
</openvidu-appearin>
```

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

[openvidu-server]: https://github.com/OpenVidu/openvidu/tree/master/openvidu-server
