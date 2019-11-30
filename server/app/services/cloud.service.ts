import * as admin from 'firebase-admin';
import { injectable } from 'inversify';
import 'reflect-metadata';

import * as serviceAccount from '../../P9-cloud-230ae8edfba8.json';

@injectable()
export class CloudService {
    initialize(): void {
        admin.initializeApp({
            credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
            storageBucket: 'p9-cloud.appspot.com',
        });
    }

    save(srcFilename: string, content: string): void {
        const bucket = admin.storage().bucket();
        bucket.file(srcFilename).save(content);
    }

    download(srcFilename: string): Promise<[Buffer]> {
        const bucket = admin.storage().bucket();
        return bucket.file(srcFilename).download();
    }
}
