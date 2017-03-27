"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
var core_1 = require("@angular/core");
var StreamComponent = (function () {
    function StreamComponent(domSanitizer, renderer) {
        this.domSanitizer = domSanitizer;
        this.renderer = renderer;
    }
    Object.defineProperty(StreamComponent.prototype, "stream", {
        get: function () {
            return this._stream;
        },
        set: function (val) {
            var _this = this;
            this._stream = val;
            // Loop until you get a WrStream
            var int = setInterval(function () {
                if (_this.stream.getWrStream()) {
                    _this.videoSrc = _this.domSanitizer.bypassSecurityTrustUrl(URL.createObjectURL(_this.stream.getWrStream()));
                    console.log("Video tag src = " + _this.videoSrc);
                    clearInterval(int);
                }
            }, 1000);
            // If local, mute video
            this.muted = this.stream.isLocalMirrored();
            // If local, flip screen
            this.renderer.setElementClass(this.videoStream.nativeElement, 'flip-screen', this.stream.isLocalMirrored());
        },
        enumerable: true,
        configurable: true
    });
    StreamComponent.prototype.ngOnInit = function () {
        //this.stream.addEventListener('src-added', () => {
        //    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
        //});
    };
    return StreamComponent;
}());
__decorate([
    core_1.ViewChild('videoStream')
], StreamComponent.prototype, "videoStream");
__decorate([
    core_1.Input('stream')
], StreamComponent.prototype, "stream");
StreamComponent = __decorate([
    core_1.Component({
        selector: 'stream',
        styleUrls: ['./stream.component.less'],
        template: "\n\t\t<div class='participant'>\n\t\t\t<span>{{stream.getParticipant().id}}</span>\n\t\t\t<video #videoStream class=\"\" autoplay=\"true\" [src]=\"videoSrc\" [muted]=\"muted\"></video>\n        </div>"
    })
], StreamComponent);
exports.StreamComponent = StreamComponent;
