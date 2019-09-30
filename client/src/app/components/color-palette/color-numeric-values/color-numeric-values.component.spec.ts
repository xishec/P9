import { async, ComponentFixture, TestBed } from "@angular/core/testing";

import { ShortcutManagerService } from '../../../services/shortcut-manager/shortcut-manager.service';
import { ColorToolService } from "../../../services/tools/color-tool/color-tool.service";
import { ColorNumericValuesComponent } from "./color-numeric-values.component";
import { NO_ERRORS_SCHEMA } from "@angular/core";
import { FormBuilder, FormGroup } from "@angular/forms";

describe("ColorNumericValuesComponent", () => {
    let component: ColorNumericValuesComponent;
    let fixture: ComponentFixture<ColorNumericValuesComponent>;
    let form: FormGroup;
    let shortCutManagerService: ShortcutManagerService;

    const MOCK_COLOR = "01234567";
    const MOCK_COLOR_FROM_SERVICE = "ff00ff00";
    const MOCK_OPACITY = "33";

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorNumericValuesComponent],
            schemas: [NO_ERRORS_SCHEMA],
            providers: [
                FormBuilder,
                {
                    provide: ColorToolService,
                    useValue: {
                        getPreviewColorOpacityHex: () => MOCK_OPACITY,
                        translateRGBToHex: () => MOCK_COLOR_FROM_SERVICE,
                        changePreviewColor: () => null,
                    },
                }, {
                    provide: ShortcutManagerService,
                    useValue: {
                        changeIsOnInput: (b: boolean) => null,
                    }
                }
            ],
        }).compileComponents();

        fixture = TestBed.createComponent(ColorNumericValuesComponent);
        component = fixture.componentInstance;

        shortCutManagerService = fixture.debugElement.injector.get(ShortcutManagerService);

        component.initializeForm();

        form = component.colorNumericValuesForm;
    }));

    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("by default RGB are 0 and A is 1", () => {
        expect(form.controls["R"].value).toEqual(0);
        expect(form.controls["G"].value).toEqual(0);
        expect(form.controls["B"].value).toEqual(0);
        expect(form.controls["A"].value).toEqual(1);
    });

    it("setColorNumericValues should call setHexValues before setRGBValues", () => {
        const spyOnSetHex = spyOn(component, "setHexValues").and.returnValue();
        const spyOnSetRGB = spyOn(component, "setRGBValues").and.returnValue();

        component.setColorNumericValues();

        expect(spyOnSetHex).toHaveBeenCalledBefore(spyOnSetRGB);
    });

    it(`when setHexValues with ${MOCK_COLOR} then this preview color is the first 6 char`, () => {
        component.previewColor = MOCK_COLOR;

        component.setHexValues();

        expect(form.controls["hex"].value).toEqual("012345");
    });

    it(`when setRGBValues with ${MOCK_COLOR} then R=01, G=23, B=45 A=0.2`, () => {
        component.previewColor = MOCK_COLOR;

        component.setRGBValues();

        expect(form.controls["R"].value).toEqual(1);
        expect(form.controls["G"].value).toEqual(35);
        expect(form.controls["B"].value).toEqual(69);
        expect(form.controls["A"].value).toEqual("0.4");
    });

    it("when onUserHexInput previewColor is colorNumericValuesForm.hex + opacity", () => {
        const hexColor = "112233";
        form.controls["hex"].setValue(hexColor);

        component.onUserHexInput();

        expect(component.previewColor).toEqual(hexColor + MOCK_OPACITY);
    });

    it(`when onUserColorRGBInput preview is ${MOCK_COLOR_FROM_SERVICE} (value provided from service)`, () => {
        spyOn(component, 'setColorNumericValues').and.returnValue();

        component.onUserColorRGBInput();

        expect(component.previewColor).toEqual(MOCK_COLOR_FROM_SERVICE);
    });

    it('when onFocus shortCutManagerService.changeIsOnInput is called with true', () => {
        const spy = spyOn(shortCutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocus();

        expect(spy).toHaveBeenCalledWith(true);
    });

    it('when onFocusOut shortCutManagerService.changeIsOnInput is called with false', () => {
        const spy = spyOn(shortCutManagerService, 'changeIsOnInput').and.returnValue();

        component.onFocusOut();

        expect(spy).toHaveBeenCalledWith(false);
    });
});
