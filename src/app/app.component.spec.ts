import { TestBed } from '@angular/core/testing';

// Angular Material
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatToolbarModule } from '@angular/material/toolbar';

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

