import { HOUSING_DATASET, type House } from "./dataset.js";

export interface ModelCoefficients {
  intercept: number;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
}

export interface TrainedModel {
  coefficients: ModelCoefficients;
  rSquared: number;
  adjustedRSquared: number;
  rmse: number;
  mae: number;
  sampleSize: number;
  predictions: number[];
}

function matMul(A: number[][], B: number[][]): number[][] {
  const rows = A.length;
  const cols = B[0].length;
  const inner = B.length;
  const C: number[][] = Array.from({ length: rows }, () => Array(cols).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      for (let k = 0; k < inner; k++) {
        C[i][j] += A[i][k] * B[k][j];
      }
    }
  }
  return C;
}

function transpose(A: number[][]): number[][] {
  const rows = A.length;
  const cols = A[0].length;
  const T: number[][] = Array.from({ length: cols }, () => Array(rows).fill(0));
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      T[j][i] = A[i][j];
    }
  }
  return T;
}

function gaussJordanInverse(M: number[][]): number[][] {
  const n = M.length;
  const aug: number[][] = M.map((row, i) => {
    const identity = Array(n).fill(0);
    identity[i] = 1;
    return [...row, ...identity];
  });

  for (let col = 0; col < n; col++) {
    let pivotRow = col;
    let maxVal = Math.abs(aug[col][col]);
    for (let row = col + 1; row < n; row++) {
      if (Math.abs(aug[row][col]) > maxVal) {
        maxVal = Math.abs(aug[row][col]);
        pivotRow = row;
      }
    }
    [aug[col], aug[pivotRow]] = [aug[pivotRow], aug[col]];

    const pivot = aug[col][col];
    if (Math.abs(pivot) < 1e-12) {
      throw new Error("Matrix is singular and cannot be inverted");
    }
    for (let j = 0; j < 2 * n; j++) {
      aug[col][j] /= pivot;
    }

    for (let row = 0; row < n; row++) {
      if (row !== col) {
        const factor = aug[row][col];
        for (let j = 0; j < 2 * n; j++) {
          aug[row][j] -= factor * aug[col][j];
        }
      }
    }
  }

  return aug.map((row) => row.slice(n));
}

function trainLinearRegression(data: House[]): TrainedModel {
  const n = data.length;

  const X: number[][] = data.map((h) => [1, h.sqft, h.bedrooms, h.bathrooms]);
  const y: number[][] = data.map((h) => [h.price]);

  const Xt = transpose(X);
  const XtX = matMul(Xt, X);
  const XtXinv = gaussJordanInverse(XtX);
  const Xty = matMul(Xt, y);
  const beta = matMul(XtXinv, Xty);

  const intercept = beta[0][0];
  const sqftCoeff = beta[1][0];
  const bedroomsCoeff = beta[2][0];
  const bathroomsCoeff = beta[3][0];

  const predictions = data.map(
    (h) =>
      intercept +
      sqftCoeff * h.sqft +
      bedroomsCoeff * h.bedrooms +
      bathroomsCoeff * h.bathrooms,
  );

  const actualPrices = data.map((h) => h.price);
  const meanPrice = actualPrices.reduce((s, v) => s + v, 0) / n;

  const ssTot = actualPrices.reduce((s, v) => s + (v - meanPrice) ** 2, 0);
  const ssRes = actualPrices.reduce(
    (s, v, i) => s + (v - predictions[i]) ** 2,
    0,
  );

  const rSquared = 1 - ssRes / ssTot;
  const numFeatures = 3;
  const adjustedRSquared =
    1 - ((1 - rSquared) * (n - 1)) / (n - numFeatures - 1);

  const mse = ssRes / n;
  const rmse = Math.sqrt(mse);
  const mae =
    actualPrices.reduce((s, v, i) => s + Math.abs(v - predictions[i]), 0) / n;

  return {
    coefficients: {
      intercept,
      sqft: sqftCoeff,
      bedrooms: bedroomsCoeff,
      bathrooms: bathroomsCoeff,
    },
    rSquared,
    adjustedRSquared,
    rmse,
    mae,
    sampleSize: n,
    predictions,
  };
}

export const MODEL = trainLinearRegression(HOUSING_DATASET);

export function predict(
  sqft: number,
  bedrooms: number,
  bathrooms: number,
): number {
  const { coefficients } = MODEL;
  return (
    coefficients.intercept +
    coefficients.sqft * sqft +
    coefficients.bedrooms * bedrooms +
    coefficients.bathrooms * bathrooms
  );
}
