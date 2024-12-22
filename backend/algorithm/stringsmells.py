# @Date: 2020-09-27
# @Description: This program checks for string smells in the dataset.

import re, matplotlib.pyplot as plt, io, base64, numpy as np, pandas as pd

special_char_present = False
# @Description: To check for special characters in the dataset
def detect_special_characters(df):
    special_char_features = []
    code = ''; s = ''
    try :
        for col in df.columns:
            if df[col].dtype == 'object':
                pattern = re.compile('[^A-Za-z0-9\s]+')
                match = pattern.search(df[col].iloc[0])
                if match:
                    special_char_features.append(col)
        if len(special_char_features) > 0:
            global special_char_present; special_char_present = True
            s = "There are features with special characters in the dataset.\n"
            s += "Features with special characters: " + str(special_char_features[:8] )
            if len(special_char_features) > 8:
                s += "...\n"
            else:
                s += "\n"
            s+= f' Code for refactoring: \n'
            code += f'''
    for col in df.columns:
        if df[col].dtype == 'object':
            pattern = re.compile('[^A-Za-z0-9\s]+')
            match = pattern.search(df[col].iloc[0])
            if match:
                # remove special characters
                df[col] = df[col].str.replace('[^A-Za-z0-9\s]+', '')
                # remove leading and trailing spaces
                df[col] = df[col].str.strip()
                # convert to lowercase
                df[col] = df[col].str.lower()
                print(df[col].head())\n'''
        else:
            s = "There are no features with special characters in the dataset."
    except Exception as e:
        s = "There are no features with special characters in the dataset."
        # s = "Nil."
        # print(e)
    return s, code


# @Description: This function generates a bargraph for the number of special characters in each feature.
def generate_bargraph_special_characters(df):
    if not special_char_present:
        return None
    try:
        pres = {num : 0 for num in df.columns if df[num].str.contains('[^A-Za-z0-9\s]+').sum()}
        for num in df.columns:
            if df[num].str.contains('[^A-Za-z0-9\s]+').sum():
                pres[num] = df[num].str.contains('[^A-Za-z0-9\s]+').sum()
        plt.bar(pres.keys(), pres.values())
        plt.xticks(rotation=90)
        # Save the plot to a BytesIO object
        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)
        # Encode the image data as base64 string
        img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
        plt.close()

        return img_base64
    
    except Exception as e:
        # print(e)
        return None
    

def refactor_special_char(df):
    try:
        for col in df.columns:
            if df[col].dtype == 'object':
                pattern = re.compile('[^A-Za-z0-9\s]+')
                match = pattern.search(df[col].iloc[0])
                if match:
                    # Remove special characters
                    df[col] = df[col].str.replace('[^A-Za-z0-9\s]+', '', regex=True)
                    # Remove leading and trailing spaces
                    df[col] = df[col].str.strip()
                    # Convert to lowercase
                    df[col] = df[col].str.lower()
        return df
    except Exception as e:
        return df

# Detecting Trailng Spaces
'''# create a list to store the column names with trailing spaces
cols_with_trailing_spaces = []

# loop through each column in the dataset
for col in df.columns:
    # check if the column is a string type
    if df[col].dtype == 'object':
        # check if the column contains trailing spaces
        if df[col].str.endswith(' ').any():
            cols_with_trailing_spaces.append(col)

# print the columns with trailing spaces
if len(cols_with_trailing_spaces) > 0:
    print("There are columns with trailing spaces in the dataset.")
    print("Columns with trailing spaces:", cols_with_trailing_spaces)
else:
    print("There are no columns with trailing spaces in the dataset.")

    
# Check for different string interpretations due to capital letters usage
for col in df.select_dtypes(include=['object']):
    unique_vals = df[col].str.lower().unique()
    if len(unique_vals) != len(set(unique_vals)):
        print(f"Column '{col}' contains different string interpretations due to capital letters usage")'''

