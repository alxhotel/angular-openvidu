import { TestBed } from '@angular/core/testing';

// Angular Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import {
  MatButtonModule,
  MatCardModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatSnackBarModule,
  MatToolbarModule
} from '@angular/material';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AppComponent
      ],
      imports: [
        /* OpenVidu Module */
        // OpenViduModule,

        /* Material Module */
        NoopAnimationsModule,
        MatButtonModule,
        MatCardModule,
        MatIconModule,
        MatInputModule,
        MatSelectModule,
        MatSnackBarModule,
        MatToolbarModule
      ],
      providers: [
        // {provide: OpenViduHangoutsIntl, useClass: MySpanishOpenViduHangoutsIntl},
      ]
    }).compileComponents();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'Angular OpenVidu Demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.componentInstance;
    expect(app.title).toEqual('Angular OpenVidu Demo');
  });

  it(`should render title 'Angular OpenVidu Demo'`, () => {
    const fixture = TestBed.createComponent(AppComponent);
    fixture.detectChanges();
    const compiled = fixture.nativeElement;
    expect(compiled.querySelector('mat-toolbar').textContent.trim()).toEqual('Angular OpenVidu Demo');
  });
});

