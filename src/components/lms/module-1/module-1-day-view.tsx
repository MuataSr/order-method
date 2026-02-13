'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="learn">Learn</TabsTrigger>
                  <TabsTrigger value="practice">Practice</TabsTrigger>
                  <TabsTrigger value="gate">
                    Gate
                    {isGateCompleted && <CheckCircle2 className="ml-1 h-4 w-4" />}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="learn" className="space-y-4 mt-6">
                  <LearnContent day={day} />
                </TabsContent>

                <TabsContent value="practice" className="space-y-4 mt-6">
                  <PracticeContent day={day} />
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
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Start and end times for work activities</li>
          <li>Breaks and their duration</li>
          <li>Meetings and calls</li>
          <li>Task switching events</li>
          <li>Energy levels throughout the day</li>
        </ul>
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

// Practice content component
function PracticeContent({ day }: { day: number }) {
  const practiceContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Time Log Template</h3>
        <p className="text-sm text-muted-foreground">
          Use this template to track your time for the next 3 days:
        </p>
        <div className="p-4 bg-secondary rounded text-sm font-mono">
          <div>Time | Activity | Category | Energy (1-10)</div>
          <div>-----|---------|----------|---------------</div>
          <div>9:00 | Checked email | Admin | 6</div>
          <div>9:30 | Client call | Client | 8</div>
          <div>... | ... | ... | ...</div>
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Complete Day 2 Log</h3>
        <p className="text-sm text-muted-foreground">
          Continue your time tracking. You're building awareness of your patterns.
        </p>
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded">
          <p className="text-sm font-medium">Remember:</p>
          <p className="text-sm text-muted-foreground">Don't change your behavior yet. Just observe and record.</p>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Task Brainstorm</h3>
        <p className="text-sm text-muted-foreground">
          Set a timer for 15 minutes and list EVERYTHING you're responsible for. Don't organize yet, just capture.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Example items:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Client project deliverables</li>
            <li>Team meetings and 1:1s</li>
            <li>Monthly financial review</li>
            <li>Social media content</li>
            <li>Website updates</li>
            <li>Invoicing and bookkeeping</li>
          </ul>
        </div>
      </div>
    ),
    4: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Categorize Your Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Take 5 tasks from your inventory and place them in the appropriate quadrant.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-red-500/10 rounded">
            <strong>DO NOW:</strong>
            <p className="text-muted-foreground">Client deadline today</p>
          </div>
          <div className="p-2 bg-blue-500/10 rounded">
            <strong>SCHEDULE:</strong>
            <p className="text-muted-foreground">Strategy session</p>
          </div>
          <div className="p-2 bg-yellow-500/10 rounded">
            <strong>DELEGATE:</strong>
            <p className="text-muted-foreground">Email responses</p>
          </div>
          <div className="p-2 bg-gray-500/10 rounded">
            <strong>DELETE:</strong>
            <p className="text-muted-foreground">Doomscrolling news</p>
          </div>
        </div>
      </div>
    ),
    5: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Design Your Week</h3>
        <p className="text-sm text-muted-foreground">
          Sketch out your ideal week. Start with your most important commitments.
        </p>
        <div className="p-4 bg-secondary rounded text-sm">
          <div className="font-medium mb-2">Sample Week Structure:</div>
          <div className="space-y-1 text-xs">
            <div>Mon: CEO Day - Strategy & Planning</div>
            <div>Tue: Sales Day - Client Calls & Proposals</div>
            <div>Wed: Content Day - Writing & Recording</div>
            <div>Thu: CEO Day - Strategy & Planning</div>
            <div>Fri: Admin Day - Email, Finance, Ops</div>
          </div>
        </div>
      </div>
    ),
    6: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Assign Themes</h3>
        <p className="text-sm text-muted-foreground">
          Review your weekly schedule and assign clear themes to each day.
        </p>
        <div className="p-4 bg-green-500/10 border border-green-500/20 rounded">
          <p className="text-sm font-medium">Theme Day Rules:</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>One primary theme per day</li>
            <li>Group all related tasks</li>
            <li>Reschedule urgent non-theme items</li>
            <li>Communicate your schedule</li>
          </ul>
        </div>
      </div>
    ),
    7: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Deep Work Session</h3>
        <p className="text-sm text-muted-foreground">
          Schedule a 90-minute deep work block for tomorrow. Prepare your environment.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Pre-Session Checklist:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>☐ Clear workspace</div>
            <div>☐ Silence phone</div>
            <div>☐ Close email/tabs</div>
            <div>☐ Set specific goal</div>
            <div>☐ Prepare water/snack</div>
          </div>
        </div>
      </div>
    ),
    8: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Energy Map</h3>
        <p className="text-sm text-muted-foreground">
          For the next 3 days, rate your energy hourly. Find your patterns.
        </p>
        <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded">
          <p className="text-sm font-medium">Sample Energy Map:</p>
          <div className="text-xs text-muted-foreground mt-2">
            9am: ⚡⚡⚡ (Peak)<br />
            11am: ⚡⚡ (High)<br />
            2pm: ⚡ (Low - slump)<br />
            4pm: ⚡⚡ (Recovering)<br />
            7pm: ⚡⚡⚡ (Second wind)
          </div>
        </div>
      </div>
    ),
    9: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Write Your Boundaries</h3>
        <p className="text-sm text-muted-foreground">
          Draft 3 boundary statements you can use with clients or team members.
        </p>
        <div className="space-y-2 text-sm">
          <div className="p-2 bg-secondary rounded">
            &quot;I check email twice daily at 10am and 3pm. For urgent matters, call me.&quot;
          </div>
          <div className="p-2 bg-secondary rounded">
            &quot;My focus hours are 8-11am. I'll respond to messages after 11am.&quot;
          </div>
          <div className="p-2 bg-secondary rounded">
            &quot;I reserve Fridays for admin work. Let's schedule our meeting for Monday.&quot;
          </div>
        </div>
      </div>
    ),
    10: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Your System Document</h3>
        <p className="text-sm text-muted-foreground">
          Create a one-page summary of your time mastery system. Keep it visible.
        </p>
        <div className="p-4 bg-yellow-500/10 border border-yellow-500/20 rounded">
          <p className="text-sm font-medium">Include:</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>Your weekly theme day structure</li>
            <li>Deep work block times</li>
            <li>Key boundaries to maintain</li>
            <li>Weekly review schedule</li>
            <li>Emergency recovery protocol</li>
          </ul>
        </div>
      </div>
    ),
  };

  return practiceContent[day] || <p>Select a day to see practice exercises.</p>;
}

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
  const [formData, setFormData] = useState<any>({});

  const handleSubmit = () => {
    onComplete(gateName, formData);
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
            Complete this gate to unlock Day {day + 1}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <label className="text-sm font-medium mb-2 block">
            {day <= 2 ? 'Time Log Notes' :
             day === 3 ? 'List Your Tasks' :
             day === 4 ? 'Categorize 5 Tasks' :
             day === 5 ? 'Upload Your Weekly Schedule' :
             day === 6 ? 'Describe Your Theme Days' :
             day === 7 ? 'Your Deep Work Protocol' :
             day === 8 ? 'Energy Level Observations' :
             day === 9 ? 'Your Boundary Statements' :
             'Your Time Mastery System'}
          </label>
          <textarea
            className="w-full min-h-[120px] p-3 border rounded-lg text-sm"
            placeholder="Enter your response here..."
            value={formData.notes || ''}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
          />
        </div>

        <Button onClick={handleSubmit} className="w-full">
          Submit Gate
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
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
