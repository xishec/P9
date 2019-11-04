import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { FileType, MAX_BMP_SIZE } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    svg: ElementRef<SVGElement>;
    anchor: HTMLAnchorElement;
    canvas: HTMLCanvasElement;
    workzoneIsEmpty = true;
    renderer: Renderer2;
    img: HTMLImageElement;
    fileType: FileType;

    constructor(private drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService.drawingInfo.subscribe(() => {
            this.workzoneIsEmpty = false;
        });
        this.workzoneIsEmpty = true;
    }

    launchDownload(): void {
        this.renderer.setAttribute(this.anchor, 'download', 'untitled.' + this.fileType);
        this.anchor.click();
    }

    createSVGBlob(): Blob {
        this.renderer.setAttribute(this.svg, 'xmlns', SVG_NS);
        const data = new XMLSerializer().serializeToString(this.svg.nativeElement);
        return new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    }

    initializeService(ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.svg = ref;
        this.renderer = renderer;
        this.canvas = this.renderer.createElement('canvas');
        this.anchor = this.renderer.createElement('a');
        this.img = this.renderer.createElement('img');
    }

    saveFile(fileType: FileType): void {
        this.fileType = fileType;
        this.resizeCanvas();
        if (this.fileType === FileType.SVG) {
            this.saveAsSVG();
        } else {
            this.saveAsOther();
        }
    }

    saveAsSVG(): void {
        this.renderer.setAttribute(this.anchor, 'href', URL.createObjectURL(this.createSVGBlob()));
        this.launchDownload();
    }

    saveAsOther(): void {
        const originalSvgSize: ClientRect | DOMRect = this.svg.nativeElement.getBoundingClientRect();

        if (FileType.BMP === this.fileType) {
            this.compressSVG();
        }

        const url: string = URL.createObjectURL(this.createSVGBlob());
        this.img.onload = () => {
            let uri = this.setUri(url);
            this.launchDownload();
            URL.revokeObjectURL(uri);
        };

        this.renderer.setAttribute(this.img, 'src', url);
        if (FileType.BMP === this.fileType) {
            this.decompressSVG(originalSvgSize);
        }
    }

    resizeCanvas(): void {
        const svgSize = this.svg.nativeElement.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        this.canvas.height = svgSize.height;
    }

    compressSVG(): void {
        const svgSize = this.svg.nativeElement.getBoundingClientRect();
        this.renderer.setAttribute(this.svg, 'viewBox', `0,0,${svgSize.width},${svgSize.height}`);
        this.renderer.setAttribute(this.svg, 'width', `${MAX_BMP_SIZE}`);
        this.renderer.setAttribute(this.svg, 'height', `${MAX_BMP_SIZE}`);
        this.resizeCanvas();
    }

    decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.renderer.removeAttribute(this.svg, 'viewBox');
        this.renderer.setAttribute(this.svg, 'width', `${svgSize.width}`);
        this.renderer.setAttribute(this.svg, 'height', `${svgSize.height}`);
    }

    setUri(url: string): string {
        (this.canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(this.img, 0, 0);

        URL.revokeObjectURL(url);

        let uri: string;
        if (this.fileType !== FileType.BMP) {
            uri = this.canvas.toDataURL('image/' + this.fileType).replace('image/' + this.fileType, 'octet/stream');
        } else {
            uri = this.canvasToBMP.toDataURL(this.canvas);
        }
        this.renderer.setAttribute(this.anchor, 'href', uri);
        return uri;
    }
}
