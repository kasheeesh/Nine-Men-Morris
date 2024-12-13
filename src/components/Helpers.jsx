// helpers.js
export const adjacencyMap = {
  // Outer square adjacency
  O1: ["O2", "O8"],
  O2: ["O1", "O3", "M2"],
  O3: ["O2", "O4"],
  O4: ["O3", "O5", "M4"],
  O5: ["O4", "O6"],
  O6: ["O5", "O7", "M6"],
  O7: ["O6", "O8"],
  O8: ["O7", "O1", "M8"],
  // Middle square adjacency
  M1: ["M2", "M8"],
  M2: ["M1", "M3", "I2"],
  M3: ["M2", "M4"],
  M4: ["M3", "M5", "I4"],
  M5: ["M4", "M6"],
  M6: ["M5", "M7", "I6"],
  M7: ["M6", "M8"],
  M8: ["M7", "M1", "I8"],
  // Inner square adjacency
  I1: ["I2", "I8"],
  I2: ["I1", "I3"],
  I3: ["I2", "I4"],
  I4: ["I3", "I5"],
  I5: ["I4", "I6"],
  I6: ["I5", "I7"],
  I7: ["I6", "I8"],
  I8: ["I7", "I1"],
};

export const millCombinations = [
    ["O1", "O2", "O3"],
    ["O3", "O4", "O5"],
    ["O5", "O6", "O7"],
    ["O7", "O8", "O1"],
    // Middle square mills
    ["M1", "M2", "M3"],
    ["M3", "M4", "M5"],
    ["M5", "M6", "M7"],
    ["M7", "M8", "M1"],
    // Inner square mills
    ["I1", "I2", "I3"],
    ["I3", "I4", "I5"],
    ["I5", "I6", "I7"],
    ["I7", "I8", "I1"],
    // Connections across squares
    ["O2", "M2", "I2"],
    ["O4", "M4", "I4"],
    ["O6", "M6", "I6"],
    ["O8", "M8", "I8"],
  ];

export const checkForMills = (updatedBoard, currentPlayer, processedMills) => {
  return millCombinations.filter(
    (mill) =>
      mill.every((point) => updatedBoard[point] === currentPlayer) &&
      !processedMills.includes(mill.join("-"))
  );
};
