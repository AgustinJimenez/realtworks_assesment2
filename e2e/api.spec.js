import { test, expect } from '@playwright/test';
import { generateRealisticNameAndCategory } from '../data/generate-data.js';

test.describe('API Endpoints', () => {
  const baseURL = 'http://localhost:4001';

  test('should fetch items from API', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data.items.length).toBeGreaterThan(0);
    
    // Verify item structure
    const firstItem = data.items[0];
    expect(firstItem).toHaveProperty('id');
    expect(firstItem).toHaveProperty('name');
    expect(firstItem).toHaveProperty('category');
    expect(firstItem).toHaveProperty('price');
  });

  test('should support search query parameter', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items?q=laptop`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    
    // Should filter items containing 'laptop' (case insensitive)
    if (data.items.length > 0) {
      const firstItem = data.items[0];
      expect(firstItem.name.toLowerCase()).toContain('laptop');
    }
  });

  test('should support limit parameter', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items?limit=2`);
    expect(response.status()).toBe(200);
    
    const data = await response.json();
    expect(data).toHaveProperty('items');
    expect(Array.isArray(data.items)).toBeTruthy();
    expect(data.items.length).toBeLessThanOrEqual(2);
  });

  test('should fetch individual item by ID', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items/1`);
    expect(response.status()).toBe(200);
    
    const item = await response.json();
    expect(item).toHaveProperty('id', 1);
    expect(item).toHaveProperty('name');
    expect(item).toHaveProperty('category');
    expect(item).toHaveProperty('price');
  });

  test('should return 404 for non-existent item', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/items/999999`);
    expect(response.status()).toBe(404);
  });

  test('should fetch stats', async ({ request }) => {
    const response = await request.get(`${baseURL}/api/stats`);
    expect(response.status()).toBe(200);
    
    const stats = await response.json();
    expect(stats).toHaveProperty('total');
    expect(stats).toHaveProperty('averagePrice');
    expect(typeof stats.total).toBe('number');
    expect(typeof stats.averagePrice).toBe('number');
  });

  test('should create new item via POST', async ({ request }) => {
    const { name, category, price } = generateRealisticNameAndCategory();
    
    const newItem = {
      name: name,
      category: category,
      price: price
    };

    const response = await request.post(`${baseURL}/api/items`, {
      data: newItem
    });
    
    expect(response.status()).toBe(201);
    
    const createdItem = await response.json();
    expect(createdItem).toHaveProperty('id');
    expect(createdItem.name).toBe(newItem.name);
    expect(createdItem.category).toBe(newItem.category);
    expect(createdItem.price).toBe(newItem.price);
  });
});