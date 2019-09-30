import { async, TestBed, ComponentFixture } from '@angular/core/testing';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { MatDialog } from '@angular/material';
import { of, Observable } from 'rxjs';

import { AppComponent } from './app.component';
import SpyObj = jasmine.SpyObj;
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { IndexService } from '../../services/index/index.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';

fdescribe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [AppComponent],
            providers: [
                {
                    provide: IndexService,
                    useValue: {
                        basicGet: () => new Observable(),
                        pipe: () => new Observable(),
                        subscribe: () => {},
                    },
                },
                {
                    provide: WelcomeModalWindowService,
                    useValue: {
                        currentWelcomeModalWindowClosed: {
                            subscribe: () => {},
                        },
                        getValueFromLocalStorage: () => false,
                    },
                },
                {
                    provide: MatDialog,
                },
                {
                    provide: ToolSelectorService,
                    useValue: {},
                },
                {
                    provide: ToolSelectorService,
                    useValue: {},
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        currentDisplayNewDrawingModalWindow: {
                            subscribe: () => {},
                        },
                    },
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {
                        currentIsOnInput: {
                            subscribe: () => {},
                        },
                    },
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        }).compileComponents();
    }));

    beforeEach(() => {
        indexServiceSpy = jasmine.createSpyObj('IndexService', ['basicGet']);
        indexServiceSpy.basicGet.and.returnValue(of({ title: '', body: '' }));

        fixture = TestBed.createComponent(AppComponent);
        app = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create the app', () => {
        expect(app).toBeTruthy();
    });

    it(`should have as title 'LOG2990'`, () => {
        expect(app.title).toEqual('LOG2990');
    });

    it('should allow shortcut when no drawing modal and focus not on input and no welcome window', () => {
        app.displayNewDrawingModalWindow = false;
        app.welcomeModalWindowClosed = false;
        app.displayWelcomeModalWindow = false;
        app.isOnInput = false;
        expect(app.shouldAllowShortcut()).toBe(true);
    });

    it('should not allow shortcut when drawing modal is on or focus on input or welcome window is on', () => {
        app.displayNewDrawingModalWindow = false;
        app.welcomeModalWindowClosed = false;
        app.displayWelcomeModalWindow = true;
        app.isOnInput = false;
        expect(app.shouldAllowShortcut()).toBe(false);
    });
});
