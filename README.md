# openvidu-webcomponent
[![GitHub issues](https://img.shields.io/github/issues/openvidu/angular-openvidu.svg)](https://github.com/openvidu/angular-openvidu/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/openvidu/angular-openvidu/master/LICENSE)

## Demo

[https://github.com/alxhotel/angular-openvidu-app](https://github.com/alxhotel/angular-openvidu-app)

## About

OpenVidu room videoconference element implemented as an Angular Component

Pull requests are welcome.

## Table of contents

- [About](#about)
- [Installation](#installation)
- [Documentation](#documentation)
- [Development](#development)
- [License](#licence)

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
import { OpenViduComponent } from 'openvidu-webcomponent';

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

## Usage

You are ready. Use it in your template:

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">
  Loading openvidu...
</openvidu>
```

Optionally, you can use this to listen for events:

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId" (change)="onChange($event)">
  Loading openvidu...
</openvidu>
```

## Documentation


## Development

  Things to know to understand the implementation:
  
  1. **Events**
  
      a) `room-connected`: triggers when the client has established a session with the server
      
      b) `room-closed`: triggers when the room is closed
      
      c) `lost-connection`: triggers when you can't establish a connection to the server
      
      d) `error-room`: triggers when it was unable to join room
      
      e) `stream-added`: triggers when a new stream was added
      
      f) `stream-removed`: triggers when a stream was removed
      
      g) `participant-joined`: triggers when a participant has joined your room
      
      h) `particpant-published`: triggers when a participant is publised
      
      i) `participant-left`: triggers when a participant has left your room
      
      j) `participant-evicted`: triggers when a participant is evicted
      
      k) `upodate-main-speaker`: triggers when a the main speaker has been updated
      
      l) `newMessage`: triggers when a new message is recived
      
      m) `error-media`: triggers when an error occurs while trying to retrieve some media
            
      n) `custom-message-received`: triggers when a custom notificaction arrives
      
      
  2. **Stream component**: is the component in charge of displaying the video from each participant.
  
  3. **LESS**: the CSS stylesheet is compiled from the LESS file.
  
  4. [Angular Material](https://github.com/angular/material2): used to display the toolbar, buttons and all animations.

  5. `screenfull`: used to toggle the fullscreen mode of the streaming.


## License

MIT
