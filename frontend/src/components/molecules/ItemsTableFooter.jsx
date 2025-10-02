import React from 'react';

export function ItemsTableFooter({ visibleCount, totalCount, loading }) {
  return (
    <div className="border-t bg-muted/20 backdrop-blur-sm p-4 shrink-0">
      <div className="text-center text-sm font-medium">
        <span className="text-primary font-semibold">{visibleCount.toLocaleString()}</span>
        {' '}items shown from{' '}
        <span className="text-primary font-semibold">{totalCount.toLocaleString()}</span>
        {' '}total
        {loading && (
          <span className="block text-xs text-muted-foreground mt-1">
            Loading more items...
          </span>
        )}
      </div>
    </div>
  );
}
