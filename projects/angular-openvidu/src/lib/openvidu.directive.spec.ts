import { Component, ViewChild } from '@angular/core';

import { async, getTestBed, ComponentFixture, ComponentFixtureAutoDetect, TestBed } from '@angular/core/testing';

// Imports dependencies of component to be tested
import { OpenViduModule } from './openvidu.module';

// Component to be tested
import { OpenViduDirective, MessageEvent } from './openvidu.directive';

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

	serverConnected: boolean = false;
	messages: string[] = [];

	// OpenVidu api
	@ViewChild('openviduApi') openviduApi: OpenViduDirective;

	onServerConnected() {
		// Dummy
		this.serverConnected = true;
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
	onNewMessage(messageEvent: MessageEvent) {
		this.messages.push(messageEvent.message);
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
		jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
	}));

	afterAll(() => {
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
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();
		expect(testComponent.openviduApi.sessionId).toEqual(randomCredentials['sessionId']);
		expect(testComponent.openviduApi.participantId).toEqual(randomCredentials['participantId']);
		expect(testComponent.openviduApi.wsUrl).toEqual(defaultWsUrl);
	});

	it('should trigger onServerConnected', (done) => {
		console.log(testComponent.openviduApi.wsUrl);
		// Setup spy
		spyOn(testComponent, 'onServerConnected').and.callThrough();
		// Setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		// Check trigger
		setTimeout(() => {
			expect(testComponent.onServerConnected).toHaveBeenCalled();
			done();
		}, 1000);
	});


	it('should trigger onRoomConnected', (done) => {
		// Setup spy
		spyOn(testComponent, 'onRoomConnected').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		// Check trigger
		setTimeout(() => {
			expect(testComponent.onRoomConnected).toHaveBeenCalled();
			done();
		}, 4000);
	});

	it('should trigger onLeaveRoom', (done) => {
		// Setup spy
		spyOn(testComponent, 'onLeaveRoom').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		testComponent.openviduApi.leaveRoom();

		// Check trigger
		setTimeout(() => {
			expect(testComponent.onLeaveRoom).toHaveBeenCalled();
			done();
		}, 1000);
	});

	it('should trigger onNewMessage', (done) => {
		// Fix popup from openvidu-browser
		//window.alert = function(){return;};
		window.confirm = () => {return false;};
		// Setup spy
		spyOn(testComponent, 'onNewMessage').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		// Check trigger
		setTimeout(() => {
			const testMessage = 'Testing message';
			testComponent.openviduApi.sendMessage(testMessage);

			// Check trigger
			setTimeout(() => {
				expect(testComponent.onNewMessage).toHaveBeenCalled();
				expect(testComponent.messages.length).toEqual(1);
				expect(testComponent.messages[0]).toEqual(testMessage);
				done();
			}, 4000);
		}, 4000);
	});

	it('should change camera', () => {
		// Setup spy
		spyOn(testComponent, 'onNewMessage').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		// Check trigger
		setTimeout(() => {
			testComponent.openviduApi.camEnabled = false;
			expect(testComponent.messages.length).not.toBeTruthy(testComponent.openviduApi.camEnabled);
		}, 4000);
	});

	it('should chnage microphone', () => {
		// Setup spy
		spyOn(testComponent, 'onNewMessage').and.callThrough();
		// setup creds
		const randomCredentials = getRandomCredentials();
		testComponent.sessionId = randomCredentials['sessionId'];
		testComponent.participantId = randomCredentials['participantId'];
		testComponent.wsUrl = defaultWsUrl;
		fixture.detectChanges();

		// Check trigger
		setTimeout(() => {
			testComponent.openviduApi.micEnabled = false;
			expect(testComponent.messages.length).not.toBeTruthy(testComponent.openviduApi.micEnabled);
		}, 4000);
	});

});
