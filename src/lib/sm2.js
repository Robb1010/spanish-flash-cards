/**
 * SM-2 spaced repetition algorithm
 * @param {number} quality - 0 (blackout) to 5 (perfect)
 * @param {object} card - { ease_factor, interval_days, repetitions }
 * @returns updated { ease_factor, interval_days, repetitions, due_at }
 */
export function sm2(quality, { ease_factor, interval_days, repetitions }) {
  let newEF = ease_factor + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02));
  if (newEF < 1.3) newEF = 1.3;

  let newInterval, newReps;
  if (quality < 3) {
    newReps = 0;
    newInterval = 1;
  } else {
    newReps = repetitions + 1;
    if (repetitions === 0) newInterval = 1;
    else if (repetitions === 1) newInterval = 6;
    else newInterval = Math.round(interval_days * newEF);
  }

  const due = new Date();
  due.setDate(due.getDate() + newInterval);

  return {
    ease_factor: newEF,
    interval_days: newInterval,
    repetitions: newReps,
    due_at: due.toISOString(),
  };
}

export const qualityMap = { correct: 5, hint: 3, wrong: 1 };
