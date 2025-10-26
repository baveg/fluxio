import { fluxTimer } from '../src/flux/fluxTimer';
import { LogTable, fluxLogTable } from './LogTable';

const logTable = new LogTable();

const count$ = fluxTimer(100).scan((count) => count + 1, 0);

fluxLogTable(count$, logTable, 'count$');

const throttle$ = count$.throttle(500);

fluxLogTable(throttle$, logTable, 'throttle$');

const map$ = throttle$.map((v) => v.toString(16));

fluxLogTable(map$, logTable, 'map$');
