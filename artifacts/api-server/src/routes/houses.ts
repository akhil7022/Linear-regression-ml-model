import { Router, type IRouter } from "express";
import { HOUSING_DATASET } from "../lib/dataset.js";
import { MODEL, predict } from "../lib/regression.js";
import {
  GetHousesResponse,
  GetModelResponse,
  PredictPriceBody,
  PredictPriceResponse,
} from "@workspace/api-zod";

const router: IRouter = Router();

router.get("/houses", async (_req, res): Promise<void> => {
  res.json(GetHousesResponse.parse(HOUSING_DATASET));
});

router.get("/model", async (_req, res): Promise<void> => {
  const { coefficients, rSquared, adjustedRSquared, rmse, mae, sampleSize } =
    MODEL;

  const stats = GetModelResponse.parse({
    intercept: coefficients.intercept,
    coefficients: [
      coefficients.sqft,
      coefficients.bedrooms,
      coefficients.bathrooms,
    ],
    featureNames: ["sqft", "bedrooms", "bathrooms"],
    rSquared,
    adjustedRSquared,
    rmse,
    mae,
    sampleSize,
  });

  res.json(stats);
});

router.post("/predict", async (req, res): Promise<void> => {
  const parsed = PredictPriceBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { sqft, bedrooms, bathrooms } = parsed.data;
  const predictedPrice = predict(sqft, bedrooms, bathrooms);

  const { coefficients } = MODEL;

  const result = PredictPriceResponse.parse({
    predictedPrice,
    features: { sqft, bedrooms, bathrooms },
    breakdown: [
      {
        feature: "Intercept",
        coefficient: coefficients.intercept,
        value: 1,
        contribution: coefficients.intercept,
      },
      {
        feature: "Square Footage",
        coefficient: coefficients.sqft,
        value: sqft,
        contribution: coefficients.sqft * sqft,
      },
      {
        feature: "Bedrooms",
        coefficient: coefficients.bedrooms,
        value: bedrooms,
        contribution: coefficients.bedrooms * bedrooms,
      },
      {
        feature: "Bathrooms",
        coefficient: coefficients.bathrooms,
        value: bathrooms,
        contribution: coefficients.bathrooms * bathrooms,
      },
    ],
  });

  res.json(result);
});

export default router;
