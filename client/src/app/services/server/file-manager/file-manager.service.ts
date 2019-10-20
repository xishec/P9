import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

import { Drawing } from '../../../../../../common/communication/Drawing';
import { Message } from '../../../../../../common/communication/message';

@Injectable({
    providedIn: 'root',
})
export class FileManagerService {
    constructor(private http: HttpClient) {}

    getDrawing(name: string): Observable<Message> {
        let message: Message = { title: 'Send Drawing Name ', body: 'Add Drawing ' + name };
        return this.http.post<Message>(environment.BASE_URL + '/api/file-manager/open', message);
    }

    postDrawing(name: string, svg: string, idStack: string[]): void {
        let drawing: Drawing = { name: name, svg: svg, idStack: [...idStack] };
        let message: Message = { title: 'Add Drawing ' + name, body: JSON.stringify(drawing) };
        this.http.post<Message>(environment.BASE_URL + '/api/file-manager/save', message).subscribe((responseData) => {
            // console.log(responseData);
        });
    }
}
