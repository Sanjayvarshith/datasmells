
import pandas as pd, numpy as np, io, base64, matplotlib.pyplot as plt, seaborn as sns
# from dython.nominal import cramers_v
# To check and visualize the correlation between the features in the dataset
def generate_heatmap(df):
    # when the correlation map is empty due to data type mismatch, return None
    corr = df.corr()
    if corr.empty:
        return None
        # # use cramers_v to check correlation between categorical features

        # cat_cols = df.select_dtypes(include=['object']).columns
        # if len(cat_cols) > 1:
        #     corr_matrix = pd.DataFrame(index=cat_cols, columns=cat_cols)
        #     # plot the correlation heatmap
        #     for i in range(len(cat_cols)):
        #         for j in range(i):
        #             corr_matrix.iloc[i, j] = cramers_v(df[cat_cols[i]], df[cat_cols[j]])
        #             corr_matrix.iloc[j, i] = corr_matrix.iloc[i, j]
        #     plt.figure(figsize=(10, 10))
        #     sns.heatmap(corr_matrix, annot=True, cmap='coolwarm', fmt='.2f')
        #     # Save the plot to a BytesIO object
        #     img_bytes = io.BytesIO()
        #     plt.savefig(img_bytes, format='png')
        #     img_bytes.seek(0)
        #     # Encode the image data as base64 string
        #     img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
        #     plt.close()
        #     return img_base64
        # else:
        #     return None

            # return 


    plt.imshow(corr, cmap='coolwarm', interpolation='none')
    plt.xticks(range(len(corr.columns)), corr.columns, rotation=90)
    plt.yticks(range(len(corr.columns)), corr.columns)
    plt.colorbar()
    # Save the plot to a BytesIO object
    img_bytes = io.BytesIO()
    plt.savefig(img_bytes, format='png')
    img_bytes.seek(0)
    # Encode the image data as base64 string
    img_base64 = base64.b64encode(img_bytes.read()).decode('utf-8')
    plt.close()
    return img_base64



def correlated(df):
    # Compute the correlation matrix
    corr_matrix = df.corr() 
    instr = []
    if corr_matrix.empty:
        # print("There are no highly correlated features in the dataset.")
        instr.append("There are no highly correlated features in the dataset.\n")
        return instr
    # Identify highly correlated features
    high_corr_features = set()
    for i in range(len(corr_matrix.columns)):
        for j in range(i):
            if abs(corr_matrix.iloc[i, j]) > 0.7: # Change the threshold value as needed
                colname = corr_matrix.columns[i]
                high_corr_features.add(colname)
    # Highest cvalue of correlation on non-diagonal elements
    max_corr = corr_matrix.where(np.triu(np.ones(corr_matrix.shape), k=1).astype(np.bool_)).stack().max()
    print("Maximum correlation value among any two values:", max_corr)
    # instr += "Maximum correlation value among any two values: " + str(max_corr) + "\n"
    instr.append("Maximum correlation value among any two distinct values: " + str(max_corr) + "\n")

    # print giving info
    if len(high_corr_features) > 0:
        print("There are highly correlated features in the dataset.")
        print("Number of highly correlated features:", len(high_corr_features))
        print("Highly correlated features:", high_corr_features)
        # instr += "There are highly correlated features in the dataset.\n"
        # instr += "Number of highly correlated features: " + str(len(high_corr_features)) + "\n"
        # instr += "Highly correlated features: " + str(high_corr_features) + "\n"
        instr.extend(["There are highly correlated features in the dataset.\n", "Number of highly correlated features: " + str(len(high_corr_features)) + "\n", "Highly correlated features: " + str(high_corr_features) + "\n"])

    else:
        print("There are no highly correlated features in the dataset.")
        # instr += "There are no highly correlated features in the dataset.\n"
        instr.append("There are no highly correlated features in the dataset.\n")

    return instr
