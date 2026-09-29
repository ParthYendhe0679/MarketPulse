export const STATES_AND_CITIES: Record<string, string[]> = {
  "Maharashtra": ["Mumbai", "Pune", "Nagpur", "Nashik"],
  "Delhi": ["New Delhi", "Noida NCR", "Gurugram NCR"],
  "Karnataka": ["Bangalore", "Mysore", "Hubli", "Mangalore"],
  "Tamil Nadu": ["Chennai", "Coimbatore", "Madurai", "Trichy"],
  "West Bengal": ["Kolkata", "Siliguri", "Howrah", "Durgapur"],
  "Gujarat": ["Ahmedabad", "Surat", "Vadodara", "Rajkot"],
  "Uttar Pradesh": ["Lucknow", "Kanpur", "Noida", "Agra"],
  "Rajasthan": ["Jaipur", "Jodhpur", "Udaipur", "Kota"],
  "Kerala": ["Kochi", "Trivandrum", "Kozhikode", "Thrissur"],
  "Telangana": ["Hyderabad", "Warangal", "Nizamabad", "Khammam"],
  "Andhra Pradesh": ["Visakhapatnam", "Vijayawada", "Guntur", "Nellore"]
};

export const STATES = Object.keys(STATES_AND_CITIES);

export const CATEGORIES_BRANDS_PRODUCTS: Record<string, Record<string, string[]>> = {
  "Electronics": {
    "Apple": ["iPhone 15", "iPad Air", "AirPods Pro", "MacBook Air"],
    "Samsung": ["Galaxy S24", "Galaxy A55", "Samsung OLED TV", "Galaxy Buds"],
    "Xiaomi": ["Redmi Note 13", "Mi Power Bank", "Xiaomi Smart Band", "Mi TV"],
    "boAt": ["Rockerz 400", "Airdopes 131", "Wave Smartwatch", "Stone Speaker"]
  },
  "Food & Beverages": {
    "Amul": ["Amul Butter", "Amul Gold Milk", "Amul Cheese Slices", "Amul Ice Cream"],
    "Britannia": ["Good Day Biscuits", "Marie Gold", "Bourbon Biscuits", "NutriChoice Digestives"],
    "Nestle": ["Maggi Noodles", "Nescafe Gold", "KitKat Chocolate", "Milkmaid"],
    "ITC": ["Aashirvaad Atta", "Sunfeast Dark Fantasy", "Yippee Noodles", "Bingo Chips"]
  },
  "Personal Care": {
    "HUL": ["Surf Excel Liquid", "Lux Soap Bar", "Clinic Plus Shampoo", "Dove Cream Bar"],
    "Nivea": ["Nivea Soft Cream", "Nivea Pearl Roll-on", "Nivea Body Lotion", "Nivea Men Facewash"],
    "Colgate": ["Colgate MaxFresh", "Colgate Strong Teeth", "Colgate Plax Mouthwash", "Colgate Toothbrush"],
    "L'Oreal": ["L'Oreal Total Repair Shampoo", "L'Oreal Revitalift Serum", "L'Oreal Matte Lipstick", "L'Oreal Hair Color"]
  },
  "Apparel & Fashion": {
    "Zara": ["Zara Slim Fit Suit", "Zara Denim Jacket", "Zara Casual Shirt", "Zara Leather Boots"],
    "H&M": ["H&M Hoodie", "H&M Chinos", "H&M Basic T-Shirt", "H&M Knit Sweater"],
    "Aditya Birla": ["Louis Philippe Shirt", "Van Heusen Suit", "Allen Solly Blazer", "Peter England Trousers"],
    "Reliance Retail": ["Trends Kurti", "Performax Joggers", "DNMX Denim Jeans", "Avaasa Suit Set"]
  }
};

export const CATEGORIES = Object.keys(CATEGORIES_BRANDS_PRODUCTS);

export const ALL_BRANDS = Object.values(CATEGORIES_BRANDS_PRODUCTS).flatMap(brandsObj => Object.keys(brandsObj));

export const ALL_PRODUCTS = Object.values(CATEGORIES_BRANDS_PRODUCTS).flatMap(brandsObj => 
  Object.values(brandsObj).flat()
);

export const YEARS = [2024, 2025, 2026];

export const QUARTERS = ["Q1", "Q2", "Q3", "Q4"];

export const MONTHS = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December"
];

export const AGE_GROUPS = ['18-24', '25-34', '35-44', '45-54', '55+'] as const;

export const GENDERS = ['Male', 'Female', 'Other'] as const;
