export interface IconItem {
  icon: string;
  label: string;
  category: string;
}

export const CATEGORY_ICONS: IconItem[] = [
  // Technology & Electronics
  { icon: 'fa-mobile-alt', label: 'Mobile Phone', category: 'Electronics' },
  { icon: 'fa-laptop', label: 'Laptop', category: 'Electronics' },
  { icon: 'fa-desktop', label: 'Desktop Computer', category: 'Electronics' },
  { icon: 'fa-tablet-alt', label: 'Tablet', category: 'Electronics' },
  { icon: 'fa-camera', label: 'Camera', category: 'Electronics' },
  { icon: 'fa-headphones', label: 'Headphones', category: 'Electronics' },
  { icon: 'fa-watch', label: 'Smart Watch', category: 'Electronics' },
  { icon: 'fa-tv', label: 'Television', category: 'Electronics' },
  { icon: 'fa-gamepad', label: 'Gamepad', category: 'Electronics' },
  { icon: 'fa-keyboard', label: 'Keyboard', category: 'Electronics' },
  { icon: 'fa-mouse', label: 'Computer Mouse', category: 'Electronics' },
  { icon: 'fa-print', label: 'Printer', category: 'Electronics' },
  { icon: 'fa-bolt', label: 'Lightning/Power', category: 'Electronics' },
  { icon: 'fa-microchip', label: 'Chip', category: 'Electronics' },
  { icon: 'fa-plug', label: 'Plug', category: 'Electronics' },

  // Fashion & Clothing
  { icon: 'fa-tshirt', label: 'T-Shirt', category: 'Fashion' },
  { icon: 'fa-shoe-prints', label: 'Shoes', category: 'Fashion' },
  { icon: 'fa-hat-cowboy', label: 'Hat', category: 'Fashion' },
  { icon: 'fa-ring', label: 'Ring/Jewelry', category: 'Fashion' },
  { icon: 'fa-gem', label: 'Diamond/Gem', category: 'Fashion' },
  { icon: 'fa-palette', label: 'Fashion/Art', category: 'Fashion' },
  { icon: 'fa-shopping-bag', label: 'Shopping Bag', category: 'Fashion' },
  { icon: 'fa-gift', label: 'Gift', category: 'Fashion' },
  { icon: 'fa-bag-shopping', label: 'Handbag', category: 'Fashion' },
  { icon: 'fa-wand-magic-sparkles', label: 'Beauty/Magic', category: 'Fashion' },

  // Home & Garden
  { icon: 'fa-home', label: 'Home', category: 'Home & Garden' },
  { icon: 'fa-couch', label: 'Sofa', category: 'Home & Garden' },
  { icon: 'fa-lightbulb', label: 'Light Bulb', category: 'Home & Garden' },
  { icon: 'fa-tools', label: 'Tools', category: 'Home & Garden' },
  { icon: 'fa-screwdriver-wrench', label: 'Screwdriver', category: 'Home & Garden' },
  { icon: 'fa-hammer', label: 'Hammer', category: 'Home & Garden' },
  { icon: 'fa-wrench', label: 'Wrench', category: 'Home & Garden' },
  { icon: 'fa-paint-roller', label: 'Paint Roller', category: 'Home & Garden' },
  { icon: 'fa-seedling', label: 'Plant/Seedling', category: 'Home & Garden' },
  { icon: 'fa-tree', label: 'Tree', category: 'Home & Garden' },
  { icon: 'fa-spa', label: 'Spa/Leaf', category: 'Home & Garden' },
  { icon: 'fa-bed', label: 'Bed', category: 'Home & Garden' },
  { icon: 'fa-bath', label: 'Bath', category: 'Home & Garden' },
  { icon: 'fa-kitchen-set', label: 'Kitchen', category: 'Home & Garden' },

  // Books & Education
  { icon: 'fa-book', label: 'Book', category: 'Books' },
  { icon: 'fa-graduation-cap', label: 'Graduation Cap', category: 'Books' },
  { icon: 'fa-school', label: 'School', category: 'Books' },
  { icon: 'fa-book-open', label: 'Book Open', category: 'Books' },
  { icon: 'fa-newspaper', label: 'Newspaper', category: 'Books' },
  { icon: 'fa-bookmark', label: 'Bookmark', category: 'Books' },
  { icon: 'fa-pen', label: 'Pen', category: 'Books' },
  { icon: 'fa-pencil', label: 'Pencil', category: 'Books' },

  // Sports & Outdoors
  { icon: 'fa-running', label: 'Running', category: 'Sports' },
  { icon: 'fa-futbol', label: 'Soccer Ball', category: 'Sports' },
  { icon: 'fa-basketball', label: 'Basketball', category: 'Sports' },
  { icon: 'fa-football', label: 'Football', category: 'Sports' },
  { icon: 'fa-baseball', label: 'Baseball', category: 'Sports' },
  { icon: 'fa-table-tennis-paddle-ball', label: 'Tennis/Ping Pong', category: 'Sports' },
  { icon: 'fa-dumbbell', label: 'Dumbbell', category: 'Sports' },
  { icon: 'fa-bicycle', label: 'Bicycle', category: 'Sports' },
  { icon: 'fa-person-swimming', label: 'Swimming', category: 'Sports' },
  { icon: 'fa-person-skating', label: 'Ice Skating', category: 'Sports' },
  { icon: 'fa-skiing', label: 'Skiing', category: 'Sports' },
  { icon: 'fa-hiking', label: 'Hiking', category: 'Sports' },
  { icon: 'fa-campground', label: 'Camping', category: 'Sports' },
  { icon: 'fa-mountain', label: 'Mountain', category: 'Sports' },
  { icon: 'fa-map', label: 'Map', category: 'Sports' },

  // Automotive
  { icon: 'fa-car', label: 'Car', category: 'Automotive' },
  { icon: 'fa-motorcycle', label: 'Motorcycle', category: 'Automotive' },
  { icon: 'fa-truck', label: 'Truck', category: 'Automotive' },
  { icon: 'fa-bus', label: 'Bus', category: 'Automotive' },
  { icon: 'fa-car-side', label: 'Car Side', category: 'Automotive' },
  { icon: 'fa-gas-pump', label: 'Gas Station', category: 'Automotive' },
  { icon: 'fa-wrench', label: 'Mechanic', category: 'Automotive' },
  { icon: 'fa-car-battery', label: 'Car Battery', category: 'Automotive' },
  { icon: 'fa-oil-can', label: 'Motor Oil', category: 'Automotive' },
  { icon: 'fa-tire-car', label: 'Tire', category: 'Automotive' },

  // Toys & Games
  { icon: 'fa-puzzle-piece', label: 'Puzzle', category: 'Toys & Games' },
  { icon: 'fa-chess', label: 'Chess', category: 'Toys & Games' },
  { icon: 'fa-dice', label: 'Dice', category: 'Toys & Games' },
  { icon: 'fa-robot', label: 'Robot', category: 'Toys & Games' },
  { icon: 'fa-gamepad', label: 'Gamepad', category: 'Toys & Games' },
  { icon: 'fa-bowling-ball', label: 'Bowling', category: 'Toys & Games' },
  { icon: 'fa-bullseye', label: 'Target/Dart', category: 'Toys & Games' },
  { icon: 'fa-baby', label: 'Baby/Toys', category: 'Toys & Games' },
  { icon: 'fa-rainbow', label: 'Rainbow', category: 'Toys & Games' },
  { icon: 'fa-masks-theater', label: 'Masks/Costumes', category: 'Toys & Games' },

  // Health & Beauty
  { icon: 'fa-heart', label: 'Heart', category: 'Health & Beauty' },
  { icon: 'fa-spa', label: 'Spa', category: 'Health & Beauty' },
  { icon: 'fa-pills', label: 'Medicine/Pills', category: 'Health & Beauty' },
  { icon: 'fa-prescription', label: 'Prescription', category: 'Health & Beauty' },
  { icon: 'fa-syringe', label: 'Syringe', category: 'Health & Beauty' },
  { icon: 'fa-notes-medical', label: 'Medical Notes', category: 'Health & Beauty' },
  { icon: 'fa-briefcase-medical', label: 'Medical Bag', category: 'Health & Beauty' },
  { icon: 'fa-staff-snake', label: 'Health Staff', category: 'Health & Beauty' },
  { icon: 'fa-eye', label: 'Eye', category: 'Health & Beauty' },
  { icon: 'fa-ear-listen', label: 'Hearing/Ear', category: 'Health & Beauty' },
  { icon: 'fa-brain', label: 'Brain', category: 'Health & Beauty' },
  { icon: 'fa-person', label: 'Person', category: 'Health & Beauty' },
  { icon: 'fa-dumbbell', label: 'Gym/Fitness', category: 'Health & Beauty' },
  { icon: 'fa-apple-whole', label: 'Apple/Healthy Food', category: 'Health & Beauty' },
  { icon: 'fa-leaf', label: 'Leaf/Natural', category: 'Health & Beauty' },

  // Food & Drink
  { icon: 'fa-utensils', label: 'Utensils', category: 'Food' },
  { icon: 'fa-utensil-slash', label: 'No Utensils', category: 'Food' },
  { icon: 'fa-utensils', label: 'Kitchen', category: 'Food' },
  { icon: 'fa-pizza-slice', label: 'Pizza', category: 'Food' },
  { icon: 'fa-burger', label: 'Burger', category: 'Food' },
  { icon: 'fa-fish', label: 'Fish', category: 'Food' },
  { icon: 'fa-wheat-awn', label: 'Bread/Grain', category: 'Food' },
  { icon: 'fa-cookie', label: 'Cookie', category: 'Food' },
  { icon: 'fa-ice-cream', label: 'Ice Cream', category: 'Food' },
  { icon: 'fa-mug-hot', label: 'Hot Beverage', category: 'Food' },
  { icon: 'fa-beer-mug-empty', label: 'Beer', category: 'Food' },
  { icon: 'fa-wine-glass', label: 'Wine', category: 'Food' },
  { icon: 'fa-cocktail', label: 'Cocktail', category: 'Food' },
  { icon: 'fa-pepper-hot', label: 'Hot Pepper', category: 'Food' },
  { icon: 'fa-carrot', label: 'Carrot/Vegetables', category: 'Food' },

  // Shopping & Business
  { icon: 'fa-store', label: 'Store', category: 'Shopping' },
  { icon: 'fa-shopping-cart', label: 'Shopping Cart', category: 'Shopping' },
  { icon: 'fa-tags', label: 'Tags', category: 'Shopping' },
  { icon: 'fa-tag', label: 'Tag', category: 'Shopping' },
  { icon: 'fa-barcode', label: 'Barcode', category: 'Shopping' },
  { icon: 'fa-credit-card', label: 'Credit Card', category: 'Shopping' },
  { icon: 'fa-money-bill', label: 'Money Bill', category: 'Shopping' },
  { icon: 'fa-dollar-sign', label: 'Dollar', category: 'Shopping' },
  { icon: 'fa-receipt', label: 'Receipt', category: 'Shopping' },
  { icon: 'fa-store-slash', label: 'Store Closed', category: 'Shopping' },
  { icon: 'fa-box', label: 'Box/Package', category: 'Shopping' },
  { icon: 'fa-box-open', label: 'Box Open', category: 'Shopping' },
  { icon: 'fa-boxes-stacked', label: 'Boxes', category: 'Shopping' },
  { icon: 'fa-parcel', label: 'Parcel', category: 'Shopping' },
  { icon: 'fa-truck-fast', label: 'Fast Delivery', category: 'Shopping' },

  // Music & Entertainment
  { icon: 'fa-music', label: 'Music', category: 'Entertainment' },
  { icon: 'fa-headphones', label: 'Headphones', category: 'Entertainment' },
  { icon: 'fa-compact-disc', label: 'CD/DVD', category: 'Entertainment' },
  { icon: 'fa-radio', label: 'Radio', category: 'Entertainment' },
  { icon: 'fa-film', label: 'Film/Movie', category: 'Entertainment' },
  { icon: 'fa-camera-movie', label: 'Movie Camera', category: 'Entertainment' },
  { icon: 'fa-tv', label: 'TV', category: 'Entertainment' },
  { icon: 'fa-guitar', label: 'Guitar', category: 'Entertainment' },
  { icon: 'fa-microphone', label: 'Microphone', category: 'Entertainment' },
  { icon: 'fa-sliders', label: 'Equalizer', category: 'Entertainment' },
  { icon: 'fa-play', label: 'Play', category: 'Entertainment' },
  { icon: 'fa-film', label: 'Video', category: 'Entertainment' },

  // Travel & Transportation
  { icon: 'fa-plane', label: 'Plane', category: 'Travel' },
  { icon: 'fa-plane-departure', label: 'Plane Departure', category: 'Travel' },
  { icon: 'fa-plane-arrival', label: 'Plane Arrival', category: 'Travel' },
  { icon: 'fa-hotel', label: 'Hotel', category: 'Travel' },
  { icon: 'fa-bed', label: 'Bed', category: 'Travel' },
  { icon: 'fa-map-location-dot', label: 'Map Location', category: 'Travel' },
  { icon: 'fa-map-marked', label: 'Map Marked', category: 'Travel' },
  { icon: 'fa-globe', label: 'Globe', category: 'Travel' },
  { icon: 'fa-earth-americas', label: 'Americas', category: 'Travel' },
  { icon: 'fa-passport', label: 'Passport', category: 'Travel' },
  { icon: 'fa-suitcase', label: 'Suitcase', category: 'Travel' },
  { icon: 'fa-person-walking-luggage', label: 'Walking with Luggage', category: 'Travel' },
  { icon: 'fa-landmark', label: 'Landmark', category: 'Travel' },
  { icon: 'fa-mosque', label: 'Mosque', category: 'Travel' },
  { icon: 'fa-church', label: 'Church', category: 'Travel' },

  // Nature & Animals
  { icon: 'fa-paw', label: 'Paw', category: 'Nature' },
  { icon: 'fa-dog', label: 'Dog', category: 'Nature' },
  { icon: 'fa-cat', label: 'Cat', category: 'Nature' },
  { icon: 'fa-fish', label: 'Fish', category: 'Nature' },
  { icon: 'fa-spider', label: 'Spider', category: 'Nature' },
  { icon: 'fa-shrimp', label: 'Shrimp', category: 'Nature' },
  { icon: 'fa-bug', label: 'Bug', category: 'Nature' },
  { icon: 'fa-feather', label: 'Feather', category: 'Nature' },
  { icon: 'fa-snowflake', label: 'Snowflake', category: 'Nature' },
  { icon: 'fa-sun', label: 'Sun', category: 'Nature' },
  { icon: 'fa-moon', label: 'Moon', category: 'Nature' },
  { icon: 'fa-cloud', label: 'Cloud', category: 'Nature' },
  { icon: 'fa-cloud-sun', label: 'Partly Sunny', category: 'Nature' },
  { icon: 'fa-umbrella', label: 'Umbrella', category: 'Nature' },
  { icon: 'fa-rainbow', label: 'Rainbow', category: 'Nature' },

  // General & Default
  { icon: 'fa-box', label: 'Box', category: 'General' },
  { icon: 'fa-tag', label: 'Tag', category: 'General' },
  { icon: 'fa-tags', label: 'Tags', category: 'General' },
  { icon: 'fa-key', label: 'Key', category: 'General' },
  { icon: 'fa-lock', label: 'Lock', category: 'General' },
  { icon: 'fa-unlock', label: 'Unlock', category: 'General' },
  { icon: 'fa-cart-shopping', label: 'Cart', category: 'General' },
  { icon: 'fa-basket-shopping', label: 'Basket', category: 'General' },
  { icon: 'fa-bag-shopping', label: 'Shopping Bag', category: 'General' },
  { icon: 'fa-wallet', label: 'Wallet', category: 'General' },
  { icon: 'fa-warehouse', label: 'Warehouse', category: 'General' },
  { icon: 'fa-archive', label: 'Archive', category: 'General' },
  { icon: 'fa-inbox', label: 'Inbox', category: 'General' },
  { icon: 'fa-folder', label: 'Folder', category: 'General' },
  { icon: 'fa-folder-open', label: 'Folder Open', category: 'General' },
];

export const getIconsByCategory = (): Record<string, IconItem[]> => {
  const grouped: Record<string, IconItem[]> = {};

  CATEGORY_ICONS.forEach((icon) => {
    if (!grouped[icon.category]) {
      grouped[icon.category] = [];
    }
    grouped[icon.category].push(icon);
  });

  return grouped;
};

export const getIconByName = (iconName: string): IconItem | undefined => {
  return CATEGORY_ICONS.find((icon) => icon.icon === iconName);
};
