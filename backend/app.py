# @Date: 2023-02-28
# @Title: The core backend Flask code that runs the server, communicates with the frontend using flask_cors, and calls the algorithms.

# pip install numpy panda seaborn matplotlib flask flask_cors
from algorithm.sp_missingvalues import *
from algorithm.correlated import *
from algorithm.outliers import *
from algorithm.duplicates import *
from algorithm.imbalance import *
from algorithm.stringsmells import *
import json

# Datasets/concrete.csv
df = pd.read_csv('Datasets/concrete.csv')

from flask import Flask, request, jsonify, send_file
from flask_cors import CORS
import pandas as pd, numpy as np, io, base64, matplotlib.pyplot as plt, seaborn as sns

# Initialize the Flask application
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})



# route http posts to this method
@app.route('/upload', methods=['POST'])
def upload():
    file = request.files['file']
    global df
    df = pd.read_csv(file)
    print(df)
    results = {}
    results['num_rows'] = len(df)
    results['num_cols'] = len(df.columns)
    results['column_names'] = list(df.columns)
    results['duplicates'], df = duplicated(df)
    spd = SpecialMissingValues(df)
    results['sp_missing_values'] = {'Info': spd[0], 'InfoNan': spd[1], 'Code': spd[2], 'Code_Nan':spd[3],'splmissCols':spd[4],'missingPer':spd[5]}
    for col in spd[4]:  
        if df[col].dtype in ['float64', 'int64']:  
            df[col].fillna(df[col].mean(), inplace=True)
    spd = missing_values(df)
    results['missing_values'] = {'Info': spd[0],  'Code': spd[1],'missCols':spd[2], 'missPer':spd[3]}
    for col in spd[2]:  
        if df[col].dtype in ['float64', 'int64']: 
            df[col].fillna(df[col].mean(), inplace=True)
    results['heatmap'] = generate_heatmap(df)
    results['correlated'] = correlated(df)
    results['bargraph_miss'] = generate_bargraph_missing_values(df)
    results['bargraph_sp_miss'] = generate_bargraph_special_missing_values(df)
    results['bargraph_nan'] = generate_bargraph_nan_values(df)
    print(df)
    bnc = binning_cat(df)
    results['binning_cat'] = {'Info': bnc[0],  'Code': bnc[1], 'binCols': bnc[2], 'unqVals':bnc[3], 'plot': generate_bargraph_binning_cat(df)}
    imb = class_imbal(df)
    results['imbalance'] = {'Info': imb[0] + imb[1], 'imbCols': imb[2], 'imbRatio':imb[3],  'plot': generate_bargraph_class_imbal(df)}
    # Trailng Spaces, Special Characters, Human Friendly
    spcr = detect_special_characters(df)
    results['sp_char'] = {'Info': spcr[0], 'Code': spcr[1], 'plot': generate_bargraph_special_characters(df)}
    trsp = trailing_spaces(df)
    results['tr_spaces'] = {'Info': trsp[0], 'Code': trsp[1], 'plot': generate_bargraph_trailing_spaces(df)}
    humf = human_friendly(df)
    results['hum_friendly'] = {'Info': humf[0], 'Code': humf[1], 'plot': generate_bargraph_human_friendly(df)}
    outl = Outliers(df)
    results['outliers'] = {'Info': outl[0], 'Suggestion': outl[1], 'Code': outl[2], 'plot': generate_boxplot(df)}
    j = jsonify(results)
    # print(j)    
    return j



# @Use: Converts Excel Column Number to Column Name
def excelColnoToColNo(cn:str) :
    if type(cn)== int or cn.isdigit():
        cn = int(cn)
        if cn < 1:
            return 1
        return cn
    cn = cn.upper()
    for i in range(len(cn)):
        if not (ord(cn[i]) >= 65 and ord(cn[i]) <= 90):
            return -1
    if len(cn) == 1:
        # A->1
        return ord(cn) - 64
    elif len(cn) == 2:
        # AA->27
        return (ord(cn[0]) - 64) * 26 + (ord(cn[1]) - 64)
    
    elif len(cn) == 3:
        # AAA->703
        return (ord(cn[0]) - 64) * 26 * 26 + (ord(cn[1]) - 64) * 26 + (ord(cn[2]) - 64)
    else:
        ans = 0
        for i in range(len(cn)):
            ans += (ord(cn[i]) - 64) * 26 ** (len(cn) - i - 1)
        return ans
    
@app.route('/regularExp', methods=['POST'])
# @Use: Custom Data Smell Detection
def regularExp():
    global df
    #print(df)
    count = 0
    # initialize prefetching,
    colNo = 1
    regex = request.json['regex']
    colNo = request.json['colNo']


    colNo = excelColnoToColNo(colNo)
    #string to regex string
    #filtered_df = df[int(colNo)].str.match[(regex)]
    #print(filtered_df)
    # matches = df[col].astype(str).str.match(pattern)
    # Verify that the column is of type object, and colNo is an integer less than the number of columns
    # if df[df.columns[int(colNo)]].dtype == 'object' and int(colNo) < len(df.columns):
    if 0 < int(colNo) < len(df.columns)+1:
            
        matches  = df[df.columns[int(colNo)-1]].astype(str).str.match(regex)
        # print lentgh of matches
        #count where matches is true
        count = len(matches[matches == True].index)
        print(count, len(matches))
        percent__ = (count/len(matches)).__round__(5)*100
        colName = df.columns[int(colNo)-1]
        percent_ ='Column Name : '+ colName + f'\nPercentage of matches: {percent__}%'
        
        #print(matches)
        print(regex)
        print(colNo)
        print(count)
    else:
        count = 0
        percent__ = 0
        percent_ = f'Please enter a valid column number. It should be less than {len(df.columns)+1} and more than 0.\n Indexing starts from 1.'
    
    return jsonify({'count': count, 'percent': percent_})
if __name__ == '__main__':
    app.run(debug= True)

'''
# define the regular expression to match
regex_pattern = r'^[a-z]{3}[0-9]{2}$'

col_name = 'Custom Name'
# # filter the DataFrame using the regular expression
filtered_df = df[col_name].str.match(regex_pattern)]

# for col in filtered_df.columns:
#     filtered_df = filtered_df[filtered_df[col].str.match(regex_pattern)]

# print the filtered DataFrame
print(filtered_df)

# print the filtered DataFrame
print(filtered_df)

'''