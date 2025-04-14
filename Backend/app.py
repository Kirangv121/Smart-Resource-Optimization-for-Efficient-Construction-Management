import numpy as np
import pandas as pd
import pickle
from sklearn.model_selection import train_test_split
from sklearn.linear_model import LinearRegression
from sklearn.preprocessing import OneHotEncoder

# ✅ Generate Sample Construction Data
data = {
    "construction_type": ["House", "Building", "School", "Commercial", "Warehouse"] * 20,
    "size_sqft": np.random.randint(500, 5000, 100),  # Random sizes (500 - 5000 sqft)
    "materials_cost": np.random.randint(10000, 200000, 100),  # Random cost (10k - 200k)
    "labor_required": np.random.randint(5, 50, 100)  # Random labor (5 - 50 workers)
}

df = pd.DataFrame(data)

# ✅ Encode Categorical Feature (Construction Type)
encoder = OneHotEncoder(sparse_output=False)
encoded_types = encoder.fit_transform(df[["construction_type"]])
encoded_df = pd.DataFrame(encoded_types, columns=encoder.get_feature_names_out())

# ✅ Merge Encoded Data
df = df.drop("construction_type", axis=1)
df = pd.concat([df, encoded_df], axis=1)

# ✅ Split Data into Train/Test Sets
X = df.drop(["materials_cost", "labor_required"], axis=1)
y_materials = df["materials_cost"]
y_labor = df["labor_required"]

X_train, X_test, y_materials_train, y_materials_test = train_test_split(X, y_materials, test_size=0.2, random_state=42)
X_train, X_test, y_labor_train, y_labor_test = train_test_split(X, y_labor, test_size=0.2, random_state=42)

# ✅ Train ML Models
material_model = LinearRegression()
labor_model = LinearRegression()

material_model.fit(X_train, y_materials_train)
labor_model.fit(X_train, y_labor_train)

# ✅ Save Models for Deployment
with open("material_model.pkl", "wb") as file:
    pickle.dump(material_model, file)

with open("labor_model.pkl", "wb") as file:
    pickle.dump(labor_model, file)

with open("encoder.pkl", "wb") as file:
    pickle.dump(encoder, file)

print("✅ Models Trained & Saved Successfully!")
