import { MatSliderChange } from '@angular/material';

export class Predicate {
    eventIsValid<T>(event: MatSliderChange, range: T): boolean {
        const value = event.value;
        // @ts-ignore
        return value !== null ? this.isBetween(value, range) : false;
    }
    isBetween<T>(value: number, range: T): boolean {
        // @ts-ignore
        return value >= range.Min && value <= range.Max;
    }
}
