import { padEnd } from '../string/pad';
import { truncate } from '../string/truncate';
import { logger } from './Logger';
import { humanize } from '../string/humanize';
import { removeIndex } from '../array/removeIndex';

export class LogTable {
  public readonly log = logger('LogTable');
  public readonly rows: string[][] = [];
  public readonly names: string[] = [];
  public readonly timeStep = 100;
  public readonly cellLength = 6;
  public readonly maxRowLength = 120;
  public readonly startIndex = Math.round(Date.now() / this.timeStep);
  public readonly interval = setInterval(() => this.show(), this.timeStep);
  public nameLength = 0;

  addRow(name: string) {
    name = `${name}: `;
    const { rows, names, nameLength } = this;

    rows.push([]);
    names.push(name);

    if (name.length > nameLength) {
      const newNameLength = name.length;
      this.nameLength = newNameLength;
      names.forEach((name, i) => {
        names[i] = padEnd(name, newNameLength);
      });
    }

    return this.rows.length - 1;
  }

  getTimeIndex() {
    return Math.round(Date.now() / this.timeStep);
  }

  setCell(rowIndex: number, collIndex: number, value: any) {
    const { cellLength, maxRowLength, rows } = this;
    const row = rows[rowIndex] || (rows[rowIndex] = []);
    row[collIndex] = padEnd(truncate(humanize(value), cellLength), cellLength);

    if (row.length > maxRowLength) {
      for (const r of rows) {
        removeIndex(r, 0);
      }
    }
  }

  setCellTime(rowIndex: number, value: any) {
    this.setCell(this.getTimeIndex(), rowIndex, value);
  }

  toString() {
    const { rows, names } = this;
    return rows.map((row, i) => names[i] + row.join('')).join('\n');
  }

  show() {
    this.log.i('\n', this.toString());
  }
}
