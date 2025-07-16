import React from "react";

const monthNames = [
  "Januari", "Februari", "Maret", "April", "Mei", "Juni",
  "Juli", "Agustus", "September", "Oktober", "November", "Desember"
];
// Navigasi bulannya
const MonthNavigator = ({ selectedMonth, selectedYear, onChange }) => {
  const handlePrev = () => {
    let newMonth = selectedMonth - 1;
    let newYear = selectedYear;

    if (newMonth < 0) {
      newMonth = 11;
      newYear -= 1;
    }

    onChange(newMonth, newYear);
  };

// Next bulan
  const handleNext = () => {
    let newMonth = selectedMonth + 1;
    let newYear = selectedYear;

    if (newMonth > 11) {
      newMonth = 0;
      newYear += 1;
    }

    onChange(newMonth, newYear);
  };
  
  // Ngerendernya
  return (
    <div className="d-flex align-items-center gap-2 mb-3">
      <button className="btn btn-outline-primary" onClick={handlePrev}>
        &larr;
      </button>
      <strong>{monthNames[selectedMonth]} {selectedYear}</strong>
      <button className="btn btn-outline-primary" onClick={handleNext}>
        &rarr;
      </button>
    </div>
  );
};

export default MonthNavigator;
