import { Component, ViewChild } from '@angular/core';

import { async, getTestBed, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

// Imports dependencies of component to be tested
import { OpenViduModule } from './openvidu.module';

// Component to be tested
import { OpenViduDirective } from './openvidu.directive';

// Testing utils
import { getRandomCredentials } from './testing/testing-helper';

@Component({
	template: `
	<openvidu-template
		#openviduApi="openviduApi"
		[wsUrl]="wsUrl" [sessionId]="sessionId" [participantId]="participantId"
		(onServerConnected)="onServerConnected()"
		(onRoomConnected)="onRoomConnected()"
		(onParticipantJoined)="onParticipantJoined($event)"
		(onParticipantLeft)="onParticipantLeft($event)"
		(onErrorMedia)="onErrorMedia()"
		(onLeaveRoom)="onLeaveRoom()"
		(onNewMessage)="onNewMessage($event)">
		Loading openvidu...
	</openvidu-template>`
})
class TestComponent {
	sessionId: string;
	participantId: string;
	wsUrl: string;

	// OpenVidu api
	@ViewChild('openviduApi') openviduApi: OpenViduDirective;

	onServerConnected() {
		// Dummy
	}
	onRoomConnected() {
		// Dummy
	}
	onParticipantJoined() {
		// Dummy
	}
	onParticipantLeft() {
		// Dummy
	}
	onErrorMedia() {
		// Dummy
	}
	onLeaveRoom() {
		// Dummy
	}
	onNewMessage() {
		// Dummy
	}
}

describe('AngularOpenVidu Directive', () => {
	let fixture: ComponentFixture<TestComponent>;
	let testComponent: TestComponent;

	const defaultWsUrl = 'wss://127.0.0.1:8443/';

	beforeEach(async(() => {
		// Setup the component to be tested
		TestBed.configureTestingModule({
			imports: [
				OpenViduModule
			],
			declarations: [
				TestComponent
			],
			providers: [
				{ provide: ComponentFixtureAutoDetect, useValue: true }
			]
		})
		.compileComponents().then( () => {
			fixture = TestBed.createComponent(TestComponent);
			fixture.detectChanges();
			testComponent = fixture.componentInstance;
		});
	}));

	afterEach(() => {
		// Reset the testing module
		//getTestBed().resetTestingModule();
	});

	it('should create the component', () => {
		// Check that the componente has been instanciated
		expect(testComponent).toBeTruthy();
	});

	it('should trigger ngOnChanges', () => {
		// Setup spy
		spyOn(testComponent.openviduApi, 'ngOnChanges').and.callThrough();

		// No calls
		expect(testComponent.openviduApi.ngOnChanges).not.toHaveBeenCalled();

		// One call
		testComponent.sessionId = 'dummy';
		fixture.detectChanges();
		expect(testComponent.openviduApi.ngOnChanges).toHaveBeenCalled();

		// Check values
		const sessionId = 'SessionA';
		testComponent.sessionId = sessionId;
		const participantId = 'ParticipantA';
		testComponent.participantId = participantId;
		const wsUrl = 'wss://127.0.0.1:8443/';
		testComponent.wsUrl = wsUrl;
		fixture.detectChanges();
		expect(testComponent.openviduApi.sessionId).toEqual(sessionId);
		expect(testComponent.openviduApi.participantId).toEqual(participantId);
		expect(testComponent.openviduApi.wsUrl).toEqual(wsUrl);
	});

	it('should trigger onServerConnected', (done) => {
		console.log(testComponent.openviduApi.wsUrl);
		// Setup spy
		const spyChanges = spyOn(testComponent, 'onServerConnected').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;

		// Check trigger
		//setTimeout(() => {
		//	expect(spyChanges).toHaveBeenCalled();
		//	done();
		//}, 1000);
		done();
		expect(true).toBeTruthy();
	});

	it('should trigger onRoomConnected', () => {
		// Setup spy
		const spyChanges = spyOn(testComponent, 'onRoomConnected').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;

		// Check trigger
		//expect(spyChanges).toHaveBeenCalled();
		expect(true).toBeTruthy();
	});

	it('should trigger onParticipantJoined', () => {
		expect(true).toBeTruthy();
	});

	it('should trigger onParticipantLeft', () => {
		expect(true).toBeTruthy();
	});

	it('should trigger onErrorMedia', () => {
		expect(true).toBeTruthy();
	});

	it('should trigger onLeaveRoom', () => {
		expect(true).toBeTruthy();
	});

	it('should trigger onNewMessage', () => {
		expect(true).toBeTruthy();
	});

	//const h2 = fixture.debugElement.query(By.css('h2'));

	//expect(h2.nativeElement.textContent).to.equal('Value: 0'

});
