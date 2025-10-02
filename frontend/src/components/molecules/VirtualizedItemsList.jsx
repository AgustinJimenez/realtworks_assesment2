import React from 'react';
import { List } from 'react-window';

export function VirtualizedItemsList({
  rowComponent: RowComponent,
  rowCount,
  rowHeight,
  rowProps,
  containerHeight,
  overscanCount = 5,
  onRowsRendered,
  listRef
}) {
  return (
    <List
      rowComponent={RowComponent}
      rowCount={rowCount}
      rowHeight={rowHeight}
      rowProps={rowProps}
      defaultHeight={containerHeight}
      onRowsRendered={onRowsRendered}
      listRef={listRef}
      overscanCount={overscanCount}
      style={{ height: containerHeight, width: '100%' }}
    />
  );
}
