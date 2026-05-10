import styles from "./index.module.css";
import * as React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRight,
  faArrowDown,
  faEnvelopeCircleCheck,
  faXmark,
  faTaxi,
} from "@fortawesome/free-solid-svg-icons";
import BookingForm from "../../assets/store/bookingForm.json";
import Places from "../../assets/store/places.json";
import Autocomplete from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import BookingCard from "../../atom/bookingCard.js/index.js";
import { Ring } from "@uiball/loaders";

const Booking = (props) => {
  return (
    <div className={styles.booking__outer} id="book">

      {/* ── EMAIL CONFIRMATION POPUP ── */}
      {props.showPopup && (
        <div className={styles.popup__overlay}>
          <div className={styles.popup__box}>
            <button className={styles.popup__close} onClick={props.closePopup}>
              <FontAwesomeIcon icon={faXmark} />
            </button>
            <div className={styles.popup__icon__wrap}>
              <FontAwesomeIcon icon={faEnvelopeCircleCheck} className={styles.popup__icon} />
            </div>
            <div className={styles.popup__title}>Booking Confirmed!</div>
            <div className={styles.popup__msg}>{props.popupMessage}</div>
            <div className={styles.popup__sub}>
              A confirmation has been sent to<br />
              <strong>{props.popupEmail}</strong>
            </div>
            <div className={styles.popup__check__line}>
              <FontAwesomeIcon icon={faTaxi} className={styles.popup__taxi} />
              &nbsp; Please check your email inbox
            </div>
            <button className={styles.popup__btn} onClick={props.closePopup}>
              Done &nbsp;<FontAwesomeIcon icon={faArrowRight} />
            </button>
          </div>
        </div>
      )}

      <div className={styles.booking__inner}>

        {/* ── LEFT FORM PANEL ── */}
        <div className={styles.booking__inner__left}>
          <div className={styles.booking__inner__left__heading}>
            {BookingForm.heading}
          </div>

          {/* Email */}
          <div className={styles.booking__each}>
            <div className={styles.booking__each__heading}>
              {BookingForm.email.label}
            </div>
            <div className={styles.booking__each__field}>
              <input
                type={BookingForm.email.type}
                placeholder={BookingForm.email.placeholder}
                className={styles.booking__inputfield}
                onChange={(e) => { props.changeEmail(e.target.value); }}
              />
            </div>
          </div>

          {/* Pick-Up Location (Source) */}
          <div className={styles.booking__each}>
            <div className={styles.booking__each__heading}>
              {BookingForm.source.label}&nbsp;
              <span className={styles.bracket__label}>(Source)</span>
            </div>
            <div className={styles.booking__each__field}>
              <Autocomplete
                disablePortal
                defaultValue={null}
                sx={{ borderRadius: "5px", border: "2px solid black", outline: "none" }}
                id="combo-box-source"
                placeholder={BookingForm.source.placeholder}
                options={Places}
                value={props.sourceLocation}
                onChange={(event, newVal) => {
                  props.changeSource(newVal != null ? newVal.label : "");
                }}
                renderInput={(params) => <TextField {...params} label="" />}
              />
            </div>
          </div>

          {/* Drop Location (Destination) */}
          <div className={styles.booking__each}>
            <div className={styles.booking__each__heading}>
              {BookingForm.dest.label}&nbsp;
              <span className={styles.bracket__label}>(Destination)</span>
            </div>
            <div className={styles.booking__each__field}>
              <Autocomplete
                disablePortal
                defaultValue={null}
                sx={{ borderRadius: "5px", border: "2px solid black", outline: "none" }}
                id="combo-box-dest"
                placeholder={BookingForm.dest.placeholder}
                options={Places}
                value={props.destLocation}
                onChange={(event, newVal) => {
                  props.changeDest(newVal != null ? newVal.label : "");
                }}
                renderInput={(params) => <TextField {...params} label="" />}
              />
            </div>
          </div>

          <div className={styles.booking__left__button}>
            <div
              className={styles.booking__left__button__each}
              onClick={() => { props.checkFairClicked(); }}
            >
              Check Fair {"\u00A0"}{" "}
              <FontAwesomeIcon icon={faArrowRight} size="lg" className="nav__icon" />
            </div>
          </div>
        </div>

        {/* ── RIGHT RESULTS PANEL ── */}
        <div className={styles.booking__inner__right}>

          {/* Desktop */}
          <div className={styles.booking__inner__right__heading}>
            <span style={{ textDecoration: "underline" }}>Pick Up (Source):</span>
            {"\u00A0"}
            {props.sourceLocation ? props.sourceLocation : "Select Pick-Up"}
            {"\u00A0\u00A0"}
            <FontAwesomeIcon icon={faArrowRight} size="lg" className="nav__icon" />
            {"\u00A0\u00A0"}
            <span style={{ textDecoration: "underline" }}>Drop (Destination):</span>
            {"\u00A0"}
            {props.destLocation ? props.destLocation : "Select Drop"}
          </div>

          {/* Mobile */}
          <div className={styles.booking__inner__right__heading__mobile}>
            <div className={styles.booking__inner__right__heading__top}>
              <span style={{ textDecoration: "underline" }}>Pick Up (Source):</span>
              {"\u00A0"}{props.sourceLocation ? props.sourceLocation : "Select Pick-Up"}
            </div>
            <div className={styles.booking__inner__right__heading__top}>
              <FontAwesomeIcon icon={faArrowDown} size="lg" />
            </div>
            <div className={styles.booking__inner__right__heading__top}>
              <span style={{ textDecoration: "underline" }}>Drop (Destination):</span>
              {"\u00A0"}{props.destLocation ? props.destLocation : "Select Drop"}
            </div>
          </div>

          <div className={styles.booking__inner__right__time}>
            <span style={{ textDecoration: "underline" }}>Minimum Time:</span>{" "}
            {"\u00A0"}{" "}
            {props.totalTime ? <>{props.totalTime} min</> : "Check Fair!"}{" "}
            {"\u00A0"}
          </div>

          <div>
            {props.cabDisplayLoading ? (
              <Ring size={40} lineWeight={5} speed={2} color="black" />
            ) : (
              props.cabData.map((ele) => (
                <BookingCard
                  key={ele._id}
                  ele={ele}
                  totalTime={props.totalTime}
                  cabBookClicked={props.cabBookClicked}
                />
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
};

export default Booking;
