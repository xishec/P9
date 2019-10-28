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

    saveAsSVG() {
        this.refSVG.nativeElement.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
        let preface = '<?xml version="1.0" standalone="no"?>\r\n';
        let svgBlob = new Blob([preface, this.refSVG.nativeElement.outerHTML], { type: 'image/svg+xml;charset=utf-8' });
        let svgUrl = URL.createObjectURL(svgBlob);
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
}
