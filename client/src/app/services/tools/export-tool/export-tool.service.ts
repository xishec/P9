import { Injectable, ElementRef, Renderer2 } from '@angular/core';
import { FileType } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';
import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    refSVG: ElementRef<SVGElement>;
    refAnchor: ElementRef<HTMLAnchorElement>;
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
        this.refSVG = ref;
        this.renderer = renderer;
    }

    initialize(refAnchor: ElementRef<HTMLAnchorElement>): void {
        this.refAnchor = refAnchor;
        this.canvas = this.renderer.createElement('canvas');
    }

    saveFile(fileType: FileType): void {
        const originalSvgSize = this.refSVG.nativeElement.getBoundingClientRect();
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
        this.refAnchor.nativeElement.href = URL.createObjectURL(this.getSVGBlob());
        this.launchDownload(FileType.SVG);
    }

    saveAsPNG(): void {
        let context = this.canvas.getContext('2d');
        let img = new Image();
        let url = URL.createObjectURL(this.getSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let uri = this.canvas.toDataURL('image/png').replace('image/png', 'octet/stream');
            this.refAnchor.nativeElement.href = uri;
            this.launchDownload(FileType.PNG);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    saveAsJPG(): void {
        let context = this.canvas.getContext('2d');
        let img = new Image();
        let url = URL.createObjectURL(this.getSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let uri = this.canvas.toDataURL('image/jpeg').replace('image/jpeg', 'octet/stream');
            this.refAnchor.nativeElement.href = uri;
            this.launchDownload(FileType.JPG);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    saveAsBMP(): void {
        let context: CanvasRenderingContext2D | null = this.canvas.getContext('2d');
        let img: HTMLImageElement = new Image();
        let url = URL.createObjectURL(this.getSVGBlob());
        img.onload = () => {
            if (context !== null) {
                context.drawImage(img, 0, 0);
            }

            URL.revokeObjectURL(url);
            let canvasToBMP = new CanvasToBMP();
            let uri = canvasToBMP.toDataURL(this.canvas);
            this.refAnchor.nativeElement.href = uri;
            this.launchDownload(FileType.BMP);

            URL.revokeObjectURL(uri);
        };
        img.src = url;
    }

    launchDownload(fileType: FileType): void {
        this.refAnchor.nativeElement.download = 'untitled.' + fileType;
        this.refAnchor.nativeElement.click();
    }

    getSVGBlob(): Blob {
        this.refSVG.nativeElement.setAttribute('xmlns', SVG_NS);
        let data = new XMLSerializer().serializeToString(this.refSVG.nativeElement);
        return new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    }

    resizeCanvas(): void {
        const svgSize = this.refSVG.nativeElement.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        console.log('width : ' + this.canvas.width);
        this.canvas.height = svgSize.height;
        console.log('height : ' + this.canvas.height);
    }

    compressSVG(): void {
        const svgSize = this.refSVG.nativeElement.getBoundingClientRect();
        this.refSVG.nativeElement.setAttribute('viewBox', `0,0,${svgSize.width},${svgSize.height}`);
        this.refSVG.nativeElement.setAttribute('width', '620');
        this.refSVG.nativeElement.setAttribute('height', '620');

        this.resizeCanvas();
    }

    decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.refSVG.nativeElement.removeAttribute('viewbox');
        this.refSVG.nativeElement.setAttribute('width', `${svgSize.width}`);
        this.refSVG.nativeElement.setAttribute('height', `${svgSize.height}`);
    }
}
