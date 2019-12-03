import { Pipe, PipeTransform } from '@angular/core';
import { Drawing } from '../../../../common/communication/Drawing';

@Pipe({
    name: 'labelFilter',
    pure: false,
})
export class LabelFilter implements PipeTransform {
    transform(drawings: Drawing[], labelFilter: string): Drawing[] {
        if (labelFilter === undefined || labelFilter.length === 0) {
            return drawings;
        } else {
            labelFilter = labelFilter.toLowerCase().replace(/\s/g, '');
            const labelsFromFilter = labelFilter.split(',').map(String);

            return drawings.filter((drawing: Drawing) => {
                let checkLabels = false;
                labelsFromFilter.forEach((labelFromFilter: string) => {
                    if (
                        drawing.drawingInfo.labels.filter((label: string) => {
                            return label
                                .toLowerCase()
                                .replace(/\s/g, '')
                                .includes(labelFromFilter);
                        }).length !== 0
                    ) {
                        checkLabels = true;
                    }
                });
                return checkLabels;
            });
        }
    }
}
