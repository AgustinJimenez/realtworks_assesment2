import React from 'react';
import { Card, CardContent } from '../atoms/ui/card';

export function ItemsPageTemplate({ searchBar, tableControls, itemsTable }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      <div className="container mx-auto p-6 space-y-6">
        <Card className="shadow-lg border-2">
          <CardContent className="space-y-8 p-8">
            {/* Search Section */}
            {searchBar}

            {/* Table Controls Section */}
            {tableControls}

            {/* Items Table Section */}
            {itemsTable}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}