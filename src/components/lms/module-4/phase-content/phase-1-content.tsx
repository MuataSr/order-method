'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Calendar, MessageSquare, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_4 } from '../constants';
import { PreviewModeGate } from '@/components/lms/preview-mode-gate';

interface Phase1ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  bypassGates?: boolean;
}

const gates = PHASES_MODULE_4[0].gates;

export function Phase1Content({ completedGates, onCompleteGate, bypassGates }: Phase1ContentProps) {
  const bypassGatesEnabled = bypassGates ?? false;
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 1;
  });

  const [visionStatement, setVisionStatement] = useState('');
  const [trainingDate, setTrainingDate] = useState('');
  const [attendees, setAttendees] = useState('');
  const [teamQuestions, setTeamQuestions] = useState('');
  const [roles, setRoles] = useState<Array<{
    systemName: string;
    primaryOwner: string;
    backupOwner: string;
    acknowledged: boolean;
  }>>([
    { systemName: '', primaryOwner: '', backupOwner: '', acknowledged: false },
  ]);

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;

  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitVisionStatement = async () => {
    if (visionStatement.trim().split(/\s+/).length < 10) {
      return;
    }
    await onCompleteGate('vision_statement', { visionStatement });
    setCurrentGate(2);
  };

  const handleSubmitCalendar = async () => {
    if (!trainingDate.trim()) return;
    await onCompleteGate('calendar_confirmation', { calendarConfirmation: trainingDate });
    setCurrentGate(3);
  };

  const handleSubmitTrainingNotes = async () => {
    if (!attendees.trim() || !teamQuestions.trim()) return;
    await onCompleteGate('training_notes', {
      trainingNotes: {
        sessionDate: trainingDate,
        attendees: attendees.split(',').map(a => a.trim()),
        teamQuestions: teamQuestions.split('\n').filter(q => q.trim()),
      },
    });
    setCurrentGate(5);
  };

  const handleSubmitRolesTable = async () => {
    const validRoles = roles.filter(r => r.systemName && r.primaryOwner);
    if (validRoles.length === 0) return;
    await onCompleteGate('roles_table', { rolesTable: validRoles });
  };

  const addRole = () => {
    setRoles([...roles, { systemName: '', primaryOwner: '', backupOwner: '', acknowledged: false }]);
  };

  const updateRole = (index: number, field: string, value: string | boolean) => {
    const updated = [...roles];
    updated[index] = { ...updated[index], [field]: value };
    setRoles(updated);
  };

  return (
    <div className="space-y-6">
      {bypassGatesEnabled && (
        <div className="space-y-4">
          {gates.map((gate) => (
            <PreviewModeGate
              key={gate.name}
              gateName={gate.name}
              gateLabel={gate.label}
              day={gate.day}
            />
          ))}
        </div>
      )}
      {!bypassGatesEnabled && (
        <>
          {/* Progress */}
          <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase 1 Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedGates.filter(g => gates.some(gate => gate.name === g)).length}/{gates.length} gates
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Gate Navigation */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {gates.map((gate) => (
          <button
            key={gate.name}
            onClick={() => (bypassGatesEnabled || isGateComplete(gate.name)) && setCurrentGate(gate.day)}
            disabled={!bypassGatesEnabled && !isGateComplete(gate.name) && gate.day > currentGate}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all',
              isGateComplete(gate.name) && 'border-green-500 bg-green-500/10',
              currentGate === gate.day && !isGateComplete(gate.name) && 'border-primary bg-primary/10',
              !bypassGatesEnabled && gate.day > currentGate && 'border-muted opacity-50 cursor-not-allowed'
            )}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-medium">Day {gate.day}</span>
              {isGateComplete(gate.name) && <CheckCircle2 className="h-3 w-3 text-green-500" />}
            </div>
            <p className="text-xs text-muted-foreground">{gate.label}</p>
          </button>
        ))}
      </div>

      {/* Day 1: Vision Statement */}
      {currentGate === 1 && !isGateComplete('vision_statement') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Day 1: The 'Why' Narrative</CardTitle>
            </div>
            <CardDescription>
              Draft a 2-3 sentence Vision Statement explaining the shift to systems. Focus on benefits to team AND business.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Vision Statement</label>
              <Textarea
                value={visionStatement}
                onChange={(e) => setVisionStatement(e.target.value)}
                placeholder="Example: We're implementing systems to reduce chaos and help everyone leave on time. This means less firefighting and more time for the work that matters. When we follow clear processes, we can all be more successful together."
                rows={4}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-1">
                {visionStatement.trim().split(/\s+/).filter(w => w).length} words (minimum 10 words)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Tips for Your Vision Statement:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Avoid language that sounds like policing or micromanagement</li>
                <li>• Focus on team benefits, not just business benefits</li>
                <li>• Be specific about what success looks like</li>
                <li>• Address potential concerns proactively</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitVisionStatement}
              disabled={visionStatement.trim().split(/\s+/).length < 10}
              className="w-full"
            >
              Submit Vision Statement
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Day 2: Calendar Confirmation */}
      {currentGate === 2 && !isGateComplete('calendar_confirmation') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Day 2: The Training Plan</CardTitle>
            </div>
            <CardDescription>
              Schedule your training session and prepare the agenda.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Training Session Date & Time</label>
              <Input
                type="text"
                value={trainingDate}
                onChange={(e) => setTrainingDate(e.target.value)}
                placeholder="e.g., Monday, March 15th at 2:00 PM"
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Training Preparation Checklist:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Define who must attend</li>
                <li>✓ Select 2-3 workflows to cover</li>
                <li>✓ Prepare materials and walkthrough agenda</li>
                <li>✓ Block 60-90 minutes on the calendar</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitCalendar}
              disabled={!trainingDate.trim()}
              className="w-full"
            >
              Confirm Training Scheduled
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 3-4: Training Notes */}
      {(currentGate === 3 || currentGate === 4) && !isGateComplete('training_notes') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Days 3-4: Run the Training</CardTitle>
            </div>
            <CardDescription>
              Document your training session and team questions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Who Attended?</label>
              <Textarea
                value={attendees}
                onChange={(e) => setAttendees(e.target.value)}
                placeholder="List names separated by commas"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Team Questions & Concerns</label>
              <Textarea
                value={teamQuestions}
                onChange={(e) => setTeamQuestions(e.target.value)}
                placeholder="Record each question or concern on a new line"
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Training Best Practices:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Walk through 'Trigger → Steps → Done' for each workflow</li>
                <li>• Show where SOPs and templates live</li>
                <li>• Allow hands-on practice during session</li>
                <li>• Record ALL questions without judgment</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitTrainingNotes}
              disabled={!attendees.trim() || !teamQuestions.trim()}
              className="w-full"
            >
              Submit Training Notes
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 5-7: Roles Table */}
      {currentGate >= 5 && !isGateComplete('roles_table') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-indigo-500" />
              <CardTitle className="text-lg">Days 5-7: Assign Official Roles</CardTitle>
            </div>
            <CardDescription>
              Confirm Primary and Backup owners for each system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {roles.map((role, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <label className="text-xs font-medium mb-1 block">System Name</label>
                    <Input
                      value={role.systemName}
                      onChange={(e) => updateRole(index, 'systemName', e.target.value)}
                      placeholder="e.g., Client Onboarding"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Primary Owner</label>
                    <Input
                      value={role.primaryOwner}
                      onChange={(e) => updateRole(index, 'primaryOwner', e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Backup Owner</label>
                    <Input
                      value={role.backupOwner}
                      onChange={(e) => updateRole(index, 'backupOwner', e.target.value)}
                      placeholder="Name"
                    />
                  </div>
                  <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={role.acknowledged}
                        onChange={(e) => updateRole(index, 'acknowledged', e.target.checked)}
                        className="rounded border-input"
                      />
                      <span className="text-xs">Acknowledged</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addRole} className="w-full">
              + Add Another System
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Owner Confirmation Questions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "Do you feel clear on what 'done right' looks like?"</li>
                <li>• "What support do you need from me?"</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitRolesTable}
              disabled={!roles.some(r => r.systemName && r.primaryOwner)}
              className="w-full"
            >
              Submit Roles Table
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}
        </>
      )}

      {/* Phase Complete Message */}
      {isGateComplete('roles_table') && !bypassGatesEnabled && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Phase 1 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your team is aligned and trained. Continue to Phase 2 to test their independence.
            </p>
            <Badge className="bg-green-500">4/4 Gates Completed</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
