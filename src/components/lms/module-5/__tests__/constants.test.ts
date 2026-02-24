import { describe, it, expect } from 'vitest';
import {
  MODULE_5_META,
  PHASES_MODULE_5,
  ALL_GATES_MODULE_5,
  TOTAL_GATES_MODULE_5,
  MODULE_5_FINAL_ASSESSMENT,
  MODULE_5_LEARNING_OBJECTIVES,
  MODULE_5_OUTCOMES,
  DAY_THEMES,
  DASHBOARD_METRIC_CATEGORIES,
} from '../constants';

describe('Module 5 Constants', () => {
  describe('MODULE_5_META', () => {
    it('has correct id', () => {
      expect(MODULE_5_META.id).toBe('module-5');
    });

    it('has correct total days', () => {
      expect(MODULE_5_META.totalDays).toBe(30);
    });

    it('has correct total gates', () => {
      expect(MODULE_5_META.totalGates).toBe(12);
    });

    it('has correct badge name', () => {
      expect(MODULE_5_META.badgeName).toBe('Freedom Founder');
    });

    it('has required properties', () => {
      expect(MODULE_5_META).toHaveProperty('title');
      expect(MODULE_5_META).toHaveProperty('subtitle');
      expect(MODULE_5_META).toHaveProperty('description');
      expect(MODULE_5_META).toHaveProperty('icon');
      expect(MODULE_5_META).toHaveProperty('color');
    });
  });

  describe('PHASES_MODULE_5', () => {
    it('has exactly 4 phases', () => {
      expect(PHASES_MODULE_5).toHaveLength(4);
    });

    it('each phase has required properties', () => {
      PHASES_MODULE_5.forEach(phase => {
        expect(phase).toHaveProperty('number');
        expect(phase).toHaveProperty('name');
        expect(phase).toHaveProperty('days');
        expect(phase).toHaveProperty('description');
        expect(phase).toHaveProperty('gates');
        expect(phase).toHaveProperty('gateCount');
      });
    });

    it('each phase has correct gate count matching gates array', () => {
      PHASES_MODULE_5.forEach(phase => {
        expect(phase.gateCount).toBe(phase.gates.length);
      });
    });

    it('each gate has name, label, and day properties', () => {
      PHASES_MODULE_5.forEach(phase => {
        phase.gates.forEach(gate => {
          expect(gate).toHaveProperty('name');
          expect(gate).toHaveProperty('label');
          expect(gate).toHaveProperty('day');
        });
      });
    });

    it('phase numbers are sequential (1-4)', () => {
      PHASES_MODULE_5.forEach((phase, index) => {
        expect(phase.number).toBe(index + 1);
      });
    });

    it('each phase has 3 gates', () => {
      PHASES_MODULE_5.forEach(phase => {
        expect(phase.gates).toHaveLength(3);
      });
    });
  });

  describe('ALL_GATES_MODULE_5', () => {
    it('contains all gates from all phases', () => {
      const totalGatesInPhases = PHASES_MODULE_5.reduce((sum, phase) => sum + phase.gates.length, 0);
      expect(ALL_GATES_MODULE_5).toHaveLength(totalGatesInPhases);
    });

    it('matches TOTAL_GATES_MODULE_5', () => {
      expect(ALL_GATES_MODULE_5).toHaveLength(TOTAL_GATES_MODULE_5);
    });
  });

  describe('TOTAL_GATES_MODULE_5', () => {
    it('equals 12', () => {
      expect(TOTAL_GATES_MODULE_5).toBe(12);
    });
  });

  describe('MODULE_5_FINAL_ASSESSMENT', () => {
    it('has 5 questions', () => {
      expect(MODULE_5_FINAL_ASSESSMENT).toHaveLength(5);
    });

    it('each question has required properties', () => {
      MODULE_5_FINAL_ASSESSMENT.forEach(question => {
        expect(question).toHaveProperty('question');
        expect(question).toHaveProperty('options');
        expect(question).toHaveProperty('correctAnswer');
        expect(question).toHaveProperty('explanation');
      });
    });

    it('each question has 4 options', () => {
      MODULE_5_FINAL_ASSESSMENT.forEach(question => {
        expect(question.options).toHaveLength(4);
      });
    });

    it('correctAnswer is a valid index', () => {
      MODULE_5_FINAL_ASSESSMENT.forEach(question => {
        expect(question.correctAnswer).toBeGreaterThanOrEqual(0);
        expect(question.correctAnswer).toBeLessThan(question.options.length);
      });
    });
  });

  describe('MODULE_5_LEARNING_OBJECTIVES', () => {
    it('has learning objectives', () => {
      expect(MODULE_5_LEARNING_OBJECTIVES.length).toBeGreaterThan(0);
    });

    it('has 6 learning objectives', () => {
      expect(MODULE_5_LEARNING_OBJECTIVES).toHaveLength(6);
    });
  });

  describe('MODULE_5_OUTCOMES', () => {
    it('has 3 outcomes', () => {
      expect(MODULE_5_OUTCOMES).toHaveLength(3);
    });

    it('each outcome has required properties', () => {
      MODULE_5_OUTCOMES.forEach(outcome => {
        expect(outcome).toHaveProperty('title');
        expect(outcome).toHaveProperty('description');
        expect(outcome).toHaveProperty('icon');
        expect(outcome).toHaveProperty('color');
        expect(outcome).toHaveProperty('bgColor');
      });
    });
  });

  describe('DAY_THEMES', () => {
    it('has 7 day themes', () => {
      expect(DAY_THEMES).toHaveLength(7);
    });

    it('each theme has value, label, and description', () => {
      DAY_THEMES.forEach(theme => {
        expect(theme).toHaveProperty('value');
        expect(theme).toHaveProperty('label');
        expect(theme).toHaveProperty('description');
      });
    });
  });

  describe('DASHBOARD_METRIC_CATEGORIES', () => {
    it('has metric categories', () => {
      expect(DASHBOARD_METRIC_CATEGORIES.length).toBeGreaterThan(0);
    });

    it('each category has value, label, and icon', () => {
      DASHBOARD_METRIC_CATEGORIES.forEach(category => {
        expect(category).toHaveProperty('value');
        expect(category).toHaveProperty('label');
        expect(category).toHaveProperty('icon');
      });
    });
  });
});
