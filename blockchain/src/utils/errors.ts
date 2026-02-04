import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export const ErrorCodes = {
  POOL_NOT_FOUND: "POOL_NOT_FOUND",
  INSUFFICIENT_LIQUIDITY: "INSUFFICIENT_LIQUIDITY", 
  INVALID_AMOUNT: "INVALID_AMOUNT",
  INVALID_TOKEN: "INVALID_TOKEN",
  TRANSACTION_BUILD_FAILED: "TRANSACTION_BUILD_FAILED",
  WALLET_NOT_FOUND: "WALLET_NOT_FOUND",
  NETWORK_ERROR: "NETWORK_ERROR",
} as const;

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({
      error: {
        message: err.message,
        code: err.code,
      }
    });
  }
  
  console.error("❌ Unhandled error:", err);
  return res.status(500).json({
    error: {
      message: "Internal server error",
      code: "INTERNAL_ERROR",
      ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    }
  });
}
