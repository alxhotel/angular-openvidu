# openvidu-template

### Selector

- `openvidu-template`

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
<openvidu-template [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">

	<!-- My custom template goes here -->

</openvidu-template>
```

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
| `onCameraAccessChange`     | `({access: boolean, camera?: Stream, error?: any)` | triggers when the access to the camera of the client has change.
`access` is true if we have permissions to access the user's camera. If yes then `camera` will be sent. If not, `error` will be set with an object Error and `camera` will be `null`. |

### Creating your template

When starting to create your own template, keep in mind that you will need to create a new component to display the streams of the participant.

To do this you will need the WebRTC URL pointing to the video.

You can get it by doing:

```js
	let videoURL = URL.createObjectURL(this.streamObject.getWrStream())
```
