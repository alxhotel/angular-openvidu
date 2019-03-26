/*
 * Public API Surface of angular-openvidu
 */

// Export OpenDirective
export {
    CameraAccessEvent, ErrorEvent, MessageEvent,
    ParticipantData, ParticipantEvent, RoomConnectedEvent, StreamEvent
} from './lib/openvidu.directive';

// Export Misc
export { Stream } from 'openvidu-browser';

// Export Abstract Component
export { OpenViduHelperComponent } from './lib/openvidu-helper.component';

// Export explicitly Directives
export { OpenViduDirective } from './lib/openvidu.directive';

// Export Services
export { OpenViduHangoutsIntl } from './lib/openvidu-hangouts/openvidu-hangouts-intl';
export { OpenViduAppearinIntl } from './lib/openvidu-appearin/openvidu-appearin-intl';
export { OpenViduGoToMeetingIntl } from './lib/openvidu-gotomeeting/openvidu-gotomeeting-intl';

// Export Module
export { OpenViduModule } from './lib/openvidu.module';
