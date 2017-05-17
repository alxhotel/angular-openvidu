#openvidu-template

#### Selector

- `openvidu-template`

#### Propeties

| Name | Type | Optional | Description |
|---|---|---|---|
| `wsUrl`			| `String` | required | Websocket URL pointing to your [OpenVidu Server][openvidu-server] |
| `sessionId`		| `String` | required | An id for a session |
| `participantId`	| `String` | required | An id for the current participant joining the session |

#### Events

This events are coming from `openvidu-browser`, AngularOpenVidu uses them to implement the logic.

These are the events AngularOpenVidu exposes for the user of the module.

To use them just do:

```html
<openvidu-template (eventName)="myEventHandler($event)">
	Loading openvidu...
</openvidu-template>
```

| Name | Params | Description |
|---|---|---|
| `onRoomConnected`          | `No params` | triggers when the client has established a session with the server |
| `onRoomClosed`             | `No params` | triggers when the admin closes the room                            |
| `onLostConnection`         | `No params` | triggers when you can't establish a connection to the server       |
| `onErrorRoom`              | `({error: error})` | triggers when there's an error, like a "time out" with the server       |
| `onParticipantJoined`      | `({participantId: participantId})` | triggers when a participant has joined your room   |
| `onParticipantLeft`        | `({participantId: participantId})` | triggers when a participant has left your room     |
| `onErrorMedia`             | `({error: error})` | triggers when an error occurs while trying to retrieve some media  |
| `onLeaveRoom`              | `No params` | triggers when the current user leaves the room |
| `onNewMessage`             | `({room: room, user: user, message: message})` | triggers when a message from a participant is received |
| `onCustomNotification`     | `(customObject)` | triggers when a custom notification from a participant is received |
