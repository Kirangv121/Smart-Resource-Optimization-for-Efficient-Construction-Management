const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fs = require("fs");
const pickle = require("pickle-loader");

// ✅ Load Trained Models
const materialModel = pickle.load(fs.readFileSync("material_model.pkl"));
const laborModel = pickle.load(fs.readFileSync("labor_model.pkl"));
const encoder = pickle.load(fs.readFileSync("encoder.pkl"));

const app = express();
app.use(cors());
app.use(bodyParser.json());

// ✅ API Endpoint for Predictions
app.post("/predict", (req, res) => {
  const { construction_type, size_sqft } = req.body;

  // Encode Construction Type
  const encodedType = encoder.transform([[construction_type]])[0];

  // Create Input Array
  const inputData = [size_sqft, ...encodedType];

  // Get Predictions
  const predictedMaterialCost = materialModel.predict([inputData])[0];
  const predictedLaborRequired = laborModel.predict([inputData])[0];

  res.json({
    predicted_material_cost: Math.round(predictedMaterialCost),
    predicted_labor_required: Math.round(predictedLaborRequired),
  });
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
