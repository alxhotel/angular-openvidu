# angular-openvidu
[![Dependency Status](https://david-dm.org/alxhotel/angular-openvidu.svg)](https://david-dm.org/alxhotel/angular-openvidu)
[![GitHub license](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://raw.githubusercontent.com/openvidu/angular-openvidu/master/LICENSE)

**AngularOpenVidu** is a room videoconference component library for [Angular](https://angular.io/).

It's written in [TypeScript](https://www.typescriptlang.org/), with the guidelines from [Angular Components](https://angular.io/docs/ts/latest/api/core/index/Component-decorator.html)

To be able to work in the browser, AngularOpenVidu uses [openvidu-browser](openvidu-browser) to communicate with the [OpenVidu Server](openvidu-server).

To use AngularOpenVidu, [WebRTC](https://en.wikipedia.org/wiki/WebRTC) support is required (Chrome, Firefox, Opera).

### Table of contents

- [Demo](#demo)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Development](#development)
- [License](#license)

### Demo

In this demo you will see a use case of `angular-openvidu`, where you can test ALL the features included in this component.

Follow the instructions from the [app's README](https://github.com/alxhotel/angular-openvidu-demo) to test it out.

Link to the repository: [https://github.com/alxhotel/angular-openvidu-demo](https://github.com/alxhotel/angular-openvidu-demo)

### Features

- Join a group call
- Close group call
- Disable camera
- Mute microphone
- Toggle fullscreen video

### Installation

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

4. Deploy ODS (OpenVidu Development Server)

	You will need a [ODS](https://github.com/OpenVidu/openvidu/tree/master/openvidu-server).

	Follow the instructions in [this page](https://github.com/OpenVidu/openvidu-sample-basic-plainjs#start-openvidu-development-server) to deploy it with docker.

### Usage

You are ready. Use it in your template:

- `wsUrl`: Websocket URL pointing to your [OpenVidu Server](https://github.com/OpenVidu/openvidu/tree/master/openvidu-server). Type: `String`.
- `sessionId`: An id for a session. Type: `String`.
- `participantId`: An id for the participant joining the session. Type: `String`.

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">
	Loading openvidu...
</openvidu>
```

### Development

Things you need to know:

#### 1. Events

This events are coming from `openvidu-browser`, AngularOpenVidu use them to implement the logic.

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
| `newMessage`              | triggers when a new message is received                            |
| `error-media`             | triggers when an error occurs while trying to retrieve some media  |
| `custom-message-received` | triggers when a custom notificaction arrives                       |

#### 2. Dependencies

These are the main modules that make up AngularOpenVidu:

| Module | Version | Description |
|---|---|---|
| [OpenVidu Browser](openvidu-browser)		| [![][openvidu-browser-ni]][openvidu-browser-nu]			| used to communicate with the OpenVidu Server				|
| [Angular Material](@angular/material)		| [![][@angular/material-ni]][@angular/material-nu]			| used to display the toolbar, buttons and animations		|
| [Screenfull.js](screenfull.js)			| [![][screenfull.js-ni]][screenfull.js-nu]					| used to toggle the fullscreen mode of the streaming		|
| [EventEmitter](wolfy87-eventemitter)		| [![][wolfy87-eventemitter-ni]][wolfy87-eventemitter-nu]	| used to listen and emit events						|

[openvidu-browser]: https://github.com/OpenVidu/openvidu/tree/master/openvidu-browser
[openvidu-browser-ni]: https://img.shields.io/npm/v/openvidu-browser.svg
[openvidu-browser-nu]: https://www.npmjs.com/package/openvidu-browser

[@angular/material]: https://github.com/angular/material2
[@angular/material-ni]: https://img.shields.io/npm/v/@angular/material.svg
[@angular/material-nu]: https://www.npmjs.com/package/@angular/material

[screenfull.js]: https://github.com/sindresorhus/screenfull.js
[screenfull.js-ni]: https://img.shields.io/npm/v/screenfull.svg
[screenfull.js-nu]: https://www.npmjs.com/package/screenfull

[wolfy87-eventemitter]: https://github.com/Olical/EventEmitter
[wolfy87-eventemitter-ni]: https://img.shields.io/npm/v/wolfy87-eventemitter.svg
[wolfy87-eventemitter-nu]: https://www.npmjs.com/package/wolfy87-eventemitter

[openvidu-server]: https://github.com/OpenVidu/openvidu/tree/master/openvidu-server

#### 3. CSS

The CSS stylesheet is compiled from the [LESS](http://lesscss.org/) files with [Angular-CLI](https://github.com/angular/angular-cli)

#### 4. Files

| Filename | Description |
|----|---|
| `openvidu.component.ts`   | in charge of running most the logic behind the component, such as adding new participants to the screen	|
| `openvidu.component.less` | openvidu component's LESS																					|
| `openvidu.component.html` | openvidu component's HTML																					|
| `stream.component.ts`     | in charge of displaying the video from each participant													|
| `stream.component.html`   | stream component's LESS																					|
| `stream.component.less`   | stream component's HTML																					|
| `openvidu.module.ts`      | openvidu module																							|
| `index.ts`				| file needed to export all components and directives to other components									|

## License

Apache Software License 2.0 ©
