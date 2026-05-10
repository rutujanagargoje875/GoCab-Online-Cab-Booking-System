
import express from "express";
import Logger from "../connect/logg.js";
import USER from "../models/user.js";
import ALLBOOKING from "../models/allBooking.js";
import nodemailer from "nodemailer";
import db_elements from "../connect/getENV.js";

const userBooking = express.Router();

// ── NODEMAILER TRANSPORTER ──────────────────────────────────
// Uses values from your .env file
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: db_elements.db_email,       // GMAIL= in your .env
    pass: db_elements.dp_email_pass,  // PASS= in your .env (App Password)
  },
});

// ── UPDATE USER BOOKING ─────────────────────────────────────
userBooking.post("/update-user-booking", async (req, res) => {
  const {
    email,
    obj: cab_obj,
    total_time,
    total_price,
    source,
    dest,
  } = req.body;

  const dateObject = new Date();
  const hours   = dateObject.getHours();
  const minutes = dateObject.getMinutes();
  const seconds = dateObject.getSeconds();
  const date    = `0${dateObject.getDate()}`.slice(-2);
  const month   = `0${dateObject.getMonth() + 1}`.slice(-2);
  const year    = dateObject.getFullYear();
  const timestamp = `${year}-${month}-${date} ${hours}:${minutes}:${seconds}`;

  cab_obj["booking_time"]      = timestamp;
  cab_obj["user_journey_time"] = total_time;
  cab_obj["user_total_price"]  = total_price;
  cab_obj["user_source"]       = source;
  cab_obj["user_destinations"] = dest;

  try {
    let user = await USER.findOne({ user_email: email }).exec();
    if (!user) {
      await USER.insertMany([{ user_email: email, user_cabs: [] }]);
      user = await USER.findOne({ user_email: email }).exec();
    }

    const bookingCount = user.user_cabs.length + 1;
    let discountApplied = 0;
    if (bookingCount % 3 === 0) {
      discountApplied = total_price * 0.3;
      cab_obj["user_total_price"] = Math.round(total_price * 0.7);
    }

    await USER.findOneAndUpdate(
      { user_email: email },
      { $push: { user_cabs: cab_obj } }
    );

    await ALLBOOKING.insertMany([
      {
        cab_name:  cab_obj["cab_name"],
        cab_price: cab_obj["user_total_price"],
        cab_type:  cab_obj["cab_type"],
        cab_seats: cab_obj["cab_seats"],
        user_email: email,
      },
    ]);

    // ── SEND CONFIRMATION EMAIL ─────────────────────────────
    const discountLine = discountApplied > 0
      ? `🎉 Discount Applied: ₹${Math.round(discountApplied)}/- (30% off on every 3rd booking!)`
      : "";

    const mailOptions = {
      from: `"CabSwift Booking" <${db_elements.db_email}>`,
      to: email,
      subject: "✅ Cab Booking Confirmed — CabSwift",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; border: 1px solid #eee; border-radius: 12px; overflow: hidden;">
          <div style="background: #0E1C1D; padding: 24px; text-align: center;">
            <h1 style="color: #FF8C00; margin: 0; font-size: 24px;">🚕 CabSwift</h1>
            <p style="color: #E8F4F4; margin: 8px 0 0;">Booking Confirmed!</p>
          </div>
          <div style="padding: 24px; background: #FFFBF2;">
            <p style="font-size: 16px; color: #0E1C1D;">Hi <strong>${email}</strong>,</p>
            <p style="color: #2F4445;">Your cab has been booked successfully. Here are your trip details:</p>
            <table style="width: 100%; border-collapse: collapse; margin: 16px 0;">
              <tr style="background: #E8F4F4;">
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">Cab</td>
                <td style="padding: 10px 14px; color: #0E1C1D;">${cab_obj["cab_name"]}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">From</td>
                <td style="padding: 10px 14px; color: #0E1C1D;">${source}</td>
              </tr>
              <tr style="background: #E8F4F4;">
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">To</td>
                <td style="padding: 10px 14px; color: #0E1C1D;">${dest}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">Journey Time</td>
                <td style="padding: 10px 14px; color: #0E1C1D;">${total_time} min</td>
              </tr>
              <tr style="background: #E8F4F4;">
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">Total Fare</td>
                <td style="padding: 10px 14px; color: #0E1C1D; font-size: 18px; font-weight: bold;">₹${cab_obj["user_total_price"]}</td>
              </tr>
              <tr>
                <td style="padding: 10px 14px; font-weight: bold; color: #0D7377;">Date & Time</td>
                <td style="padding: 10px 14px; color: #0E1C1D;">${timestamp}</td>
              </tr>
            </table>
            ${discountLine ? `<p style="background: #FFF3DC; border: 1px solid #FF8C00; border-radius: 8px; padding: 10px 14px; color: #CC7000; font-weight: bold;">${discountLine}</p>` : ""}
            <p style="color: #2F4445; margin-top: 20px;">Thank you for choosing <strong style="color: #0D7377;">CabSwift</strong>. Have a safe journey! 🙏</p>
          </div>
          <div style="background: #0E1C1D; padding: 14px; text-align: center;">
            <p style="color: rgba(255,251,242,0.5); font-size: 12px; margin: 0;">CabSwift — Maharashtra's Cab Booking Platform</p>
          </div>
        </div>
      `,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        Logger.error("Email Error: " + error.message);
      } else {
        Logger.success("Email Sent: " + info.response);
      }
    });

    Logger.success("Booking Successful");
    res.status(200).send({
      message: "UpdateSuccess",
      data: email,
      discountApplied,
    });
  } catch (error) {
    Logger.error(error.message);
    res.status(404).json({ message: error.message });
  }
});

// ── GET ALL USERS ───────────────────────────────────────────
userBooking.get("/user/get-data", async (req, res) => {
  try {
    const ele = await USER.find().exec();
    if (ele !== null) {
      res.status(200).send({ message: "fetchSuccess", data: ele });
      Logger.success("All users FetchSuccess");
    } else {
      Logger.error("All users FetchFailed");
      res.status(200).send({ message: "fetchFailed", data: {} });
    }
  } catch (error) {
    Logger.error(error.message);
    res.status(404).json({ message: error.message });
  }
});

export default userBooking;
