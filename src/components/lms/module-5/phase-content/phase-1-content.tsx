'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Target, Calendar, Clock, Plus, X, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_5, DAY_THEMES, DAYS_OF_WEEK, TIME_BLOCKS } from '../constants';

interface Phase1ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  bypassGates?: boolean;
}

const gates = PHASES_MODULE_5[0].gates;

export function Phase1Content({ completedGates, onCompleteGate, bypassGates }: Phase1ContentProps) {
  const bypassGatesEnabled = bypassGates ?? false;
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 1;
  });

  const [onlyYouTasks, setOnlyYouTasks] = useState<string[]>(['', '', '']);
  const [delegatedTasks, setDelegatedTasks] = useState<string[]>(['', '', '']);
  
  const [themedSchedule, setThemedSchedule] = useState<Array<{ day: string; theme: string; isOffDay: boolean }>>(
    DAYS_OF_WEEK.slice(0, 5).map(d => ({ day: d.id, theme: '', isOffDay: false }))
  );
  
  const [calendarDetails, setCalendarDetails] = useState('');

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;

  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitValueAudit = async () => {
    const validOnlyYou = onlyYouTasks.filter(t => t.trim());
    const validDelegated = delegatedTasks.filter(t => t.trim());
    if (validOnlyYou.length < 3) return;
    
    await onCompleteGate('founder_value_audit', {
      founderValueAudit: {
        onlyYouTasks: validOnlyYou,
        delegatedTasks: validDelegated,
      },
    });
    setCurrentGate(3);
  };

  const handleSubmitThemedSchedule = async () => {
    const validSchedule = themedSchedule.filter(s => s.theme || s.isOffDay);
    const hasOffDay = themedSchedule.some(s => s.isOffDay);
    if (validSchedule.length < 4 || !hasOffDay) return;
    
    await onCompleteGate('themed_schedule', { themedSchedule });
    setCurrentGate(5);
  };

  const handleSubmitIdealCalendar = async () => {
    if (!calendarDetails.trim()) return;
    
    await onCompleteGate('ideal_calendar', {
      idealCalendar: { confirmed: true, details: calendarDetails },
    });
  };

  const updateOnlyYouTask = (index: number, value: string) => {
    const updated = [...onlyYouTasks];
    updated[index] = value;
    setOnlyYouTasks(updated);
  };

  const updateDelegatedTask = (index: number, value: string) => {
    const updated = [...delegatedTasks];
    updated[index] = value;
    setDelegatedTasks(updated);
  };

  const addOnlyYouTask = () => setOnlyYouTasks([...onlyYouTasks, '']);
  const addDelegatedTask = () => setDelegatedTasks([...delegatedTasks, '']);

  const updateScheduleTheme = (dayId: string, theme: string, isOffDay: boolean) => {
    setThemedSchedule(prev => 
      prev.map(s => s.day === dayId ? { ...s, theme, isOffDay } : s)
    );
  };

  const toggleOffDay = (dayId: string) => {
    setThemedSchedule(prev =>
      prev.map(s => s.day === dayId ? { ...s, isOffDay: !s.isOffDay, theme: '' } : s)
    );
  };

  const validOnlyYouCount = onlyYouTasks.filter(t => t.trim()).length;

  return (
    <div className="space-y-6">
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
      <div className="grid grid-cols-3 gap-3">
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

      {/* Days 1-2: Founder Value Audit */}
      {(currentGate <= 2) && !isGateComplete('founder_value_audit') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Days 1-2: The 'Only You' Filter</CardTitle>
            </div>
            <CardDescription>
              List 3-5 highest-value activities that ONLY you can do, and tasks that could be delegated.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              {/* Only You Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-emerald-600">Only You Can Do</h4>
                  <Badge variant="outline">{validOnlyYouCount}/3 min</Badge>
                </div>
                <div className="space-y-2">
                  {onlyYouTasks.map((task, index) => (
                    <div key={index} className="flex gap-2">
                      <Star className="h-4 w-4 text-emerald-500 mt-3 shrink-0" />
                      <Input
                        value={task}
                        onChange={(e) => updateOnlyYouTask(index, e.target.value)}
                        placeholder={index < 3 ? `Activity ${index + 1}` : 'Add another...'}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addOnlyYouTask} className="w-full">
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>

              {/* Delegated Tasks */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-blue-600">Could Be Delegated</h4>
                  <Badge variant="outline">{delegatedTasks.filter(t => t.trim()).length}</Badge>
                </div>
                <div className="space-y-2">
                  {delegatedTasks.map((task, index) => (
                    <div key={index} className="flex gap-2">
                      <X className="h-4 w-4 text-blue-500 mt-3 shrink-0" />
                      <Input
                        value={task}
                        onChange={(e) => updateDelegatedTask(index, e.target.value)}
                        placeholder={`Task ${index + 1}`}
                        className="flex-1"
                      />
                    </div>
                  ))}
                </div>
                <Button variant="outline" size="sm" onClick={addDelegatedTask} className="w-full">
                  <Plus className="h-3 w-3 mr-1" /> Add Task
                </Button>
              </div>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Examples of 'Only You' Activities:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Big Vision & Strategic Direction</li>
                <li>• Key Partnerships & Major Relationships</li>
                <li>• Major Client Relationships</li>
                <li>• Culture & Values Setting</li>
                <li>• Crisis Decision Making</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitValueAudit}
              disabled={validOnlyYouCount < 3}
              className="w-full"
            >
              Submit Founder Value Audit
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 3-4: Themed Schedule */}
      {(currentGate >= 3 && currentGate <= 4) && !isGateComplete('themed_schedule') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Days 3-4: Draft the 4-Day Week</CardTitle>
            </div>
            <CardDescription>
              Assign a theme to each work day and select at least one non-work day.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-3">
              {DAYS_OF_WEEK.map((day) => {
                const schedule = themedSchedule.find(s => s.day === day.id);
                const isOffDay = schedule?.isOffDay || false;
                const selectedTheme = schedule?.theme || '';

                return (
                  <div
                    key={day.id}
                    className={cn(
                      'p-4 rounded-lg border-2 transition-all',
                      isOffDay ? 'border-muted bg-muted/30' : 'border-border'
                    )}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-20">
                        <span className="font-medium">{day.label}</span>
                      </div>
                      <div className="flex-1">
                        <select
                          value={isOffDay ? 'off' : selectedTheme}
                          onChange={(e) => {
                            if (e.target.value === 'off') {
                              toggleOffDay(day.id);
                            } else {
                              updateScheduleTheme(day.id, e.target.value, false);
                            }
                          }}
                          disabled={isOffDay}
                          className={cn(
                            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm',
                            isOffDay && 'opacity-50'
                          )}
                        >
                          <option value="">Select theme...</option>
                          {DAY_THEMES.map(theme => (
                            <option key={theme.value} value={theme.value}>
                              {theme.label} - {theme.description}
                            </option>
                          ))}
                        </select>
                      </div>
                      <Button
                        variant={isOffDay ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => toggleOffDay(day.id)}
                      >
                        {isOffDay ? '✓ Off Day' : 'Mark Off'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">⚠️ Must include at least one non-work day</h4>
              <p className="text-sm text-muted-foreground">
                Protect your off day fiercely. This is essential for sustainable performance.
              </p>
            </div>

            <Button
              onClick={handleSubmitThemedSchedule}
              disabled={themedSchedule.filter(s => s.theme && !s.isOffDay).length < 4 || !themedSchedule.some(s => s.isOffDay)}
              className="w-full"
            >
              Submit Themed Schedule
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 5-7: Ideal Calendar */}
      {(currentGate >= 5) && !isGateComplete('ideal_calendar') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-emerald-500" />
              <CardTitle className="text-lg">Days 5-7: Time Blocking</CardTitle>
            </div>
            <CardDescription>
              Create your ideal calendar with blocked time for each type of work.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Visual Calendar Grid */}
            <div className="overflow-x-auto">
              <div className="min-w-[600px]">
                <div className="grid grid-cols-5 gap-2 mb-2">
                  {DAYS_OF_WEEK.slice(0, 5).map(day => (
                    <div key={day.id} className="text-center font-medium text-sm py-2 bg-muted rounded">
                      {day.short}
                    </div>
                  ))}
                </div>
                {TIME_BLOCKS.map(block => (
                  <div key={block.id} className="grid grid-cols-5 gap-2 mb-2">
                    {DAYS_OF_WEEK.slice(0, 5).map(day => (
                      <div
                        key={`${day.id}-${block.id}`}
                        className="h-12 border rounded bg-background hover:bg-muted/50 transition-colors cursor-pointer flex items-center justify-center text-xs text-muted-foreground"
                      >
                        {block.label.split(' ')[0]}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Calendar Details</label>
              <Textarea
                value={calendarDetails}
                onChange={(e) => setCalendarDetails(e.target.value)}
                placeholder="Describe your blocked calendar: Which time blocks are for Strategy/CEO work? Which for Key Relationships & Sales? Include buffer time..."
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Time Blocking Checklist:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Block time for Strategy/CEO work</li>
                <li>✓ Block time for Key Relationships & Sales</li>
                <li>✓ Block time for Review & Decisions</li>
                <li>✓ Include buffer time</li>
                <li>✓ Avoid over-scheduling</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitIdealCalendar}
              disabled={!calendarDetails.trim()}
              className="w-full"
            >
              Submit Ideal Calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Phase Complete Message */}
      {isGateComplete('ideal_calendar') && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Phase 1 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              You've defined your unique value and designed your ideal schedule. Continue to Phase 2 to start delegating.
            </p>
            <Badge className="bg-green-500">3/3 Gates Completed</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
