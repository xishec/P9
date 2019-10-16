import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { catchError } from 'rxjs/operators';

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

    private handleError<T>(request: string, result?: T): (error: Error) => Observable<T> {
        return (error: Error): Observable<T> => {
            return of(result as T);
        };
    }
}
