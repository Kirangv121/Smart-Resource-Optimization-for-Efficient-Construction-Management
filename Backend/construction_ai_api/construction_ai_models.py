# construction_ai_models.py

import numpy as np
from sklearn.ensemble import GradientBoostingRegressor, RandomForestClassifier
from sklearn.linear_model import LinearRegression
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import LSTM, Dense, Dropout 
import xgboost as xgb
import shap

class ResourceForecaster:
    def __init__(self, model_type='gbm'):
        self.model_type = model_type
        self.model = self._create_model()

    def _create_model(self):
        if self.model_type == 'gbm':
            return GradientBoostingRegressor(n_estimators=100, learning_rate=0.1, max_depth=5, random_state=42)
        elif self.model_type == 'lstm':
            model = Sequential([
                LSTM(50, activation='relu', input_shape=(30, 1), return_sequences=True),
                Dropout(0.2),
                LSTM(30, activation='relu'),
                Dense(1)
            ])
            model.compile(optimizer='adam', loss='mse')
            return model

    def train(self, X, y):
        if self.model_type == 'lstm':
            X = X.reshape((X.shape[0], X.shape[1], 1))
        self.model.fit(X, y)

    def predict(self, X):
        if self.model_type == 'lstm':
            X = X.reshape((X.shape[0], X.shape[1], 1))
        return self.model.predict(X)


class DelayPredictor:
    def __init__(self, model_type='rf'):
        self.model_type = model_type
        self.model = self._create_model()
        self.explainer = None

    def _create_model(self):
        if self.model_type == 'rf':
            return RandomForestClassifier(n_estimators=100, max_depth=10, random_state=42)
        elif self.model_type == 'xgb':
            return xgb.XGBClassifier(n_estimators=100, max_depth=5, learning_rate=0.1)

    def train(self, X, y):
        self.model.fit(X, y)
        if self.model_type == 'xgb':
            self.explainer = shap.TreeExplainer(self.model)

    def predict(self, X):
        return self.model.predict_proba(X)

    def explain_prediction(self, X):
        if self.explainer is None:
            return None
        shap_values = self.explainer.shap_values(X)
        return shap_values


class CarbonEstimator:
    def __init__(self):
        self.material_impact_model = GradientBoostingRegressor()
        self.transport_impact_model = LinearRegression()
        self.emission_factors = {
            'concrete': 0.12,
            'steel': 1.85,
            'timber': 0.03,
        }

    def train(self, X_materials, y_materials, X_transport, y_transport):
        self.material_impact_model.fit(X_materials, y_materials)
        self.transport_impact_model.fit(X_transport, y_transport)

    def predict_total_impact(self, material_data, transport_data):
        material_impact = self.material_impact_model.predict(material_data)
        transport_impact = self.transport_impact_model.predict(transport_data)
        return material_impact + transport_impact

    def calculate_material_impact(self, material_type, quantity):
        return self.emission_factors.get(material_type, 0) * quantity
