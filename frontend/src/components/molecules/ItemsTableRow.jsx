import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../atoms/ui/button';

function ItemsTableRowComponent({ index, style, ariaAttributes, items, formatPrice }) {
  const item = items?.[index];

  if (!item) {
    return (
      <div className="flex items-center justify-center h-16 border-b w-full" style={style} {...ariaAttributes}>
        <span className="text-muted-foreground">No item at index {index}</span>
      </div>
    );
  }

  return (
    <div
      className="flex border-b transition-colors hover:bg-muted/50 h-16 w-full"
      data-testid={`item-row-${item.id}`}
      style={style}
      {...ariaAttributes}
    >
      <div className="w-[40%] px-4 align-middle font-medium border-r flex items-center">
        <span className="truncate">{item.name}</span>
      </div>
      <div className="w-[20%] px-4 align-middle border-r flex items-center">
        <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-secondary/50 text-secondary-foreground border">
          {item.category}
        </span>
      </div>
      <div className="w-[20%] px-4 align-middle text-right font-semibold text-primary border-r flex items-center justify-end">
        {formatPrice(item.price)}
      </div>
      <div className="w-[20%] px-4 align-middle flex items-center">
        <Button variant="outline" size="sm" asChild className="hover:bg-primary hover:text-primary-foreground transition-colors">
          <Link to={`/items/${item.id}`}>
            View Details
          </Link>
        </Button>
      </div>
    </div>
  );
}

export const ItemsTableRow = memo(ItemsTableRowComponent);
