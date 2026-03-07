'use client';

import { useState } from 'react';
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
  Search,
  Workflow,
  Settings,
  MessageSquare,
  TrendingUp,
  CheckSquare,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { PreviewModeGate } from '@/components/lms/preview-mode-gate';

// Day content configuration
const DAY_CONTENT = {
  1: {
    title: 'Day 1: Current State Audit',
    subtitle: 'Document Your Existing Workflows',
    description: 'Map out 3-5 of your current workflows to understand what you actually do each day. This foundation reveals hidden inefficiencies.',
    duration: '60 min',
    gateName: 'current_state_audit',
    gateLabel: 'Workflow Documentation',
  },
  2: {
    title: 'Day 2: Time Assessment',
    subtitle: 'Analyze Your Time Patterns',
    description: 'Review your time logs from Module 1 to identify patterns, recurring tasks, and time sinks in your workflows.',
    duration: '45 min',
    gateName: 'time_assessment',
    gateLabel: 'Time Assessment Insights',
  },
  3: {
    title: 'Day 3: Workflow Mapping',
    subtitle: 'Visualize Your Processes',
    description: 'Create visual workflow maps for your key processes. See handoffs, decision points, and where work gets stuck.',
    duration: '60 min',
    gateName: 'workflow_mapping',
    gateLabel: 'Workflow Maps',
  },
  4: {
    title: 'Day 4: Bottleneck Identification',
    subtitle: 'Find Your Constraints',
    description: 'Identify the specific bottlenecks slowing down your workflows. Rate their impact and prioritize which to tackle first.',
    duration: '45 min',
    gateName: 'bottleneck_id',
    gateLabel: 'Bottleneck Log',
  },
  5: {
    title: 'Day 5: Energy Analysis',
    subtitle: 'Align Tasks with Your Energy',
    description: 'Map your energy levels against workflow demands. Reschedule demanding tasks for your peak performance hours.',
    duration: '40 min',
    gateName: 'energy_analysis',
    gateLabel: 'Energy-Aligned Workflow',
  },
  6: {
    title: 'Day 6: Tool Audit',
    subtitle: 'Evaluate Your Tech Stack',
    description: 'Assess all tools you use. Are they helping or hindering? Identify redundancies and opportunities for consolidation.',
    duration: '45 min',
    gateName: 'tool_audit',
    gateLabel: 'Tool Inventory',
  },
  7: {
    title: 'Day 7: Communication Review',
    subtitle: 'Analyze Meeting & Email Load',
    description: 'Audit your communication patterns. How much time goes to meetings? What email habits drain your focus?',
    duration: '50 min',
    gateName: 'communication_review',
    gateLabel: 'Communication Audit',
  },
  8: {
    title: 'Day 8: Success Patterns',
    subtitle: 'Document What Works',
    description: 'Identify your top 3 workflow successes. What makes them work? How can you replicate these patterns elsewhere?',
    duration: '45 min',
    gateName: 'success_patterns',
    gateLabel: 'Success Pattern Analysis',
  },
  9: {
    title: 'Day 9: Optimization Plan',
    subtitle: 'Create Your 30-Day Roadmap',
    description: 'Design a concrete plan to address your top bottlenecks and implement your highest-impact optimizations.',
    duration: '60 min',
    gateName: 'optimization_plan',
    gateLabel: 'Optimization Plan',
  },
  10: {
    title: 'Day 10: Implementation Commitment',
    subtitle: 'Lock In Your Changes',
    description: 'Commit to 3 specific workflow changes. Set up tracking and accountability to ensure they stick.',
    duration: '45 min',
    gateName: 'implementation_commit',
    gateLabel: 'Implementation Commitment',
  },
};

interface Module2DayViewProps {
  day: number;
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: any) => void;
  onDayChange: (day: number) => void;
  isWorkflowAnalyst: boolean;
  bypassGates?: boolean;
}

