document.addEventListener("DOMContentLoaded", initialize);

function initialize() {
  const gregorianInput = document.getElementById("gregorian");
  const julianInput = document.getElementById("julian");

  // Set today's date in the Gregorian input and calculate its Julian equivalent
  gregorianInput.valueAsDate = new Date();

  // Calculate and set the Julian date based on today's Gregorian date
  julianInput.value = gregorianToJulianDate(gregorianInput.valueAsDate);

  // Attach event listeners for input changes
  gregorianInput.addEventListener("input", handleGregorianInputChange);
  julianInput.addEventListener("input", handleJulianInputChange);
}

function handleGregorianInputChange() {
  const gregorianDate = new Date(this.value);
  const julianInput = document.getElementById("julian");

  if (isValidDate(gregorianDate)) {
    julianInput.value = gregorianToJulianDate(gregorianDate);
    removeInvalidClass(this, julianInput);
  } else {
    addInvalidClass(this);
  }
}

function handleJulianInputChange() {
  const julianDate = this.value.trim();
  const gregorianInput = document.getElementById("gregorian");

  if (isValidjulianDate(julianDate)) {
    gregorianInput.valueAsDate = julianDateToGregorian(julianDate);
    removeInvalidClass(this, gregorianInput);
  } else {
    addInvalidClass(this);
  }
}

function isValidDate(date) {
  return !isNaN(date.getTime());
}

function isValidjulianDate(julianDate) {
  const century = parseInt(julianDate.charAt(0), 10);
  const yearWithinCentury = parseInt(julianDate.substring(1, 3), 10);
  const dayOfYear = parseInt(julianDate.substring(3), 10);
  const fullYear = (century + 19) * 100 + yearWithinCentury;

  if (/^\d{5,6}$/.test(julianDate)) {
    const maxDays = isLeapYear(fullYear) ? 366 : 365;
    return dayOfYear >= 1 && dayOfYear <= maxDays;
  }
  return false;
}

function addInvalidClass(...elements) {
  elements.forEach((el) => el.classList.add("invalid"));
}

function removeInvalidClass(...elements) {
  elements.forEach((el) => el.classList.remove("invalid"));
}

function julianDateToGregorian(julianDate) {
  const century = parseInt(julianDate.charAt(0), 10);
  const yearWithinCentury = parseInt(julianDate.substring(1, 3), 10);
  const dayOfYear = parseInt(julianDate.substring(3), 10);
  const fullYear = (century + 19) * 100 + yearWithinCentury;

  const gregorianDate = new Date(Date.UTC(fullYear, 0, 1));
  gregorianDate.setUTCDate(dayOfYear);

  return gregorianDate;
}

function gregorianToJulianDate(gregorianDate) {
  const year = gregorianDate.getFullYear();
  const century = Math.floor(year / 100) - 19;
  const yearWithinCentury = year % 100;
  const startOfYear = new Date(Date.UTC(year, 0, 1));

  const dayOfYear =
    Math.floor((gregorianDate - startOfYear) / (1000 * 60 * 60 * 24)) + 1;

  const julianDate = `${century}${yearWithinCentury
    .toString()
    .padStart(2, "0")}${dayOfYear.toString().padStart(3, "0")}`;

  return julianDate;
}

function isLeapYear(year) {
  return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
}
