import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import 'firebase/storage';

@Injectable({
    providedIn: 'root',
})
export class CloudService {
    storage: firebase.storage.Storage;

    initializeApp() {
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
        firebase.initializeApp(firebaseConfig);
        this.storage = firebase.storage();
    }

    save(name: string, file: Blob) {
        var storageRef = this.storage.ref(name);

        // let clone = this.workZoneRef.nativeElement.cloneNode(true);
        // this.renderer.setAttribute(clone, 'xmlns', SVG_NS);
        // let file = new Blob([this.getXMLSVG(clone)], { type: 'image/svg+xml;charset=utf-8' });

        storageRef
            .put(file)
            .then(() => {
                console.log('Uploaded a blob or file!');
            })
            .catch((e: Error) => {
                console.log(e);
            });
    }

    download(): Promise<string> {
        let pathReference = this.storage.ref('Hx_logo_lightRed.png');
        return pathReference.getDownloadURL();
    }
}
