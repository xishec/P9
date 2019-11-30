import * as admin from 'firebase-admin';
import { injectable } from 'inversify';
import 'reflect-metadata';

@injectable()
export class CloudService {
    initialize(): void {
        try {
            // tslint:disable-next-line: no-require-imports
            const serviceAccount = require('../../P9-cloud-230ae8edfba8.json');
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount as admin.ServiceAccount),
                storageBucket: 'p9-cloud.appspot.com',
            });
            console.log('Connected to Cloud Storage!');
        } catch (e) {
            if (e instanceof Error && e.message === 'Cannot find module \'../../P9-cloud-230ae8edfba8.json\'') {
                console.log('Can\'t find serviceAccount!');
            } else {
                throw e;
            }
        }
    }

    save(srcFilename: string, content: string): void {
        if (admin.apps.length) {
            const bucket = admin.storage().bucket();
            bucket.file(srcFilename).save(content);
        }
    }

    download(srcFilename: string): Promise<[Buffer]> {
        if (admin.apps.length) {
            const bucket = admin.storage().bucket();
            return bucket.file(srcFilename).download();
        }
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve([Buffer.from('', 'utf8')]);
            }, 10);
        });
    }
}
