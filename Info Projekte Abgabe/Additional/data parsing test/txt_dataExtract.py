import pandas as pd
import re

# Read lines from the text file
with open('data.txt', 'r') as file:
    lines = file.readlines()

# Remove strings of the form 'FluidSimEuler.js:number:otherNumber'
lines = [re.sub(r' FluidSimEuler\.js:\d+:\d+', '', line) for line in lines]

# Split the remaining strings by commas and store them in a list of lists
data = [line.strip().split(',') for line in lines]

# Create a DataFrame from the data
df = pd.DataFrame(data)

# Convert columns to numeric data type only if all values in the column are numbers
for col in df.columns:
    if pd.to_numeric(df[col], errors='coerce').notnull().all():
        df[col] = pd.to_numeric(df[col])

# Write the DataFrame to an Excel file, setting the decimal separator to ','
df.to_excel('output.xlsx', index=False)

print("Data has been written to 'output.xlsx' with each column separated.")
