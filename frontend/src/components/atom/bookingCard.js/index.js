import styles from './index.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faArrowRight,
  faStar,
  faSnowflake,
  faWind,
  faUser,
  faRoad,
  faClock,
  faReceipt,
  faChevronDown,
  faChevronUp,
  faIdCard,
} from '@fortawesome/free-solid-svg-icons';
import { useState } from 'react';

const DRIVERS = [
  { name: 'Rajesh Kumar', rating: 4.8, trips: 1240, license: 'MH12AB1234' },
  { name: 'Suresh Patil', rating: 4.6, trips: 980,  license: 'MH14CD5678' },
  { name: 'Amit Sharma',  rating: 4.9, trips: 2100, license: 'DL01EF9012' },
  { name: 'Vikram Singh', rating: 4.7, trips: 760,  license: 'KA05GH3456' },
  { name: 'Priya Nair',   rating: 4.5, trips: 530,  license: 'TN22IJ7890' },
];

function getDriver(cabName) {
  let hash = 0;
  for (let i = 0; i < cabName.length; i++) hash += cabName.charCodeAt(i);
  return DRIVERS[hash % DRIVERS.length];
}

// Average speed 50 km/h for inter-district travel
const AVG_SPEED_KMH = 50;

function calcDistance(totalTime) {
  if (!totalTime) return null;
  return ((AVG_SPEED_KMH * totalTime) / 60).toFixed(1);
}

