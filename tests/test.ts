import { fTimer, LogTable } from '../src';
import { fLogTable } from '../src/flux/fluxLogTable';

const logTable = new LogTable();

const count$ = fTimer(100).scan((count) => count + 1, 0);

fLogTable(count$, logTable, 'count$');

const throttle$ = count$.throttle(500);

fLogTable(throttle$, logTable, 'throttle$');

const map$ = throttle$.map((v) => v.toString(16));

fLogTable(map$, logTable, 'map$');
