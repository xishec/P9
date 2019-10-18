import { MatSliderChange } from '@angular/material';

export class Predicate {
    eventIsValid<T>(event: MatSliderChange, range: T): boolean {
        const value = event.value;
        // @ts-ignore
        if (value !== null) {
            return this.isBetween(value, range);
        } else {
            return false;
        }
    }
    isBetween<T>(value: number, range: T): boolean {
        // @ts-ignore
        return value >= range.Min && value <= range.Max;
    }
}
