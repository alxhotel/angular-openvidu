import { TestBed, async } from '@angular/core/testing';

import { AppComponent } from './app.component';
import { AppModule } from './app.module';

describe('AppComponent', () => {
	beforeEach(async(() => {
		TestBed.configureTestingModule({
			imports: [
				AppModule
			],
		}).compileComponents();
	}));

	it('should create the app', async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		expect(app).toBeTruthy();
	}));

	it(`should have as title 'Angular OpenVidu Demo'`, async(() => {
		const fixture = TestBed.createComponent(AppComponent);
		const app = fixture.debugElement.componentInstance;
		const compiled = fixture.debugElement.nativeElement;
		console.log(app);
		console.log(compiled);
		expect(compiled.querySelector('mat-toolbar').textContent.trim()).toEqual('Angular OpenVidu Demo');
	}));
});
