import { ElementRef, Injectable, Renderer2 } from '@angular/core';

import { CanvasToBMP } from 'src/classes/CanvasToBMP';
import { SVG_NS } from 'src/constants/constants';
import { FILE_TYPE, HTML_ATTRIBUTE, MAX_BMP_SIZE } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    private svg: SVGElement;
    private anchor: HTMLAnchorElement;
    private canvas: HTMLCanvasElement;
    private renderer: Renderer2;
    private img: HTMLImageElement;
    private fileType: FILE_TYPE;
    private canvasToBMP: CanvasToBMP;

    private launchDownload(): void {
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.download, 'untitled.' + this.fileType);
        this.anchor.click();
    }

    private getXMLSVG(): string {
        return new XMLSerializer().serializeToString(this.svg);
    }

    private createSVGBlob(): Blob {
        this.renderer.setAttribute(this.svg, 'xmlns', SVG_NS);
        return new Blob([this.getXMLSVG()], { type: 'image/svg+xml;charset=utf-8' });
    }

    initializeService(ref: ElementRef<SVGElement>, renderer: Renderer2): void {
        this.svg = ref.nativeElement;
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

    private saveAsSVG(): void {
        const uri = 'data:image/svg+xml,' + encodeURIComponent(this.getXMLSVG());
        this.renderer.setAttribute(this.anchor, HTML_ATTRIBUTE.href, uri);
        this.launchDownload();
    }

    private saveAsOther(): void {
        const originalSvgSize: ClientRect | DOMRect = this.svg.getBoundingClientRect();

        if (FILE_TYPE.BMP === this.fileType) {
            setTimeout(() => {
                this.compressSVG();
            }, 0);
        }

        const url: string = URL.createObjectURL(this.createSVGBlob());
        this.img.onload = () => {
            const uri = this.setUri(url);
            this.launchDownload();
            URL.revokeObjectURL(uri);
        };

        this.renderer.setAttribute(this.img, HTML_ATTRIBUTE.src, url);
        if (FILE_TYPE.BMP === this.fileType) {
            setTimeout(() => {
                this.decompressSVG(originalSvgSize);
            }, 0);
        }
    }

    private resizeCanvas(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.canvas.width = svgSize.width;
        this.canvas.height = svgSize.height;
    }

    private compressSVG(): void {
        const svgSize = this.svg.getBoundingClientRect();
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.viewBox, `0,0,${svgSize.width},${svgSize.height}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.width, `${MAX_BMP_SIZE}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.height, `${MAX_BMP_SIZE}`);
        this.resizeCanvas();
    }

    private decompressSVG(svgSize: ClientRect | DOMRect): void {
        this.renderer.removeAttribute(this.svg, HTML_ATTRIBUTE.viewBox);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.width, `${svgSize.width}`);
        this.renderer.setAttribute(this.svg, HTML_ATTRIBUTE.height, `${svgSize.height}`);
    }

    private setUri(url: string): string {
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
