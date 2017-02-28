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
var platform_browser_1 = require('@angular/platform-browser');
var StreamComponent = (function () {
    function StreamComponent(sanitizer) {
        this.sanitizer = sanitizer;
    }
    StreamComponent.prototype.ngOnInit = function () {
        var _this = this;
        var int = setInterval(function () {
            if (_this.stream.getWrStream()) {
                _this.videoSrc = _this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(_this.stream.getWrStream()));
                console.log("Video tag src=" + _this.videoSrc);
                _this.muted = _this.stream.isLocalMirrored();
                clearInterval(int);
            }
        }, 1000);
        //this.stream.addEventListener('src-added', () => {
        //    this.video.src = this.sanitizer.bypassSecurityTrustUrl(URL.createObjectURL(this.stream.getWrStream())).toString();
        //});
    };
    __decorate([
        core_1.Input(), 
        __metadata('design:type', openvidu_browser_1.Stream)
    ], StreamComponent.prototype, "stream", void 0);
    StreamComponent = __decorate([
        core_1.Component({
            selector: 'stream',
            styles: ["\n\t\t.main-stream video {\n\t\t\twidth: 100%;\n\t\t}\n        /*.participant {\n\t        float: left;\n\t        width: 20%;\n\t        margin: 10px;\n        }\n        .participant video {\n\t        width: 100%;\n\t        height: auto;\n        }*/"],
            template: "\n\t\t<div class='participant'>\n\t\t\t<span>{{stream.getId()}}</span>\n\t\t\t<video autoplay=\"true\" [src]=\"videoSrc\" [muted]=\"muted\"></video>\n        </div>"
        }), 
        __metadata('design:paramtypes', [platform_browser_1.DomSanitizer])
    ], StreamComponent);
    return StreamComponent;
}());
exports.StreamComponent = StreamComponent;
//# sourceMappingURL=/home/alex/Documents/Universidad/Cuarto/TFG/OpenVidu/openvidu-webcomponent/stream.component.js.map