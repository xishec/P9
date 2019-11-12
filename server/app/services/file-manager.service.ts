import { injectable } from 'inversify';
import 'reflect-metadata';
import { Drawing } from '../model/post';
import { IDrawing } from '../../../common/communication/Drawing';

@injectable()
export class FileManagerService {
    async getAllDrawings(): Promise<IDrawing[]> {
        return Drawing.find()
            .then((drawings: any) => {
              return drawings;
            })
            .catch((error: Error) => {
                throw Error;
            });
    }


    deleteDrawing(): void {
      
    }

}
