import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorApplicatorToolService } from 'src/app/services/tools/color-applicator-tool/color-applicator-tool.service';
import { ToolSelectorService } from 'src/app/services/tools/tool-selector/tool-selector.service';
import { ColorApplicatorAttributesComponent } from './color-applicator-attributes.component';

describe('ColorApplicatorAttributesComponent', () => {
    let component: ColorApplicatorAttributesComponent;
    let fixture: ComponentFixture<ColorApplicatorAttributesComponent>;
    let toolSelectorService: ToolSelectorService;
    let colorApplicatorToolService: ColorApplicatorToolService;

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
        })
            .overrideComponent(ColorApplicatorAttributesComponent, {
                set: {
                    providers: [
                        {
                            provide: ColorApplicatorToolService,
                            useValue: {
                                initializeColorToolService: () => null,
                            },
                        },
                    ],
                },
            })
            .compileComponents();

        fixture = TestBed.createComponent(ColorApplicatorAttributesComponent);
        component = fixture.componentInstance;
        toolSelectorService = fixture.debugElement.injector.get<ToolSelectorService>(ToolSelectorService);
        colorApplicatorToolService = fixture.debugElement.injector.get<ColorApplicatorToolService>(
            ColorApplicatorToolService,
        );
    }));

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    it('shoud return colorApplicatorToolService when ngAfterViewInit', () => {
        const SPY1 = spyOn(toolSelectorService, 'getColorApplicatorTool').and.returnValue(colorApplicatorToolService);
        component.ngAfterViewInit();
        expect(SPY1).toHaveBeenCalled();
    });
});
