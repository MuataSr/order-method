'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Shield, Calendar, Users, Star, Trophy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_4, TOTAL_GATES_MODULE_4 } from '../constants';

interface Phase3ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  isTeamChampion: boolean;
}

const gates = PHASES_MODULE_4[2].gates;

export function Phase3Content({ completedGates, onCompleteGate, isTeamChampion }: Phase3ContentProps) {
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 15;
  });

  const [decisionItems, setDecisionItems] = useState<Array<{
    decisionType: string;
    teamCanDecide: string;
    mustEscalate: boolean;
  }>>([
    { decisionType: '', teamCanDecide: '', mustEscalate: false },
  ]);

  const [weeklyMeetingDetails, setWeeklyMeetingDetails] = useState('');
  const [steppedUpMost, setSteppedUpMost] = useState('');
  const [stillTooInvolved, setStillTooInvolved] = useState('');
  const [nextWorkflow, setNextWorkflow] = useState('');
  const [lessonsLearned, setLessonsLearned] = useState('');

  const allPreviousGatesComplete = completedGates.length >= (TOTAL_GATES_MODULE_4 - gates.length);
  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;

  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitDecisionMatrix = async () => {
    const validItems = decisionItems.filter(d => d.decisionType && d.teamCanDecide);
    if (validItems.length === 0) return;
    await onCompleteGate('decision_matrix', { decisionMatrix: validItems });
    setCurrentGate(18);
  };

  const handleSubmitWeeklyRhythm = async () => {
    if (!weeklyMeetingDetails.trim()) return;
    await onCompleteGate('weekly_rhythm_calendar', { weeklyRhythmCalendar: weeklyMeetingDetails });
    setCurrentGate(20);
  };

  const handleSubmitEmpowermentAudit = async () => {
    if (!steppedUpMost.trim() || !stillTooInvolved.trim()) return;
    await onCompleteGate('team_empowerment_audit', {
      teamEmpowermentAudit: {
        steppedUpMost,
        stillTooInvolved,
        nextWorkflow,
        lessonsLearned,
        adjustmentsNeeded: '',
        signedAt: new Date().toISOString(),
      },
    });
  };

  const addDecisionItem = () => {
    setDecisionItems([...decisionItems, { decisionType: '', teamCanDecide: '', mustEscalate: false }]);
  };

  const updateDecisionItem = (index: number, field: string, value: string | boolean) => {
    const updated = [...decisionItems];
    updated[index] = { ...updated[index], [field]: value };
    setDecisionItems(updated);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase 3 Progress</span>
            <span className="text-sm text-muted-foreground">
              {completedGates.filter(g => gates.some(gate => gate.name === g)).length}/{gates.length} gates
            </span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </CardContent>
      </Card>

      {/* Gate Navigation */}
      <div className="grid grid-cols-3 gap-3">
        {gates.map((gate) => (
          <button
            key={gate.name}
            onClick={() => isGateComplete(gate.name) && setCurrentGate(gate.day)}
            disabled={!isGateComplete(gate.name) && gate.day > currentGate}
            className={cn(
              'p-3 rounded-lg border-2 text-left transition-all',
              isGateComplete(gate.name) && 'border-green-500 bg-green-500/10',
              currentGate === gate.day && !isGateComplete(gate.name) && 'border-primary bg-primary/10',
              gate.day > currentGate && 'border-muted opacity-50 cursor-not-allowed'
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

      {/* Days 15-17: Decision Matrix */}
      {(currentGate >= 15 && currentGate <= 17) && !isGateComplete('decision_matrix') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-violet-500" />
              <CardTitle className="text-lg">Days 15-17: Set Decision Boundaries</CardTitle>
            </div>
            <CardDescription>
              Define what the team CAN decide on their own vs. when they MUST escalate.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {decisionItems.map((item, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <label className="text-xs font-medium mb-1 block">Decision Type</label>
                    <Input
                      value={item.decisionType}
                      onChange={(e) => updateDecisionItem(index, 'decisionType', e.target.value)}
                      placeholder="e.g., Client deadline change"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Team Can Decide If...</label>
                    <Input
                      value={item.teamCanDecide}
                      onChange={(e) => updateDecisionItem(index, 'teamCanDecide', e.target.value)}
                      placeholder="e.g., Within 2 days"
                    />
                  </div>
                  <div className="flex items-end gap-2">
                    <label className="flex items-center gap-2 cursor-pointer pb-2">
                      <input
                        type="checkbox"
                        checked={item.mustEscalate}
                        onChange={(e) => updateDecisionItem(index, 'mustEscalate', e.target.checked)}
                        className="rounded border-input"
                      />
                      <span className="text-xs">Must escalate?</span>
                    </label>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addDecisionItem} className="w-full">
              + Add Another Decision Type
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Decision Boundary Examples:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• <strong>Client deadline changes:</strong> Team decides if within 2 days, escalate if more</li>
                <li>• <strong>Budget approvals:</strong> Team decides up to $500, escalate above</li>
                <li>• <strong>Refunds/credits:</strong> Team decides up to $100, escalate above</li>
                <li>• <strong>Scope changes:</strong> Always escalate</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitDecisionMatrix}
              disabled={!decisionItems.some(d => d.decisionType && d.teamCanDecide)}
              className="w-full"
            >
              Submit Decision Matrix
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 18-19: Weekly Rhythm */}
      {(currentGate === 18 || currentGate === 19) && !isGateComplete('weekly_rhythm_calendar') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-violet-500" />
              <CardTitle className="text-lg">Days 18-19: The Weekly Rhythm</CardTitle>
            </div>
            <CardDescription>
              Design and schedule your recurring weekly meeting structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Weekly Meeting Details</label>
              <Textarea
                value={weeklyMeetingDetails}
                onChange={(e) => setWeeklyMeetingDetails(e.target.value)}
                placeholder="e.g., Every Monday at 10:00 AM for 30 minutes. Attendees: All system owners."
                rows={3}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Weekly Meeting Agenda Template:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. <strong>Quick Wins</strong> (5 min) - What went well this week?</li>
                <li>2. <strong>Key Numbers/Metrics</strong> (10 min) - Dashboard review</li>
                <li>3. <strong>Issues</strong> (10 min) - What's stuck or broken?</li>
                <li>4. <strong>Improvements</strong> (5 min) - One thing to fix next week</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">📅 Schedule the Recurring Invite</h4>
              <p className="text-sm text-muted-foreground">
                Create a recurring calendar invite for the same time each week. Confirm attendance expectations with all system owners.
              </p>
            </div>

            <Button
              onClick={handleSubmitWeeklyRhythm}
              disabled={!weeklyMeetingDetails.trim()}
              className="w-full"
            >
              Submit Weekly Rhythm
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 20-21: Team Empowerment Audit */}
      {(currentGate >= 20) && !isGateComplete('team_empowerment_audit') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-violet-500" />
              <CardTitle className="text-lg">Days 20-21: The Next Steps Review</CardTitle>
            </div>
            <CardDescription>
              Complete the Team Empowerment Audit to finish Module 4.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Where has the team stepped up most?</label>
              <Textarea
                value={steppedUpMost}
                onChange={(e) => setSteppedUpMost(e.target.value)}
                placeholder="Which systems are running smoothly without your involvement?"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Where are you still too involved?</label>
              <Textarea
                value={stillTooInvolved}
                onChange={(e) => setStillTooInvolved(e.target.value)}
                placeholder="Which areas still require your direct intervention?"
                rows={2}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Which workflow should you systemize or train on next?</label>
              <Input
                value={nextWorkflow}
                onChange={(e) => setNextWorkflow(e.target.value)}
                placeholder="e.g., Monthly reporting, Quarterly reviews"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Key lessons learned</label>
              <Textarea
                value={lessonsLearned}
                onChange={(e) => setLessonsLearned(e.target.value)}
                placeholder="What would you do differently? What worked well?"
                rows={2}
              />
            </div>

            <Button
              onClick={handleSubmitEmpowermentAudit}
              disabled={!steppedUpMost.trim() || !stillTooInvolved.trim()}
              className="w-full"
            >
              <Trophy className="mr-2 h-4 w-4" />
              Submit & Complete Module 4
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Complete Message */}
      {isGateComplete('team_empowerment_audit') && (
        <Card className="border-purple-500 bg-purple-500/5">
          <CardContent className="p-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', duration: 0.5 }}
            >
              <div className="relative inline-block mb-4">
                <div className="absolute inset-0 bg-purple-400 blur-2xl opacity-50 rounded-full" />
                <div className="relative bg-purple-500 text-white p-6 rounded-2xl">
                  <Users className="h-16 w-16 mb-2" />
                  <div className="text-lg font-bold">Team Champion</div>
                </div>
              </div>
            </motion.div>

            <h3 className="font-semibold text-xl mb-2">🎉 Module 4 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              You have successfully transitioned operational control to your team. Your team can now run systems without your constant intervention.
            </p>

            <div className="flex flex-wrap justify-center gap-2 mb-4">
              <Badge className="bg-purple-500">
                <Star className="h-3 w-3 mr-1" />
                Team Champion Badge Earned
              </Badge>
              <Badge className="bg-green-500">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                {TOTAL_GATES_MODULE_4}/{TOTAL_GATES_MODULE_4} Gates Completed
              </Badge>
            </div>

            <p className="text-sm text-muted-foreground">
              Module 5: Replace Yourself & Review is now unlocked!
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
