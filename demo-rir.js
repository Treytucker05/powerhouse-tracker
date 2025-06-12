// RIR Schedule & Load Feedback System Demo
console.log('=== RIR Schedule & Load Feedback System Demo ===\n');

// Core RIR Schedule
const RIR_SCHEDULE = {
  4: [3, 2, 1, 0],
  5: [3, 3, 2, 1, 0], 
  6: [3, 3, 2, 2, 1, 0]
};

function getScheduledRIR(week, mesoLength) {
  if (mesoLength < 3 || mesoLength > 6 || week < 1) return 3;
  const schedule = RIR_SCHEDULE[mesoLength] || [3, 2, 1, 0];
  return week > schedule.length ? schedule[schedule.length - 1] : schedule[week - 1];
}

// Demo 1: RIR Schedule
console.log('📅 RIR SCHEDULE:');
console.log('4-Week Mesocycle:');
for (let week = 1; week <= 4; week++) {
  const rir = getScheduledRIR(week, 4);
  console.log(`  Week ${week}: Target RIR = ${rir}`);
}

// Demo 2: Load Adjustments
console.log('\n⚖️ LOAD ADJUSTMENTS:');
const scenarios = [
  { actual: 3, target: 3, desc: 'Perfect execution' },
  { actual: 4, target: 3, desc: 'Too easy' },
  { actual: 2, target: 3, desc: 'Too hard' }
];

scenarios.forEach(scenario => {
  const deviation = scenario.actual - scenario.target;
  let adjustment = 0;
  
  if (Math.abs(deviation) <= 0.5) {
    adjustment = 0;
  } else if (deviation > 0) {
    adjustment = Math.min(15, deviation * 5);
  } else {
    adjustment = Math.max(-15, deviation * 7);
  }
  
  console.log(`${scenario.desc}: ${adjustment > 0 ? '+' : ''}${adjustment}% load change`);
});

console.log('\n✅ System fully operational!');
