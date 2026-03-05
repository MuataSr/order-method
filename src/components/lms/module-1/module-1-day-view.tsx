'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Textarea } from '@/components/ui/textarea';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  CheckCircle2,
  Circle,
  ArrowRight,
  ArrowLeft,
  Trophy,
  Target,
  ListTodo,
  Grid3x3,
  CalendarDays,
  Trash2,
  Plus,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Day content configuration
const DAY_CONTENT = {
  1: {
    title: 'Day 1: Baseline Reality Check',
    subtitle: 'Document Your Actual Time Usage',
    description: 'Start by logging your time for 3 days to understand your current patterns. This honest assessment is the foundation for transformation.',
    duration: '45 min',
    gateName: 'baseline_entry',
    gateLabel: 'Baseline Time Log',
  },
  2: {
    title: 'Day 2: Complete Your Baseline',
    subtitle: 'Continue Time Tracking',
    description: 'Continue logging your time. Consistency is key for accurate data.',
    duration: '15 min',
    gateName: 'baseline_completion',
    gateLabel: 'Complete 3-Day Log',
  },
  3: {
    title: 'Day 3: Task Inventory & Audit',
    subtitle: 'Catalog Everything On Your Plate',
    description: 'Create a comprehensive inventory of all your tasks, commitments, and responsibilities across all areas of your business.',
    duration: '60 min',
    gateName: 'task_inventory',
    gateLabel: 'Complete Task Audit',
  },
  4: {
    title: 'Day 4: Eisenhower Matrix',
    subtitle: 'Prioritize by Impact & Urgency',
    description: 'Apply the Eisenhower Matrix to categorize your task inventory. Learn what to do now, schedule, delegate, or delete.',
    duration: '45 min',
    gateName: 'eisenhower_matrix',
    gateLabel: 'Prioritization Matrix',
  },
  5: {
    title: 'Day 5: Time Blocking Deep Dive',
    subtitle: 'Design Your Ideal Week',
    description: 'Create a weekly schedule template using themed days and time blocks. Design your week around your priorities, not reactively.',
    duration: '60 min',
    gateName: 'time_blocking',
    gateLabel: 'Weekly Schedule Design',
  },
  6: {
    title: 'Day 6: Theme Days Implementation',
    subtitle: 'Focus Days vs. Admin Days',
    description: 'Implement CEO days, Sales days, Content days, and Admin days. Group similar tasks to minimize context switching.',
    duration: '45 min',
    gateName: 'theme_days',
    gateLabel: 'Theme Day Setup',
  },
  7: {
    title: 'Day 7: Deep Work Protocols',
    subtitle: 'Protect Your Peak Hours',
    description: 'Establish protocols for deep work sessions. Learn to eliminate distractions and protect your most productive hours.',
    duration: '50 min',
    gateName: 'deep_work',
    gateLabel: 'Deep Work Protocol',
  },
  8: {
    title: 'Day 8: Energy Management',
    subtitle: 'Align Tasks with Your Rhythms',
    description: 'Map your daily energy patterns and align your schedule with your biological prime time. Work with your body, not against it.',
    duration: '40 min',
    gateName: 'energy_management',
    gateLabel: 'Energy Map',
  },
  9: {
    title: 'Day 9: Boundaries & Communication',
    subtitle: 'Protect Your Time Proactively',
    description: 'Set clear boundaries with clients, team, and even yourself. Create protocols that protect your focused work time.',
    duration: '45 min',
    gateName: 'boundaries',
    gateLabel: 'Boundary Protocol',
  },
  10: {
    title: 'Day 10: Your Time Mastery System',
    subtitle: 'Integrate & Commit',
    description: 'Synthesize everything into your personal time mastery system. Commit to your new way of working and living.',
    duration: '60 min',
    gateName: 'final_system',
    gateLabel: 'Time Master Commitment',
  },
};

interface Module1DayViewProps {
  day: number;
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: any) => void;
  onDayChange: (day: number) => void;
  isTimeMaster: boolean;
}

