/**
 * Phase Gate Content Component
 *
 * Displays details for a specific gate and handles form submission.
 * Shows gate description, completion status, and submission form.
 *
 * @module phase-content/phase-gate-content
 */

import { useState } from 'react';
import { CheckCircle2, ArrowLeft, ArrowRight, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { GateContentViewProps, GateFormData, PhaseGate } from '../types';

/**
 * Phase Gate Content Component
 *
 * Displays gate details and handles form submission.
 * Shows different forms based on gate type (final gate vs regular gate).
 *
 * @param gate - The gate object to display
 * @param isCompleted - Whether the gate is completed
 * @param formData - Current form data
 * @param setFormData - Function to update form data
 * @param onSubmit - Callback when form is submitted
 * @param onBack - Callback to go back to gate list
 */
export function PhaseGateContent({
  gate,
  isCompleted,
  formData,
  setFormData,
  onSubmit,
  onBack,
}: GateContentViewProps) {
  // Local state for form validation
  const [touched, setTouched] = useState(false);

  if (isCompleted) {
    return (
      <div className="text-center py-8" role="status" aria-live="polite">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" aria-hidden="true" />
        <h3 className="text-xl font-semibold mb-2">Gate Completed!</h3>
        <p className="text-muted-foreground">You've successfully completed {gate.label}.</p>
        <Button onClick={onBack} className="mt-4">
          Back to Gates
          <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
        </Button>
      </div>
    );
  }

  const isFinalGate = (gate as PhaseGate).name === 'systems_playbook_v1';

  const isFormValid = isFinalGate
    ? !!(formData.workflowTitle && formData.owner && formData.metrics && formData.steps)
    : !!formData.notes;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setTouched(true);
    if (isFormValid) {
      onSubmit();
    }
  };

  return (
    <div className="space-y-4">
      <Button
        variant="ghost"
        onClick={onBack}
        className="mb-2"
        aria-label="Back to gate list"
      >
        <ArrowLeft className="mr-2 h-4 w-4" aria-hidden="true" />
        Back to Gates
      </Button>

      <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg">
        <Target className="h-5 w-5 text-primary" aria-hidden="true" />
        <div>
          <h3 className="font-semibold">{(gate as PhaseGate).label}</h3>
          <p className="text-sm text-muted-foreground">Day {(gate as PhaseGate).day}</p>
        </div>
      </div>

      <p className="text-sm text-muted-foreground">{(gate as PhaseGate).description}</p>

      {isFinalGate ? (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-lg">
            <h4 className="font-semibold mb-2">Systems Playbook v1.0 Entry</h4>
            <p className="text-sm text-muted-foreground mb-3">
              Enter one of your 3 workflows for your Systems Playbook. Complete this gate 3 times to add all workflows.
            </p>
          </div>

          <div>
            <Label htmlFor="workflowTitle">
              Workflow Title
              <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="workflowTitle"
              placeholder="e.g., Client Onboarding Process"
              value={formData.workflowTitle || ''}
              onChange={(e) => setFormData({ ...formData, workflowTitle: e.target.value })}
              className="mt-1"
              required
              aria-required="true"
              aria-invalid={touched && !formData.workflowTitle}
            />
            {touched && !formData.workflowTitle && (
              <p className="text-sm text-destructive mt-1">Workflow title is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="owner">
              Owner
              <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="owner"
              placeholder="Who owns this system?"
              value={formData.owner || ''}
              onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
              className="mt-1"
              required
              aria-required="true"
              aria-invalid={touched && !formData.owner}
            />
            {touched && !formData.owner && (
              <p className="text-sm text-destructive mt-1">Owner is required</p>
            )}
          </div>

          <div>
            <Label htmlFor="metrics">
              Success Metrics
              <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Input
              id="metrics"
              placeholder="e.g., Time to completion: <2 days, Satisfaction: >4.5/5"
              value={formData.metrics || ''}
              onChange={(e) => setFormData({ ...formData, metrics: e.target.value })}
              className="mt-1"
              required
              aria-required="true"
              aria-invalid={touched && !formData.metrics}
            />
            {touched && !formData.metrics && (
              <p className="text-sm text-destructive mt-1">Metrics are required</p>
            )}
          </div>

          <div>
            <Label htmlFor="steps">
              Workflow Steps (one per line)
              <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Textarea
              id="steps"
              placeholder="1. Send welcome email&#10;2. Schedule kickoff call&#10;3. Share project timeline..."
              value={formData.steps || ''}
              onChange={(e) => setFormData({ ...formData, steps: e.target.value })}
              className="mt-1 min-h-[150px]"
              required
              aria-required="true"
              aria-invalid={touched && !formData.steps}
            />
            {touched && !formData.steps && (
              <p className="text-sm text-destructive mt-1">Steps are required</p>
            )}
          </div>

          <div>
            <Label htmlFor="notes">Additional Notes</Label>
            <Textarea
              id="notes"
              placeholder="Any additional context, tools needed, or special considerations..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 min-h-[100px]"
            />
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid}
            aria-label="Submit workflow to Systems Playbook"
          >
            Submit to Systems Playbook
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <Label htmlFor="notes">
              Your Response
              <span className="text-destructive" aria-label="required">*</span>
            </Label>
            <Textarea
              id="notes"
              placeholder="Describe your work for this gate..."
              value={formData.notes || ''}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              className="mt-1 min-h-[150px]"
              required
              aria-required="true"
              aria-invalid={touched && !formData.notes}
            />
            {touched && !formData.notes && (
              <p className="text-sm text-destructive mt-1">Response is required</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full"
            disabled={!isFormValid}
            aria-label="Submit gate"
          >
            Submit Gate
            <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
          </Button>
        </form>
      )}
    </div>
  );
}
