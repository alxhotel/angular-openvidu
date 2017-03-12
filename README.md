# angular-openvidu
[![Dependency Status](https://david-dm.org/openvidu/angular-openvidu.svg)](https://david-dm.org/openvidu/angular-openvidu)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/openvidu/angular-openvidu/master/LICENSE)

## Demo

In this demo you will see an implementation of `angular-openvidu` where you can test ALL the features included in this component.

Follow the instructions from the app's README to test it out.

Link to the repository: [https://github.com/alxhotel/angular-openvidu-demo](https://github.com/alxhotel/angular-openvidu-demo)

## Table of contents

- [About](#about)
- [Features](#features)
- [Installation](#installation)
- [Development](#development)
- [License](#license)

## About

[OpenVidu](https://github.com/OpenVidu) room videoconference element implemented as an [Angular Component](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html)

## Features

  - Join a group call
  - Close group call
  - Disable camera
  - Mute microphone
  - Toggle fullscreen video

## Installation

1. Install `angular-openvidu` node module through npm:

	```bash
	$ npm install angular-openvidu --save
	```

2. Import `OpenViduComponent` to your AppModule

	```js
	import { NgModule } from '@angular/core';
	import { FormsModule } from "@angular/forms";
	import { BrowserModule  } from '@angular/platform-browser';
	import { AppComponent } from './app.component';
	import { OpenViduComponent } from 'angular-openvidu';

	@NgModule({
	  imports: [BrowserModule, FormsModule, OpenViduComponent],
	  declarations: [AppComponent],
	  bootstrap: [ AppComponent ]
	})
	export class AppModule { }
	```

	You may also find it useful to view the [demo source](https://github.com/alxhotel/angular-openvidu-app/blob/master/src/app/app.component.ts).

3. Add `hammer.js` in your html:

	```html
	<script src="../node_modules/hammerjs/hammer.js"></script>
	```

4. Deploy KMS (Kurento Media Server)

	You will need a [KMS](https://github.com/OpenVidu/openvidu/tree/master/openvidu-server).

	Follow the instructions in [this page](https://github.com/OpenVidu/openvidu-docker) to deploy it with docker.

## Usage

You are ready. Use it in your template:

- `wsUrl`: Websocket URL pointing to your [KMS](https://github.com/OpenVidu/openvidu/tree/master/openvidu-server). Type: `String`.
- `sessionId`: An id for a session. Type: `String`.
- `participantId`: An id for the participant joining the session. Type: `String`.

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">
  Loading openvidu...
</openvidu>
```

## Development

  Things you need to know about the  implementation:
  
  1. **Events**
  
	| Name                      | Description                                                        |
	|---------------------------|--------------------------------------------------------------------|
	| `room-connected`          | triggers when the client has established a session with the server |
	| `room-closed`             | triggers when the room is closed                                   |
	| `lost-connection`         | triggers when you can't establish a connection to the server       |
	| `error-room`              | triggers when it was unable to join room                           |
	| `stream-added`            | triggers when a new stream was added                               |
	| `stream-removed`          | triggers when a stream was removed                                 |
	| `participant-joined`      | triggers when a participant has joined your room                   |
	| `particpant-published`    | triggers when a participant is publised                            |
	| `participant-left`        | triggers when a participant has left your room                     |
	| `participant-evicted`     | triggers when a participant is evicted                             |
	| `upodate-main-speaker`    | triggers when a the main speaker has been updated                  |
	| `newMessage`              | triggers when a new message is recived                             |
	| `error-media`             | triggers when an error occurs while trying to retrieve some media  |
	| `custom-message-received` | triggers when a custom notificaction arrives                       |

  2. **Stream component**: is the component in charge of displaying the video from each participant.
  
  3. **LESS**: the CSS stylesheet is compiled from the LESS file.
  
  4. [Angular Material](https://github.com/angular/material2): used to display the toolbar, buttons and all animations.

  5. `screenfull`: used to toggle the fullscreen mode of the streaming.


## License

MIT
