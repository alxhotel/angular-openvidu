"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var core_1 = require('@angular/core');
var openvidu_browser_1 = require('openvidu-browser');
var EventEmitter = require('wolfy87-eventemitter');
var screenfull = require('screenfull');
var OpenViduComponent = (function () {
    function OpenViduComponent() {
        this.ee = new EventEmitter();
        this.connected = false;
        this.joinedRoom = false;
        // Participants
        this.participants = [];
        // Rest of peers
        this.streams = [];
        this.micDisabled = false;
        this.cameraDisabled = false;
    }
    OpenViduComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Loading...
        this.loading = true;
        window.onbeforeunload = function () {
            if (_this.openVidu) {
                _this.openVidu.close(true);
            }
        };
        // Setup connection to server
        this.openVidu = new openvidu_browser_1.OpenVidu(this.wsUrl);
        this.openVidu.connect(function (error, openVidu) {
            if (error)
                return console.log(error);
            console.log(openVidu);
            _this.connected = true;
            _this.joinSession(_this.sessionId, _this.participantId, function (error) {
                if (error)
                    console.log(error);
                // All correct :)
            });
        });
        // Finish loading
        this.loading = false;
    };
    OpenViduComponent.prototype.addEventListener = function (eventName, listener) {
        this.ee.addListener(eventName, listener);
    };
    OpenViduComponent.prototype.emitEvent = function (eventName, eventsArray) {
        this.ee.emitEvent(eventName, eventsArray);
    };
    OpenViduComponent.prototype.setListeners = function () {
        var _this = this;
        // Set listeners
        this.session.addEventListener('update-main-speaker', this.updateMainSpeaker);
        this.session.addEventListener('error-room', function () {
            console.warn("error-room");
        });
        this.session.addEventListener('room-connected', function () {
            console.warn("Room connected");
            _this.joinedRoom = true;
        });
        this.session.addEventListener('stream-added', function (streamEvent) {
            console.warn("Stream added");
            _this.streams.push(streamEvent.stream);
        });
        this.session.addEventListener('participant-published', function () {
            console.warn("Participant published");
        });
        this.session.addEventListener('participant-joined', function (participantEvent) {
            console.warn("participant-joined");
            var newParticipant = participantEvent.participant;
            _this.participants[newParticipant.id] = newParticipant;
        });
        this.session.addEventListener('participant-left', function (participantEvent) {
            console.warn("Participant Left");
            delete _this.participants[participantEvent.participant.id];
        });
        this.session.addEventListener('stream-removed', function () {
            console.warn("stream-removed");
            //this.removeVideoTag(streamEvent.stream);
        });
        this.session.addEventListener('participant-evicted', function () {
            console.warn("participant-evicted");
        });
        this.session.addEventListener('newMessage', function () {
            console.warn("newMessage");
        });
        this.session.addEventListener('room-closed', function () {
            console.warn("room-closed");
        });
        this.session.addEventListener('lost-connection', function () {
            console.warn("lost-connection");
        });
        this.session.addEventListener('error-media', function () {
            console.warn("error-media");
        });
    };
    OpenViduComponent.prototype.updateMainSpeaker = function (participantEvent) {
        console.warn("Update main speaker");
        var streams = this.participants[participantEvent.participantId].getStreams();
        this.mainStream = streams[Object.keys(streams)[0]];
    };
    OpenViduComponent.prototype.removeVideoTag = function (stream) {
        console.log("Stream removed");
        this.streams.slice(this.streams.indexOf(stream), 1);
    };
    OpenViduComponent.prototype.joinSession = function (sessionId, participantId, callback) {
        var _this = this;
        if (!this.connected)
            callback(new Error("Not connected to server yet"));
        // Set attributes
        this.sessionId = sessionId;
        this.participantId = participantId;
        var sessionOptions = {
            sessionId: this.sessionId,
            participantId: this.participantId
        };
        // Enter session
        this.openVidu.joinSession(sessionOptions, function (error, session) {
            if (error)
                return callback(error);
            // Get session for this room
            _this.session = session;
            _this.setListeners();
            var camera = _this.openVidu.getCamera({
                recvAudio: true,
                recvVideo: true,
                audio: true,
                video: true,
                data: true
            });
            // Show camera
            camera.requestCameraAccess(function (error, camera) {
                if (error)
                    return callback(error);
                _this.myCamera = camera;
                _this.myCamera.mirrorLocalStream(_this.myCamera.getWrStream());
                _this.mainStream = _this.myCamera;
                // Debug
                var allStreams = session.getStreams();
                console.log("MY CAMERA APPROVED: ", camera);
                console.log("Other streams: ", allStreams);
                // Publish my camera to session
                _this.myCamera.publish();
                return callback(error);
            });
        });
    };
    OpenViduComponent.prototype.toggleMic = function () {
        var toggleMicButton = document.getElementsByClassName("toggle-mic")[0];
        if (this.micDisabled) {
            toggleMicButton.className = toggleMicButton.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
            this.myCamera.getWebRtcPeer().audioEnabled = true;
        }
        else {
            toggleMicButton.className += " disabled";
            this.myCamera.getWebRtcPeer().audioEnabled = false;
        }
        this.micDisabled = !this.micDisabled;
        console.log(this.myCamera);
    };
    OpenViduComponent.prototype.toggleCamera = function () {
        var toggleCameraButton = document.getElementsByClassName("toggle-camera")[0];
        if (this.cameraDisabled) {
            toggleCameraButton.className = toggleCameraButton.className.replace(/(?:^|\s)disabled(?!\S)/g, '');
            this.myCamera.getWebRtcPeer().videoEnabled = true;
        }
        else {
            toggleCameraButton.className += " disabled";
            this.myCamera.getWebRtcPeer().videoEnabled = false;
        }
        this.cameraDisabled = !this.cameraDisabled;
        console.log(this.myCamera);
    };
    OpenViduComponent.prototype.toggleFullscreen = function () {
        // TODO
        screenfull.request(document.getElementsByClassName('openvidu')[0]);
    };
    OpenViduComponent.prototype.onLostConnection = function () {
        if (!this.joinedRoom) {
            console.warn('Not connected to room, ignoring lost connection notification');
            return false;
        }
    };
    OpenViduComponent.prototype.leaveSession = function () {
        this.session = null;
        this.streams = [];
        this.connected = false;
        this.joinedRoom = false;
        if (this.openVidu) {
            this.openVidu.close(true);
        }
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], OpenViduComponent.prototype, "wsUrl", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], OpenViduComponent.prototype, "sessionId", void 0);
    __decorate([
        core_1.Input(), 
        __metadata('design:type', String)
    ], OpenViduComponent.prototype, "participantId", void 0);
    OpenViduComponent = __decorate([
        core_1.Component({
            selector: 'openvidu',
            templateUrl: './openvidu.component.html',
            styleUrls: ['./css/openvidu.component.css'],
            encapsulation: core_1.ViewEncapsulation.None
        }), 
        __metadata('design:paramtypes', [])
    ], OpenViduComponent);
    return OpenViduComponent;
}());
exports.OpenViduComponent = OpenViduComponent;
//# sourceMappingURL=/home/alex/Documents/Universidad/Cuarto/TFG/OpenVidu/openvidu-webcomponent/openvidu.component.js.map