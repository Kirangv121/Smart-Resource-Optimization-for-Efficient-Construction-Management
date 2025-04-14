# main.py

from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
from Backend.construction_ai_api.construction_ai_models import ResourceForecaster, DelayPredictor, CarbonEstimator

app = FastAPI()
forecaster = ResourceForecaster(model_type='gbm')
predictor = DelayPredictor(model_type='rf')
carbon_tool = CarbonEstimator()

# Dummy training
X_dummy = np.random.rand(100, 10)
y_dummy = np.random.rand(100)
forecaster.train(X_dummy, y_dummy)

X_delay = np.random.rand(100, 8)
y_delay = np.random.randint(0, 2, 100)
predictor.train(X_delay, y_delay)

X_mat = np.random.rand(100, 3)
y_mat = np.random.rand(100)
X_trans = np.random.rand(100, 2)
y_trans = np.random.rand(100)
carbon_tool.train(X_mat, y_mat, X_trans, y_trans)

class ForecastInput(BaseModel):
    features: list[list[float]]

class DelayInput(BaseModel):
    features: list[list[float]]

class CarbonInput(BaseModel):
    material_type: str
    quantity: float

@app.post("/forecast-resource")
def forecast_resource(data: ForecastInput):
    X = np.array(data.features)
    preds = forecaster.predict(X).tolist()
    return {"predictions": preds}

@app.post("/predict-delay")
def predict_delay(data: DelayInput):
    X = np.array(data.features)
    probs = predictor.predict(X).tolist()
    return {"delay_probabilities": probs}

@app.post("/estimate-carbon")
def estimate_carbon(data: CarbonInput):
    impact = carbon_tool.calculate_material_impact(data.material_type, data.quantity)
    return {
        "material": data.material_type,
        "quantity": data.quantity,
        "estimated_emission": impact
    }
