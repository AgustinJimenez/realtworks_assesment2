import React from 'react';
import { Routes, Route, Link } from 'react-router-dom';
import Items from './Items';
import ItemDetail from './ItemDetail';
import { DataProvider } from '../state/DataContext';
import { Button } from '../components/atoms/ui/button';

function App() {
  return (
    <DataProvider>
      <div className="min-h-screen bg-gradient-to-br from-background via-muted/20 to-background">
        <nav className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
          <div className="container mx-auto px-6 py-4">
            <div className="flex items-center justify-between">
              <Button variant="ghost" asChild className="p-0 h-auto hover:bg-transparent">
                <Link to="/" className="text-lg font-semibold text-foreground hover:text-primary transition-colors">
                  Items Store
                </Link>
              </Button>
            </div>
          </div>
        </nav>
        
        <main className="relative">
          <Routes>
            <Route path="/" element={<Items />} />
            <Route path="/items/:id" element={<ItemDetail />} />
          </Routes>
        </main>
      </div>
    </DataProvider>
  );
}

export default App;