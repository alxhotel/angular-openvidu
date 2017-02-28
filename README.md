# openvidu-webcomponent
OpenVidu room videoconference element implemented as an Angular 2 Component

<a href="https://github.com/alxhotel/openvidu-webcomponent-app">
  DEMO
</a>

## Install

1. install openvidu-webcomponent node module

```bash
$ npm install openvidu-webcomponent --save
```

2. import OpenViduComponent to your AppModule

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

## Usage

Add `hammer.js` in your html

```html
<script src="../node_modules/hammerjs/hammer.js"></script>
```

You are ready. use it in your template

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId">
  Loading openvidu...
</openvidu>
```

Optionally you can use this to listen for events:

```html
<openvidu [wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId" (change)="onChange($event)">
  Loading openvidu...
</openvidu>
```

## For Developers

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
