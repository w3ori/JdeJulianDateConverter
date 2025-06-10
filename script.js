document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const gregorianInput = document.getElementById("gregorianDate");
  const julianInput = document.getElementById("jdeJulianDate");

  if (!gregorianInput || !julianInput) {
    console.error("Missing input elements: #gregorianDate or #jdeJulianDate");
    return;
  }

  // Set today's date in the Gregorian input and calculate its Julian equivalent
  gregorianInput.valueAsDate = new Date();

  // Calculate and set the Julian date based on today's Gregorian date
  julianInput.value = gregorianToJdeJulianDate(gregorianInput.valueAsDate);

  // Attach event listeners for input changes
  gregorianInput.addEventListener("input", handleGregorianInputChange);
  julianInput.addEventListener("input", handleJulianInputChange);
}

function handleGregorianInputChange() {
  const gregorianDate = new Date(this.value);
  const julianInput = document.getElementById("jdeJulianDate");

  if (isValidDate(gregorianDate)) {
    julianInput.value = gregorianToJdeJulianDate(gregorianDate);
    removeInvalidClass(this, julianInput);
  } else {
    julianInput.value = null; // Reset Julian date if Gregorian is invalid
    addInvalidClass(this);
  }
}

function handleJulianInputChange() {
  const julianDate = this.value.trim();
  const gregorianInput = document.getElementById("gregorianDate");

  if (isValidJdeJulianDate(julianDate)) {
    gregorianInput.valueAsDate = jdeJulianDateToGregorian(julianDate);
    removeInvalidClass(this, gregorianInput);
  } else {
    gregorianInput.valueAsDate = null; // Reset Gregorian date if Julian is invalid
    addInvalidClass(this);
  }
}

function isValidDate(date) {
  return date instanceof Date && !isNaN(date.getTime());
}

function isValidJdeJulianDate(julianDate) {
  if (julianDate.length > 6) {
    return false;
  }

  const century = parseInt(julianDate.slice(0, 1), 10);
  const yearWithinCentury = parseInt(julianDate.slice(1, 3), 10);
  const dayOfYear = parseInt(julianDate.slice(3, 6), 10);
  const fullYear = (century + 19) * 100 + yearWithinCentury;

  if (
    isNaN(century) ||
    isNaN(yearWithinCentury) ||
    isNaN(dayOfYear) ||
    century < 0 ||
    yearWithinCentury < 0 ||
    dayOfYear < 1 ||
    dayOfYear > (isLeapYear(fullYear) ? 366 : 365)
  ) {
    return false;
  }

  return true;
}

function jdeJulianDateToGregorian(julianDate) {
  const century = parseInt(julianDate.slice(0, 1), 10);
  const yearWithinCentury = parseInt(julianDate.slice(1, 3), 10);
  const dayOfYear = parseInt(julianDate.slice(3, 6), 10);
  const fullYear = (century + 19) * 100 + yearWithinCentury;

  const gregorianDate = new Date(Date.UTC(fullYear, 0, 1));
  gregorianDate.setUTCDate(dayOfYear);

  return gregorianDate;
}

function gregorianToJdeJulianDate(gregorianDate) {
  const year = gregorianDate.getFullYear();
  const century = Math.floor(year / 100) - 19;
  const yearWithinCentury = year % 100;
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const dayOfYear =
    Math.floor((gregorianDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  const centuryStr = century.toString();
  const yearWithinCenturyStr = yearWithinCentury.toString().padStart(2, "0");
  const dayOfYearStr = dayOfYear.toString().padStart(3, "0");

  return `${centuryStr}${yearWithinCenturyStr}${dayOfYearStr}`;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}

function addInvalidClass(...elements) {
  elements.forEach((el) => el.classList.add("invalid"));
}

function removeInvalidClass(...elements) {
  elements.forEach((el) => el.classList.remove("invalid"));
}
