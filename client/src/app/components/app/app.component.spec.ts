import { NO_ERRORS_SCHEMA } from '@angular/core';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material';
import { Observable, of } from 'rxjs';

import SpyObj = jasmine.SpyObj;
import { HttpClientModule } from '@angular/common/http';
import { DrawingModalWindowService } from '../../services/drawing-modal-window/drawing-modal-window.service';
import { IndexService } from '../../services/server/index/index.service';
import { ShortcutManagerService } from '../../services/shortcut-manager/shortcut-manager.service';
import { ToolSelectorService } from '../../services/tools/tool-selector/tool-selector.service';
import { WelcomeModalWindowService } from '../../services/welcome-modal-window/welcome-modal-window.service';
import { AppComponent } from './app.component';

describe('AppComponent', () => {
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
                        subscribe: () => null,
                    },
                },
                {
                    provide: WelcomeModalWindowService,
                    useValue: {
                        currentWelcomeModalWindowClosed: {
                            subscribe: () => null,
                        },
                        getValueFromLocalStorage: () => false,
                    },
                },
                {
                    provide: MatDialogRef,
                    useValue: {
                        afterClosed: () => of('result'),
                    },
                },
                {
                    provide: MatDialog,
                    useValue: {
                        open: (one: any, two: any) => MatDialogRef,
                    },
                },
                {
                    provide: ToolSelectorService,
                    useValue: {
                        changeTool: (arg: string) => null,
                    },
                },
                {
                    provide: DrawingModalWindowService,
                    useValue: {
                        currentDisplayNewDrawingModalWindow: {
                            subscribe: () => null,
                        },
                    },
                },
                {
                    provide: ShortcutManagerService,
                    useValue: {
                        currentIsOnInput: {
                            subscribe: () => null,
                        },
                    },
                },
                {
                    provide: KeyboardEvent,
                    useValue: {
                        preventDefault: () => null,
                    },
                },
            ],
            imports: [HttpClientModule],
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

    it('should openWelcomeModalWindow if displayWelcomeModalWindow is on', () => {
        const SPY = spyOn(app[`dialog`], 'open').and.returnValue({ afterClosed: () => of() } as any);
        app.displayWelcomeModalWindow = true;
        app.openWelcomeModalWindow();
        expect(SPY).toHaveBeenCalled();
    });

    it('should not openWelcomeModalWindow if displayWelcomeModalWindow is off', () => {
        const SPY = spyOn(app[`dialog`], 'open');
        app.displayWelcomeModalWindow = false;
        expect(SPY).not.toHaveBeenCalled();
    });

    it('should allow shortcut when no drawing modal and focus not on input and no welcome window', () => {
        app.displayWelcomeModalWindow = false;
        app.isOnInput = false;
        expect(app.shouldAllowShortcut()).toBe(true);
    });

    it('should not allow shortcut when drawing modal is on or focus on input or welcome window is on', () => {
        app.modalIsDisplayed = true;
        app.isOnInput = false;

        expect(app.shouldAllowShortcut()).toBe(false);
    });
});
