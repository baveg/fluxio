import { timerFlux } from "../src";

const rows: string[][] = [];

const getTime = () => Math.round(Date.now() / 100);

const start = getTime();
const getTimeIndex = () => getTime() - start;

const setCell = (collIndex: number, rowIndex: number, value: any) => {
    const row = rows[rowIndex] || (rows[rowIndex] = []);
    row[collIndex] = value;
}

const setCellTime = (rowIndex: number, value: any) => setCell(getTimeIndex(), rowIndex, value);

const showTimeline = () => {
    console.info('Timeline :\n', rows.map(row => row.join('\t')).join('\n'));
}

const count$ = timerFlux(100).scan(count => count + 1, 0);

count$.on(value => setCellTime(0, value));

count$.throttle(500).map(v => v.toString(16)).on(value => setCellTime(1, value));

count$.on(showTimeline);