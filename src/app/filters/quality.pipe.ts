import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'quality'
})
export class QualityPipe implements PipeTransform {

  transform(value: any, args?: any): any {
    if (value == 'A') return "Ótimo";
    if (value == 'B') return "Bom";
    if (value == 'C') return "Regular";
    if (value == 'D') return "Ruim";

    return "Sem Classificação";
  }

}
