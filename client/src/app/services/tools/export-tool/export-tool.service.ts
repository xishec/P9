import { Injectable, ElementRef } from '@angular/core';
import { FileType } from 'src/constants/tool-constants';

@Injectable({
    providedIn: 'root',
})
export class ExportToolService {
    private refSVG: ElementRef<SVGElement>;

    initializeSVG(ref: ElementRef<SVGElement>) {
        this.refSVG = ref;
    }

    saveFile(fileType: FileType) {
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

        let downloadLink = document.createElement('a');
        downloadLink.href = svgUrl;
        downloadLink.download = 'untitled.svg';
        document.body.appendChild(downloadLink);
        downloadLink.click();
        document.body.removeChild(downloadLink);
    }

    saveAsPNG() {
        console.log('PNG');
    }

    saveAsJPG() {
        console.log('JPG');
    }

    saveAsBMP() {
        console.log('BMP');
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

}
