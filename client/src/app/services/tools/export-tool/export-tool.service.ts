import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { FileType } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    svg: SVGElement;
    anchor: HTMLAnchorElement;
    canvas: HTMLCanvasElement;
    workzoneIsEmpty = true;
    renderer: Renderer2;

    constructor(private drawingModalWindowService: DrawingModalWindowService) {
        this.drawingModalWindowService.drawingInfo.subscribe(() => {
            this.workzoneIsEmpty = false;
        });
        this.workzoneIsEmpty = true;
    }

    initializeService(ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.svg = ref.nativeElement;
        this.renderer = renderer;
        this.canvas = this.renderer.createElement('canvas');
        this.anchor = this.renderer.createElement('a');
    }

    saveFile(fileType: FileType): void {
        const originalSvgSize = this.svg.getBoundingClientRect();
        this.resizeCanvas();
        switch (fileType) {
            case FileType.SVG:
                this.saveAsSVG();
                break;

            case FileType.BMP:
                this.compressSVG();
                this.saveAsBMP();
                this.decompressSVG(originalSvgSize);
                break;

            case FileType.JPG:
                this.saveAsJPG();
                break;

            case FileType.PNG:
                this.saveAsPNG();
                break;
        }
    }

    saveAsSVG(): void {
        this.renderer.setAttribute(this.anchor, 'href', URL.createObjectURL(this.createSVGBlob()));
        this.launchDownload(FileType.SVG);
    }

    saveAsPNG(): void {
        let context = this.canvas.getContext('2d');
        let img = new Image();
        let url = URL.createObjectURL(this.createSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let uri = this.canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            this.renderer.setAttribute(this.anchor, 'href', uri);
            this.launchDownload(FileType.PNG);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    saveAsJPG(): void {
        let context = this.canvas.getContext('2d');
        let img = new Image();
        let url = URL.createObjectURL(this.createSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let uri = this.canvas.toDataURL('image/jpeg').replace('image/jpeg', 'octet/stream');
            this.renderer.setAttribute(this.anchor, 'href', uri);
            this.launchDownload(FileType.JPG);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    saveAsBMP(): void {
        let context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        let img: HTMLImageElement = new Image();
        let url = URL.createObjectURL(this.createSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let canvasToBMP = new CanvasToBMP();
            let uri = canvasToBMP.toDataURL(this.canvas);
            this.renderer.setAttribute(this.anchor, 'href', uri);
            this.launchDownload(FileType.BMP);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    launchDownload(fileType: FileType): void {
        this.renderer.setAttribute(this.anchor, 'download', 'untitled.' + fileType);
        this.anchor.click();
    }

    createSVGBlob(): Blob {
        this.renderer.setAttribute(this.svg, 'xmlns', SVG_NS);
        const data = new XMLSerializer().serializeToString(this.svg);
        return new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    }

    resizeCanvas(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        this.canvas.height = svgSize.height;
    }

    compressSVG(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.renderer.setAttribute(this.svg, 'viewBox', `0,0,${svgSize.width},${svgSize.height}`);
        this.renderer.setAttribute(this.svg, 'width', '620');
        this.renderer.setAttribute(this.svg, 'height', '620');

        this.resizeCanvas();
    }

    decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.renderer.removeAttribute(this.svg, 'viewBox');
        this.renderer.setAttribute(this.svg, 'width', `${svgSize.width}`);
        this.renderer.setAttribute(this.svg, 'height', `${svgSize.height}`);
    }
}
