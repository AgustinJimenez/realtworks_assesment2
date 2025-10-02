import React from 'react';

export function ItemsTableHeader() {
  return (
    <div className="border-b bg-muted/50 backdrop-blur-sm shrink-0">
      <div className="flex w-full h-12 items-center">
        <div className="w-[40%] px-4 text-left align-middle font-medium text-muted-foreground border-r">Name</div>
        <div className="w-[20%] px-4 text-left align-middle font-medium text-muted-foreground border-r">Category</div>
        <div className="w-[20%] px-4 text-right align-middle font-medium text-muted-foreground border-r">Price</div>
        <div className="w-[20%] px-4 text-left align-middle font-medium text-muted-foreground">Actions</div>
      </div>
    </div>
  );
}