function calcETA(totalTime) {
  if (!totalTime) return null;
  const eta = new Date(Date.now() + totalTime * 60 * 1000);
  return eta.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// ── REALISTIC PRICING ──────────────────────────────────────
// cab_price stored in DB is now treated as ₹/km rate
// Real Ola/Uber intercity rates:
//   Cab GO      → ₹9/km
//   Cab Premier → ₹13/km
//   Cab XL      → ₹15/km
// Formula: baseFare(₹100) + distanceCharge(₹/km × km) + toll(flat ₹150 for >100km)
// AC adds 20% on top

function calcFare(totalTime, cabPricePerKm) {
  const distanceKm  = (AVG_SPEED_KMH * totalTime) / 60;
  const baseFare    = 100;                                        // flat base fare ₹100
  const distCharge  = Math.round(cabPricePerKm * distanceKm);    // per km charge
  const toll        = distanceKm > 100 ? 150 : 0;                // toll for long routes
  const total       = baseFare + distCharge + toll;
  return { baseFare, distCharge, toll, total, distanceKm: distanceKm.toFixed(1) };
}

function Stars({ rating }) {
  return (
    <span className={styles.stars}>
      {[1, 2, 3, 4, 5].map((s) => (
        <FontAwesomeIcon
          key={s}
          icon={faStar}
          className={s <= Math.round(rating) ? styles.starFilled : styles.starEmpty}
        />
      ))}
      <span className={styles.ratingNum}>{rating}</span>
    </span>
  );
}

const BookingCard = (props) => {
  const [expanded, setExpanded] = useState(false);
  const { ele, totalTime, cabBookClicked } = props;

  const fare       = totalTime ? calcFare(totalTime, ele.cab_price) : null;
  const basePrice  = fare ? fare.total : 0;
  const acPrice    = fare ? Math.round(fare.total * 1.2) : 0;
  const distance   = calcDistance(totalTime);
  const eta        = calcETA(totalTime);
  const driver     = getDriver(ele.cab_name);
  const isAC       = ele.cab_type?.toLowerCase().includes('ac') || false;

  return (
    <div className={styles.card}>

      {/* TOP ROW */}
      <div className={styles.topRow}>
        <div className={styles.leftCol}>
          <div className={styles.cabName}>{ele.cab_name}</div>
          <div className={styles.badges}>
            <span className={`${styles.badge} ${isAC ? styles.acBadge : styles.nonAcBadge}`}>
              <FontAwesomeIcon icon={isAC ? faSnowflake : faWind} size="xs" />
              &nbsp;{isAC ? 'AC' : 'Non-AC'}
            </span>
            <span className={styles.badge}>
              <FontAwesomeIcon icon={faUser} size="xs" />&nbsp;{ele.cab_seats} seats
            </span>
          </div>
          <Stars rating={driver.rating} />
        </div>
        <div className={styles.rightCol}>
          {totalTime ? (
            <>
              <div className={styles.priceMain}>&#8377;{basePrice}/-</div>
              <div className={styles.priceSub}>Non-AC &middot; &#8377;{ele.cab_price}/km</div>
              <div className={styles.priceAC}>AC: &#8377;{acPrice}/-</div>
            </>
          ) : (
            <div className={styles.priceMain}>&#8212;</div>
          )}
        </div>
      </div>

      {/* QUICK STATS */}
      {totalTime && (
        <div className={styles.statsRow}>
          <div className={styles.stat}>
            <FontAwesomeIcon icon={faClock} className={styles.statIcon} />
            <span>{totalTime} min</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <FontAwesomeIcon icon={faRoad} className={styles.statIcon} />
            <span>{distance} km</span>
          </div>
          <div className={styles.statDivider} />
          <div className={styles.stat}>
            <FontAwesomeIcon icon={faClock} className={styles.statIcon} />
            <span>ETA {eta}</span>
          </div>
        </div>
      )}

      {/* EXPAND TOGGLE */}
      <div className={styles.expandToggle} onClick={() => setExpanded((p) => !p)}>
        <FontAwesomeIcon icon={faReceipt} size="xs" />
        &nbsp;Fare breakdown &amp; driver info&nbsp;
        <FontAwesomeIcon icon={expanded ? faChevronUp : faChevronDown} size="xs" />
      </div>

      {/* EXPANDABLE SECTION */}
      {expanded && fare && (
        <div className={styles.expandBody}>

          {/* Fare breakdown */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faReceipt} size="xs" />&nbsp;Fare Breakdown
            </div>
            <div className={styles.fareRow}>
              <span>Base fare</span>
              <span>&#8377;{fare.baseFare}</span>
            </div>
            <div className={styles.fareRow}>
              <span>Distance charge ({fare.distanceKm} km &times; &#8377;{ele.cab_price}/km)</span>
              <span>&#8377;{fare.distCharge}</span>
            </div>
            {fare.toll > 0 && (
              <div className={styles.fareRow}>
                <span>Toll charges</span>
                <span>&#8377;{fare.toll}</span>
              </div>
            )}
            <div className={`${styles.fareRow} ${styles.fareTotal}`}>
              <span>Total (Non-AC)</span>
              <span>&#8377;{basePrice}</span>
            </div>
            <div className={`${styles.fareRow} ${styles.fareAcTotal}`}>
              <span>Total (AC)</span>
              <span>&#8377;{acPrice}</span>
            </div>
          </div>

          {/* Driver info */}
          <div className={styles.section}>
            <div className={styles.sectionTitle}>
              <FontAwesomeIcon icon={faIdCard} size="xs" />&nbsp;Driver Info
            </div>
            <div className={styles.driverRow}>
              <div className={styles.driverAvatar}>{driver.name.charAt(0)}</div>
              <div className={styles.driverDetails}>
                <div className={styles.driverName}>{driver.name}</div>
                <Stars rating={driver.rating} />
                <div className={styles.driverMeta}>{driver.trips.toLocaleString()} trips completed</div>
                <div className={styles.driverMeta}>License: {driver.license}</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* BOOK BUTTONS */}
      <div className={styles.bookRow}>
        <div
          className={styles.bookBtn}
          onClick={() => cabBookClicked(ele, basePrice, totalTime)}
        >
          Book Non-AC&nbsp;<FontAwesomeIcon icon={faArrowRight} size="sm" />
        </div>
        <div
          className={`${styles.bookBtn} ${styles.bookBtnAC}`}
          onClick={() => cabBookClicked({ ...ele, cab_name: ele.cab_name + ' (AC)' }, acPrice, totalTime)}
        >
          Book AC&nbsp;<FontAwesomeIcon icon={faSnowflake} size="sm" />
        </div>
      </div>

    </div>
  );
};

export default BookingCard;
