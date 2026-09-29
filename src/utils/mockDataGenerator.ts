import type { ConsumerRecord } from '../types';
import { 
  STATES_AND_CITIES, 
  CATEGORIES_BRANDS_PRODUCTS, 
  YEARS, 
  MONTHS, 
  AGE_GROUPS, 
  GENDERS 
} from '../constants';

// Seeded random number generator for determinism
function createRandom(seed: number) {
  let s = seed;
  return function() {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
}

export function generateMockData(): ConsumerRecord[] {
  const rand = createRandom(42); // Seeded random generator
  const records: ConsumerRecord[] = [];
  let idCounter = 1;

  // Let's loop through variables to generate a rich set of data (~2000+ points)
  YEARS.forEach((year) => {
    MONTHS.forEach((month, monthIdx) => {
      // Find Quarter
      let quarter = "Q1";
      if (monthIdx >= 3 && monthIdx < 6) quarter = "Q2";
      else if (monthIdx >= 6 && monthIdx < 9) quarter = "Q3";
      else if (monthIdx >= 9) quarter = "Q4";

      // Base multiplier for seasonality (Festive season peak in Q4 - Oct, Nov, Dec)
      let seasonMultiplier = 1.0;
      if (month === "October" || month === "November") seasonMultiplier = 1.45; // Diwali / Dussehra
      else if (month === "December") seasonMultiplier = 1.3; // Christmas / New Year
      else if (month === "May" || month === "June") seasonMultiplier = 1.15; // Summer sales

      // Year-over-year organic market growth
      const yearMultiplier = year === 2024 ? 1.0 : year === 2025 ? 1.15 : 1.32;

      // Loop through States
      Object.entries(STATES_AND_CITIES).forEach(([state, cities]) => {
        // State multiplier (larger states have more weight)
        let stateMultiplier = 1.0;
        if (state === "Maharashtra") stateMultiplier = 1.5;
        else if (state === "Delhi") stateMultiplier = 1.35;
        else if (state === "Karnataka") stateMultiplier = 1.25;
        else if (state === "Uttar Pradesh") stateMultiplier = 1.15;
        else if (state === "Tamil Nadu") stateMultiplier = 1.2;
        else stateMultiplier = 0.85;

        cities.forEach((city) => {
          // City multiplier
          let cityMultiplier = 1.0;
          if (["Mumbai", "Delhi NCR", "Bangalore", "Chennai", "Kolkata", "Hyderabad"].includes(city)) {
            cityMultiplier = 1.4;
          } else {
            cityMultiplier = 0.8;
          }

          // Loop through Categories
          Object.entries(CATEGORIES_BRANDS_PRODUCTS).forEach(([category, brandsObj]) => {
            // Category multiplier
            let categoryMultiplier = 1.0;
            if (category === "Electronics") categoryMultiplier = 1.3;
            else if (category === "Food & Beverages") categoryMultiplier = 1.2;
            else if (category === "Personal Care") categoryMultiplier = 0.95;
            else categoryMultiplier = 0.8;

            Object.entries(brandsObj).forEach(([brand, products]) => {
              // Brand multiplier
              let brandMultiplier = 1.0;
              if (["Apple", "Amul", "HUL", "Zara"].includes(brand)) brandMultiplier = 1.3;
              else if (["Samsung", "Britannia", "Colgate", "Aditya Birla"].includes(brand)) brandMultiplier = 1.15;

              products.forEach((product) => {
                // Generate a data point for this product in this city/month/year
                // To keep performance high and not blow up file size, we selectively
                // sample combination records based on a seed rule.
                const sampleProbability = 0.35; // Sample 35% of all combinations
                if (rand() > sampleProbability) return;

                // Base values
                const baseRevenue = 50000; // in INR

                // Product specific multiplier
                let productMultiplier = 0.8 + rand() * 0.4;
                if (product.includes("iPhone") || product.includes("Amul Butter") || product.includes("Surf Excel") || product.includes("Trends Kurti")) {
                  productMultiplier = 1.4;
                }

                // Calculate random variation
                const variation = 0.9 + rand() * 0.2; // +/- 10%

                const revenue = Math.round(
                  baseRevenue * 
                  yearMultiplier * 
                  seasonMultiplier * 
                  stateMultiplier * 
                  cityMultiplier * 
                  categoryMultiplier * 
                  brandMultiplier * 
                  productMultiplier * 
                  variation
                );

                const avgPrice = product.includes("iPhone") || product.includes("Smart TV") || product.includes("MacBook") || product.includes("Suit")
                  ? 45000 : product.includes("Blazer") || product.includes("Headphones") || product.includes("Smartwatch") || product.includes("Boots")
                  ? 3500 : product.includes("Shampoo") || product.includes("Cream") || product.includes("Atta") || product.includes("Butter")
                  ? 350 : 50;

                const sales = Math.round(revenue / avgPrice) || 1;
                const consumerCount = Math.round(sales * (0.8 + rand() * 0.35));

                // Growth % (YoY comparison approximation)
                const baseGrowth = 5 + rand() * 15; // 5% to 20%
                let growth = parseFloat(baseGrowth.toFixed(1));
                if (year === 2024) growth = parseFloat((baseGrowth - 5).toFixed(1)); // slightly lower in 2024
                else if (year === 2026) growth = parseFloat((baseGrowth + 3).toFixed(1)); // accelerating in 2026

                // Market share within the category (1% to 25%)
                const marketShare = parseFloat((2 + rand() * 18).toFixed(1));

                // Demographics
                const ageGroup = AGE_GROUPS[Math.floor(rand() * AGE_GROUPS.length)];
                const gender = GENDERS[Math.floor(rand() * GENDERS.length)];

                // Date construction
                const formattedDate = `${year}-${String(monthIdx + 1).padStart(2, '0')}-15`;

                records.push({
                  id: `MP-${idCounter++}`,
                  state,
                  city,
                  brand,
                  category,
                  product,
                  revenue,
                  sales,
                  consumerCount,
                  marketShare,
                  growth,
                  date: formattedDate,
                  month,
                  year,
                  quarter,
                  ageGroup,
                  gender
                });
              });
            });
          });
        });
      });
    });
  });

  return records;
}
