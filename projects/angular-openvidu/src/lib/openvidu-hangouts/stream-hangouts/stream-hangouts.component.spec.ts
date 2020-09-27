import { getTestBed, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

// Imports dependencies of component to be tested
import { OpenViduModule } from '../../openvidu.module';

// Component to be tested
import { StreamHangoutsComponent } from './stream-hangouts.component';

describe('AngularOpenVidu Stream Hangouts', () => {
	let fixture: ComponentFixture<StreamHangoutsComponent>;
	let component: StreamHangoutsComponent;

	beforeEach(async () => {
		// Setup the component to be tested
		await TestBed.configureTestingModule({
			imports: [
				OpenViduModule
			],
			providers: [
				{ provide: ComponentFixtureAutoDetect, useValue: true }
			]
		})
		.compileComponents();

		fixture = TestBed.createComponent(StreamHangoutsComponent);
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
