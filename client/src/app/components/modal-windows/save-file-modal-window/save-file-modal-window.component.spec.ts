import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, FormGroup } from '@angular/forms';
import { MatDialogRef } from '@angular/material';
import { NO_ERRORS_SCHEMA } from '@angular/core';

import { SaveFileModalWindowComponent } from './save-file-modal-window.component';
import { ModalManagerService } from 'src/app/services/modal-manager/modal-manager.service';
import { DrawingLoaderService } from 'src/app/services/server/drawing-loader/drawing-loader.service';
import { MAX_NB_LABELS } from 'src/constants/constants';
import { DrawingSaverService } from 'src/app/services/server/drawing-saver/drawing-saver.service';
import { BehaviorSubject } from 'rxjs';
import { NameAndLabels } from 'src/classes/NameAndLabels';

describe('SaveFileModalWindowComponent', () => {
    let component: SaveFileModalWindowComponent;
    let fixture: ComponentFixture<SaveFileModalWindowComponent>;
    let form: FormGroup;

    let drawingSaverService: DrawingSaverService;

    const dialogMock = {
        close: () => null,
    };

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [SaveFileModalWindowComponent],
            providers: [
                FormBuilder,
                {
                    provide: MatDialogRef,
                    useValue: {},
                },
            ],
            schemas: [NO_ERRORS_SCHEMA],
        })
            .overrideComponent(SaveFileModalWindowComponent, {
                set: {
                    providers: [
                        FormBuilder,
                        FormsModule,
                        {
                            provide: MatDialogRef,
                            useValue: dialogMock,
                        },
                        {
                            provide: ModalManagerService,
                            useValue: {
                                setModalIsDisplayed: ()=> null,
                            },
                        },
                        {
                            provide: DrawingSaverService,
                            useValue: {},
                        },
                        {
                            provide: DrawingLoaderService,
                            useValue: {},
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(SaveFileModalWindowComponent);
        component = fixture.componentInstance;

        component.initializeForm();
        form = component.saveFileModalForm;
        
        drawingSaverService = fixture.debugElement.injector.get(DrawingSaverService);
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it(`should notify the user if drawing has been successfully saved`, () => {
        const SPY = spyOn(window, 'alert');

        form.value.name = 'hello';
        const nameAndLabels = new NameAndLabels(form.value.name, component.selectedLabels);
        drawingSaverService.currentNameAndLabels = new BehaviorSubject(nameAndLabels);
        drawingSaverService.currentIsSaved = new BehaviorSubject(true);

        component.onSubmit();

        expect(SPY).toHaveBeenCalledWith(`Sauvegarde réussie!`);
    });

    it(`should notify the user if drawing has been successfully saved`, () => {
        const SPY = spyOn(window, 'alert');

        form.value.name = 'hello';
        const nameAndLabels = new NameAndLabels(form.value.name, component.selectedLabels);
        drawingSaverService.currentNameAndLabels = new BehaviorSubject(nameAndLabels);
        drawingSaverService.currentIsSaved = new BehaviorSubject(false);
        component.errorMesaage = 'test error message';

        component.onSubmit();

        expect(SPY).toHaveBeenCalledWith(`Sauvegarde échouée...\n ${component.errorMesaage}`);
    });

    it(`should notify the user if user selects more than ${MAX_NB_LABELS} labels`, () => {
        const SPY = spyOn(window, 'alert');
        component.selectedLabels = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];

        component.addLabel('test-label');

        expect(SPY).toHaveBeenCalledWith(`Veuillez choisir au maximum ${MAX_NB_LABELS} étiquettes.`);
    });

    it(`should push the new label if user selects less than ${MAX_NB_LABELS} labels`, () => {
        const newLabel: string = 'test-label';
        component.drawingLabels = ['a', 'b', 'c'];
        component.selectedLabels = ['a', 'b', 'c'];

        component.addLabel(newLabel);

        expect(component.drawingLabels).toEqual(['a', 'b', 'c', 'test-label']);
        expect(component.selectedLabels).toEqual(['a', 'b', 'c', 'test-label']);
        expect(component.saveFileModalForm.controls.label.value).toEqual('');
    });

    it(`should remove label from selected labels if label is already included`, () => {
        component.selectedLabels = ['a', 'b', 'c', 'test-label'];

        component.toggleLabel('test-label');

        expect(component.selectedLabels).toEqual(['a', 'b', 'c']);
    });

    it(`should add label to selected labels if label is not already included`, () => {
        component.selectedLabels = ['a', 'b', 'c'];

        component.toggleLabel('test-label');

        expect(component.selectedLabels).toEqual(['a', 'b', 'c', 'test-label']);
    });
});
