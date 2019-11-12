import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { SVG_NS } from 'src/constants/constants';
import { FILE_TYPE, HTML_ATTRIBUTE, MAX_BMP_SIZE } from 'src/constants/tool-constants';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    svg: ElementRef<SVGElement>;
    anchor: HTMLAnchorElement;
    canvas: HTMLCanvasElement;
    renderer: Renderer2;
    img: HTMLImageElement;
    fileType: FILE_TYPE;
    canvasToBMP: CanvasToBMP;

    launchDownload(): void {
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.download, 'untitled.' + this.fileType);
        this.anchor.click();
    }

    createSVGBlob(): Blob {
        this.renderer.setAttribute(this.svg.nativeElement, 'xmlns', SVG_NS);
        const data = new XMLSerializer().serializeToString(this.svg.nativeElement);
        return new Blob([data], { type: 'image/svg+xml;charset=utf-8' });
    }

    initializeService(ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.svg = ref;
        this.renderer = renderer;
        this.canvas = this.renderer.createElement(HTML_ATTRIBUTE.canvas);
        this.anchor = this.renderer.createElement(HTML_ATTRIBUTE.a);
        this.img = this.renderer.createElement(HTML_ATTRIBUTE.img);
    }

    saveFile(fileType: FILE_TYPE): void {
        this.fileType = fileType;
        this.resizeCanvas();
        this.canvasToBMP = new CanvasToBMP();
        if (this.fileType === FILE_TYPE.SVG) {
            this.saveAsSVG();
        } else {
            this.saveAsOther();
        }
    }

    saveAsSVG(): void {
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.href, URL.createObjectURL(this.createSVGBlob()));
        this.launchDownload();
    }

    saveAsOther(): void {
        const originalSvgSize: ClientRect | DOMRect = this.svg.nativeElement.getBoundingClientRect();

        if (FILE_TYPE.BMP === this.fileType) {
            this.compressSVG();
        }

        const url: string = URL.createObjectURL(this.createSVGBlob());
        this.img.onload = () => {
            const uri = this.setUri(url);
            this.launchDownload();
            URL.revokeObjectURL(uri);
        };

        this.renderer.setAttribute(this.img, HTML_ATTRIBUTE.src, url);
        if (FILE_TYPE.BMP === this.fileType) {
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
        this.renderer.setAttribute(
            this.svg.nativeElement,
            HTML_ATTRIBUTE.viewBox,
            `0,0,${svgSize.width},${svgSize.height}`,
        );
        this.renderer.setAttribute(this.svg.nativeElement, HTML_ATTRIBUTE.width, `${MAX_BMP_SIZE}`);
        this.renderer.setAttribute(this.svg.nativeElement, HTML_ATTRIBUTE.height, `${MAX_BMP_SIZE}`);
        this.resizeCanvas();
    }

    decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.renderer.removeAttribute(this.svg.nativeElement, HTML_ATTRIBUTE.viewBox);
        this.renderer.setAttribute(this.svg.nativeElement, HTML_ATTRIBUTE.width, `${svgSize.width}`);
        this.renderer.setAttribute(this.svg.nativeElement, HTML_ATTRIBUTE.height, `${svgSize.height}`);
    }

    setUri(url: string): string {
        (this.canvas.getContext('2d') as CanvasRenderingContext2D).drawImage(this.img, 0, 0);

        URL.revokeObjectURL(url);

        let uri: string;
        if (this.fileType !== FILE_TYPE.BMP) {
            uri = this.canvas.toDataURL('image/' + this.fileType).replace('image/' + this.fileType, 'octet/stream');
        } else {
            uri = this.canvasToBMP.toDataURL(this.canvas);
        }
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.href, uri);
        return uri;
    }
}
