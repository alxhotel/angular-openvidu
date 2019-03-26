import { Stream } from '../OpenViduInternal/Stream';
export declare class Subscriber {
    private ee;
    element: Element;
    id: string;
    stream: Stream;
    constructor(stream: Stream, parentId: string);
    on(eventName: string, callback: any): void;
}
