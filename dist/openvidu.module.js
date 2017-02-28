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
var material_1 = require('@angular/material');
var stream_component_1 = require("./stream.component");
var openvidu_component_1 = require("./openvidu.component");
var COMPONENTS_DIRECTIVES = [
    stream_component_1.StreamComponent,
    openvidu_component_1.OpenViduComponent,
    material_1.MaterialModule
];
var OpenViduModule = (function () {
    function OpenViduModule() {
    }
    OpenViduModule = __decorate([
        core_1.NgModule({
            imports: [
                material_1.MaterialModule.forRoot()
            ],
            declarations: [COMPONENTS_DIRECTIVES],
            exports: [COMPONENTS_DIRECTIVES],
            providers: []
        }), 
        __metadata('design:paramtypes', [])
    ], OpenViduModule);
    return OpenViduModule;
}());
exports.OpenViduModule = OpenViduModule;
//# sourceMappingURL=/home/alex/Documents/Universidad/Cuarto/TFG/OpenVidu/openvidu-webcomponent/openvidu.module.js.map