export function Module2DayView({
  day,
  completedGates,
  onCompleteGate,
  onDayChange,
  isWorkflowAnalyst,
  bypassGates,
}: Module2DayViewProps) {
  const bypassGatesEnabled = bypassGates ?? false;
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
  const canAccessDay = bypassGatesEnabled || day === 1 || completedGates.includes(DAY_CONTENT[day - 1 as keyof typeof DAY_CONTENT]?.gateName);
  const canProceedToNext = bypassGatesEnabled || isGateCompleted;
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
          disabled={isLastDay || !canProceedToNext}
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
              <Workflow className="h-5 w-5 text-primary" />
              <span className="font-semibold">Module 2 Progress</span>
            </div>
            <span className="text-sm text-muted-foreground">
              {completedGates.length}/10 Gates Completed
            </span>
          </div>
          <Progress value={(completedGates.length / 10) * 100} className="h-2" />
          {allGatesCompleted && !isWorkflowAnalyst && (
            <div className="mt-4 p-4 bg-primary/10 rounded-lg">
              <p className="text-sm font-medium text-center">
                Congratulations! You've completed all gates. You're now a Workflow Analyst!
              </p>
            </div>
          )}
          {isWorkflowAnalyst && (
            <div className="mt-4 p-4 bg-emerald-500/10 rounded-lg flex items-center justify-center gap-2">
              <Trophy className="h-5 w-5 text-emerald-500" />
              <p className="text-sm font-medium text-emerald-700 dark:text-emerald-400">
                Workflow Analyst Badge Earned!
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
              Complete {DAY_CONTENT[day - 1 as keyof typeof DAY_CONTENT]?.gateLabel} for Day {day - 1} to unlock this day.
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
            <div className="bg-gradient-to-r from-emerald-500/10 to-teal-500/5 p-6">
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
                  <Search className="h-12 w-12 text-emerald-500/20" />
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
                  {bypassGatesEnabled ? (
                    <PreviewModeGate
                      day={day}
                      gateName={content.gateName}
                      gateLabel={content.gateLabel}
                      description={content.description}
                    />
                  ) : (
                    <GateContent
                      day={day}
                      gateName={content.gateName}
                      gateLabel={content.gateLabel}
                      isCompleted={isGateCompleted}
                      onComplete={onCompleteGate}
                    />
                  )}
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
        <h3 className="font-semibold">Why Document Workflows?</h3>
        <p className="text-sm text-muted-foreground">
          Most agency owners operate on autopilot. Workflows evolved organically, collecting inefficiencies over time.
          Documenting your current state reveals hidden bottlenecks and opportunities.
        </p>
        <h4 className="font-medium text-sm">Key Workflow Types:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Client onboarding and delivery</li>
          <li>Content creation and publishing</li>
          <li>Sales and proposal process</li>
          <li>Team communication and handoffs</li>
          <li>Admin and recurring tasks</li>
        </ul>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <h3 className="font-semibold">Time Assessment for Workflows</h3>
        <p className="text-sm text-muted-foreground">
          Your Module 1 time logs are a goldmine for workflow analysis. Look for patterns that reveal which workflows
          consume disproportionate time.
        </p>
        <h4 className="font-medium text-sm">What to Analyze:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Recurring task clusters (signaling workflow needs)</li>
          <li>Task switching frequency (workflow fragmentation)</li>
          <li>Time sinks and bottlenecks</li>
          <li>Peak productivity windows</li>
          <li>Energy-draining activities</li>
        </ul>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <h3 className="font-semibold">Visual Workflow Mapping</h3>
        <p className="text-sm text-muted-foreground">
          Transform text-based workflows into visual maps. Seeing the flow reveals handoffs, decision points,
          and where work typically stalls.
        </p>
        <h4 className="font-medium text-sm">Mapping Elements:</h4>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="p-2 bg-secondary rounded">→ Arrows: Flow direction</div>
          <div className="p-2 bg-secondary rounded">◇ Diamonds: Decisions</div>
          <div className="p-2 bg-secondary rounded">□ Rectangles: Tasks</div>
          <div className="p-2 bg-secondary rounded">⬭ Ovals: Start/End</div>
        </div>
      </div>
    ),
    4: (
      <div className="space-y-4">
        <h3 className="font-semibold">Identifying Bottlenecks</h3>
        <p className="text-sm text-muted-foreground">
          Bottlenecks are constraints that limit your workflow throughput. They can be people, processes, or tools.
          Finding them is step one; prioritizing which to fix is step two.
        </p>
        <h4 className="font-medium text-sm">Common Bottleneck Types:</h4>
        <div className="grid grid-cols-2 gap-3 text-sm">
          <div className="p-3 bg-red-500/10 border border-red-500/20 rounded">
            <div className="font-medium text-red-700 dark:text-red-400 mb-1">HIGH IMPACT</div>
            <div className="text-xs text-muted-foreground">Client delivery delays</div>
          </div>
          <div className="p-3 bg-orange-500/10 border border-orange-500/20 rounded">
            <div className="font-medium text-orange-700 dark:text-orange-400 mb-1">MEDIUM IMPACT</div>
            <div className="text-xs text-muted-foreground">Admin task pileups</div>
          </div>
          <div className="p-3 bg-yellow-500/10 border border-yellow-500/20 rounded">
            <div className="font-medium text-yellow-700 dark:text-yellow-400 mb-1">LOW IMPACT</div>
            <div className="text-xs text-muted-foreground">Occasional delays</div>
          </div>
          <div className="p-3 bg-blue-500/10 border border-blue-500/20 rounded">
            <div className="font-medium text-blue-700 dark:text-blue-400 mb-1">EASY WINS</div>
            <div className="text-xs text-muted-foreground">Quick fixes available</div>
          </div>
        </div>
      </div>
    ),
    5: (
      <div className="space-y-4">
        <h3 className="font-semibold">Energy-Workflow Alignment</h3>
        <p className="text-sm text-muted-foreground">
          Not all workflows demand equal energy. High-focus workflows belong in your prime time. Routine tasks
          fit energy slumps. Match demand to capacity.
        </p>
        <h4 className="font-medium text-sm">Energy Levels:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li><strong>Peak Energy:</strong> Creative work, strategy, client calls</li>
          <li><strong>High Energy:</strong> Writing, analysis, complex tasks</li>
          <li><strong>Moderate Energy:</strong> Meetings, reviews, planning</li>
          <li><strong>Low Energy:</strong> Email, admin, file organization</li>
        </ul>
      </div>
    ),
    6: (
      <div className="space-y-4">
        <h3 className="font-semibold">Tool Audit Framework</h3>
        <p className="text-sm text-muted-foreground">
          Your tech stack should accelerate workflows, not create friction. Audit every tool for necessity,
          effectiveness, and integration quality.
        </p>
        <h4 className="font-medium text-sm">Evaluation Criteria:</h4>
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <CheckSquare className="h-4 w-4 text-green-500" />
            <span><strong>Essential:</strong> Cannot operate without it</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <Settings className="h-4 w-4 text-blue-500" />
            <span><strong>Helpful:</strong> Improves efficiency</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <TrendingUp className="h-4 w-4 text-yellow-500" />
            <span><strong>Redundant:</strong> Duplicates another tool</span>
          </div>
          <div className="flex items-center gap-2 p-2 bg-secondary rounded">
            <Search className="h-4 w-4 text-red-500" />
            <span><strong>Hindrance:</strong> Creates more work than value</span>
          </div>
        </div>
      </div>
    ),
    7: (
      <div className="space-y-4">
        <h3 className="font-semibold">Communication Overhead</h3>
        <p className="text-sm text-muted-foreground">
          Meetings and email are necessary but often excessive. Analyze your communication patterns to reclaim
          focus time while maintaining collaboration quality.
        </p>
        <h4 className="font-medium text-sm">Audit Dimensions:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Hours per week in meetings</li>
          <li>Emails sent/received daily</li>
          <li>Response time expectations</li>
          <li>Meeting necessity vs. alternative options</li>
          <li>Async vs. sync communication balance</li>
        </ul>
      </div>
    ),
    8: (
      <div className="space-y-4">
        <h3 className="font-semibold">Success Pattern Analysis</h3>
        <p className="text-sm text-muted-foreground">
          You already have workflows that work well. Identify your top 3 successes and decode what makes them
          effective. Replicate these patterns elsewhere.
        </p>
        <h4 className="font-medium text-sm">Pattern Elements:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Clear triggers and starting conditions</li>
          <li>Single owner or clear responsibility</li>
          <li>Minimal handoffs and dependencies</li>
          <li>Right-sized tools and automation</li>
          <li>Aligned with your energy patterns</li>
        </ul>
      </div>
    ),
    9: (
      <div className="space-y-4">
        <h3 className="font-semibold">Optimization Planning</h3>
        <p className="text-sm text-muted-foreground">
          Transform insights into action. Create a 30-day roadmap that addresses your highest-impact bottlenecks
          and builds on your success patterns.
        </p>
        <h4 className="font-medium text-sm">Plan Components:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Top 3 bottlenecks to address</li>
          <li>Success patterns to replicate</li>
          <li>Tool consolidation opportunities</li>
          <li>Communication boundary experiments</li>
          <li>Measurement and tracking approach</li>
        </ul>
      </div>
    ),
    10: (
      <div className="space-y-4">
        <h3 className="font-semibold">Implementation Commitment</h3>
        <p className="text-sm text-muted-foreground">
          Analysis without action is wasted effort. Commit to 3 specific changes with clear accountability
          mechanisms to ensure they become lasting habits.
        </p>
        <h4 className="font-medium text-sm">Commitment Framework:</h4>
        <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
          <li>Specific change description</li>
          <li>Implementation start date</li>
          <li>Success metrics and measurement</li>
          <li>Accountability partner or mechanism</li>
          <li>Review and adjustment schedule</li>
        </ul>
      </div>
    ),
  };

  return learnContent[day] || <p>Select a day to see learning content.</p>;
}

