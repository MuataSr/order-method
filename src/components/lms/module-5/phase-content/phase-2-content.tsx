'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, Users, Hand, MessageSquare, Plus, Trash2, Calendar } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData } from '../types';
import { PHASES_MODULE_5 } from '../constants';

interface Phase2ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  bypassGates?: boolean;
}

const gates = PHASES_MODULE_5[1].gates;

export function Phase2Content({ completedGates, onCompleteGate, bypassGates }: Phase2ContentProps) {
  const bypassGatesEnabled = bypassGates ?? false;
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 8;
  });

  const [delegationItems, setDelegationItems] = useState<Array<{
    task: string;
    newOwner: string;
    trainingNeeded: string;
    targetDate: string;
    status: 'pending' | 'in_progress' | 'completed';
  }>>([
    { task: '', newOwner: '', trainingNeeded: '', targetDate: '', status: 'pending' },
  ]);

  const [handoffItems, setHandoffItems] = useState<Array<{
    systemName: string;
    handedOffTo: string;
    handoffDate: string;
    confirmed: boolean;
  }>>([
    { systemName: '', handedOffTo: '', handoffDate: '', confirmed: false },
  ]);

  const [communicationPolicy, setCommunicationPolicy] = useState('');

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;
  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitDelegationRoadmap = async () => {
    const validItems = delegationItems.filter(d => d.task && d.newOwner && d.targetDate);
    if (validItems.length < 2) return;
    
    await onCompleteGate('delegation_roadmap', { delegationRoadmap: validItems });
    setCurrentGate(11);
  };

  const handleSubmitHandoffConfirmation = async () => {
    const validItems = handoffItems.filter(h => h.systemName && h.handedOffTo && h.confirmed);
    if (validItems.length < 1) return;
    
    await onCompleteGate('handoff_confirmation', { handoffConfirmation: validItems });
    setCurrentGate(14);
  };

  const handleSubmitCommunicationPolicy = async () => {
    if (communicationPolicy.trim().split(/\s+/).length < 20) return;
    
    await onCompleteGate('communication_policy', { communicationPolicy });
  };

  const addDelegationItem = () => {
    setDelegationItems([...delegationItems, { task: '', newOwner: '', trainingNeeded: '', targetDate: '', status: 'pending' }]);
  };

  const updateDelegationItem = (index: number, field: string, value: string) => {
    const updated = [...delegationItems];
    updated[index] = { ...updated[index], [field]: value };
    setDelegationItems(updated);
  };

  const removeDelegationItem = (index: number) => {
    setDelegationItems(delegationItems.filter((_, i) => i !== index));
  };

  const addHandoffItem = () => {
    setHandoffItems([...handoffItems, { systemName: '', handedOffTo: '', handoffDate: '', confirmed: false }]);
  };

  const updateHandoffItem = (index: number, field: string, value: string | boolean) => {
    const updated = [...handoffItems];
    updated[index] = { ...updated[index], [field]: value };
    setHandoffItems(updated);
  };

  const removeHandoffItem = (index: number) => {
    setHandoffItems(handoffItems.filter((_, i) => i !== index));
  };

  const validDelegationCount = delegationItems.filter(d => d.task && d.newOwner && d.targetDate).length;

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

      {/* Days 8-10: Delegation Roadmap */}
      {(currentGate >= 8 && currentGate <= 10) && !isGateComplete('delegation_roadmap') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-lg">Days 8-10: The 'Stop Doing' List</CardTitle>
            </div>
            <CardDescription>
              Identify tasks to release and name the new owner for each.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {delegationItems.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground">Task {index + 1}</span>
                    {delegationItems.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeDelegationItem(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium">Task to Delegate</label>
                      <Input
                        value={item.task}
                        onChange={(e) => updateDelegationItem(index, 'task', e.target.value)}
                        placeholder="e.g., Weekly reporting"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">New Owner</label>
                      <Input
                        value={item.newOwner}
                        onChange={(e) => updateDelegationItem(index, 'newOwner', e.target.value)}
                        placeholder="e.g., Jordan"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Training Needed</label>
                      <Input
                        value={item.trainingNeeded}
                        onChange={(e) => updateDelegationItem(index, 'trainingNeeded', e.target.value)}
                        placeholder="e.g., 2-hour walkthrough"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Target Date</label>
                      <Input
                        type="date"
                        value={item.targetDate}
                        onChange={(e) => updateDelegationItem(index, 'targetDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addDelegationItem} className="w-full">
              <Plus className="h-3 w-3 mr-1" /> Add Task
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Delegation Tips:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Start with tasks you're clinging to unnecessarily</li>
                <li>• Name a specific person, not "the team"</li>
                <li>• Be realistic about training needs</li>
                <li>• Set concrete target dates</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitDelegationRoadmap}
              disabled={validDelegationCount < 2}
              className="w-full"
            >
              Submit Delegation Roadmap ({validDelegationCount}/2 min)
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 11-13: Handoff Confirmation */}
      {(currentGate >= 11 && currentGate <= 13) && !isGateComplete('handoff_confirmation') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Hand className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-lg">Days 11-13: The Handoff Plan</CardTitle>
            </div>
            <CardDescription>
              Document completed handoffs for each system.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              {handoffItems.map((item, index) => (
                <div key={index} className="p-4 bg-muted/50 rounded-lg space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-medium text-muted-foreground">Handoff {index + 1}</span>
                    {handoffItems.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeHandoffItem(index)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div>
                      <label className="text-xs font-medium">System/Process</label>
                      <Input
                        value={item.systemName}
                        onChange={(e) => updateHandoffItem(index, 'systemName', e.target.value)}
                        placeholder="e.g., Client Onboarding"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Handed Off To</label>
                      <Input
                        value={item.handedOffTo}
                        onChange={(e) => updateHandoffItem(index, 'handedOffTo', e.target.value)}
                        placeholder="e.g., Alex"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Handoff Date</label>
                      <Input
                        type="date"
                        value={item.handoffDate}
                        onChange={(e) => updateHandoffItem(index, 'handoffDate', e.target.value)}
                        className="mt-1"
                      />
                    </div>
                    <div className="flex items-end">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={item.confirmed}
                          onChange={(e) => updateHandoffItem(index, 'confirmed', e.target.checked)}
                          className="rounded border-input"
                        />
                        <span className="text-xs">Handoff Completed</span>
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <Button variant="outline" onClick={addHandoffItem} className="w-full">
              <Plus className="h-3 w-3 mr-1" /> Add Handoff
            </Button>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Handoff Protocol:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>1. Show the system/SOP</li>
                <li>2. Do a run-through together</li>
                <li>3. Let them run it while you watch</li>
                <li>4. Then step back completely</li>
              </ul>
            </div>

            <Button
              onClick={handleSubmitHandoffConfirmation}
              disabled={handoffItems.filter(h => h.systemName && h.handedOffTo && h.confirmed).length < 1}
              className="w-full"
            >
              Submit Handoff Confirmation
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 14-15: Communication Policy */}
      {(currentGate >= 14) && !isGateComplete('communication_policy') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-teal-500" />
              <CardTitle className="text-lg">Days 14-15: Access Boundaries</CardTitle>
            </div>
            <CardDescription>
              Define when you ARE and are NOT available for decisions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Your Communication Policy</label>
              <Textarea
                value={communicationPolicy}
                onChange={(e) => setCommunicationPolicy(e.target.value)}
                placeholder="Example: I check Slack only at 11am and 3pm on work days. I am available for urgent decisions between 11-12 and 3-4. Non-urgent items should be added to the weekly meeting agenda. My off day is Friday - please do not contact me unless it's a genuine emergency."
                rows={5}
              />
              <p className="text-xs text-muted-foreground mt-1">
                {communicationPolicy.trim().split(/\s+/).filter(w => w).length} words (minimum 20)
              </p>
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Policy Elements to Include:</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• When you check messages (e.g., "11am and 3pm")</li>
                <li>• When you're available for decisions</li>
                <li>• How to handle non-urgent items</li>
                <li>• What constitutes an emergency</li>
                <li>• Your protected off-day rules</li>
              </ul>
            </div>

            <div className="bg-amber-500/10 border border-amber-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-amber-600 mb-2">📝 Share with Your Team</h4>
              <p className="text-sm text-muted-foreground">
                This policy should be communicated clearly to all team members. Consider posting it in a shared document or messaging channel.
              </p>
            </div>

            <Button
              onClick={handleSubmitCommunicationPolicy}
              disabled={communicationPolicy.trim().split(/\s+/).length < 20}
              className="w-full"
            >
              Submit Communication Policy
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Phase Complete Message */}
      {isGateComplete('communication_policy') && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Phase 2 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              You've created a delegation roadmap, completed handoffs, and set communication boundaries. Continue to Phase 3 to build your dashboard.
            </p>
            <Badge className="bg-green-500">3/3 Gates Completed</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
