import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class FileManagerService {
    constructor(private http: HttpClient) {}

    getAllDrawings(): Observable<Drawing[]> {
        return this.http
            .get<Drawing[]>(environment.BASE_URL + '/api/file-manager/')
            .pipe(catchError(this.handleError<Drawing[]>('getAllDrawings')));
    }

    postDrawing(
        name: string,
        labels: string[],
        svg: string,
        idStack: string[],
        drawingInfo: DrawingInfo,
        createdOn: number,
        lastModified: number,
    ): Observable<Drawing> {
        const drawing: Drawing = { name, labels, svg, idStack, drawingInfo, createdOn, lastModified };
        return this.http
            .post<Drawing>(environment.BASE_URL + '/api/file-manager/save', drawing)
            .pipe(catchError(this.handleError<Drawing>('postDrawing')));
    }

    deleteDrawing(createdOn: number): Observable<number> {
        return this.http
            .delete<number>(environment.BASE_URL + `/api/file-manager/${createdOn.toString()}`)
            .pipe(catchError(this.handleError<number>('deleteDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
