import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ColorToolService } from 'src/app/services/tools/color-tool/color-tool.service';
import { ColorPaletteComponent } from './color-palette.component';

fdescribe('ColorPaletteComponent', () => {
    let component: ColorPaletteComponent;
    let fixture: ComponentFixture<ColorPaletteComponent>;
    let colorToolService: ColorToolService;

    // const testColor = '23fe45';

    beforeEach(async(() => {
      TestBed.configureTestingModule({
          declarations: [ColorPaletteComponent],
          schemas: [NO_ERRORS_SCHEMA],
          providers: [
              {
                  provide: ColorToolService,
                  useValue: {
                    changeColorOnFocus: () => null,
                    addColorToQueue: () => null,
                    changShowColorPalette: () => null,
                    changeSelectedColorType: () => null,
                  },
              },
          ],
      }).compileComponents();

      fixture = TestBed.createComponent(ColorPaletteComponent);
      component = fixture.componentInstance;

      colorToolService = fixture.debugElement.injector.get(ColorToolService);
  }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    // it('should update preview color when a color in queue is clicked', () => {
    //     component.onClickColorQueueButton(testColor);
    //     expect(component.previewColor).toEqual(testColor);
    // });

    it('should call Color Tool Service changeColorOnFocus function when submit button is pressed', () => {
      const SPY = spyOn(colorToolService, 'changeColorOnFocus');
      component.onSubmit();
      expect(SPY).toHaveBeenCalled();
    });

    // it('should call Color Tool Service addColorToQueue function when submit button is pressed', () => {
    //   const SPY = spyOn(colorToolService, 'addColorToQueue');
    //   component.onSubmit();
    //   expect(SPY).toHaveBeenCalled();
    // });

    // it('should call Color Tool Service changShowColorPalette function when submit button is pressed', () => {
    //   const SPY = spyOn(colorToolService, 'changeShowColorPalette');
    //   component.onSubmit();
    //   expect(SPY).toHaveBeenCalled();
    // });

    // it('should call Color Tool Service changeSelectedColorType function when submit button is pressed', () => {
    //   const SPY = spyOn(colorToolService, 'changeSelectedColorType');
    //   component.onSubmit();
    //   expect(SPY).toHaveBeenCalled();
    // });

    // it('should call Color Tool Service changShowColorPalette function when cancel button is pressed', () => {
    //   const SPY = spyOn(colorToolService, 'changeShowColorPalette');
    //   component.onCancel();
    //   expect(SPY).toHaveBeenCalled();
    // });

    // it('should call Color Tool Service changeSelectedColorType function when cancel button is pressed', () => {
    //   const SPY = spyOn(colorToolService, 'changeSelectedColorType');
    //   component.onCancel();
    //   expect(SPY).toHaveBeenCalled();
    // });
});