trailing_spaces_present = False
# @Description: This function detects trailing spaces in the dataset.
def trailing_spaces(df):
    code = ''; s = ''
    try:
        cols_with_trailing_spaces = []
        for col in df.columns:
            if df[col].dtype == 'object':
                if df[col].str.endswith(' ').any():
                    cols_with_trailing_spaces.append(col)
        if len(cols_with_trailing_spaces) > 0:
            global trailing_spaces_present; trailing_spaces_present = True
            s = "There are columns with trailing spaces in the dataset."
            s += "Columns with trailing spaces: " + str(cols_with_trailing_spaces[:8])
            if len(cols_with_trailing_spaces) > 8:
                s += "...\n"
            s+= f' Code for refactoring: \n'
            code += f'''
    # # refactoring: 
    # for col in df.select_dtypes(include=['object']):
    #     df[col] = df[col].str.strip()'''
        else:
            s = "There are no columns with trailing spaces in the dataset."
    except Exception as e:
        s = "There are no columns with trailing spaces in the dataset."
        # s = "Nil."
        # print(e)
    return s, code

def refactor_trailing_spaces(df):
    try:
        # Loop through each column and remove trailing spaces from string columns
        for col in df.columns:
            if df[col].dtype == 'object':  # Only consider object (string) columns
                df[col] = df[col].str.strip()  # Remove leading and trailing spaces
        return df
    except Exception as e:
        # If any exception occurs, return the original dataframe
        return df


# @Description: This function generates a bargraph for the number of trailing spaces in each feature.
def generate_bargraph_trailing_spaces(df):
    global trailing_spaces_present
    if not trailing_spaces_present:
        return None
    try: 
        pres = {num : 0 for num in df.columns if df[num].str.endswith(' ').sum()}
        for num in df.columns:
            if df[num].str.endswith(' ').sum():
                pres[num] = df[num].str.endswith(' ').sum()
        plt.bar(pres.keys(), pres.values())
        plt.xticks(rotation=90)
        # Save the plot to a BytesIO object
        img_bytes = io.BytesIO()
        plt.savefig(img_bytes, format='png')
        img_bytes.seek(0)
        # Encode the image data as base64 string
        img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
        plt.close()

        return img_base64
    except Exception as e:
        return None

# Strings in Human Friendly Format

human_friendly_present = False
def human_friendly(df):
    code = ''; s = ''

    pattern = r'^\d{1,3}(,\d{3})*(\.\d+)?$'
    hum = False
    for col in df.columns:
        if df[col].dtype == 'object':
            if df[col].str.match(pattern).all():
                hum = True
    if hum:
        global human_friendly_present; human_friendly_present = True
        s = "There are human-friendly formats in the dataset."
        s+= f' Code for refactoring: \n'
        code += f'''
# # refactoring:
for col in df.columns:
    if df[col].dtype == 'object':
        if df[col].str.match(pattern).all():
            # detected human-friendly format
            # Convert human-friendly format to float
            df[col] = df[col].str.replace(',', '').astype(float)'''
    else:
        s = "There are no human-friendly formats in the dataset."
    return s, code

def refactor_human_friendly(df):
    try:
        pattern = r'^\d{1,3}(,\d{3})*(\.\d+)?$'
        for col in df.columns:
            if df[col].dtype == 'object':
                if df[col].str.match(pattern).all():
                    # Remove commas and convert to float
                    df[col] = df[col].str.replace(',', '').astype(float)
        return df
    except Exception as e:
        return df

def generate_bargraph_human_friendly(df):
    if not human_friendly_present:
        return None
    pattern = r'^\d{1,3}(,\d{3})*(\.\d+)?$'
    pres = {num : 0 for num in df.columns if df[num].str.match(pattern).all()}
    for num in df.columns:
        if df[num].str.match(pattern).all():
            pres[num] = df[num].str.match(pattern).all().sum()
    plt.bar(pres.keys(), pres.values())
    plt.xticks(rotation=90)
    # Save the plot to a BytesIO object
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    # Encode the image data as base64 string
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close()

    return img_base64


