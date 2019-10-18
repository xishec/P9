import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { catchError } from 'rxjs/operators';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/message';
import { DrawingInfo } from 'src/classes/DrawingInfo';

@Injectable({
    providedIn: 'root',
})
export class FileManagerService {
    constructor(private http: HttpClient) {}

    getAllDrawing(): Observable<Message[] | Message> {
        return this.http
            .get<Message[]>(environment.BASE_URL + '/api/file-manager/get-all-drawing')
            .pipe(catchError(this.handleError<Message>('getAllDrawing')));
    }

    postDrawing(name: string, labels: string[], svg: string, idStack: string[], drawingInfo: DrawingInfo): void {
        let drawing: Drawing = { name: name, labels: labels, svg: svg, idStack: idStack, drawingInfo: drawingInfo };
        let message: Message = { title: 'Add Drawing ' + name, body: JSON.stringify(drawing) };
        this.http.post<Message>(environment.BASE_URL + '/api/file-manager/save', message).subscribe((responseData) => {
            // console.log(responseData);
        });
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
