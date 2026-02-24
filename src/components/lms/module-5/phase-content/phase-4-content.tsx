'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Calendar, Settings, Trophy, Star, Zap, Target } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_5, TOTAL_GATES_MODULE_5 } from '../constants';
import { motion } from 'framer-motion';

interface Phase4ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  isFreedomFounder: boolean;
}

const gates = PHASES_MODULE_5[3].gates;

export function Phase4Content({ completedGates, onCompleteGate, isFreedomFounder }: Phase4ContentProps) {
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 24;
  });

  const [testDays, setTestDays] = useState<Array<{
    date: string;
    isWorkDay: boolean;
    plannedActivities: string;
    actualActivities: string;
    slippedIntoOldHabits: boolean;
    notes: string;
  }>>([
    { date: '', isWorkDay: true, plannedActivities: '', actualActivities: '', slippedIntoOldHabits: false, notes: '' },
  ]);

  const [finalAdjustments, setFinalAdjustments] = useState('');

  const [freedomCommitment, setFreedomCommitment] = useState({
    targetDate2DayWeek: '',
    stepsTo3Days: '',
    stepsTo2Days: '',
  });

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;
  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitTestLog = async () => {
    const validDays = testDays.filter(d => d.date && d.plannedActivities && d.actualActivities);
    if (validDays.length < 4) return;
    
    await onCompleteGate('test_week_log', { testWeekLog: validDays });
    setCurrentGate(28);
  };

  const handleSubmitAdjustments = async () => {
    if (finalAdjustments.trim().split(/\s+/).length < 20) return;
    
    await onCompleteGate('final_adjustments', { finalAdjustments });
    setCurrentGate(30);
  };

  const handleSubmitFreedomCommitment = async () => {
    if (!freedomCommitment.targetDate2DayWeek || !freedomCommitment.stepsTo3Days || !freedomCommitment.stepsTo2Days) return;
    
    await onCompleteGate('freedom_commitment', {
      freedomCommitment: {
        ...freedomCommitment,
        signedAt: new Date().toISOString(),
      },
    });
  };

  const addTestDay = () => {
    setTestDays([...testDays, { date: '', isWorkDay: true, plannedActivities: '', actualActivities: '', slippedIntoOldHabits: false, notes: '' }]);
  };

  const updateTestDay = (index: number, field: string, value: string | boolean) => {
    const updated = [...testDays];
    updated[index] = { ...updated[index], [field]: value };
    setTestDays(updated);
  };

  const validDaysCount = testDays.filter(d => d.date && d.plannedActivities && d.actualActivities).length;

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase 4 Progress</span>
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

      {/* Days 24-27: Test Week Log */}
      {(currentGate >= 24 && currentGate <= 27) && !isGateComplete('test_week_log') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Days 24-27: The 4-Day Test Drive</CardTitle>
            </div>
            <CardDescription>
              Live your 4-day schedule for at least one full week and log each day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {testDays.map((day, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-medium text-muted-foreground">Day {index + 1}</span>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={day.isWorkDay}
                        onChange={(e) => updateTestDay(index, 'isWorkDay', e.target.checked)}
                        className="rounded border-input"
                      />
                      <span className="text-xs">Work Day</span>
                    </label>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium">Date</label>
                      <Input
                        type="date"
                        value={day.date}
                        onChange={(e) => updateTestDay(index, 'date', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Slipped into old habits?</label>
                      <div className="flex gap-2 mt-1">
                        <Button
                          variant={day.slippedIntoOldHabits ? 'destructive' : 'outline'}
                          size="sm"
                          onClick={() => updateTestDay(index, 'slippedIntoOldHabits', true)}
                        >
                          Yes
                        </Button>
                        <Button
                          variant={!day.slippedIntoOldHabits ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateTestDay(index, 'slippedIntoOldHabits', false)}
                        >
                          No
                        </Button>
                      </div>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-medium">Planned Activities</label>
                    <Input
                      value={day.plannedActivities}
                      onChange={(e) => updateTestDay(index, 'plannedActivities', e.target.value)}
                      placeholder="What did you plan to do?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Actual Activities</label>
                    <Input
                      value={day.actualActivities}
                      onChange={(e) => updateTestDay(index, 'actualActivities', e.target.value)}
                      placeholder="What actually happened?"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium">Notes / Improvements</label>
                    <Input
                      value={day.notes}
                      onChange={(e) => updateTestDay(index, 'notes', e.target.value)}
                      placeholder="What to improve tomorrow?"
                      className="mt-1"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addTestDay} className="w-full">
              <Calendar className="h-3 w-3 mr-1" /> Add Day
            </Button>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">⚠️ Be Honest</h4>
              <p className="text-sm text-muted-foreground">
                This log is for your benefit. Note where you slipped back into old habits so you can address them.
              </p>
            </div>

            <Button
              onClick={handleSubmitTestLog}
              disabled={validDaysCount < 4}
              className="w-full"
            >
              Submit Test Week Log ({validDaysCount}/4 days)
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 28-29: Final Adjustments */}
      {(currentGate >= 28 && currentGate <= 29) && !isGateComplete('final_adjustments') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Settings className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Days 28-29: Adjust & Improve</CardTitle>
            </div>
            <CardDescription>
              Identify schedule leaks and fix them. Finalize your 4-day structure.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Adjustments Made</label>
              <Textarea
                value={finalAdjustments}
                onChange={(e) => setFinalAdjustments(e.target.value)}
                placeholder="Describe the adjustments you made based on your test week. What schedule leaks did you find? What system gaps did you address? How did you update your schedule and dashboard?"
                rows={6}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {finalAdjustments.trim().split(/\s+/).filter(w => w).length} words (minimum 20)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Common Adjustments:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Block specific times for email/messages</li>
                <li>• Add buffer time between meetings</li>
                <li>• Adjust theme assignments</li>
                <li>• Refine dashboard metrics</li>
                <li>• Update communication policy</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitAdjustments}
              disabled={finalAdjustments.trim().split(/\s+/).length < 20}
              className="w-full"
            >
              Submit Final Adjustments
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Day 30: Freedom Commitment */}
      {(currentGate >= 30) && !isGateComplete('freedom_commitment') && (
        <Card className="border-2 border-emerald-500">
          <CardHeader className="bg-gradient-to-r from-emerald-500 to-teal-500 text-white">
            <div className="flex items-center gap-2">
              <Trophy className="h-6 w-6" />
              <CardTitle className="text-xl">Day 30: The Freedom Commitment</CardTitle>
            </div>
            <CardDescription className="text-white/80">
              🎉 FINAL MODULE GATE - Define your path to the 2-day work week
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6 pt-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Target Date for 2-Day Work Week</label>
                  <Input
                    type="date"
                    value={freedomCommitment.targetDate2DayWeek}
                    onChange={(e) => setFreedomCommitment({ ...freedomCommitment, targetDate2DayWeek: e.target.value })}
                    className="mt-1"
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    When will you achieve a sustainable 2-day work week?
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Steps to Move from 4 Days to 3 Days</label>
                  <Textarea
                    value={freedomCommitment.stepsTo3Days}
                    onChange={(e) => setFreedomCommitment({ ...freedomCommitment, stepsTo3Days: e.target.value })}
                    placeholder="1. Delegate X to Y by [date]&#10;2. Train Y on Z by [date]&#10;3. ..."
                    rows={4}
                  />
                </div>
              </div>
            </div>

            <div>
              <label className="text-sm font-medium">Steps to Move from 3 Days to 2 Days</label>
              <Textarea
                value={freedomCommitment.stepsTo2Days}
                onChange={(e) => setFreedomCommitment({ ...freedomCommitment, stepsTo2Days: e.target.value })}
                placeholder="1. Systematize X by [date]&#10;2. Hire Y to handle Z by [date]&#10;3. ..."
                rows={4}
              />
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-600 mb-2">🏆 Your Freedom Commitment</h4>
              <p className="text-sm text-muted-foreground">
                This signed document represents your commitment to achieving true business freedom. 
                By completing Module 5, you've proven you can extract yourself from daily operations.
              </p>
            </div>

            <Button
              onClick={handleSubmitFreedomCommitment}
              disabled={!freedomCommitment.targetDate2DayWeek || !freedomCommitment.stepsTo3Days || !freedomCommitment.stepsTo2Days}
              className="w-full bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600"
            >
              <Trophy className="h-4 w-4 mr-2" />
              Sign Freedom Commitment
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Module Complete & Certificate */}
      {isGateComplete('freedom_commitment') && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="border-emerald-500 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-950 dark:to-teal-950">
            <CardContent className="p-8 text-center">
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', duration: 0.8 }}
              >
                <div className="relative inline-block mb-6">
                  <div className="absolute inset-0 bg-emerald-400 blur-3xl opacity-30 rounded-full scale-150" />
                  <div className="relative bg-gradient-to-br from-emerald-400 to-teal-500 text-white p-8 rounded-2xl shadow-xl">
                    <Trophy className="h-20 w-20 mx-auto mb-3" />
                    <div className="text-2xl font-bold">Freedom Founder</div>
                    <div className="text-emerald-100">Badge Earned!</div>
                  </div>
                </div>
              </motion.div>

              <h2 className="text-3xl font-bold mb-3">🎉 Congratulations!</h2>
              <p className="text-muted-foreground text-lg mb-6">
                You have completed the O.R.D.E.R. Framework!
              </p>

              <div className="flex flex-wrap justify-center gap-3 mb-6">
                <Badge className="bg-emerald-500 text-white px-4 py-2 text-sm">
                  <Star className="h-4 w-4 mr-1" />
                  Freedom Founder Badge
                </Badge>
                <Badge className="bg-teal-500 text-white px-4 py-2 text-sm">
                  <CheckCircle2 className="h-4 w-4 mr-1" />
                  {TOTAL_GATES_MODULE_5}/{TOTAL_GATES_MODULE_5} Gates Completed
                </Badge>
                <Badge className="bg-cyan-500 text-white px-4 py-2 text-sm">
                  <Trophy className="h-4 w-4 mr-1" />
                  O.R.D.E.R. Business Mastery
                </Badge>
              </div>

              <Card className="max-w-2xl mx-auto bg-white/50 dark:bg-black/20 backdrop-blur-sm">
                <CardContent className="p-6">
                  <div className="border-4 border-emerald-500 rounded-lg p-6 bg-white dark:bg-slate-900">
                    <div className="text-emerald-600 font-serif text-sm uppercase tracking-widest mb-4">
                      Certificate of Completion
                    </div>
                    <h3 className="text-2xl font-bold mb-2">O.R.D.E.R. Business Mastery</h3>
                    <div className="w-24 h-1 bg-emerald-500 mx-auto mb-4" />
                    <p className="text-muted-foreground mb-4">
                      This certifies that
                    </p>
                    <p className="text-xl font-semibold mb-4">
                      {/* User name will be populated */}
                      Course Graduate
                    </p>
                    <p className="text-muted-foreground mb-6">
                      has successfully completed all five modules of the O.R.D.E.R. Framework
                      and demonstrated mastery of business operations, delegation, and strategic freedom.
                    </p>
                    <div className="flex justify-center gap-8 text-sm text-muted-foreground">
                      <div>
                        <div className="font-semibold text-foreground">Completed</div>
                        <div>{new Date().toLocaleDateString()}</div>
                      </div>
                      <div>
                        <div className="font-semibold text-foreground">Certificate ID</div>
                        <div className="font-mono">ORDER-{Date.now().toString(36).toUpperCase()}</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline">
                  Download Certificate
                </Button>
                <Button>
                  Share Achievement
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}
    </div>
  );
}
