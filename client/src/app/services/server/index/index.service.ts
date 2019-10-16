import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/message';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root',
})
export class IndexService {
    constructor(private http: HttpClient) {}

    basicGet(): Observable<Message> {
        return this.http
            .get<Message>(environment.BASE_URL + '/api/index')
            .pipe(catchError(this.handleError<Message>('basicGet')));
    }

    getDrawing(name: string): Observable<Message> {
        let message: Message = { title: 'Send Drawing Name ', body: 'Add Drawing ' + name };
        return this.http.post<Message>(environment.BASE_URL + '/file-manager/open', message);
    }

    postDrawing(name: string, svg: string, idStack: string[]) {
        let drawing: Drawing = { name: name, svg: svg, idStack: [...idStack] };
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
