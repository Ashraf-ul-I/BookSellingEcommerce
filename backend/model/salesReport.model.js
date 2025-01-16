import mongoose, { Schema } from "mongoose";


const salesReportSchema = new Schema({
    category: String,
    totalSales: Number,
    totalBooksSold: Number,
    weekStart: Date, // Start of the week for the report
    weekEnd: Date,   // End of the week for the report
    generatedAt: {
      type: Date,
      default: Date.now,
    },
  });
  
  export const SalesReport = mongoose.model("SalesReport", salesReportSchema);
  