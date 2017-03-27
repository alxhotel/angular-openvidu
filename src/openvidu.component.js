"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var openvidu_browser_1 = require("openvidu-browser");
var EventEmitter = require("wolfy87-eventemitter");
var screenfull = require("screenfull");
var OpenViduComponent = (function () {
    function OpenViduComponent(renderer) {
        this.renderer = renderer;
        this.ee = new EventEmitter();
        // Participants
        this.participants = [];
        // Rest of peers
        this.streams = [];
        this.joinedRoom = false;
        this.connected = false;
        // Flags for HTML elements
        this.userMessage = "Loading OpenViudu...";
        this.micDisabled = false;
        this.cameraDisabled = false;
        this.isFullscreen = false;
    }
    OpenViduComponent.prototype.ngOnInit = function () {
        var _this = this;
        // Set listeners
        window.onbeforeunload = function () {
            if (_this.openVidu) {
                _this.openVidu.close(true);
            }
        };
        // Display message
        this.userMessage = "Connecting...";
        // Setup connection to server
        this.openVidu = new openvidu_browser_1.OpenVidu(this.wsUrl);
        this.openVidu.connect(function (error, openVidu) {
            if (error)
                return console.log(error);
            console.log(openVidu);
            _this.connected = true;
            // Display message
            _this.userMessage = "Joining room...";
            _this.joinSession(_this.sessionId, _this.participantId, function (error) {
                if (error)
                    console.log(error);
                // All correct :)
            });
        });
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
        this.session.addEventListener('update-main-speaker', function (participantEvent) {
            console.warn("Update main speaker");
            // TODO.: make a fix in Openvidu ?
            // "participantId" is not a participant ID, is a stream ID
            if (_this.streams == null)
                _this.streams = [];
            for (var _i = 0, _a = _this.streams; _i < _a.length; _i++) {
                var stream = _a[_i];
                console.log(stream.getId());
                if (stream.getId() == participantEvent.participantId) {
                    var streams = _this.participants[stream.getParticipant().getId()].getStreams();
                    // Use any stream
                    _this.mainStream = streams[Object.keys(streams)[0]];
                    break;
                }
            }
        });
        this.session.addEventListener('error-room', function () {
            console.warn("error-room");
        });
        this.session.addEventListener('room-connected', function () {
            console.warn("Room connected");
            _this.joinedRoom = true;
        });
        this.session.addEventListener('stream-added', function (streamEvent) {
            console.warn("Stream added");
            var newStream = streamEvent.stream;
            _this.streams.push(newStream);
            // Also add to participant
            _this.participants[newStream.getParticipant().getId()].addStream(newStream);
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
            var oldParticipant = participantEvent.participant;
            _this.participants.splice(_this.participants.indexOf(oldParticipant), 1);
        });
        this.session.addEventListener('stream-removed', function (streamEvent) {
            console.warn("stream-removed");
            var oldStream = streamEvent.stream;
            _this.streams.splice(_this.streams.indexOf(oldStream), 1);
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
                _this.streams.push(_this.myCamera);
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
        var toggleMicButton = this.toggleMicElement._getHostElement();
        if (this.micDisabled) {
            this.renderer.setElementClass(toggleMicButton, 'disabled', false);
            this.myCamera.getWebRtcPeer().audioEnabled = true;
        }
        else {
            this.renderer.setElementClass(toggleMicButton, 'disabled', true);
            this.myCamera.getWebRtcPeer().audioEnabled = false;
        }
        this.micDisabled = !this.micDisabled;
    };
    OpenViduComponent.prototype.toggleCamera = function () {
        var toggleCameraButton = this.toggleCameraElement._getHostElement();
        if (this.cameraDisabled) {
            this.renderer.setElementClass(toggleCameraButton, 'disabled', false);
            this.myCamera.getWebRtcPeer().videoEnabled = true;
        }
        else {
            this.renderer.setElementClass(toggleCameraButton, 'disabled', true);
            this.myCamera.getWebRtcPeer().videoEnabled = false;
        }
        this.cameraDisabled = !this.cameraDisabled;
    };
    OpenViduComponent.prototype.toggleFullscreen = function () {
        if (screenfull.isFullscreen) {
            screenfull.exit();
        }
        else {
            screenfull.request(this.mainElement.nativeElement);
        }
        this.isFullscreen = screenfull.isFullscreen;
    };
    OpenViduComponent.prototype.onLostConnection = function () {
        if (!this.joinedRoom) {
            console.warn('Not connected to room, ignoring lost connection notification');
            return false;
        }
    };
    OpenViduComponent.prototype.leaveSession = function () {
        this.mainStream = null;
        this.session = null;
        this.streams = [];
        this.participants = [];
        this.userMessage = "You left the room";
        this.joinedRoom = false;
        if (this.openVidu) {
            this.openVidu.close(true);
        }
    };
    return OpenViduComponent;
}());
__decorate([
    core_1.ViewChild('main')
], OpenViduComponent.prototype, "mainElement");
__decorate([
    core_1.ViewChild('toggleMicView')
], OpenViduComponent.prototype, "toggleMicElement");
__decorate([
    core_1.ViewChild('toggleCameraView')
], OpenViduComponent.prototype, "toggleCameraElement");
__decorate([
    core_1.Input()
], OpenViduComponent.prototype, "wsUrl");
__decorate([
    core_1.Input()
], OpenViduComponent.prototype, "sessionId");
__decorate([
    core_1.Input()
], OpenViduComponent.prototype, "participantId");
OpenViduComponent = __decorate([
    core_1.Component({
        selector: 'openvidu',
        templateUrl: './openvidu.component.html',
        styleUrls: ['./openvidu.component.less']
    })
], OpenViduComponent);
exports.OpenViduComponent = OpenViduComponent;