export function Module1DayView({
  day,
  completedGates,
  onCompleteGate,
  onDayChange,
  isTimeMaster,
}: Module1DayViewProps) {
  const content = DAY_CONTENT[day as keyof typeof DAY_CONTENT];
  const [activeTab, setActiveTab] = useState<'learn' | 'practice' | 'gate'>('learn');

  if (!content) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold mb-2">Day not found</h2>
        <p>Please select a valid day (1-10)</p>
      </div>
    );
  }

  const isGateCompleted = completedGates.includes(content.gateName);
  const canAccessDay = day === 1 || completedGates.includes(DAY_CONTENT[day - 1 as keyof typeof DAY_CONTENT]?.gateName);
  const isLastDay = day === 10;
  const allGatesCompleted = completedGates.length >= 10;

  return (
    <div className="space-y-6">
      {/* Day Navigation */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={() => onDayChange(day - 1)}
          disabled={day === 1}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Previous Day
        </Button>
        <div className="text-center">
          <Badge variant="outline" className="text-lg px-4 py-1">
            Day {day} of 10
          </Badge>
        </div>
        <Button
          variant="outline"
          onClick={() => onDayChange(day + 1)}
          disabled={isLastDay || !canAccessDay}
        >
          Next Day
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>

      {/* Day Progress Overview */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-primary" />
              <span className="font-semibold">Module 1 Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedGates.length}/10 Gates Completed
            </span>
          </div>
          <Progress value={(completedGates.length / 10) * 100} className="h-2" />
          {allGatesCompleted && !isTimeMaster && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium text-center">
                Congratulations! You've completed all gates. You're now a Time Master!
              </p>
            </div>
          )}
          {isTimeMaster && (
            <div className="mt-4 p-4 bg-yellow-500/10 rounded-lg flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-500" />
              <p className="text-sm font-medium text-yellow-700 dark:text-yellow-400">
                Time Master Badge Earned!
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Locked State */}
      {!canAccessDay && (
        <Card className="border-dashed">
          <CardContent className="p-12 text-center">
            <Lock className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Day {day} is Locked</h3>
            <p className="text-muted-foreground">
              Complete the gate for Day {day - 1} to unlock this day.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Day Content */}
      {canAccessDay && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="overflow-hidden">
            <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge>{content.duration}</Badge>
                    <Badge variant={isGateCompleted ? 'default' : 'secondary'}>
                      {isGateCompleted ? (
                        <>
                          <CheckCircle2 className="mr-1 h-3 w-3" />
                          Completed
                        </>
                      ) : (
                        <>
                          <Circle className="mr-1 h-3 w-3" />
                          In Progress
                        </>
                      )}
                    </Badge>
                  </div>
                  <CardTitle className="text-2xl mb-1">{content.title}</CardTitle>
                  <CardDescription className="text-base">{content.subtitle}</CardDescription>
                </div>
                <div className="hidden sm:block">
                  <Clock className="h-12 w-12 text-primary/20" />
                </div>
              </div>
            </div>
            <CardContent className="p-6">
              <p className="text-muted-foreground mb-6">{content.description}</p>

              <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="learn">Learn</TabsTrigger>
                  <TabsTrigger value="gate">
                    Gate
                    {isGateCompleted && <CheckCircle2 className="ml-1 h-4 w-4" />}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="learn" className="space-y-4 mt-6">
                  <LearnContent day={day} />
                </TabsContent>

                <TabsContent value="gate" className="space-y-4 mt-6">
                  <GateContent
                    day={day}
                    gateName={content.gateName}
                    gateLabel={content.gateLabel}
                    isCompleted={isGateCompleted}
                    onComplete={onCompleteGate}
                  />
                </TabsContent>
              </Tabs>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Day Navigation Grid */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">All Days</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((d) => {
              const dayContent = DAY_CONTENT[d as keyof typeof DAY_CONTENT];
              const isCompleted = completedGates.includes(dayContent.gateName);
              const isCurrentDay = d === day;
              const isAccessible = d === 1 || completedGates.includes(DAY_CONTENT[d - 1 as keyof typeof DAY_CONTENT]?.gateName);

              return (
                <button
                  key={d}
                  onClick={() => isAccessible && onDayChange(d)}
                  disabled={!isAccessible}
                  className={cn(
                    'aspect-square rounded-lg flex items-center justify-center text-sm font-medium transition-all',
                    isCurrentDay && 'bg-primary text-primary-foreground',
                    isCompleted && !isCurrentDay && 'bg-green-500/10 text-green-700 dark:text-green-400',
                    !isCompleted && isAccessible && !isCurrentDay && 'bg-secondary hover:bg-secondary/80',
                    !isAccessible && 'bg-muted text-muted-foreground cursor-not-allowed opacity-50'
                  )}
                >
                  {isCompleted ? <CheckCircle2 className="h-4 w-4" /> : d}
                </button>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Learn content component
function LearnContent({ day }: { day: number }) {
  const learnContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-4">
        <h3 className="font-semibold">Why Track Your Time?</h3>
        <p className="text-sm text-muted-foreground">
          Before you can improve your time management, you need to understand how you currently spend your time.
          Most people underestimate distractions and overestimate productive time.
        </p>
        <h4 className="font-medium text-sm">What to Track:</h4>
        <Accordion type="multiple" className="w-full">
          <AccordionItem value="start-end-times">
            <AccordionTrigger>Start and End Times for Work Activities</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Recording start and end times of your work activities is fundamental. This practice helps in identifying how long specific tasks take and can reveal inefficiencies. For instance, you may discover that a task you assumed would take an hour actually consumes two.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="breaks-duration">
            <AccordionTrigger>Breaks and Their Duration</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Breaks are essential for maintaining productivity, but it's important to monitor their frequency and duration. Are your breaks rejuvenating, or do they extend longer than necessary? Tracking this can help you find right balance that keeps your energy levels optimal without cutting into productive time.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="meetings-calls">
            <AccordionTrigger>Meetings and Calls</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Meetings and calls can be significant time consumers. Documenting duration and content of these interactions can highlight whether they are productive or if they could be streamlined or even eliminated.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="task-switching">
            <AccordionTrigger>Task Switching Events</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Task switching, or multitasking, can lead to a loss of focus and efficiency. By tracking how often you switch tasks, you can identify patterns that might be hindering your concentration and productivity. Reducing task switching can lead to improved focus and time management.
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="energy-levels">
            <AccordionTrigger>Energy Levels Throughout Day</AccordionTrigger>
            <AccordionContent className="text-muted-foreground">
              Understanding your energy levels at different times of day can help you plan tasks according to when you are most alert and productive. Perhaps you are a morning person who accomplishes more in early hours, or maybe your energy peaks in afternoon. Aligning tasks with your natural energy rhythms can boost efficiency.
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <h3 className="font-semibold">Continuing Your Baseline</h3>
        <p className="text-sm text-muted-foreground">
          Day 2 of time tracking. Continue capturing your actual activities without judgment.
          The goal is accurate data, not perfection.
        </p>
        <h4 className="font-medium text-sm">Tips for Accurate Tracking:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Log in real-time when possible</li>
          <li>Include distractions and social media</li>
          <li>Note your energy levels</li>
          <li>Be honest about procrastination</li>
        </ul>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <h3 className="font-semibold">Task Categories</h3>
        <p className="text-sm text-muted-foreground">
          Break down all your responsibilities into categories for better visibility.
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-secondary rounded">Client Work</div>
          <div className="p-2 bg-secondary rounded">Team Management</div>
          <div className="p-2 bg-secondary rounded">Admin/Finance</div>
          <div className="p-2 bg-secondary rounded">Marketing/Sales</div>
          <div className="p-2 bg-secondary rounded">Content Creation</div>
          <div className="p-2 bg-secondary rounded">Creative Work</div>
          <div className="p-2 bg-secondary rounded">Emergencies/Firefighting</div>
          <div className="p-2 bg-secondary rounded">Personal Development</div>
        </div>
      </div>
    ),
    4: (
      <div className="space-y-4">
        <h3 className="font-semibold">The Eisenhower Matrix</h3>
        <p className="text-sm text-muted-foreground">
          Categorize tasks based on importance and urgency to make better decisions about where to focus.
        </p>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
            <div className="font-medium text-red-700 dark:text-red-400 mb-1">DO NOW</div>
            <div className="text-xs text-muted-foreground">High Urgency, High Importance</div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">SCHEDULE</div>
            <div className="text-xs text-muted-foreground">Low Urgency, High Importance</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <div className="font-medium text-yellow-700 dark:text-yellow-400 mb-1">DELEGATE</div>
            <div className="text-xs text-muted-foreground">High Urgency, Low Importance</div>
          </div>
          <div className="p-3 bg-gray-500/10 border border-gray-500/20 rounded">
            <div className="font-medium text-gray-700 dark:text-gray-400 mb-1">DELETE</div>
            <div className="text-xs text-muted-foreground">Low Urgency, Low Importance</div>
          </div>
        </div>
      </div>
    ),
    5: (
      <div className="space-y-4">
        <h3 className="font-semibold">Time Blocking Fundamentals</h3>
        <p className="text-sm text-muted-foreground">
          Design your ideal week by blocking time for specific activities. Work on your priorities, not just in your business.
        </p>
        <h4 className="font-medium text-sm">Key Principles:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Block your most important tasks first</li>
          <li>Group similar tasks together</li>
          <li>Include buffer time between blocks</li>
          <li>Schedule breaks, not just work</li>
          <li>Protect your deep work blocks</li>
        </ul>
      </div>
    ),
    6: (
      <div className="space-y-4">
        <h3 className="font-semibold">Theme Days</h3>
        <p className="text-sm text-muted-foreground">
          Dedicate entire days to specific types of work to minimize context switching and maximize focus.
        </p>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <CalendarDays className="h-4 w-4 text-blue-500" />
            <span><strong>CEO Day:</strong> Strategy, planning, high-level decisions</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <CalendarDays className="h-4 w-4 text-green-500" />
            <span><strong>Sales Day:</strong> Client calls, proposals, follow-ups</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <CalendarDays className="h-4 w-4 text-purple-500" />
            <span><strong>Content Day:</strong> Writing, recording, creative work</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <CalendarDays className="h-4 w-4 text-orange-500" />
            <span><strong>Admin Day:</strong> Email, finances, operations</span>
          </div>
        </div>
      </div>
    ),
    7: (
      <div className="space-y-4">
        <h3 className="font-semibold">Deep Work Protocols</h3>
        <p className="text-sm text-muted-foreground">
          Create rituals and systems that enable sustained, focused work on your most important tasks.
        </p>
        <h4 className="font-medium text-sm">Deep Work Checklist:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Silence notifications during deep work blocks</li>
          <li>Use website blockers for distracting sites</li>
          <li>Set expectations with team/clients</li>
          <li>Prepare your environment before starting</li>
          <li>Work in focused sprints (90-120 min max)</li>
        </ul>
      </div>
    ),
    8: (
      <div className="space-y-4">
        <h3 className="font-semibold">Energy Management</h3>
        <p className="text-sm text-muted-foreground">
          Your energy levels fluctuate throughout the day. Align your schedule with your natural rhythms.
        </p>
        <h4 className="font-medium text-sm">Find Your Prime Time:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Morning person? Do creative work early</li>
          <li>Night owl? Save analysis for evening</li>
          <li>Afternoon slump? Schedule routine tasks</li>
          <li>Track your energy for 1 week</li>
        </ul>
      </div>
    ),
    9: (
      <div className="space-y-4">
        <h3 className="font-semibold">Setting Boundaries</h3>
        <p className="text-sm text-muted-foreground">
          Protect your time proactively by setting clear expectations and communication protocols.
        </p>
        <h4 className="font-medium text-sm">Boundary Strategies:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Set specific office hours and communicate them</li>
          <li>Use auto-responders for focused periods</li>
          <li>Create response time expectations</li>
          <li>Teach clients when to expect updates</li>
          <li>Say no to low-value commitments</li>
        </ul>
      </div>
    ),
    10: (
      <div className="space-y-4">
        <h3 className="font-semibold">Your Time Mastery System</h3>
        <p className="text-sm text-muted-foreground">
          Integrate all the tools and strategies into a cohesive system tailored to your life and business.
        </p>
        <h4 className="font-medium text-sm">System Components:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Weekly planning ritual</li>
          <li>Daily review and schedule</li>
          <li>Time tracking for awareness</li>
          <li>Theme day structure</li>
          <li>Boundary communication templates</li>
          <li>Emergency protocols for setbacks</li>
        </ul>
      </div>
    ),
  };

  return learnContent[day] || <p>Select a day to see the learning content.</p>;
}

interface TimeEntry {
  id: string;
  startTime: string;
  endTime: string;
  activity: string;
  category: string;
  energy: number;
}

const CATEGORIES = [
  'Client Work',
  'Admin/Finance',
  'Marketing/Sales',
  'Content Creation',
  'Creative Work',
  'Personal/Break',
  'Finance',
] as const;

// Gate content component
function GateContent({
  day,
  gateName,
  gateLabel,
  isCompleted,
  onComplete,
}: {
  day: number;
  gateName: string;
  gateLabel: string;
  isCompleted: boolean;
  onComplete: (gateName: string, data?: any) => void;
}) {
  const [entries, setEntries] = useState<TimeEntry[]>([]);
  const [currentEntry, setCurrentEntry] = useState<TimeEntry>({
    id: '',
    startTime: '',
    endTime: '',
    activity: '',
    category: '',
    energy: 5,
  });
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const savedDraft = localStorage.getItem(`timelog-draft-${day}`);
    if (savedDraft) {
      setEntries(JSON.parse(savedDraft));
    }
  }, [day]);

  const validateEntry = (entry: TimeEntry): boolean => {
    return !!(
      entry.startTime &&
      entry.endTime &&
      entry.activity.trim() &&
      entry.category &&
      entry.energy >= 1 &&
      entry.energy <= 10
    );
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    if (!startTime || !endTime) return 0;
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    const startMinutes = startH * 60 + startM;
    const endMinutes = endH * 60 + endM;
    return Math.max(0, (endMinutes - startMinutes) / 60);
  };

  const addEntry = () => {
    if (!validateEntry(currentEntry)) return;

    const newEntry = {
      ...currentEntry,
      id: Date.now().toString(),
    };

    setEntries([...entries, newEntry]);
    setCurrentEntry({
      id: '',
      startTime: '',
      endTime: '',
      activity: '',
      category: '',
      energy: 5,
    });
  };

  const deleteEntry = (id: string) => {
    setEntries(entries.filter(e => e.id !== id));
  };

  const saveAsDraft = () => {
    localStorage.setItem(`timelog-draft-${day}`, JSON.stringify(entries));
  };

  const handleSubmit = async () => {
    if (entries.length === 0) return;
    setIsSubmitting(true);

    try {
      const totalHours = entries.reduce((sum, entry) => {
        return sum + calculateDuration(entry.startTime, entry.endTime);
      }, 0);

      onComplete(gateName, {
        entryCount: entries.length,
        totalHours: Math.round(totalHours * 100) / 100,
        entries,
        notes,
      });

      localStorage.removeItem(`timelog-draft-${day}`);
    } catch (error) {
      console.error('Failed to submit gate:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isCompleted) {
    return (
      <div className="text-center py-8">
        <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
        <h3 className="text-xl font-semibold mb-2">Gate Completed!</h3>
        <p className="text-muted-foreground">You've successfully completed this gate.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 p-4 bg-primary/10 rounded-lg">
        <Target className="h-5 w-5 text-primary" />
        <div>
          <h3 className="font-semibold">{gateLabel}</h3>
          <p className="text-sm text-muted-foreground">
            {day <= 2
              ? 'Record your activities across 3 days. Add entries one at a time below.'
              : 'Complete this gate to unlock Day ' + (day + 1)}
          </p>
        </div>
      </div>

      {day <= 2 && (
        <>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Add New Entry</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">Start Time *</label>
                  <Input
                    type="time"
                    value={currentEntry.startTime}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, startTime: e.target.value })}
                  />
                </div>
                <div>
                  <label className="text-sm font-medium mb-2 block">End Time *</label>
                  <Input
                    type="time"
                    value={currentEntry.endTime}
                    onChange={(e) => setCurrentEntry({ ...currentEntry, endTime: e.target.value })}
                  />
                </div>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Activity *</label>
                <Input
                  placeholder="e.g., Client meeting, Email check, Deep work on project"
                  value={currentEntry.activity}
                  onChange={(e) => setCurrentEntry({ ...currentEntry, activity: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Category *</label>
                <Select
                  value={currentEntry.category}
                  onValueChange={(value) => setCurrentEntry({ ...currentEntry, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select category..." />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Energy Level (1-10) *</label>
                <div className="flex items-center gap-4">
                  <Slider
                    min={1}
                    max={10}
                    value={[currentEntry.energy]}
                    onValueChange={(values) => setCurrentEntry({ ...currentEntry, energy: values[0] })}
                    className="flex-1"
                  />
                  <span className="text-lg font-semibold min-w-[40px] text-center">
                    {currentEntry.energy}/10
                  </span>
                </div>
              </div>
              <Button onClick={addEntry} className="w-full">
                <Plus className="mr-2 h-4 w-4" />
                Add Entry
              </Button>
            </CardContent>
          </Card>

          {entries.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex justify-between items-center">
                  <span>Your Entries ({entries.length})</span>
                  <Button variant="outline" size="sm" onClick={saveAsDraft}>
                    Save Draft
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {entries.map((entry) => (
                    <div
                      key={entry.id}
                      className="p-3 bg-secondary rounded flex justify-between items-start gap-3"
                    >
                      <div className="grid grid-cols-[80px_80px_1fr_140px_60px] gap-2 text-sm flex-1 min-w-0">
                        <span className="font-medium">{entry.startTime}</span>
                        <span className="font-medium">{entry.endTime}</span>
                        <span className="truncate" title={entry.activity}>{entry.activity}</span>
                        <Badge variant="secondary" className="truncate">{entry.category}</Badge>
                        <span className="font-semibold text-primary">E:{entry.energy}</span>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => deleteEntry(entry.id)}
                        className="shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Additional Notes (Optional)</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder="Any patterns, insights, or observations from your time tracking..."
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                rows={4}
              />
            </CardContent>
          </Card>

          <div className="space-y-3">
            <Button
              onClick={handleSubmit}
              disabled={entries.length === 0 || isSubmitting}
              className="w-full"
            >
              {isSubmitting ? 'Submitting...' : 'Submit Time Log Gate'}
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
            {entries.length === 0 && (
              <p className="text-sm text-center text-muted-foreground">
                Add at least one time entry to submit this gate.
              </p>
            )}
          </div>
        </>
      )}

      {day > 2 && (
        <div className="space-y-4">
          <div>
            <label className="text-sm font-medium mb-2 block">
              {day === 3 ? 'List Your Tasks' :
               day === 4 ? 'Categorize 5 Tasks' :
               day === 5 ? 'Upload Your Weekly Schedule' :
               day === 6 ? 'Describe Your Theme Days' :
               day === 7 ? 'Your Deep Work Protocol' :
               day === 8 ? 'Energy Level Observations' :
               day === 9 ? 'Your Boundary Statements' :
               'Your Time Mastery System'}
            </label>
            <Textarea
              className="w-full min-h-[120px]"
              placeholder="Enter your response here..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
            />
          </div>

          <Button onClick={handleSubmit} disabled={isSubmitting} className="w-full">
            {isSubmitting ? 'Submitting...' : 'Submit Gate'}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

// Lock icon for locked days
function Lock({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
    </svg>
  );
}
