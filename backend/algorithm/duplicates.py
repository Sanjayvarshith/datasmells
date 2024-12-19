# @Date: 2023-03-02
# @Title: This program checks for duplicates in the dataset.


import pandas as pd, numpy as np, io, base64, matplotlib.pyplot as plt, seaborn as sns

# To check for duplicates in the dataset
def duplicated(df):
    duplicates = df.duplicated()
    instr = ''
    if any(duplicates):
        # print("Duplicate examples are present in the dataset.")
        # print("Number of duplicate examples:", duplicates.sum())
        # print("Indices of duplicate examples:", df.index[duplicates].tolist())
        instr += "Duplicate examples are present in the dataset.\n"
        instr += "Number of duplicate examples: " + str(duplicates.sum()) + "\n"
        instr += f"Percentage of duplicate examples: {round(duplicates.sum() / df.shape[0] * 100, 3)} %\n"
        dl = df.index[duplicates].tolist()
        instr += "Indices of duplicate examples: " + str(dl[: min(len(dl), 30)]) + "\n"
        if len(dl) > 30:
            instr += "(Only the first 30 duplicate examples are shown.)\n"

    else:
        # print("There are no duplicate examples in the dataset.")
        instr += "There are no duplicate examples in the dataset.\n"

    return instr
