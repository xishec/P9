import { ElementRef, Renderer2, Type } from '@angular/core';
import { getTestBed, TestBed } from '@angular/core/testing';

import { FILE_TYPE, HTML_ATTRIBUTE } from 'src/constants/tool-constants';
import { ExportToolService } from './export-tool.service';

describe('ExportToolService', () => {
    let injector: TestBed;
    let service: ExportToolService;

    let spyCreateSVGBlob: jasmine.Spy;
    let spyLaunchDownload: jasmine.Spy;
    let spyGetXMLSVG: jasmine.Spy;

    const FAKE_URL = 'http://localhost:4200/';

    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ExportToolService,
                {
                    provide: Renderer2,
                    useValue: {
                        createElement: (elem: string) => {
                            if (elem === HTML_ATTRIBUTE.Canvas) {
                                const mockCanvas = {
                                    getContext: (dimention: string) => {
                                        const mockContext = {
                                            drawImage: (img: CanvasImageSource, dx: number, dy: number) => {
                                                null; // tslint:disable-line
                                            },
                                            getImageData: (x: number, y: number, sw: number, sh: number) => {
                                                const mockImageData = {};
                                                return (mockImageData as unknown) as ImageData;
                                            },
                                        };
                                        return (mockContext as unknown) as CanvasRenderingContext2D;
                                    },
                                    toDataURL: () => {
                                        return 'newuri';
                                    },
                                };
                                return (mockCanvas as unknown) as HTMLCanvasElement;
                            } else if (elem === HTML_ATTRIBUTE.Img) {
                                const mockImg = {};
                                return mockImg as HTMLImageElement;
                            } else {
                                const mockAnchor = {
                                    click: () => null,
                                };
                                return (mockAnchor as unknown) as HTMLAnchorElement;
                            }
                        },
                        setAttribute: () => null,
                        appendChild: () => null,
                        removeChild: () => null,
                        setProperty: () => null,
                        removeAttribute: () => null,
                    },
                },
                {
                    provide: ElementRef,
                    useValue: {
                        nativeElement: {
                            getBoundingClientRect: () => {
                                const boundleft = 0;
                                const boundtop = 0;
                                const boundRect = {
                                    left: boundleft,
                                    top: boundtop,
                                };
                                return boundRect;
                            },
                        },
                    },
                },
                {
                    provide: CanvasRenderingContext2D,
                    useValue: {
                        drawImage: () => {
                            const mockDrawImage = {};
                            return (mockDrawImage as unknown) as CanvasDrawImage;
                        },
                    },
                },
            ],
        });
        injector = getTestBed();
        service = injector.get(ExportToolService);

        const rendererMock = injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
        const elementRefMock = injector.get<ElementRef>(ElementRef as Type<ElementRef>);
        service.initializeService(elementRefMock, rendererMock);

        spyCreateSVGBlob = spyOn<any>(service, 'createSVGBlob').and.callThrough();
        spyLaunchDownload = spyOn<any>(service, 'launchDownload').and.callThrough();
        spyGetXMLSVG = spyOn<any>(service, 'getXMLSVG').and.returnValue('');
        jasmine.clock().install();
    });

    afterEach(() => {
        jasmine.clock().uninstall();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    it('should launch download as svg if filetype is svg', () => {
        const spySaveAsSVG = spyOn<any>(service, 'saveAsSVG').and.callThrough();
        const filename = 'test';

        service.saveFile(FILE_TYPE.SVG, filename);

        expect(service[`fileType`]).toEqual(FILE_TYPE.SVG);
        expect(spyLaunchDownload).toHaveBeenCalled();
        expect(spySaveAsSVG).toHaveBeenCalled();
        expect(spyGetXMLSVG).toHaveBeenCalled();
    });

    it('should launch download as bmp if filetype is bmp and do the compression/decompression of svg', () => {
        const spyOnCompressSVG = spyOn<any>(service, 'compressSVG').and.callThrough();
        const spyOnDecompressSVG = spyOn<any>(service, 'decompressSVG').and.callThrough();
        const spySaveAsOther = spyOn<any>(service, 'saveAsOther').and.callThrough();
        const filename = 'test';

        service.saveFile(FILE_TYPE.BMP, filename);
        jasmine.clock().tick(1);

        expect(service[`fileType`]).toEqual(FILE_TYPE.BMP);
        expect(spySaveAsOther).toHaveBeenCalled();
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spyOnCompressSVG).toHaveBeenCalled();
        expect(spyOnDecompressSVG).toHaveBeenCalled();
    });

    it('should launch download as jpeg if filetype is jpeg', () => {
        const spySaveAsOther = spyOn<any>(service, 'saveAsOther').and.callThrough();
        const filename = 'test';

        service.saveFile(FILE_TYPE.JPG, filename);

        expect(service[`fileType`]).toEqual(FILE_TYPE.JPG);
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spySaveAsOther).toHaveBeenCalled();
    });

    it('should launch download as png if filetype is png', () => {
        const spySaveAsOther = spyOn<any>(service, 'saveAsOther').and.callThrough();
        const filename = 'test';

        service.saveFile(FILE_TYPE.PNG, filename);

        expect(service[`fileType`]).toEqual(FILE_TYPE.PNG);
        expect(spyCreateSVGBlob).toHaveBeenCalled();
        expect(spySaveAsOther).toHaveBeenCalled();
    });

    it('shoud call toDataURL from canvas is filetype is JPEG or PNG', () => {
        const spy = spyOn(service[`canvas`], 'toDataURL').and.returnValue('');

        service[`fileType`] = FILE_TYPE.PNG;
        service[`setUri`](FAKE_URL);
        service[`fileType`] = FILE_TYPE.JPG;
        service[`setUri`](FAKE_URL);

        expect(spy).toHaveBeenCalledTimes(2);
    });

    it('should call toDataURL from CanvasToBMP if filetype is BMP', () => {
        const filename = 'test';
        service.saveFile(FILE_TYPE.BMP, filename);
        const spy = spyOn(service[`canvasToBMP`], 'toDataURL').and.returnValue('');

        service[`setUri`](FAKE_URL);

        expect(spy).toHaveBeenCalled();
    });
});
