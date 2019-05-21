import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'prettyNumber'})
export class PrettyNumberPipe implements PipeTransform {
  private ranksSymbolMap = new Map([
    [0, ''],
    [3, 'K'],
    [6, 'M'],
    [9, 'G'],
    [12, 'T'],
    [15, 'P'],
    [18, 'E'],
    [21, 'Z'],
    [24, 'Y']
  ]);
  transform(number, decimal = 1): string {
    const rank = this.getRank(number);
    const roundedNumber = this.getRoundedRankedNumber(number, rank, decimal);
    return roundedNumber >= 1000
      ? this.rankUp(number, rank, decimal)
      : this.formatRankedNumber(roundedNumber, rank);
  }

  private getRank(number) {
    const absNumber = Math.abs(number);
    if (absNumber < 1) {
      return 0;
    }
    return Math.floor(Math.log10(absNumber) / 3) * 3;
  }

  private getRoundedRankedNumber(number, rank, decimal) {
    const rankedNumber = this.getRankedNumber(number, rank);
    return this.roundToDecimal(rankedNumber, decimal);
  }

  private getRankedNumber(number, rank) {
    return number / Math.pow(10, rank);
  }

  private roundToDecimal(number, decimal) {
    const delimeter = Math.pow(10, decimal);
    return Math.round(number * delimeter) / delimeter;
  }

  private rankUp(number, rank, decimal) {
    const newRank = rank + 3;
    const rankedNumber = this.getRoundedRankedNumber(number, newRank, decimal);
    return this.formatRankedNumber(rankedNumber, newRank);
  }

  private formatRankedNumber(rankedNumber, rank) {
    const symbol = this.getSymbol(rank);
    return `${rankedNumber}${symbol}`;
  }

  private getSymbol(rank) {
    return this.ranksSymbolMap.get(rank);
  }

}
