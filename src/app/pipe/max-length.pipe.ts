import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'maxLengthName' })
export class MaxLengthNamePipe implements PipeTransform {
    transform(value: string): string {
        const name = value && value.length > 14 ? value.substr(0, 14).concat('...') : value;
        return name;
    }
}
