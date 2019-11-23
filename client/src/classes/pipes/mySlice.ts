import { Pipe, PipeTransform } from '@angular/core';

import { Drawing } from '../Drawing';

@Pipe({
    name: 'mySlice',
    pure: false,
})
export class MySlice implements PipeTransform {
    transform(drawings: Drawing[], nameFilter: string): Drawing[] {
        return nameFilter === '$tout' ? drawings : drawings.slice(0, 5);
    }
}
