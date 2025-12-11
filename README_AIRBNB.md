# Airbnb Data Analysis Project

A Python-based data analysis project for analyzing Airbnb listings and reviews datasets.

## 📋 Project Overview

This project provides tools to load, analyze, and visualize Airbnb listings and reviews data from Google Cloud Storage.

## 🚀 Quick Start

### Prerequisites

- Python 3.8 or higher
- pip (Python package installer)

### Installation

1. **Install required packages:**
   ```bash
   pip install -r requirements_airbnb.txt
   ```

2. **Load the data:**
   ```python
   from airbnb_data_loader import load_data
   
   listings_df, reviews_df = load_data()
   ```

## 📁 Project Structure

```
Project_Mgt/
├── airbnb_data_loader.py      # Main data loading module
├── requirements_airbnb.txt     # Python dependencies
├── README_AIRBNB.md           # This file
└── [analysis scripts]          # Your analysis notebooks/scripts
```

## 📊 Data Sources

### Listings Dataset
- **URL**: `https://storage.googleapis.com/public-data-337819/listings%202%20reduced.csv`
- Contains Airbnb property listings information

### Reviews Dataset
- **URL**: `https://storage.googleapis.com/public-data-337819/reviews%202%20reduced.csv`
- Contains Airbnb guest reviews

## 🔧 Usage Examples

### Basic Data Loading

```python
from airbnb_data_loader import load_data

# Load both datasets
listings_df, reviews_df = load_data()

# Access the data
print(listings_df.head())
print(reviews_df.head())
print(f"Total listings: {len(listings_df)}")
print(f"Total reviews: {len(reviews_df)}")
```

### Get Dataset Information

```python
from airbnb_data_loader import get_data_info

# Get detailed information about the datasets
info = get_data_info()

print(f"Listings: {info['listings']['rows']} rows")
print(f"Reviews: {info['reviews']['rows']} rows")
print(f"Listings columns: {info['listings']['column_names']}")
```

### Error Handling

```python
from airbnb_data_loader import load_data
import logging

logging.basicConfig(level=logging.INFO)

try:
    listings_df, reviews_df = load_data()
    print("Data loaded successfully!")
except Exception as e:
    print(f"Error loading data: {e}")
```

## 📈 Analysis Ideas

### Potential Analysis Topics:

1. **Price Analysis**
   - Average prices by location
   - Price trends over time
   - Price vs. property features

2. **Review Analysis**
   - Sentiment analysis of reviews
   - Average ratings by location
   - Review trends and patterns

3. **Property Analysis**
   - Most popular property types
   - Amenities impact on ratings
   - Availability analysis

4. **Location Analysis**
   - Best performing neighborhoods
   - Geographic distribution of listings
   - Location-based pricing

5. **Host Analysis**
   - Superhost vs. regular host performance
   - Host response rates
   - Multiple listings analysis

## 🛠️ Features

- ✅ **Easy Data Loading**: Simple function to load datasets
- ✅ **Error Handling**: Comprehensive error handling and logging
- ✅ **Type Hints**: Full type annotations for better code clarity
- ✅ **Logging**: Built-in logging for debugging
- ✅ **Data Info**: Utility function to get dataset information
- ✅ **Memory Efficient**: Uses `low_memory=False` for proper data type inference

## 📦 Dependencies

- **pandas**: Data manipulation and analysis
- **numpy**: Numerical computing
- **matplotlib**: Basic plotting
- **seaborn**: Statistical visualization
- **plotly**: Interactive visualizations
- **scipy**: Scientific computing
- **scikit-learn**: Machine learning tools
- **jupyter**: Interactive notebooks

## 🔍 Data Exploration

### Quick Data Overview

```python
import pandas as pd
from airbnb_data_loader import load_data

listings, reviews = load_data()

# Basic statistics
print("Listings Info:")
print(listings.info())
print("\nListings Describe:")
print(listings.describe())

print("\nReviews Info:")
print(reviews.info())
print("\nReviews Describe:")
print(reviews.describe())

# Check for missing values
print("\nMissing Values in Listings:")
print(listings.isnull().sum())

print("\nMissing Values in Reviews:")
print(reviews.isnull().sum())
```

## 📝 Notes

- The datasets are loaded from Google Cloud Storage
- Data is loaded in memory - ensure sufficient RAM for large datasets
- First load may take time depending on network speed
- Consider caching data locally for repeated analysis

## 🐛 Troubleshooting

### Connection Issues
- Check your internet connection
- Verify the URLs are accessible
- Try loading during off-peak hours

### Memory Issues
- Load datasets separately if memory is limited
- Consider chunking large datasets
- Close other applications to free up memory

### Import Errors
- Ensure all dependencies are installed: `pip install -r requirements_airbnb.txt`
- Check Python version: `python --version` (should be 3.8+)

## 📚 Next Steps

1. Explore the data structure
2. Clean and preprocess the data
3. Perform exploratory data analysis (EDA)
4. Create visualizations
5. Build predictive models
6. Generate insights and reports

## 🤝 Contributing

Feel free to add analysis scripts, notebooks, or improve the data loader!

## 📄 License

This project is for educational and analysis purposes.

---

**Happy Analyzing! 🎉**

