import { toError } from '@common/utils';
import { LogTable } from '../logger/LogTable';
import { Flux } from './Flux';

export const fLogTable = (flux: Flux, table: LogTable, name: string) => {
  const rowIndex = table.addRow(name);
  flux.on((value, error) => {
    table.setCellTime(rowIndex, error ? 'E:' + toError(error).message : value);
  });
  return flux;
};
