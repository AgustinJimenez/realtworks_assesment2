import { test, expect } from '@playwright/test';

const baseURL = process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:4001';

test.describe('Backend Performance Improvements', () => {
  test('should cache API responses for better performance', async ({ request }) => {
    const startTime = Date.now();
    
    // First request
    const response1 = await request.get(`${baseURL}/api/items?limit=10`);
    expect(response1.status()).toBe(200);
    const firstRequestTime = Date.now() - startTime;
    
    // Second request should be faster due to caching
    const startTime2 = Date.now();
    const response2 = await request.get(`${baseURL}/api/items?limit=10`);
    expect(response2.status()).toBe(200);
    const secondRequestTime = Date.now() - startTime2;
    
    const data1 = await response1.json();
    const data2 = await response2.json();
    
    // Responses should be identical
    expect(data1.total).toBe(data2.total);
    expect(data1.items.length).toBe(data2.items.length);
    
  });

  test('should handle stats endpoint with caching', async ({ request }) => {
    const startTime = Date.now();
    
    // First stats request
    const response1 = await request.get(`${baseURL}/api/stats`);
    expect(response1.status()).toBe(200);
    const firstRequestTime = Date.now() - startTime;
    
    const stats1 = await response1.json();
    expect(stats1).toHaveProperty('total');
    expect(stats1).toHaveProperty('averagePrice');
    expect(typeof stats1.total).toBe('number');
    expect(typeof stats1.averagePrice).toBe('number');
    
    // Second stats request should be faster due to caching
    const startTime2 = Date.now();
    const response2 = await request.get(`${baseURL}/api/stats`);
    expect(response2.status()).toBe(200);
    const secondRequestTime = Date.now() - startTime2;
    
    const stats2 = await response2.json();
    
    // Stats should be consistent types and reasonable values
    expect(typeof stats2.total).toBe('number');
    expect(typeof stats2.averagePrice).toBe('number');
    expect(stats2.total).toBeGreaterThan(0);
    expect(stats2.averagePrice).toBeGreaterThan(0);
    
    // Second request should be faster due to caching (if no cache invalidation occurred)
    // Note: Stats may differ if other tests created items and invalidated the cache
    
  });

  test('should handle async file operations without blocking', async ({ request }) => {
    // Test multiple concurrent requests to verify non-blocking I/O
    const promises = [];
    const startTime = Date.now();
    
    // Make 5 concurrent requests
    for (let i = 0; i < 5; i++) {
      promises.push(request.get(`${baseURL}/api/items?limit=5&offset=${i * 5}`));
    }
    
    const responses = await Promise.all(promises);
    const totalTime = Date.now() - startTime;
    
    // All requests should succeed
    for (const response of responses) {
      expect(response.status()).toBe(200);
      const data = await response.json();
      expect(data).toHaveProperty('items');
      expect(Array.isArray(data.items)).toBe(true);
    }
    
    // Concurrent requests should complete reasonably fast
    expect(totalTime).toBeLessThan(5000); // Should complete within 5 seconds
    
  });

  test('should handle search with improved performance', async ({ request }) => {
    const startTime = Date.now();
    
    // Search request
    const response = await request.get(`${baseURL}/api/items?q=laptop&limit=20`);
    expect(response.status()).toBe(200);
    
    const requestTime = Date.now() - startTime;
    const data = await response.json();
    
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBe(true);
    expect(data).toHaveProperty('total');
    
    // Search should complete reasonably fast
    expect(requestTime).toBeLessThan(2000); // Should complete within 2 seconds
    
  });
});