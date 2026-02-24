// three-words.pipe.ts
import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'threeWords',
  standalone: true
})
export class ThreeWordsPipe implements PipeTransform {
  transform(value: string): string {
    if (!value) return '';
    const words = value.split(' ');
    if (words.length <= 3) return value;
    return words.slice(0, 3).join(' ');
  }
}
