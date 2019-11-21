import { ElementRef, Injectable, Renderer2 } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';

import { NameAndLabels } from 'src/classes/NameAndLabels';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { Message } from '../../../../../../common/communication/Message';
import { DrawStackService } from '../../draw-stack/draw-stack.service';
import { DrawingModalWindowService } from '../../drawing-modal-window/drawing-modal-window.service';
import { DrawingLoaderService } from '../drawing-loader/drawing-loader.service';
import { FileManagerService } from '../file-manager/file-manager.service';

// *********** Firebase ***************
import * as firebase from 'firebase/app';
import 'firebase/storage';
import { SVG_NS } from 'src/constants/constants';
// ************************************

@Injectable({
    providedIn: 'root',
})
export class DrawingSaverService {
    currentIsSaved: BehaviorSubject<boolean | undefined> = new BehaviorSubject(undefined);
    currentErrorMesaage: BehaviorSubject<string> = new BehaviorSubject('');

    workZoneRef: ElementRef<SVGElement>;
    currentDrawingInfo: DrawingInfo;
    drawStackService: DrawStackService;
    renderer: Renderer2;

    constructor(
        private drawingModalWindowService: DrawingModalWindowService,
        private drawingLoaderService: DrawingLoaderService,
        private fileManagerService: FileManagerService,
        private sanitizer: DomSanitizer,
    ) {}

    initializeDrawingSaverService(
        ref: ElementRef<SVGElement>,
        drawStackService: DrawStackService,
        renderer: Renderer2,
    ) {
        this.workZoneRef = ref;
        this.drawStackService = drawStackService;
        this.drawingModalWindowService.drawingInfo.subscribe((drawingInfo) => {
            this.currentDrawingInfo = drawingInfo;
        });
        this.renderer = renderer;
    }

    getLocalFileDownloadUrl(): SafeResourceUrl {
        const jsonObj: string = JSON.stringify({
            svg: this.workZoneRef.nativeElement.innerHTML,
            idStack: this.drawStackService.idStack,
            drawingInfo: this.currentDrawingInfo,
        });
        const blob = new Blob([jsonObj], { type: 'text/plain' });
        return this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob));
    }

    sendFileToServer(nameAndLabels: NameAndLabels): void {
        if (this.drawingLoaderService.emptyDrawStack.value) {
            this.currentIsSaved.next(false);
            this.currentErrorMesaage.next('Aucun dessin dans le zone de travail!');
        } else if (nameAndLabels.name.length > 0) {
            this.postDrawing(nameAndLabels);
            this.saveFirebase();
        }
    }

    saveFirebase() {
        // Your web app's Firebase configuration
        let firebaseConfig = {
            apiKey: 'AIzaSyDLUNTqEdILpLnw-SruhmkglA2x0t8e-bk',
            authDomain: 'p9-cloud.firebaseapp.com',
            databaseURL: 'https://p9-cloud.firebaseio.com',
            projectId: 'p9-cloud',
            storageBucket: 'p9-cloud.appspot.com',
            messagingSenderId: '258132417445',
            appId: '1:258132417445:web:cc70534b51e946e786e64c',
            measurementId: 'G-969V4CLRGR',
        };
        // Initialize Firebase
        firebase.initializeApp(firebaseConfig);

        // Get a reference to the storage service, which is used to create references in your storage bucket
        let storage = firebase.storage();

        // let pathReference = storage.ref('Hx_logo_lightRed.png');
        // pathReference
        //     .getDownloadURL()
        //     .then(function(url) {
        //         console.log(url);
        //     })
        //     .catch(function(error) {
        //         // Handle any errors
        //     });

        var kevinRef = storage.ref('kevin.svg');

        let clone = this.workZoneRef.nativeElement.cloneNode(true);
        this.renderer.setAttribute(clone, 'xmlns', SVG_NS);
        let file = new Blob([this.getXMLSVG(clone)], { type: 'image/svg+xml;charset=utf-8' });

        kevinRef.put(file).then((snapshot) => {
            console.log('Uploaded a blob or file!');
        });
    }

    getXMLSVG(clone: any): string {
        return new XMLSerializer().serializeToString(clone);
    }

    postDrawing(nameAndLabels: NameAndLabels) {
        this.fileManagerService
            .postDrawing(
                nameAndLabels.name,
                nameAndLabels.drawingLabels,
                this.workZoneRef.nativeElement.innerHTML,
                this.drawStackService.idStack,
                this.currentDrawingInfo,
            )
            .pipe(
                filter((subject) => {
                    if (subject !== undefined) {
                        return true;
                    }
                    this.currentErrorMesaage.next(
                        "Erreur de sauvegarde du côté serveur! Le serveur n'est peut-être pas ouvert.",
                    );
                    this.currentIsSaved.next(false);
                    return false;
                }),
            )
            .subscribe((message: Message) => {
                if (message.body || JSON.parse(message.body).name === nameAndLabels.name) {
                    this.currentIsSaved.next(true);
                } else {
                    this.currentErrorMesaage.next('Erreur de sauvegarde du côté serveur!');
                    this.currentIsSaved.next(false);
                }
            });
    }
}
