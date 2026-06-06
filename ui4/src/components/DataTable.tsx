import { cls } from '@fluxio/core/html/cls';
import type { ComponentChildren, JSX } from 'preact';
import { useMemo, useState } from 'preact/hooks';
import { type DivProps, type ElProps } from './types';
import { isArray } from '@fluxio/core/check/isArray';
import { type CssStyle } from '@fluxio/core/html/cssTypes';
import { toTrue } from '@fluxio/core/cast/toTrue';
import { sortItems } from '@fluxio/core/array/sortItems';
import { useCss } from '../hooks/useCss';
import { toFloat } from '@fluxio/core/cast';
import { getEntries } from '@fluxio/core/object/getEntries';
import { Button } from './Button';
import { EditIcon, PointerIcon } from 'lucide-preact';
import { Field } from './Field';

export type DataTableColumnTitle = string | ComponentChildren;
export type DataTableColumnValue<T, C> = (item: T, ctx: C, index: number) => ComponentChildren;

export type DataTableColumn<T extends {} = any, C extends {} = any> = {
  w?: number;
  flex?: number;
  title?: DataTableColumnTitle;
  cls?: string | { class: string };
  val?: DataTableColumnValue<T, C>;
  props?: (item: T, ctx: C, index: number) => ElProps['td'];
  if?: (col: DataTableColumn<T, C>, ctx: C) => boolean;
};

export type ArrayDataTableColumn<T extends {} = any, C extends {} = any> =
  | [DataTableColumnTitle, DataTableColumnValue<T, C>]
  | [DataTableColumnTitle, DataTableColumnValue<T, C>, DataTableColumn<T>];

export type DataTableComputedColumn = DataTableColumn & {
  key: string;
  val: (item: any, ctx: any, index: number) => ComponentChildren;
  props: (item: any, ctx: any, index: number) => ElProps['th'];
  if: (col: DataTableColumn, ctx: any) => boolean;
};

export type DataTableColumns<T extends {} = any, C extends {} = any> = {
  [K: string]: false | null | undefined | ArrayDataTableColumn<T, C> | DataTableColumn<T, C>;
};

export interface DataTableProps<T extends {} = any, C extends {} = any> extends Omit<
  DivProps,
  'onSelect'
> {
  ctx?: C;
  cols: DataTableColumns<T, C>;
  select?: boolean;
  getKey?: (row: T, index: number) => string;
  rowProps?: (
    item: T,
    ctx: C,
    index: number
  ) => ElProps['tr'] & { mode?: 'success' | 'error' | 'selected' };
  rows: Readonly<T[]>;
  onEdit?: (item: T) => void;
  onSelect?: (item: T) => void;
}

export interface IDataTable {
  <T extends {} = any, C extends {} = any>(props: DataTableProps<T, C>): JSX.Element;
}

const defaultGetKey = (row: any, index: number) => row.id || index;

const getComputedColumns = (cols: DataTableColumns<any, any>) => {
  const computedColumns: DataTableComputedColumn[] = [];

  for (const [key, data] of getEntries(cols)) {
    if (!data) continue;

    const col = (
      isArray(data) ?
        {
          ...data[2],
          title: data[0],
          val: data[1],
        }
        : {
          ...data,
        }) as DataTableComputedColumn;

    col.key = key;

    computedColumns.push(col);
  }

  for (const col of computedColumns) {
    if (!col.if) col.if = toTrue;
    const sizeStyle: CssStyle = {};
    if (col.w) sizeStyle.width = col.w + 'px';
    if (col.flex || !col.w) sizeStyle.flex = col.flex || 1;
    const getProps = col.props;
    col.props = (item, ctx, index) => {
      const props = getProps ? getProps(item, ctx, index) : ({} as any);
      return {
        ...props,
        class: cls(col.cls, props),
        style: {
          ...sizeStyle,
          ...props.style,
        },
      } as any;
    };
  }

  return computedColumns;
};

const css = `
.table tr.row-success {
  color: hsl(var(--su));
}

.table tr.row-error {
  color: hsl(var(--er));
}

.table tr.row-selected {
  background-color: hsl(var(--b3));
}

.table td input,
.table th input {
  background: transparent;
  border: 0;
}

.table .Field {
  width: 100%;
}
`

export const DataTable = (({
  cols,
  ctx,
  select,
  getKey,
  rowProps,
  rows,
  onEdit,
  onSelect,
  ...props
}: DataTableProps) => {
  if (!getKey) getKey = defaultGetKey;

  useCss(css);

  const computedColumns = useMemo(() => getComputedColumns(cols), [cols]);
  const visibleColumns = computedColumns.filter((col) => col.if(col, ctx));
  const [sortKey, setSortKey] = useState<string | null>(null);
  const [sortAsc, setSortAsc] = useState(true);

  const filteredItems = useMemo(() => {
    const list = [...(rows || [])];
    if (sortKey) {
      const col = computedColumns.find((c) => c.key === sortKey);
      if (col) {
        sortItems(list, (item) => {
          const value = col.val(item, ctx, 0);
          if (typeof value === 'string') return toFloat(value) || value;
          if (typeof value === 'number') return value;
          return String(value);
        });
        if (!sortAsc) list.reverse();
      }
    }
    return list;
  }, [rows, sortKey, sortAsc, computedColumns, ctx]);

  const handleSort = (key: string) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(true);
    }
  };

  return (
    <div {...props} class={cls('overflow-x-auto', props)}>
      <table class="table">
        <thead>
          <tr>
            {onSelect && <th style={{ width: '40px' }}></th>}
            {onEdit && <th style={{ width: '40px' }}></th>}
            {visibleColumns.map((col) => (
              <th
                key={col.key}
                {...col.props({}, ctx, -1)}
                onClick={() => handleSort(col.key)}
                style={{ cursor: 'pointer', ...col.props({}, ctx, -1).style }}
              >
                {col.title}
                {sortKey === col.key && (sortAsc ? ' ▲' : ' ▼')}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {filteredItems.map((item: any, index: number) => {
            const { mode, ...trProps } = rowProps ? rowProps(item, ctx, index) : {};
            return (
              <tr
                key={getKey(item, index)}
                {...trProps}
                class={cls('hover', mode && `row-${mode}`, trProps)}
              >
                {onSelect && (
                  <td class="p-0">
                    <Button icon={PointerIcon} ghost xs onClick={() => onSelect(item)} />
                  </td>
                )}
                {onEdit && (
                  <td class="p-0">
                    <Button icon={EditIcon} ghost xs onClick={() => onEdit(item)} />
                  </td>
                )}
                {visibleColumns.map((col) => (
                  <td key={col.key} {...col.props(item, ctx, index)}>
                    {col.val(item, ctx, index)}
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}) as IDataTable;
