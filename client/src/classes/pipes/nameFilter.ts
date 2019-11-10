import { Pipe, PipeTransform } from '@angular/core';
import { Drawing } from '../../../../common/communication/Drawing';

@Pipe({
    name: 'nameFilter',
    pure: false,
})
export class NameFilter implements PipeTransform {
    transform(drawings: Drawing[], nameFilter: string): Drawing[] {
        if (nameFilter === '$tout') {
            return drawings;
        }

        if (nameFilter === undefined || nameFilter.length === 0) {
            return drawings;
        } else {
            nameFilter = nameFilter.toLowerCase();
            return drawings.filter((drawing: Drawing) => {
                return drawing.name.toLowerCase().includes(nameFilter);
            });
        }
    }
}
