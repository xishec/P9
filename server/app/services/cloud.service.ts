import { injectable } from 'inversify';
import 'reflect-metadata';
import * as admin from 'firebase-admin';

import * as serviceAccount from '../../P9-cloud-230ae8edfba8.json';
import { Bucket } from '@google-cloud/storage';

@injectable()
export class CloudService {
    bucket: Bucket;

    initialize() {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: 'p9-cloud.appspot.com',
        });
        this.bucket = admin.storage().bucket();
    }

    save(srcFilename: string, content: string) {
        const file = this.bucket.file(srcFilename);
        file.save(content, function(err: any) {
            if (!err) {
                console.log('yes!');
            }
        });
    }

    download(srcFilename: string) {
        this.bucket
            .file(srcFilename)
            .download()
            .then((data: any) => {
                const contents = data[0];
                console.log((contents as Buffer).toString());
            });
    }
}
