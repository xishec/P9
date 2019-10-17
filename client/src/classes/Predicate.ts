import { MatSliderChange } from '@angular/material';

export class Predicate {
    eventIsValid<T>(event: MatSliderChange, range: T): boolean {
        const value = event.value;
        // @ts-ignore
        if (value !== null) {
            return this.IsBetween(value, range);
        } else {
            return false;
        }
    }
    IsBetween<T>(value: number | boolean, range: T): boolean {
        // @ts-ignore
        return value >= range.Min && value <= range.Max;
    }
}
