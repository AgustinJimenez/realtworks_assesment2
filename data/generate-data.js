import { faker } from "@faker-js/faker";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Define realistic categories and their typical products
const categories = {
  Electronics: [
    "Laptop",
    "Desktop Computer",
    "Tablet",
    "Smartphone",
    "Monitor",
    "Keyboard",
    "Mouse",
    "Headphones",
    "Speaker",
    "Camera",
    "Smartwatch",
    "Gaming Console",
    "Router",
    "Printer",
    "Hard Drive",
    "SSD",
    "Graphics Card",
    "Processor",
    "Motherboard",
    "Power Supply",
    "Wireless Earbuds",
    "Smart TV",
    "Projector",
    "Webcam",
    "Microphone",
  ],
  Furniture: [
    "Chair",
    "Desk",
    "Table",
    "Sofa",
    "Bed",
    "Bookshelf",
    "Dresser",
    "Nightstand",
    "Coffee Table",
    "Dining Chair",
    "Ottoman",
    "Cabinet",
    "Wardrobe",
    "Bench",
    "Standing Desk",
    "Office Chair",
    "Bar Stool",
    "Recliner",
    "Sectional Sofa",
  ],
  Clothing: [
    "T-Shirt",
    "Jeans",
    "Dress",
    "Jacket",
    "Sweater",
    "Hoodie",
    "Pants",
    "Shorts",
    "Skirt",
    "Blouse",
    "Coat",
    "Sneakers",
    "Boots",
    "Sandals",
    "Hat",
    "Scarf",
    "Belt",
    "Socks",
    "Underwear",
    "Suit",
    "Tie",
    "Watch",
    "Sunglasses",
  ],
  "Home & Garden": [
    "Vacuum Cleaner",
    "Coffee Maker",
    "Blender",
    "Microwave",
    "Toaster",
    "Air Fryer",
    "Garden Hose",
    "Lawn Mower",
    "Plant Pot",
    "Fertilizer",
    "Seeds",
    "Watering Can",
    "Outdoor Chair",
    "Grill",
    "Fire Pit",
    "Umbrella",
    "Cushions",
    "Solar Lights",
  ],
  "Sports & Outdoors": [
    "Running Shoes",
    "Yoga Mat",
    "Dumbbells",
    "Bicycle",
    "Helmet",
    "Backpack",
    "Tent",
    "Sleeping Bag",
    "Hiking Boots",
    "Water Bottle",
    "Fitness Tracker",
    "Basketball",
    "Soccer Ball",
    "Tennis Racket",
    "Golf Clubs",
    "Skateboard",
  ],
  "Books & Media": [
    "Novel",
    "Textbook",
    "Cookbook",
    "Biography",
    "Self-Help Book",
    "Comic Book",
    "DVD",
    "Blu-ray",
    "Vinyl Record",
    "Board Game",
    "Puzzle",
    "Magazine Subscription",
    "E-book Reader",
    "Audiobook",
    "Art Book",
    "Travel Guide",
  ],
  "Health & Beauty": [
    "Skincare Set",
    "Makeup Kit",
    "Hair Dryer",
    "Electric Toothbrush",
    "Perfume",
    "Moisturizer",
    "Sunscreen",
    "Vitamins",
    "Protein Powder",
    "Essential Oils",
    "Face Mask",
    "Nail Polish",
    "Shampoo",
    "Conditioner",
    "Body Lotion",
  ],
  "Toys & Games": [
    "Action Figure",
    "Doll",
    "Building Blocks",
    "Puzzle",
    "Board Game",
    "Video Game",
    "Remote Control Car",
    "Stuffed Animal",
    "Art Supplies",
    "Science Kit",
    "Musical Instrument",
    "Ball",
    "Tricycle",
    "Swing Set",
    "Trampoline",
  ],
  Automotive: [
    "Car Charger",
    "Phone Mount",
    "Dash Cam",
    "Car Cover",
    "Floor Mats",
    "Seat Covers",
    "Air Freshener",
    "Tire Gauge",
    "Jump Starter",
    "Tool Kit",
    "Car Wax",
    "Cleaning Kit",
    "Bluetooth Adapter",
    "GPS Navigator",
  ],
  "Office Supplies": [
    "Notebook",
    "Pen Set",
    "Stapler",
    "Paper Clips",
    "Binder",
    "Calculator",
    "Desk Lamp",
    "File Cabinet",
    "Whiteboard",
    "Markers",
    "Sticky Notes",
    "Envelope",
    "Printer Paper",
    "Ink Cartridge",
    "Scissors",
    "Tape Dispenser",
  ],
};

// Price ranges for different categories (min, max)
const priceRanges = {
  Electronics: [50, 3000],
  Furniture: [100, 2500],
  Clothing: [15, 500],
  "Home & Garden": [10, 800],
  "Sports & Outdoors": [20, 1200],
  "Books & Media": [5, 150],
  "Health & Beauty": [8, 300],
  "Toys & Games": [10, 200],
  Automotive: [15, 500],
  "Office Supplies": [2, 150],
};

