import { getTestBed, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

// Imports dependencies of component to be tested
import { OpenViduModule } from '../openvidu.module';

// Component to be tested
import { OpenViduHangoutsComponent } from './openvidu-hangouts.component';

import { BigScreenModule } from 'angular-bigscreen';

describe('AngularOpenVidu Hangouts', () => {
	let fixture: ComponentFixture<OpenViduHangoutsComponent>;
	let component: OpenViduHangoutsComponent;

	beforeEach(async () => {
		// Setup the component to be tested
		await TestBed.configureTestingModule({
			imports: [
				OpenViduModule,
				BigScreenModule
			],
			providers: [
				{ provide: ComponentFixtureAutoDetect, useValue: true },
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(OpenViduHangoutsComponent);
		fixture.detectChanges();
		component = fixture.componentInstance;
	});

	afterEach(() => {
		// Reset the testing module
		getTestBed().resetTestingModule();
	});

	it('should create the component', () => {
		// Check that the componente has been instanciated
		expect(component).toBeTruthy();
	});
});
