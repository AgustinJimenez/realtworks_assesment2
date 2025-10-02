import React, { createContext, useCallback, useContext, useState, useRef } from 'react';

const DataContext = createContext();

export function DataProvider({ children }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [totalCount, setTotalCount] = useState(0);
  const [listResetToken, setListResetToken] = useState(0);
  const [isResetting, setIsResetting] = useState(false);
  const abortControllerRef = useRef(null);
  const lastRequestRef = useRef(null);
  const requestCache = useRef(new Map());

  const fetchItems = useCallback(async (options = {}) => {
    const { 
      search = searchQuery, 
      limit = 50, 
      offset = 0, 
      append = false 
    } = options;
    
    const isInitialPage = offset === 0;

    // Create request signature to prevent duplicate requests
    const requestSignature = `${search || ''}-${limit}-${offset}-${append}`;
    const now = Date.now();
    
    // Check if this exact request was made very recently (within 2 seconds for initial loads)
    if (requestCache.current.has(requestSignature)) {
      const lastRequestTime = requestCache.current.get(requestSignature);
      const timeDiff = now - lastRequestTime;
      // For initial loads (no offset), use longer window; for pagination, use shorter
      const windowMs = offset === 0 ? 2000 : 500;
      if (timeDiff < windowMs) {
        return;
      }
    }
    
    // Skip if this exact request is already in progress
    if (lastRequestRef.current === requestSignature && loading) {
      return;
    }
    
    // Record this request
    requestCache.current.set(requestSignature, now);
    lastRequestRef.current = requestSignature;
    
    // Cancel any ongoing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController();
    
    if (!append && isInitialPage) {
      setIsResetting(true);
    }

    setLoading(true);
    
    try {
      const params = new URLSearchParams();
      if (search) params.append('q', search);
      if (limit) params.append('limit', limit);
      if (offset) params.append('offset', offset);
      
      const res = await fetch(`/api/items?${params.toString()}`, {
        signal: abortControllerRef.current.signal
      });
      
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      
      const json = await res.json();
      
      // Handle both old and new API response formats
      const itemsArray = json.items || json || [];
      const total = json.total || itemsArray.length;
      
      if (append) {
        setItems(prev => [...prev, ...itemsArray]);
      } else {
        setItems(itemsArray);
        setListResetToken(prev => prev + 1);
      }
      
      setTotalCount(total);
      
      // If we got fewer items than requested, we've reached the end
      setHasMore(itemsArray.length === limit);
      
    } catch (error) {
      // Don't handle AbortError as an actual error
      if (error.name === 'AbortError') {
        return;
      }
      
      console.error('Failed to fetch items:', error);
      // Set safe defaults on error
      if (!append) {
        setItems([]);
        setTotalCount(0);
        setListResetToken(prev => prev + 1);
      }
      setHasMore(false);
    } finally {
      setLoading(false);
      if (!append && isInitialPage) {
        setIsResetting(false);
      }
    }
  }, [searchQuery]);

  const searchItems = useCallback(async (query) => {
    setSearchQuery(query);
    await fetchItems({ search: query, offset: 0, append: false });
  }, [fetchItems]);

  const loadMore = useCallback(async () => {
    if (!loading && hasMore) {
      await fetchItems({ 
        search: searchQuery, 
        offset: items.length, 
        append: true 
      });
    }
  }, [fetchItems, loading, hasMore, searchQuery, items.length]);

  return (
    <DataContext.Provider value={{ 
      items, 
      loading, 
      hasMore, 
      searchQuery,
      totalCount,
      listResetToken,
      isResetting,
      fetchItems, 
      searchItems, 
      loadMore 
    }}>
      {children}
    </DataContext.Provider>
  );
}

export const useData = () => useContext(DataContext);
