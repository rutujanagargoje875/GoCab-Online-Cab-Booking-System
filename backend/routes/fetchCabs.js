import express from "express";
import CABS from "../models/Cabs.js";

const getCabs = express.Router();

// Realistic per-km rates based on seat count
// (works with ANY cab name stored in your MongoDB)
// 4 seats  → ₹10/km  (like Ola Mini / Swift)
// 5 seats  → ₹12/km  (like Sedan / Tata Nexon)
// 6+ seats → ₹14/km  (like XL / Innova)

function getRealisticPrice(cab_seats) {
  if (cab_seats <= 4) return 10;
  if (cab_seats <= 5) return 12;
  return 14;
}

getCabs.get("/getAllCabs", async (req, res) => {
  try {
    const allCabs = await CABS.find();

    const updatedCabs = allCabs.map((cab) => {
      const obj = cab.toObject();
      // Force realistic per-km price — ignore whatever is in DB
      obj.cab_price = getRealisticPrice(obj.cab_seats);
      return obj;
    });

    res.status(200).json(updatedCabs);
  } catch (error) {
    console.error("Error fetching cabs:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

export default getCabs;
