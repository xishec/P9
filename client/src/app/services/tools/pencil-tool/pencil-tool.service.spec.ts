import { TestBed, getTestBed } from "@angular/core/testing";

import { PencilToolService } from "./pencil-tool.service";
import { Renderer2, ElementRef } from '@angular/core';
import { DrawStackService } from '../../draw-stack/draw-stack.service';

fdescribe("PencilToolService", () => {
    let injector: TestBed;
    let service: PencilToolService;
    //let rendererMock: Renderer2;
    beforeEach(() =>  {
        TestBed.configureTestingModule({
            providers: [PencilToolService,
            {
                provide: Renderer2,
                useValue: {

                },
            }, {
                provide: ElementRef,
                useValue: {
                    nativeElement : {},
                }, 
            }, {
                provide: DrawStackService,
                useValue: {

                }
            }],
        });

        injector = getTestBed();
        service = injector.get(PencilToolService);
    });

    it("should be created", () => {
        expect(service).toBeTruthy();
    });
});
