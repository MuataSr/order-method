import { describe, it, expect } from 'vitest';
import {
  parseCompletedGates,
  isPhaseComplete,
  calculatePhaseProgress,
  isPhaseUnlocked,
  getPhaseGatesCompleted,
  getCurrentPhase,
  getNextGate,
  isFreedomFounderEarned,
  getProgressPercentage,
  generateMetricId,
} from '../utils';
import { PHASES_MODULE_5, TOTAL_GATES_MODULE_5 } from '../constants';

describe('Module 5 Utils', () => {
  describe('parseCompletedGates', () => {
    it('returns empty array for null/undefined input', () => {
      expect(parseCompletedGates(null as unknown as string)).toEqual([]);
      expect(parseCompletedGates(undefined as unknown as string)).toEqual([]);
    });

    it('returns array as-is if already an array', () => {
      expect(parseCompletedGates(['gate1', 'gate2'])).toEqual(['gate1', 'gate2']);
    });

    it('parses JSON string to array', () => {
      expect(parseCompletedGates('["gate1", "gate2"]')).toEqual(['gate1', 'gate2']);
    });

    it('returns empty array for invalid JSON', () => {
      expect(parseCompletedGates('not valid json')).toEqual([]);
    });

    it('returns empty array if parsed value is not an array', () => {
      expect(parseCompletedGates('{"key": "value"}')).toEqual([]);
    });
  });

  describe('isPhaseComplete', () => {
    it('returns true when all phase gates are completed', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates;
      const completedGates = phase1Gates.map(g => g.name);
      expect(isPhaseComplete(phase1Gates, completedGates)).toBe(true);
    });

    it('returns false when some phase gates are missing', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates;
      const completedGates = [phase1Gates[0].name];
      expect(isPhaseComplete(phase1Gates, completedGates)).toBe(false);
    });

    it('returns false when no gates are completed', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates;
      expect(isPhaseComplete(phase1Gates, [])).toBe(false);
    });
  });

  describe('calculatePhaseProgress', () => {
    it('calculates correct percentage', () => {
      expect(calculatePhaseProgress(5, 10)).toBe(50);
      expect(calculatePhaseProgress(3, 12)).toBe(25);
      expect(calculatePhaseProgress(10, 10)).toBe(100);
    });

    it('returns 0 for zero total gates', () => {
      expect(calculatePhaseProgress(5, 0)).toBe(0);
    });

    it('handles zero completed gates', () => {
      expect(calculatePhaseProgress(0, 10)).toBe(0);
    });
  });

  describe('isPhaseUnlocked', () => {
    it('phase 1 is always unlocked', () => {
      expect(isPhaseUnlocked(1, [])).toBe(true);
    });

    it('phase 2 is locked when phase 1 is incomplete', () => {
      expect(isPhaseUnlocked(2, [])).toBe(false);
    });

    it('phase 2 is unlocked when phase 1 is complete', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates.map(g => g.name);
      expect(isPhaseUnlocked(2, phase1Gates)).toBe(true);
    });

    it('phase 3 is unlocked when phases 1 and 2 are complete', () => {
      const completedGates = [
        ...PHASES_MODULE_5[0].gates.map(g => g.name),
        ...PHASES_MODULE_5[1].gates.map(g => g.name),
      ];
      expect(isPhaseUnlocked(3, completedGates)).toBe(true);
    });

    it('phase 4 is unlocked when phases 1, 2, and 3 are complete', () => {
      const completedGates = [
        ...PHASES_MODULE_5[0].gates.map(g => g.name),
        ...PHASES_MODULE_5[1].gates.map(g => g.name),
        ...PHASES_MODULE_5[2].gates.map(g => g.name),
      ];
      expect(isPhaseUnlocked(4, completedGates)).toBe(true);
    });
  });

  describe('getPhaseGatesCompleted', () => {
    it('returns 0 for phase with no completed gates', () => {
      expect(getPhaseGatesCompleted(1, [])).toBe(0);
    });

    it('returns correct count for partial completion', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates;
      const completedGates = [phase1Gates[0].name, phase1Gates[1].name];
      expect(getPhaseGatesCompleted(1, completedGates)).toBe(2);
    });

    it('returns full count when all gates completed', () => {
      const phase1Gates = PHASES_MODULE_5[0].gates;
      const completedGates = phase1Gates.map(g => g.name);
      expect(getPhaseGatesCompleted(1, completedGates)).toBe(phase1Gates.length);
    });

    it('returns 0 for invalid phase number', () => {
      expect(getPhaseGatesCompleted(99, ['gate1'])).toBe(0);
    });
  });

  describe('getCurrentPhase', () => {
    it('returns 1 when no gates are completed', () => {
      expect(getCurrentPhase([])).toBe(1);
    });

    it('returns 2 when phase 1 is complete', () => {
      const completedGates = PHASES_MODULE_5[0].gates.map(g => g.name);
      expect(getCurrentPhase(completedGates)).toBe(2);
    });

    it('returns 4 when all phases are complete', () => {
      const completedGates = PHASES_MODULE_5.flatMap(p => p.gates.map(g => g.name));
      expect(getCurrentPhase(completedGates)).toBe(4);
    });
  });

  describe('getNextGate', () => {
    it('returns first gate when no gates completed', () => {
      const nextGate = getNextGate([]);
      expect(nextGate).toBe(PHASES_MODULE_5[0].gates[0].name);
    });

    it('returns null when all gates completed', () => {
      const allGates = PHASES_MODULE_5.flatMap(p => p.gates.map(g => g.name));
      expect(getNextGate(allGates)).toBe(null);
    });

    it('returns correct next gate after partial completion', () => {
      const completedGates = [PHASES_MODULE_5[0].gates[0].name];
      const nextGate = getNextGate(completedGates);
      expect(nextGate).toBe(PHASES_MODULE_5[0].gates[1].name);
    });
  });

  describe('isFreedomFounderEarned', () => {
    it('returns false when not all gates completed', () => {
      expect(isFreedomFounderEarned([])).toBe(false);
      expect(isFreedomFounderEarned(['gate1', 'gate2'])).toBe(false);
    });

    it('returns true when all gates completed', () => {
      const allGates = PHASES_MODULE_5.flatMap(p => p.gates.map(g => g.name));
      expect(isFreedomFounderEarned(allGates)).toBe(true);
    });
  });

  describe('getProgressPercentage', () => {
    it('returns 0 when no gates completed', () => {
      expect(getProgressPercentage([])).toBe(0);
    });

    it('returns 100 when all gates completed', () => {
      const allGates = PHASES_MODULE_5.flatMap(p => p.gates.map(g => g.name));
      expect(getProgressPercentage(allGates)).toBe(100);
    });

    it('returns correct percentage for partial completion', () => {
      const halfGates = Math.floor(TOTAL_GATES_MODULE_5 / 2);
      const completedGates = PHASES_MODULE_5.flatMap(p => p.gates.map(g => g.name)).slice(0, halfGates);
      const expectedPercentage = Math.round((halfGates / TOTAL_GATES_MODULE_5) * 100);
      expect(getProgressPercentage(completedGates)).toBe(expectedPercentage);
    });
  });

  describe('generateMetricId', () => {
    it('generates unique IDs', () => {
      const id1 = generateMetricId();
      const id2 = generateMetricId();
      expect(id1).not.toBe(id2);
    });

    it('generates IDs with correct prefix', () => {
      const id = generateMetricId();
      expect(id.startsWith('metric-')).toBe(true);
    });
  });
});