// Practice content component
function PracticeContent({ day }: { day: number }) {
  const practiceContent: Record<number, React.ReactNode> = {
    1: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Document 3-5 Workflows</h3>
        <p className="text-sm text-muted-foreground">
          Choose 3-5 workflows you use regularly. Document each step from start to finish.
        </p>
        <div className="p-4 bg-secondary rounded text-sm font-mono">
          <div className="font-medium mb-2">Workflow Template:</div>
          <div>1. Trigger/Start: What initiates this workflow?</div>
          <div>2. Steps: What happens, in order?</div>
          <div>3. People: Who is involved at each step?</div>
          <div>4. Tools: What tools are used?</div>
          <div>5. Output: What is the final result?</div>
          <div>6. Pain Points: Where does it slow down or break?</div>
        </div>
      </div>
    ),
    2: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Analyze Time Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Review your Module 1 time logs. Identify patterns and insights about your workflows.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Questions to Answer:</p>
          <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
            <li>Which workflows consume the most time?</li>
            <li>What tasks appear repeatedly?</li>
            <li>When do you experience task switching?</li>
            <li>What time sinks are recurring?</li>
          </ul>
        </div>
      </div>
    ),
    3: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Create Visual Maps</h3>
        <p className="text-sm text-muted-foreground">
          Transform your documented workflows into visual maps. Use simple shapes and arrows.
        </p>
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded">
          <p className="text-sm font-medium">Mapping Tips:</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>Start with your main workflow trigger</li>
            <li>Map every step, even small ones</li>
            <li>Mark decision points with diamonds</li>
            <li>Highlight bottlenecks in red</li>
            <li>Note who/what is involved at each step</li>
          </ul>
        </div>
      </div>
    ),
    4: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Log Your Bottlenecks</h3>
        <p className="text-sm text-muted-foreground">
          From your workflow maps, identify 5-10 specific bottlenecks. Rate each by impact.
        </p>
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2 bg-red-500/10 rounded">
            <strong>HIGH IMPACT:</strong>
            <p className="text-muted-foreground">Blocks delivery, affects revenue</p>
          </div>
          <div className="p-2 bg-orange-500/10 rounded">
            <strong>MEDIUM IMPACT:</strong>
            <p className="text-muted-foreground">Slows progress, creates frustration</p>
          </div>
          <div className="p-2 bg-yellow-500/10 rounded">
            <strong>LOW IMPACT:</strong>
            <p className="text-muted-foreground">Minor delays, occasional issue</p>
          </div>
          <div className="p-2 bg-green-500/10 rounded">
            <strong>EASY FIX:</strong>
            <p className="text-muted-foreground">Quick solution available</p>
          </div>
        </div>
      </div>
    ),
    5: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Map Energy to Tasks</h3>
        <p className="text-sm text-muted-foreground">
          Review your workflows and energy patterns. Create an optimized schedule.
        </p>
        <div className="p-4 bg-secondary rounded text-sm">
          <div className="font-medium mb-2">Energy-Aligned Schedule:</div>
          <div className="space-y-1 text-xs">
            <div><strong>Morning Peak:</strong> [List high-focus workflows]</div>
            <div><strong>Mid-Moderate:</strong> [List medium-demand workflows]</div>
            <div><strong>Afternoon Low:</strong> [List routine/admin workflows]</div>
            <div><strong>Evening Recovery:</strong> [List low-stakes workflows]</div>
          </div>
        </div>
      </div>
    ),
    6: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Tool Inventory</h3>
        <p className="text-sm text-muted-foreground">
          List every tool you use. Rate each on effectiveness and necessity.
        </p>
        <div className="p-4 bg-teal-500/10 border border-teal-500/20 rounded">
          <p className="text-sm font-medium">Tool Evaluation:</p>
          <ul className="text-xs text-muted-foreground mt-2 space-y-1 list-disc list-inside">
            <li>List all tools (software, apps, platforms)</li>
            <li>Rate daily usage frequency</li>
            <li>Mark as: Essential / Helpful / Redundant / Hindrance</li>
            <li>Note integration issues or overlaps</li>
            <li>Identify consolidation opportunities</li>
          </ul>
        </div>
      </div>
    ),
    7: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Communication Audit</h3>
        <p className="text-sm text-muted-foreground">
          Track your communication for one week. Analyze patterns and identify waste.
        </p>
        <div className="space-y-2 text-sm">
          <p className="font-medium">Track Metrics:</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 bg-secondary rounded">
              <strong>Meetings:</strong> Count + hours
            </div>
            <div className="p-2 bg-secondary rounded">
              <strong>Emails:</strong> Sent + received
            </div>
            <div className="p-2 bg-secondary rounded">
              <strong>Slack/Chat:</strong> Messages + time
            </div>
            <div className="p-2 bg-secondary rounded">
              <strong>Calls:</strong> Count + duration
            </div>
          </div>
        </div>
      </div>
    ),
    8: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Document Success Patterns</h3>
        <p className="text-sm text-muted-foreground">
          Identify your top 3 workflow successes. Decode what makes them work.
        </p>
        <div className="p-4 bg-cyan-500/10 border border-cyan-500/20 rounded">
          <p className="text-sm font-medium">Success Pattern Template:</p>
          <div className="text-xs text-muted-foreground mt-2">
            <div><strong>Workflow:</strong> [Name]</div>
            <div><strong>Why it works:</strong> [Key factors]</div>
            <div><strong>Owner:</strong> [Who runs it]</div>
            <div><strong>Tools:</strong> [What enables it]</div>
            <div><strong>Replicable elements:</strong> [What to copy]</div>
          </div>
        </div>
      </div>
    ),
    9: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Create 30-Day Plan</h3>
        <p className="text-sm text-muted-foreground">
          Design a concrete roadmap to address your top bottlenecks and implement optimizations.
        </p>
        <div className="p-4 bg-secondary rounded text-sm">
          <div className="font-medium mb-2">30-Day Roadmap:</div>
          <div className="space-y-1 text-xs">
            <div><strong>Week 1:</strong> [Bottleneck to tackle + approach]</div>
            <div><strong>Week 2:</strong> [Success pattern to replicate]</div>
            <div><strong>Week 3:</strong> [Tool consolidation or change]</div>
            <div><strong>Week 4:</strong> [Review and adjust plan]</div>
          </div>
        </div>
      </div>
    ),
    10: (
      <div className="space-y-4">
        <h3 className="font-semibold">Practice: Make 3 Commitments</h3>
        <p className="text-sm text-muted-foreground">
          Choose 3 specific workflow changes to implement. Set up accountability.
        </p>
        <div className="space-y-2">
          <p className="text-sm font-medium">Commitment Checklist:</p>
          <div className="text-xs text-muted-foreground space-y-1">
            <div>☐ Change 1: [Specific action + start date]</div>
            <div>☐ Change 2: [Specific action + start date]</div>
            <div>☐ Change 3: [Specific action + start date]</div>
            <div>☐ Success metric for each change</div>
            <div>☐ Accountability mechanism (partner, tracking, review)</div>
          </div>
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
            {day === 1 ? 'Your Workflow Documentation' :
             day === 2 ? 'Time Assessment Insights' :
             day === 3 ? 'Your Workflow Maps' :
             day === 4 ? 'Bottleneck Log with Impact Ratings' :
             day === 5 ? 'Energy-Aligned Workflow Plan' :
             day === 6 ? 'Tool Inventory with Ratings' :
             day === 7 ? 'Communication Audit Findings' :
             day === 8 ? 'Success Pattern Analysis' :
             day === 9 ? 'Optimization Plan' :
             'Implementation Commitment'}
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
