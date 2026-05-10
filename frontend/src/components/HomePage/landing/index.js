import styles from "./index.module.css";
import Navbar from "../../Pages/navbar/Navbar";
import Banner from "../../Pages/banner";
import Cabs from "../../Pages/cabs";
import BookingSection from "../../Pages/booking";
import { useEffect, useState } from "react";
import axios from "axios";
import NumPlace from "../../assets/store/numPlace.json";
import {
  faTriangleExclamation,
  faCircleCheck,
  faCircleInfo,
} from "@fortawesome/free-solid-svg-icons";
import ErrorCard from "../../atom/errorCard";

const Landing = (props) => {
  const [email, setEmail] = useState("");
  const [sourceLocation, setSourceLocation] = useState("");
  const [destLocation, setDestLocation] = useState("");
  const [totalTime, setTotalTime] = useState(null);
  const [cabDisplayLoading, setCabDisplayLoading] = useState(true);
  const [cabData, setCabData] = useState([]);
  const [allUsers, setAllUsers] = useState([]);
  const [allUserLoading, setAllUserLoading] = useState(true);
  const [allCabs, setAllCabs] = useState([]);
  const [allCabsLoading, setAllCabsLoading] = useState(true);

  // Error toast states
  const [errorDisplay, setErrorDisplay] = useState("none");
  const [errorIcon, setErrorIcon] = useState();
  const [errorText, setErrorText] = useState("Error");
  const [errorColor, setErrorColor] = useState("red");

  // Popup states
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const [popupEmail, setPopupEmail] = useState("");

  // ── refreshTrigger: increments after every booking so Cabs table re-fetches ──
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  function fetchAllUsers() {
    setAllUserLoading(true);
    axios.get("http://localhost:5000/user/user/get-data", {}).then((res) => {
      setAllUsers(res.data.data.reverse());
      setAllUserLoading(false);
    });
  }

  function fetchCabs() {
    setCabDisplayLoading(true);
    axios.get("http://localhost:5000/cabs/getAllCabs", {}).then((res) => {
      if (res.data !== null) { setCabData(res.data); }
      setCabDisplayLoading(false);
    });
  }

  function fetchAllCabDetail() {
    setAllCabsLoading(true);
    axios.get("http://localhost:5000/allcab/get-all-cab", {}).then((res) => {
      if (Array.isArray(res.data)) {
        setAllCabs(res.data.reverse());
      } else {
        setAllCabs([]);
      }
      setAllCabsLoading(false);
    });
  }

  useEffect(() => {
    fetchCabs();
    fetchAllUsers();
    fetchAllCabDetail();

    // Save email to localStorage so Cabs table can filter by user
    const savedEmail = localStorage.getItem("userEmail");
    if (savedEmail) {
      setEmail(savedEmail);
    }
  }, []);

  function changeSource(value) { setSourceLocation(value); }
  function changeEmail(value) {
    setEmail(value);
    // Save email so Cabs table always knows the current user
    localStorage.setItem("userEmail", value);
  }
  function changeDest(value)   { setDestLocation(value); }
  function myStopFunction()    { setErrorDisplay("none"); }

  function showError(message, type) {
    setErrorText(message);
    if (type === "success") {
      setErrorIcon(faCircleCheck);
      setErrorDisplay("flex");
      setErrorColor("green");
    } else if (type === "info") {
      setErrorIcon(faCircleInfo);
      setErrorDisplay("flex");
      setErrorColor("#FD9229");
    } else {
      setErrorIcon(faTriangleExclamation);
      setErrorDisplay("flex");
      setErrorColor("red");
    }
    setTimeout(myStopFunction, 4000);
  }

  function checkFairClicked() {
    var emailCheck = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (emailCheck.test(email) === false) {
      showError("Email is incorrect", "error");
      return;
    }
    if (sourceLocation === destLocation) {
      showError("Both Locations are same", "error");
      return;
    }
    if (sourceLocation === "" || destLocation === "" || email === "") {
      showError("Field is empty", "error");
      return;
    }

    setCabDisplayLoading(true);
    axios
      .post("http://localhost:5000/path/fetch-shortest-path", {
        start: NumPlace[sourceLocation],
        dest:  NumPlace[destLocation],
      })
      .then((res) => {
        setTotalTime(res.data);
        setCabDisplayLoading(false);
      });
  }

  function cabBookClicked(ele, price, time) {
    if (time === null || email === "" || sourceLocation === "" || destLocation === "") {
      showError("Check Fare First!!", "error");
      return;
    }

    axios
      .post("http://localhost:5000/user/update-user-booking", {
        source:      sourceLocation,
        dest:        destLocation,
        obj:         ele,
        total_time:  time,
        total_price: price,
        email:       email,
      })
      .then((res) => {
        if (res.data.data === false) {
          showError(res.data.message, "error");
          return;
        }

        // Build popup message
        let msg = `Your ${ele.cab_name} from ${sourceLocation} to ${destLocation} is booked!`;
        if (res.data.discountApplied > 0) {
          msg += ` You received a discount of ₹${res.data.discountApplied}/-!`;
        }

        setPopupMessage(msg);
        setPopupEmail(email);
        setShowPopup(true);

        // ── Increment trigger so Cabs table re-fetches immediately ──
        setRefreshTrigger((prev) => prev + 1);

        fetchAllUsers();
        fetchAllCabDetail();
      });
  }

  return (
    <>
      <div className={styles.landing__outer}>
        <ErrorCard
          errorDisplay={errorDisplay}
          errorIcon={errorIcon}
          errorText={errorText}
          errorColor={errorColor}
        />
        <Navbar />
        <div className={styles.langing__gap}></div>

        <Banner />

        <BookingSection
          errorDisplay={errorDisplay}
          errorIcon={errorIcon}
          errorText={errorText}
          errorColor={errorColor}
          changeDest={changeDest}
          sourceLocation={sourceLocation}
          totalTime={totalTime}
          changeEmail={changeEmail}
          changeSource={changeSource}
          destLocation={destLocation}
          checkFairClicked={checkFairClicked}
          cabData={cabData}
          cabDisplayLoading={cabDisplayLoading}
          cabBookClicked={cabBookClicked}
          showPopup={showPopup}
          popupMessage={popupMessage}
          popupEmail={popupEmail}
          closePopup={() => setShowPopup(false)}
        />

        {/* Pass refreshTrigger so table updates after every booking */}
        <Cabs
          flag={0}
          allCabs={allCabs}
          allCabsLoading={allCabsLoading}
          refreshTrigger={refreshTrigger}
        />
      </div>
    </>
  );
};

export default Landing;
