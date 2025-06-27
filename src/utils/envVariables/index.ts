import dotenv from "dotenv";
dotenv.config();

type envVariableSchema = {
  PORT: string;
  DB_URL: string;
  DB_KEY: string;
  RAZORPAY_KEY: string;
  RAZORPAY_SECRET: string;
};

export const envVariables: envVariableSchema = {
  PORT: process.env.PORT!,
  DB_URL: process.env.DB_URL!,
  DB_KEY: process.env.DB_KEY!,
  RAZORPAY_KEY: process.env.RAZORPAY_KEY!,
  RAZORPAY_SECRET: process.env.RAZORPAY_SECRET!
};