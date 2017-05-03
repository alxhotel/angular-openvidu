import { TestBed, async } from '@angular/core/testing';

import { OpenViduComponent } from './openvidu.component';

describe('AngularOpenVidu', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				OpenViduComponent
			],
		}).compileComponents();
	}));

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(OpenViduComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
});
