import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorApplicatorAttributesComponent } from './color-applicator-attributes.component';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';

fdescribe('ColorApplicatorAttributesComponent', () => {
    let component: ColorApplicatorAttributesComponent;
    let fixture: ComponentFixture<ColorApplicatorAttributesComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [ColorApplicatorAttributesComponent],
            providers: [
                ColorApplicatorAttributesComponent,
                {
                    provide: ToolSelectorService,
                    useValue: {
                        getColorApplicatorTool: () => null,
                    },
                },
            ],
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(ColorApplicatorAttributesComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shoud call ngAfterViewInit', () => {
        const SPY1 = spyOn(component[`toolSelectorService`], 'getColorApplicatorTool');
        const SPY2 = spyOn(component.colorApplicatorToolService, 'initializeColorToolService');
        component.ngAfterViewInit();
        expect(SPY1).toHaveBeenCalled;
        expect(SPY2).toHaveBeenCalled;
    });
});