// Brand prefixes for different categories
const brandPrefixes = {
  Electronics: [
    "Pro",
    "Ultra",
    "Smart",
    "Digital",
    "Wireless",
    "Premium",
    "Advanced",
    "Elite",
  ],
  Furniture: [
    "Modern",
    "Classic",
    "Luxury",
    "Comfort",
    "Ergonomic",
    "Designer",
    "Contemporary",
  ],
  Clothing: [
    "Premium",
    "Classic",
    "Designer",
    "Casual",
    "Sport",
    "Fashion",
    "Vintage",
  ],
  "Home & Garden": ["Home", "Garden", "Outdoor", "Kitchen", "Essential", "Pro"],
  "Sports & Outdoors": [
    "Sport",
    "Active",
    "Pro",
    "Outdoor",
    "Athletic",
    "Performance",
  ],
  "Books & Media": [
    "Complete",
    "Ultimate",
    "Essential",
    "Comprehensive",
    "Deluxe",
  ],
  "Health & Beauty": [
    "Natural",
    "Organic",
    "Premium",
    "Professional",
    "Beauty",
    "Care",
  ],
  "Toys & Games": [
    "Fun",
    "Educational",
    "Creative",
    "Interactive",
    "Classic",
    "Adventure",
  ],
  Automotive: ["Auto", "Car", "Drive", "Road", "Vehicle", "Motor"],
  "Office Supplies": [
    "Office",
    "Business",
    "Professional",
    "Essential",
    "Quality",
  ],
};

export function generateRealisticItem(id) {
  // Pick a random category
  const categoryNames = Object.keys(categories);
  const category = faker.helpers.arrayElement(categoryNames);

  // Pick a random product type from that category
  const productTypes = categories[category];
  const productType = faker.helpers.arrayElement(productTypes);

  // Generate a realistic name with brand/modifier
  const brandPrefix = faker.helpers.arrayElement(brandPrefixes[category]);
  const modifier = faker.helpers.maybe(
    () =>
      faker.helpers.arrayElement([
        "Deluxe",
        "Premium",
        "Professional",
        "Advanced",
        "Compact",
        "Portable",
        "Heavy Duty",
        "Lightweight",
        "Extra Large",
        "Mini",
        "Wireless",
        "Smart",
      ]),
    { probability: 0.4 }
  );

  let name = productType;
  if (modifier) {
    name = `${modifier} ${productType}`;
  }
  if (faker.datatype.boolean(0.6)) {
    name = `${brandPrefix} ${name}`;
  }

  // Generate realistic price based on category
  const [minPrice, maxPrice] = priceRanges[category];
  const price = faker.number.int({ min: minPrice, max: maxPrice });

  return {
    id: id,
    name: name,
    category: category,
    price: price,
  };
}

export function generateRealisticNameAndCategory() {
  // Pick a random category
  const categoryNames = Object.keys(categories);
  const category = faker.helpers.arrayElement(categoryNames);

  // Pick a random product type from that category
  const productTypes = categories[category];
  const productType = faker.helpers.arrayElement(productTypes);

  // Generate a realistic name with brand/modifier
  const brandPrefix = faker.helpers.arrayElement(brandPrefixes[category]);
  const modifier = faker.helpers.maybe(
    () =>
      faker.helpers.arrayElement([
        "Deluxe",
        "Premium",
        "Professional",
        "Advanced",
        "Compact",
        "Portable",
        "Heavy Duty",
        "Lightweight",
        "Extra Large",
        "Mini",
        "Wireless",
        "Smart",
      ]),
    { probability: 0.4 }
  );

  let name = productType;
  if (modifier) {
    name = `${modifier} ${productType}`;
  }
  if (faker.datatype.boolean(0.6)) {
    name = `${brandPrefix} ${name}`;
  }

  // Generate realistic price based on category
  const [minPrice, maxPrice] = priceRanges[category];
  const price = faker.number.int({ min: minPrice, max: maxPrice });

  return { name, category, price };
}

function generateItems(count) {
  const items = [];

  // Keep the original 5 items
  const originalItems = [
    { id: 1, name: "Laptop Pro", category: "Electronics", price: 2499 },
    {
      id: 2,
      name: "Noise Cancelling Headphones",
      category: "Electronics",
      price: 399,
    },
    { id: 3, name: "Ultra-Wide Monitor", category: "Electronics", price: 999 },
    { id: 4, name: "Ergonomic Chair", category: "Furniture", price: 799 },
    { id: 5, name: "Standing Desk", category: "Furniture", price: 1199 },
  ];

  items.push(...originalItems);

  // Generate the rest
  for (let i = 6; i <= count; i++) {
    items.push(generateRealisticItem(i));

  }

  return items;
}

// Only run the generation if this file is executed directly (not imported)
if (import.meta.url === `file://${process.argv[1]}`) {
  // Generate the data
  const targetCount = 1500000;
  const items = generateItems(targetCount);

  // Write to file
  const dataPath = path.join(__dirname, "items.json");
  const backupPath = path.join(__dirname, "items.backup.json");

  // Create backup of original file
  if (fs.existsSync(dataPath)) {
    fs.copyFileSync(dataPath, backupPath);
  }

  // Write new data
  fs.writeFileSync(dataPath, JSON.stringify(items, null, 2));


  // Show some statistics
  const categoryStats = {};
  items.forEach((item) => {
    categoryStats[item.category] = (categoryStats[item.category] || 0) + 1;
  });


  const prices = items.map((item) => item.price);
  const avgPrice = prices.reduce((a, b) => a + b, 0) / prices.length;
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);


}
