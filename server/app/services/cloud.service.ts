import { injectable } from 'inversify';
import 'reflect-metadata';
import * as admin from 'firebase-admin';

import * as serviceAccount from '../../P9-cloud-230ae8edfba8.json';

@injectable()
export class CloudService {
    initialize(): void {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: 'p9-cloud.appspot.com',
        });
        console.log('init cloud');
    }

    save(srcFilename: string, content: string) {
        let bucket = admin.storage().bucket();
        bucket.file(srcFilename).save(content, function(err: any) {
            if (!err) {
                console.log('yes!');
            }
        });
    }

    download(srcFilename: string): Promise<[Buffer]> {
        let bucket = admin.storage().bucket();
        return bucket.file(srcFilename).download();
    }
}
