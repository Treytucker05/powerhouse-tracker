export function processRPData(state) {
  const result = {};
  Object.keys(state.volumeLandmarks).forEach((m) => {
    const land = state.volumeLandmarks[m];
    result[m] = {
      MEV: land.MEV,
      MAV: land.MAV,
      MRV: land.MRV,
    };
  });
  return result;
}
