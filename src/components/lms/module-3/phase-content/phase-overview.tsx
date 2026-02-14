/**
 * Phase Overview Component
 *
 * Displays the learning content for each phase in Module 3.
 * Shows phase focus, objectives, and key learning points.
 *
 * @module phase-content/phase-overview
 */

import { LearnContentProps } from '../types';

/**
 * Phase Overview Content Component
 *
 * Displays educational content for the selected phase.
 * Includes phase description, focus areas, and learning objectives.
 *
 * @param phase - The phase number (1-4)
 */
export function PhaseOverview({ phase }: LearnContentProps) {
  const learnContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-4">
        <h3 className="font-semibold">The Blueprint Phase</h3>
        <p className="text-sm text-muted-foreground">
          Before building systems, you need blueprints. This phase is about deep understanding of your workflows.
          You'll identify what to systemize, define clear boundaries, and map every step.
        </p>
        <h4 className="font-medium text-sm">Phase Focus:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Select 3 high-impact workflows for systemization</li>
          <li>Define clear triggers (what starts workflow)</li>
          <li>Define desired outcomes (what success looks like)</li>
          <li>Map every step from trigger to outcome</li>
          <li>Identify decision points and handoffs</li>
        </ul>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <h3 className="font-semibold">Simplification Phase</h3>
        <p className="text-sm text-muted-foreground">
          Complexity kills systems. This phase applies ruthless simplification to make your systems foolproof.
          Apply 80/20 rule, build checklists, and create templates.
        </p>
        <h4 className="font-medium text-sm">Phase Focus:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Apply Pareto Principle (80/20 rule)</li>
          <li>Identify essential vs. non-essential steps</li>
          <li>Build bulletproof checklists</li>
          <li>Create reusable templates</li>
          <li>Validate simplified workflows</li>
        </ul>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <h3 className="font-semibold">Infrastructure Phase</h3>
        <p className="text-sm text-muted-foreground">
          Systems need infrastructure to scale. This phase assigns ownership, creates repositories,
          and defines metrics for long-term success.
        </p>
        <h4 className="font-medium text-sm">Phase Focus:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Assign clear owners for each system</li>
          <li>Define accountability and review processes</li>
          <li>Create central repository with version control</li>
          <li>Define success metrics and measurement systems</li>
          <li>Validate infrastructure readiness</li>
        </ul>
      </div>
    ),
    4: (
      <div className="space-y-4">
        <h3 className="font-semibold">Reality Test Phase</h3>
        <p className="text-sm text-muted-foreground">
          Theory meets reality. This phase tests your systems in real conditions, refines based on feedback,
          and produces your Systems Playbook v1.0.
        </p>
        <h4 className="font-medium text-sm">Phase Focus:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Run systems through real scenarios</li>
          <li>Document failures and friction points</li>
          <li>Refine based on test results</li>
          <li>Finalize all 3 workflows</li>
          <li>Compile Systems Playbook v1.0</li>
        </ul>
      </div>
    ),
  };

  return learnContent[phase] || <p>Select a phase to see learning content.</p>;
}
