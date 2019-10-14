import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Drawing } from '../../../../../common/communication/Drawing';
import { Message } from '../../../../../common/communication/message';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    private readonly BASE_URL: string = 'http://localhost:3000/api/index';

    constructor(private http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http.get<Message>(this.BASE_URL).pipe(catchError(this.handleError<Message>('basicGet')));
    }

    getDrawing() {
        return this.http
            .get<Message>('http://localhost:3000/api/file-manager/open')
            .pipe(catchError(this.handleError<Message>('getDrawing')));
    }

    postDrawing(name: string, svg: string) {
        let drawing: Drawing = { name: name, svg: svg };
        let message: Message = { title: 'Add Drawing ' + name, body: JSON.stringify(drawing) };
        this.http.post<Message>('http://localhost:3000/api/file-manager/save', message).subscribe((responseData) => {
            console.log(responseData);
        });
    }

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
