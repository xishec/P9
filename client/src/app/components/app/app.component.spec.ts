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
import { createKeyBoardEvent } from 'src/classes/test-helpers';
import { Keys } from 'src/constants/constants';
import { WelcomeModalWindowComponent } from '../../components/welcome-modal-window/welcome-modal-window.component';
import { ToolName } from 'src/constants/tool-constants';

fdescribe('AppComponent', () => {
    let indexServiceSpy: SpyObj<IndexService>;
    let app: AppComponent;
    let fixture: ComponentFixture<AppComponent>;

    const MOCK_KEYBOARD_CONTROL = createKeyBoardEvent(Keys.Control);
    const MOCK_KEYBOARD_O = createKeyBoardEvent(Keys.o);
    const MOCK_KEYBOARD_S = createKeyBoardEvent(Keys.s);
    const MOCK_KEYBOARD_G = createKeyBoardEvent(Keys.g);
    const MOCK_KEYBOARD_E = createKeyBoardEvent(Keys.e);

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
                    useValue: {
                        open: (one: any, two: any) => {},
                    },
                },
                {
                    provide: ToolSelectorService,
                    useValue: {
                        changeTool: () => {},
                    },
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
                {
                    provide: KeyboardEvent,
                    useValue: {
                        preventDefault: () => {},
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

    it('should openWelcomeModalWindow if displayWelcomeModalWindow is on', () => {
        const SPY = spyOn(app[`dialog`], 'open');
        app[`dialog`].open(WelcomeModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
            disableClose: true,
        });
        app.displayWelcomeModalWindow = false;
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should not openWelcomeModalWindow if displayWelcomeModalWindow is off', () => {
        const SPY = spyOn(app[`dialog`], 'open');
        app[`dialog`].open(WelcomeModalWindowComponent, {
            panelClass: 'myapp-max-width-dialog',
            disableClose: true,
        });
        app.displayWelcomeModalWindow = true;
        expect(SPY).toHaveBeenCalled();
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

    it('should call onControlO', () => {
        const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
        app.shouldAllowShortcut = () => true;
        app.onControlO(MOCK_KEYBOARD_CONTROL);
        app.onControlO(MOCK_KEYBOARD_O);
        expect(SPY).toHaveBeenCalledWith(ToolName.NewDrawing);
    });

    it('should call onControlS', () => {
        const SPY = spyOn(app[`toolSelectorService`], 'changeTool');
        app.shouldAllowShortcut = () => true;
        app.onControlO(MOCK_KEYBOARD_CONTROL);
        app.onControlO(MOCK_KEYBOARD_O);
        expect(SPY).toHaveBeenCalledWith(ToolName.NewDrawing);
    });
});
