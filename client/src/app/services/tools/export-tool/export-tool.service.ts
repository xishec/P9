import { Injectable, ElementRef } from '@angular/core';
import { FileType } from 'src/constants/tool-constants';
import { SVG_NS } from 'src/constants/constants';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    refSVG: ElementRef<SVGElement>;
    refAnchor: ElementRef<HTMLAnchorElement>;
    canvas: HTMLCanvasElement;

    initializeSVG(ref: ElementRef<SVGElement>): void {
        this.refSVG = ref;
    }

    initialize(refAnchor: ElementRef<HTMLAnchorElement>, refCanvas: ElementRef<HTMLCanvasElement>): void {
        this.refAnchor = refAnchor;
        this.canvas = refCanvas.nativeElement;
    }

    saveFile(fileType: FileType): void {
        this.resizeCanvas();
        switch (fileType) {
            case FileType.SVG:
                this.saveAsSVG();
                break;

            case FileType.BMP:
                this.saveAsBMP();
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

    resizeCanvas() {
        let svgSize = this.refSVG.nativeElement.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        this.canvas.height = svgSize.height;
    }
}
