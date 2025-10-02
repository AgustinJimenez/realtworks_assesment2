import React, { useEffect, useRef, useCallback, useMemo } from 'react';
import { useListRef } from 'react-window';
import { useData } from '../../state/DataContext';
import { Card, CardContent } from '../atoms/ui/card';
import { ItemsTableHeader, ItemsTableFooter, ItemsTableRow, VirtualizedItemsList } from '../molecules';

const ITEM_HEIGHT = 64; // Height of each row in pixels

export function ItemsTable() {
  const dataContext = useData();

  const {
    items = [],
    loading = false,
    hasMore = false,
    loadMore,
    fetchItems,
    totalCount = 0,
    listResetToken = 0,
    isResetting = false
  } = dataContext;
  const hasInitialFetch = useRef(false);
  const listRef = useListRef();
  const skipLoadMoreRef = useRef(false);

  // Load initial data
  useEffect(() => {
    if (!hasInitialFetch.current && fetchItems) {
      hasInitialFetch.current = true;
      fetchItems();
    }
  }, [fetchItems]);

  const formatPrice = useCallback((price) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(price);
  }, []);

  // Handle scroll-based infinite loading
  const handleVisibleRange = useCallback(({ startIndex, stopIndex }) => {
    if (isResetting) {
      skipLoadMoreRef.current = true;
      return;
    }

    if (skipLoadMoreRef.current) {
      skipLoadMoreRef.current = false;
      return;
    }

    // Trigger load more when we're viewing items near the end
    const isNearEnd = stopIndex >= items.length - 10;
    if (isNearEnd && hasMore && !loading && loadMore && items.length > 0) {
      loadMore();
    }
  }, [items.length, hasMore, loading, loadMore, isResetting]);

  // Calculate item count - exact number of items we have
  const itemCount = useMemo(() => {
    return items.length;
  }, [items.length]);

  const containerHeight = 450; // Fixed height for virtualized table (600px total - 100px for header/footer)

  const rowProps = useMemo(() => ({ items, formatPrice }), [items, formatPrice]);

  useEffect(() => {
    if (!listRef?.current) {
      return;
    }

    listRef.current.scrollToRow({ index: 0, align: 'start', behavior: 'auto' });
    skipLoadMoreRef.current = true;
  }, [listResetToken, listRef]);

  if (!items.length && loading) {
    return (
      <Card className="h-[600px]"><CardContent className="flex items-center justify-center h-full">
          <span className="text-muted-foreground" data-testid="items-loading-state">Loading items...</span>
        </CardContent>
      </Card>
    );
  }

  if (!items.length && !loading) {
    return (
      <Card className="h-[600px]">
        <CardContent className="flex items-center justify-center h-full">
          <span className="text-muted-foreground" data-testid="items-empty-state">No items found. Try adjusting your search.</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="h-[600px] flex flex-col w-full">
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        <ItemsTableHeader />

        {/* Virtualized Table Body - Scrollable */}
        <div className="flex-1 w-full overflow-hidden" data-testid="items-table-body">
          <VirtualizedItemsList
            rowComponent={ItemsTableRow}
            rowCount={itemCount}
            rowHeight={ITEM_HEIGHT}
            rowProps={rowProps}
            containerHeight={containerHeight}
            onRowsRendered={handleVisibleRange}
            listRef={listRef}
          />
        </div>

        <ItemsTableFooter visibleCount={items.length} totalCount={totalCount} loading={loading} />
      </CardContent>
    </Card>
  );
}
