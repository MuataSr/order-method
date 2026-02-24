'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Eye, Trophy, FileText, Star } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_4 } from '../constants';

interface Phase2ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
}

const gates = PHASES_MODULE_4[1].gates;

export function Phase2Content({ completedGates, onCompleteGate }: Phase2ContentProps) {
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 8;
  });

  const [testResults, setTestResults] = useState<Array<{
    systemName: string;
    owner: string;
    passed: boolean;
    notes: string;
  }>>([
    { systemName: '', owner: '', passed: false, notes: '' },
  ]);

  const [feedback, setFeedback] = useState('');
  const [sopChanges, setSopChanges] = useState('');
  const [winDescription, setWinDescription] = useState('');
  const [winSystem, setWinSystem] = useState('');
  const [winTeamMember, setWinTeamMember] = useState('');

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;

  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitPassFailLog = async () => {
    const validResults = testResults.filter(r => r.systemName && r.owner);
    if (validResults.length === 0) return;
    await onCompleteGate('pass_fail_log', { passFailLog: validResults });
    setCurrentGate(11);
  };

  const handleSubmitFeedback = async () => {
    if (!feedback.trim()) return;
    await onCompleteGate('feedback_submission', { feedback: [{ category: 'working_well', feedback }] });
    setCurrentGate(12);
  };

  const handleSubmitSopUpgrade = async () => {
    if (!sopChanges.trim()) return;
    await onCompleteGate('sop_upgrade', { sopUpgrade: { fileName: 'playbook-v1.1.pdf', fileUrl: '', changes: sopChanges } });
    setCurrentGate(14);
  };

  const handleSubmitWin = async () => {
    if (!winDescription.trim() || !winSystem.trim()) return;
    await onCompleteGate('win_documentation', {
      winDocumentation: {
        winDescription,
        systemName: winSystem,
        teamMember: winTeamMember,
        celebratedAt: new Date().toISOString(),
      },
    });
  };

  const addTestResult = () => {
    setTestResults([...testResults, { systemName: '', owner: '', passed: false, notes: '' }]);
  };

  const updateTestResult = (index: number, field: string, value: string | boolean) => {
    const updated = [...testResults];
    updated[index] = { ...updated[index], [field]: value };
    setTestResults(updated);
  };

  return (
    <div className="space-y-6">
      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium">Phase 2 Progress</span>
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

      {/* Days 8-10: Pass/Fail Log */}
      {(currentGate >= 8 && currentGate <= 10) && !isGateComplete('pass_fail_log') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Days 8-10: The Hands-Off Test</CardTitle>
            </div>
            <CardDescription>
              Let your team run systems on real work. Do NOT intervene unless catastrophe!
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {testResults.map((result, index) => (
                <div key={index} className="grid grid-cols-1 md:grid-cols-4 gap-3 p-3 bg-muted/50 rounded-lg">
                  <div>
                    <label className="text-xs font-medium mb-1 block">System Name</label>
                    <Input
                      value={result.systemName}
                      onChange={(e) => updateTestResult(index, 'systemName', e.target.value)}
                      placeholder="e.g., Client Onboarding"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Owner</label>
                    <Input
                      value={result.owner}
                      onChange={(e) => updateTestResult(index, 'owner', e.target.value)}
                      placeholder="Who ran it?"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Result</label>
                    <select
                      value={result.passed ? 'pass' : 'fail'}
                      onChange={(e) => updateTestResult(index, 'passed', e.target.value === 'pass')}
                      className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm"
                    >
                      <option value="fail">❌ Needs Work</option>
                      <option value="pass">✓ Passed</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs font-medium mb-1 block">Notes</label>
                    <Input
                      value={result.notes}
                      onChange={(e) => updateTestResult(index, 'notes', e.target.value)}
                      placeholder="Issues observed"
                    />
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addTestResult} className="w-full">
              + Add Another Test
            </Button>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">⚠️ Hands-Off Rule:</h4>
              <p className="text-sm text-muted-foreground">
                The test is meaningless if you intervene. Learning requires space to make and correct mistakes.
                Only step in if there's a genuine catastrophe.
              </p>
            </div>

            <Button
              onClick={handleSubmitPassFailLog}
              disabled={!testResults.some(r => r.systemName && r.owner)}
              className="w-full"
            >
              Submit Pass/Fail Log
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Day 11: Feedback Huddle */}
      {currentGate === 11 && !isGateComplete('feedback_submission') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Day 11: The Feedback Huddle</CardTitle>
            </div>
            <CardDescription>
              Conduct a 15-20 minute team huddle to gather feedback.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Team Feedback</label>
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="What's working well? What feels confusing? Where do you still need me?"
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Huddle Questions:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• "What's working well?"</li>
                <li>• "What feels confusing?"</li>
                <li>• "Where do you still need me?"</li>
              </ul>
              <p className="text-xs text-muted-foreground mt-2 italic">
                Document all feedback without defending or explaining.
              </p>
            </div>

            <Button
              onClick={handleSubmitFeedback}
              disabled={!feedback.trim()}
              className="w-full"
            >
              Submit Feedback
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 12-13: SOP Upgrade */}
      {(currentGate === 12 || currentGate === 13) && !isGateComplete('sop_upgrade') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Days 12-13: The SOP Upgrade</CardTitle>
            </div>
            <CardDescription>
              Edit checklists and templates based on huddle findings.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Changes Made (Version 1.1)</label>
              <Textarea
                value={sopChanges}
                onChange={(e) => setSopChanges(e.target.value)}
                placeholder="Describe the changes you made to your SOPs based on team feedback..."
                rows={4}
              />
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Upgrade Checklist:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>✓ Fix gaps immediately while feedback is fresh</li>
                <li>✓ Update version numbers (Version 1.0 → 1.1)</li>
                <li>✓ Communicate changes to team</li>
                <li>✓ Note what was clarified vs. what was added</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitSopUpgrade}
              disabled={!sopChanges.trim()}
              className="w-full"
            >
              Submit SOP Upgrade
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Day 14: Win Documentation */}
      {currentGate === 14 && !isGateComplete('win_documentation') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-purple-500" />
              <CardTitle className="text-lg">Day 14: The Win Log</CardTitle>
            </div>
            <CardDescription>
              Identify and celebrate a specific 'System Win' to reinforce the behavior you want to see more of.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">System Name</label>
                <Input
                  value={winSystem}
                  onChange={(e) => setWinSystem(e.target.value)}
                  placeholder="e.g., Client Onboarding"
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Team Member (Optional)</label>
                <Input
                  value={winTeamMember}
                  onChange={(e) => setWinTeamMember(e.target.value)}
                  placeholder="Who achieved this win?"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Win Description</label>
              <Textarea
                value={winDescription}
                onChange={(e) => setWinDescription(e.target.value)}
                placeholder="Examples: 'Fewer errors in Monday report', 'Faster client onboarding', 'Zero escalations this week'"
                rows={3}
              />
            </div>

            <div className="bg-green-500/10 border border-green-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-green-600 mb-2">🎉 Why Celebrate Wins?</h4>
              <p className="text-sm text-muted-foreground">
                Recognition shapes behavior. Celebrating wins signals what success looks like and motivates your team to repeat the behavior.
              </p>
            </div>

            <Button
              onClick={handleSubmitWin}
              disabled={!winDescription.trim() || !winSystem.trim()}
              className="w-full"
            >
              <Star className="mr-2 h-4 w-4" />
              Document & Celebrate Win
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Phase Complete Message */}
      {isGateComplete('win_documentation') && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Phase 2 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your team has practiced independently and provided feedback. Continue to Phase 3 to set decision boundaries.
            </p>
            <Badge className="bg-green-500">4/4 Gates Completed</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
