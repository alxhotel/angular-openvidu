import { TestBed, async } from '@angular/core/testing';

import { OpenViduHangoutsComponent } from './openvidu-hangouts.component';

describe('AngularOpenVidu', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			declarations: [
				OpenViduHangoutsComponent
			],
		}).compileComponents();
	}));

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(OpenViduHangoutsComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));
});
