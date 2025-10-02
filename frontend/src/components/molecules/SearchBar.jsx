import React, { useState, useEffect, useRef } from 'react';
import { useData } from '../../state/DataContext';
import { Input } from '../atoms/ui/input';
import { Button } from '../atoms/ui/button';

export function SearchBar() {
  const [query, setQuery] = useState('');
  const dataContext = useData();
  
  // Add safety check
  if (!dataContext) {
    return <div className="mb-8 p-4">Loading search...</div>;
  }
  
  const { searchItems } = dataContext;
  const debounceRef = useRef(null);
  const isInitialMount = useRef(true);

  // Debounce search to avoid too many API calls
  useEffect(() => {
    // Skip the initial mount to avoid duplicate request
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }
    
    // Clear any existing timeout
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    
    // Set new timeout
    debounceRef.current = setTimeout(() => {
      searchItems(query);
    }, 300);

    // Cleanup function
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]); // Remove searchItems from dependency array

  const handleClear = () => {
    setQuery('');
    // Clear immediately for better UX
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    searchItems('');
  };

  return (
    <div className="mb-8">
      <div className="relative w-full max-w-lg mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <span className="text-muted-foreground text-sm">🔍</span>
          </div>
          <Input
            type="text"
            placeholder="Search items by name or category..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className={`pl-10 h-12 text-lg border-2 shadow-sm transition-all duration-200 focus:shadow-md ${query ? 'pr-12' : ''}`}
            data-testid="search-input"
          />
          {query && (
            <Button
              variant="ghost"
              size="sm"
              onClick={handleClear}
              className="absolute right-2 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-destructive/10 hover:text-destructive transition-colors"
              title="Clear search"
            >
              ×
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}