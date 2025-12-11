"""
Neighborhood Price Analysis

This module finds the neighborhood with the highest median price difference.
"""

import pandas as pd
# Import from data_loader (original module name) or airbnb_data_loader
try:
    from data_loader import load_data
except ImportError:
    from airbnb_data_loader import load_data


def neighbourhood_with_highest_median_price_diff(df_listings: pd.DataFrame, df_reviews: pd.DataFrame) -> str:
    """
    Finds the neighborhood with the highest median price difference.
    
    The price difference is calculated as the difference between the highest
    and lowest median prices within each neighborhood (typically across different
    room types or property types).
    
    Args:
        df_listings: DataFrame containing Airbnb listings data
        df_reviews: DataFrame containing Airbnb reviews data (may not be used)
        
    Returns:
        str: Name of the neighborhood with the highest median price difference
        
    Algorithm:
        1. Group listings by neighborhood
        2. Calculate median price for each grouping (e.g., room_type) within neighborhood
        3. Find the difference between max and min median prices in each neighborhood
        4. Return the neighborhood with the highest difference
    """
    
    # Make a copy to avoid modifying original
    listings = df_listings.copy()
    
    # Common column name variations - try different possibilities
    price_col = None
    neighborhood_col = None
    room_type_col = None
    
    # Find price column (common names)
    for col in listings.columns:
        if 'price' in col.lower():
            price_col = col
            break
    
    # Find neighborhood column
    for col in listings.columns:
        if 'neighbourhood' in col.lower() or 'neighborhood' in col.lower():
            neighborhood_col = col
            break
    
    # Find room_type column
    for col in listings.columns:
        if 'room_type' in col.lower():
            room_type_col = col
            break
    
    # Validate that we found required columns
    if price_col is None:
        raise ValueError("Could not find price column in listings data")
    if neighborhood_col is None:
        raise ValueError("Could not find neighborhood column in listings data")
    
    # Clean price data - remove currency symbols, convert to numeric
    listings[price_col] = listings[price_col].astype(str).str.replace('$', '').str.replace(',', '')
    listings[price_col] = pd.to_numeric(listings[price_col], errors='coerce')
    
    # Remove rows with missing price or neighborhood
    listings_clean = listings.dropna(subset=[price_col, neighborhood_col])
    
    # Strategy 1: If room_type exists, find difference between room types in each neighborhood
    if room_type_col:
        # Calculate median price per neighborhood and room type
        median_prices = listings_clean.groupby([neighborhood_col, room_type_col])[price_col].median().reset_index()
        
        # For each neighborhood, find the difference between max and min median prices
        price_diff = median_prices.groupby(neighborhood_col)[price_col].agg(['max', 'min'])
        price_diff['difference'] = price_diff['max'] - price_diff['min']
        
        # Find neighborhood with highest difference
        result = price_diff['difference'].idxmax()
        
    # Strategy 2: If no room_type, use property_type or just overall variation
    else:
        # Try property_type column
        property_type_col = None
        for col in listings.columns:
            if 'property_type' in col.lower():
                property_type_col = col
                break
        
        if property_type_col:
            # Calculate median price per neighborhood and property type
            median_prices = listings_clean.groupby([neighborhood_col, property_type_col])[price_col].median().reset_index()
            
            # For each neighborhood, find the difference between max and min median prices
            price_diff = median_prices.groupby(neighborhood_col)[price_col].agg(['max', 'min'])
            price_diff['difference'] = price_diff['max'] - price_diff['min']
            
            # Find neighborhood with highest difference
            result = price_diff['difference'].idxmax()
        else:
            # Fallback: Use overall price range (75th percentile - 25th percentile) per neighborhood
            price_diff = listings_clean.groupby(neighborhood_col)[price_col].quantile([0.25, 0.75]).unstack()
            price_diff['difference'] = price_diff[0.75] - price_diff[0.25]
            result = price_diff['difference'].idxmax()
    
    return str(result)


''' 
MANDATORY - Explain your solution in plain english here

SOLUTION EXPLANATION:

1. **Data Preparation**: 
   - First, I identify the relevant columns (price, neighborhood, room_type/property_type)
   - Clean the price column by removing currency symbols ($) and commas
   - Convert prices to numeric format
   - Remove rows with missing price or neighborhood data

2. **Price Difference Calculation**:
   - The function tries multiple strategies based on available columns:
   
   a) **Strategy 1 (Preferred)**: If room_type column exists:
      - Groups listings by neighborhood AND room_type
      - Calculates median price for each neighborhood-room_type combination
      - For each neighborhood, finds the maximum and minimum median prices across different room types
      - Calculates the difference (max - min)
   
   b) **Strategy 2**: If property_type column exists (but no room_type):
      - Same approach but using property_type instead of room_type
   
   c) **Strategy 3 (Fallback)**: If neither exists:
      - Uses interquartile range (75th percentile - 25th percentile) as a measure of price variation
      - This captures price spread within each neighborhood

3. **Result**:
   - Returns the neighborhood name that has the highest price difference
   - This neighborhood has the most variation in prices (likely due to diverse property/room types)

**Why this approach?**
- Airbnb neighborhoods often have different property types (entire homes, private rooms, shared rooms)
- The median price difference captures the economic diversity within a neighborhood
- A high difference indicates a mix of luxury and budget options in the same area

COMMENTS END
'''

if __name__ == '__main__':
    print('Loading data...')
    listings_df, reviews_df = load_data()
    
    print('Analyzing neighborhoods...')
    result = neighbourhood_with_highest_median_price_diff(listings_df, reviews_df)
    print(f'Neighborhood with highest price difference: {result}')

