import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { DrawingInfo } from '../../../../../../common/communication/DrawingInfo';
import { Message } from '../../../../../../common/communication/Message';

@Injectable({
    providedIn: 'root',
})
export class FileManagerService {
    constructor(private http: HttpClient) {}

    getAllDrawings(): Observable<Drawing[]> {
        return this.http
            .get<Drawing[]>(environment.BASE_URL + '/')
            .pipe(catchError(this.handleError<Drawing[]>('getAllDrawings')));
    }

    postDrawing(
        name: string,
        labels: string[],
        svg: string,
        idStack: string[],
        drawingInfo: DrawingInfo,
    ): Observable<Message> {
        const drawing: Drawing = { name, labels, svg, idStack, drawingInfo };
        const message: Message = { title: 'Add Drawing ' + name, body: JSON.stringify(drawing) };
        return this.http
            .post<Message>(environment.BASE_URL + '/api/file-manager/save', message)
            .pipe(catchError(this.handleError<Message>('postDrawing')));
    }

    deleteDrawing(name: string): Observable<Message[] | Message> {
        const message: Message = { title: 'Delete Drawing ' + name, body: name };
        return this.http
            .post<Message[]>(environment.BASE_URL + '/api/file-manager/delete', message)
            .pipe(catchError(this.handleError<Message>('deleteDrawing')));
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
