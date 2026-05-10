

import axios from "axios";
import { useState, useEffect } from "react";
import { Ring } from "@uiball/loaders";

const Cabs = (props) => {
  const [bookedCabs, setBookedCabs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookedCabs();
  }, [props.refreshTrigger]);

  const fetchBookedCabs = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5000/user/user/get-data");
      const allUsers = response.data.data;
      const userEmail = localStorage.getItem("userEmail");

      if (!userEmail) {
        const allCabs = allUsers.flatMap((u) =>
          (u.user_cabs || []).map((cab) => ({ ...cab, user_email: u.user_email }))
        );
        allCabs.sort((a, b) => new Date(b.booking_time) - new Date(a.booking_time));
        setBookedCabs(allCabs);
      } else {
        const currentUser = allUsers.find((u) => u.user_email === userEmail);
        const userCabs = currentUser ? [...(currentUser.user_cabs || [])].reverse() : [];
        setBookedCabs(userCabs);
      }
    } catch (error) {
      console.error("Error fetching booked cabs:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      width: "100%",
      background: "#0E1C1D",
      padding: "3rem 1.5rem 4rem",
      fontFamily: "'Plus Jakarta Sans', sans-serif",
    }} id="Cabs">

      {/* Heading */}
      <h2 style={{
        textAlign: "center",
        fontSize: "26px",
        fontWeight: 900,
        color: "#FF8C00",
        textTransform: "uppercase",
        letterSpacing: "2px",
        marginBottom: "2rem",
      }}>
        Booked Cabs
      </h2>

      {/* Table wrapper */}
      <div style={{
        maxWidth: "900px",
        margin: "0 auto",
        borderRadius: "12px",
        overflow: "hidden",
        boxShadow: "8px 8px 0 #FF8C00",
        border: "2px solid rgba(255,140,0,0.3)",
      }}>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ background: "#FF8C00" }}>
              {["SNo.", "Date", "Cab Name", "Source", "Destination", "Price"].map((h) => (
                <th key={h} style={{
                  padding: "14px 18px",
                  textAlign: "left",
                  fontSize: "12px",
                  fontWeight: 800,
                  color: "#0E1C1D",
                  textTransform: "uppercase",
                  letterSpacing: "0.8px",
                }}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" style={{ textAlign: "center", padding: "2.5rem" }}>
                  <Ring size={40} lineWeight={5} speed={2} color="#FF8C00" />
                </td>
              </tr>
            ) : bookedCabs.length > 0 ? (
              bookedCabs.map((cab, index) => (
                <tr key={index} style={{
                  background: index % 2 === 0
                    ? "rgba(255,251,242,0.04)"
                    : "rgba(255,251,242,0.08)",
                  borderBottom: "1px solid rgba(255,140,0,0.1)",
                  transition: "background 0.15s",
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,140,0,0.1)"}
                  onMouseLeave={(e) => e.currentTarget.style.background = index % 2 === 0 ? "rgba(255,251,242,0.04)" : "rgba(255,251,242,0.08)"}
                >
                  <td style={tdStyle}>{index + 1}</td>
                  <td style={tdStyle}>
                    {cab.booking_time ? new Date(cab.booking_time).toLocaleDateString() : "—"}
                  </td>
                  <td style={{ ...tdStyle, fontWeight: 700, color: "#FF8C00" }}>
                    {cab.cab_name || "—"}
                  </td>
                  <td style={tdStyle}>{cab.user_source || "—"}</td>
                  <td style={tdStyle}>{cab.user_destinations || "—"}</td>
                  <td style={{ ...tdStyle, fontWeight: 800, color: "#14A9AE" }}>
                    {cab.user_total_price
                      ? `₹${Math.round(cab.user_total_price).toLocaleString()}`
                      : "—"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" style={{
                  textAlign: "center",
                  padding: "2.5rem",
                  color: "rgba(232,244,244,0.5)",
                  fontSize: "14px",
                }}>
                  No booked cabs found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

const tdStyle = {
  padding: "13px 18px",
  fontSize: "13px",
  color: "#E8F4F4",
};

export default Cabs;
