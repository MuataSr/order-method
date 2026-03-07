'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { CheckCircle2, ChevronRight, BarChart3, Calendar, FileText, Plus, Trash2, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';
import { GateSubmissionData, DashboardMetric } from '../types';
import { PHASES_MODULE_5, DASHBOARD_METRIC_CATEGORIES } from '../constants';
import { generateMetricId } from '../utils';

interface Phase3ContentProps {
  completedGates: string[];
  onCompleteGate: (gateName: string, data?: GateSubmissionData) => Promise<void>;
  bypassGates?: boolean;
}

const gates = PHASES_MODULE_5[2].gates;

export function Phase3Content({ completedGates, onCompleteGate, bypassGates }: Phase3ContentProps) {
  const bypassGatesEnabled = bypassGates ?? false;
  const [currentGate, setCurrentGate] = useState(() => {
    const incompleteGate = gates.find(g => !completedGates.includes(g.name));
    return incompleteGate ? incompleteGate.day : 16;
  });

  const [metrics, setMetrics] = useState<DashboardMetric[]>([
    { id: generateMetricId(), name: '', category: 'revenue', dataSource: '', frequency: 'weekly' },
  ]);

  const [reviewData, setReviewData] = useState({
    weeklyReviewDay: 'Monday',
    weeklyReviewTime: '09:00',
    monthlyReviewDay: '1st Friday',
    monthlyReviewTime: '10:00',
    confirmed: false,
  });

  const [responsibleFor, setResponsibleFor] = useState<string[]>(['', '', '']);
  const [noLongerResponsibleFor, setNoLongerResponsibleFor] = useState<string[]>(['', '', '']);

  const progressPercentage = (completedGates.filter(g => gates.some(gate => gate.name === g)).length / gates.length) * 100;
  const isGateComplete = (gateName: string) => completedGates.includes(gateName);

  const handleSubmitDashboard = async () => {
    const validMetrics = metrics.filter(m => m.name && m.category && m.dataSource);
    if (validMetrics.length < 5) return;
    
    await onCompleteGate('founder_dashboard', { founderDashboard: validMetrics });
    setCurrentGate(19);
  };

  const handleSubmitReviewCalendar = async () => {
    if (!reviewData.confirmed) return;
    
    await onCompleteGate('review_calendar', { reviewCalendar: reviewData });
    setCurrentGate(22);
  };

  const handleSubmitRoleDescription = async () => {
    const validResponsible = responsibleFor.filter(r => r.trim());
    const validNotResponsible = noLongerResponsibleFor.filter(r => r.trim());
    if (validResponsible.length < 3 || validNotResponsible.length < 2) return;
    
    await onCompleteGate('role_description', {
      roleDescription: {
        responsibleFor: validResponsible,
        noLongerResponsibleFor: validNotResponsible,
        signedAt: new Date().toISOString(),
      },
    });
  };

  const addMetric = () => {
    setMetrics([...metrics, { id: generateMetricId(), name: '', category: 'revenue', dataSource: '', frequency: 'weekly' }]);
  };

  const updateMetric = (id: string, field: keyof DashboardMetric, value: string) => {
    setMetrics(metrics.map(m => m.id === id ? { ...m, [field]: value } : m));
  };

  const removeMetric = (id: string) => {
    if (metrics.length > 1) {
      setMetrics(metrics.filter(m => m.id !== id));
    }
  };

  const validMetricsCount = metrics.filter(m => m.name && m.category && m.dataSource).length;

  const updateResponsibleFor = (index: number, value: string) => {
    const updated = [...responsibleFor];
    updated[index] = value;
    setResponsibleFor(updated);
  };

  const updateNotResponsibleFor = (index: number, value: string) => {
    const updated = [...noLongerResponsibleFor];
    updated[index] = value;
    setNoLongerResponsibleFor(updated);
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

      {/* Days 16-18: Founder Dashboard */}
      {(currentGate >= 16 && currentGate <= 18) && !isGateComplete('founder_dashboard') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <BarChart3 className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-lg">Days 16-18: The Founder Dashboard</CardTitle>
            </div>
            <CardDescription>
              Build your dashboard with 5-7 key health metrics for managing by metrics, not presence.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Dashboard Preview */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-lg p-4 text-white">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-medium">Founder Dashboard Preview</h4>
                <Badge variant="outline" className="text-white border-white/20">
                  {validMetricsCount}/7 metrics
                </Badge>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {metrics.filter(m => m.name).map((metric) => {
                  const category = DASHBOARD_METRIC_CATEGORIES.find(c => c.value === metric.category);
                  return (
                    <div
                      key={metric.id}
                      className="bg-white/10 rounded-lg p-3 backdrop-blur-sm"
                    >
                      <div className="text-xs text-white/60 mb-1">
                        {category?.icon} {category?.label}
                      </div>
                      <div className="font-medium truncate">{metric.name}</div>
                      <div className="text-xs text-white/40 mt-1">
                        {metric.frequency}
                      </div>
                    </div>
                  );
                })}
                {validMetricsCount < 7 && (
                  <div className="border-2 border-dashed border-white/20 rounded-lg p-3 flex items-center justify-center text-white/40">
                    <Plus className="h-5 w-5" />
                  </div>
                )}
              </div>
            </div>

            {/* Metrics Builder */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="font-medium">Configure Metrics</h4>
                <Button variant="outline" size="sm" onClick={addMetric}>
                  <Plus className="h-3 w-3 mr-1" /> Add Metric
                </Button>
              </div>

              {metrics.map((metric, index) => (
                <div key={metric.id} className="p-4 bg-muted/50 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-xs font-medium text-muted-foreground">Metric {index + 1}</span>
                    {metrics.length > 1 && (
                      <Button variant="ghost" size="sm" onClick={() => removeMetric(metric.id)}>
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    <div>
                      <label className="text-xs font-medium">Name</label>
                      <Input
                        value={metric.name}
                        onChange={(e) => updateMetric(metric.id, 'name', e.target.value)}
                        placeholder="e.g., Monthly Revenue"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Category</label>
                      <select
                        value={metric.category}
                        onChange={(e) => updateMetric(metric.id, 'category', e.target.value)}
                        className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                      >
                        {DASHBOARD_METRIC_CATEGORIES.map(cat => (
                          <option key={cat.value} value={cat.value}>
                            {cat.icon} {cat.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-medium">Target Value</label>
                      <Input
                        value={metric.targetValue || ''}
                        onChange={(e) => updateMetric(metric.id, 'targetValue', e.target.value)}
                        placeholder="e.g., $50,000"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Data Source</label>
                      <Input
                        value={metric.dataSource}
                        onChange={(e) => updateMetric(metric.id, 'dataSource', e.target.value)}
                        placeholder="e.g., Stripe Dashboard"
                        className="mt-1"
                      />
                    </div>
                  </div>
                  <div className="mt-3">
                    <label className="text-xs font-medium">Review Frequency</label>
                    <div className="flex gap-2 mt-1">
                      {(['daily', 'weekly', 'monthly'] as const).map(freq => (
                        <Button
                          key={freq}
                          variant={metric.frequency === freq ? 'default' : 'outline'}
                          size="sm"
                          onClick={() => updateMetric(metric.id, 'frequency', freq)}
                        >
                          {freq.charAt(0).toUpperCase() + freq.slice(1)}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="bg-muted/50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Recommended Metrics by Category:</h4>
              <div className="grid md:grid-cols-2 gap-2 text-sm text-muted-foreground">
                <div><strong>Revenue:</strong> MRR, Cash in Bank</div>
                <div><strong>Delivery:</strong> Client Health Score, NPS</div>
                <div><strong>Team:</strong> Team Capacity, Utilization %</div>
                <div><strong>Growth:</strong> Leads, Conversion Rate</div>
              </div>
            </div>

            <Button
              onClick={handleSubmitDashboard}
              disabled={validMetricsCount < 5}
              className="w-full"
            >
              Submit Founder Dashboard ({validMetricsCount}/5 min)
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 19-21: Review Calendar */}
      {(currentGate >= 19 && currentGate <= 21) && !isGateComplete('review_calendar') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-lg">Days 19-21: The Review Rhythm</CardTitle>
            </div>
            <CardDescription>
              Schedule your weekly and monthly review sessions.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Weekly Review */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Weekly Review (30-60 minutes)
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Day of Week</label>
                  <select
                    value={reviewData.weeklyReviewDay}
                    onChange={(e) => setReviewData({ ...reviewData, weeklyReviewDay: e.target.value })}
                    className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm mt-1"
                  >
                    {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'].map(day => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium">Time</label>
                  <Input
                    type="time"
                    value={reviewData.weeklyReviewTime}
                    onChange={(e) => setReviewData({ ...reviewData, weeklyReviewTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                <strong>Weekly Agenda:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Review dashboard metrics</li>
                  <li>Check key systems</li>
                  <li>Decide on 1-3 actions for the week</li>
                </ul>
              </div>
            </div>

            {/* Monthly Review */}
            <div className="p-4 bg-muted/50 rounded-lg space-y-4">
              <h4 className="font-medium flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                Monthly Review (60-90 minutes)
              </h4>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-medium">Day</label>
                  <Input
                    value={reviewData.monthlyReviewDay}
                    onChange={(e) => setReviewData({ ...reviewData, monthlyReviewDay: e.target.value })}
                    placeholder="e.g., 1st Friday"
                    className="mt-1"
                  />
                </div>
                <div>
                  <label className="text-xs font-medium">Time</label>
                  <Input
                    type="time"
                    value={reviewData.monthlyReviewTime}
                    onChange={(e) => setReviewData({ ...reviewData, monthlyReviewTime: e.target.value })}
                    className="mt-1"
                  />
                </div>
              </div>
              <div className="bg-background p-3 rounded text-sm text-muted-foreground">
                <strong>Monthly Agenda:</strong>
                <ul className="mt-1 ml-4 list-disc">
                  <li>Review progress toward 2-day week</li>
                  <li>Assess team ownership</li>
                  <li>Adjust priorities</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="confirm-calendar"
                checked={reviewData.confirmed}
                onChange={(e) => setReviewData({ ...reviewData, confirmed: e.target.checked })}
                className="rounded border-input"
              />
              <label htmlFor="confirm-calendar" className="text-sm">
                I have created recurring calendar invites for both review sessions
              </label>
            </div>

            <Button
              onClick={handleSubmitReviewCalendar}
              disabled={!reviewData.confirmed}
              className="w-full"
            >
              Submit Review Calendar
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Days 22-23: Role Description */}
      {(currentGate >= 22) && !isGateComplete('role_description') && (
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-cyan-500" />
              <CardTitle className="text-lg">Days 22-23: The New Role Description</CardTitle>
            </div>
            <CardDescription>
              Document your official role for the next 90 days.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-medium text-green-600">You ARE Responsible For</h4>
                {responsibleFor.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => updateResponsibleFor(index, e.target.value)}
                    placeholder={`Responsibility ${index + 1}`}
                  />
                ))}
                {responsibleFor.filter(r => r.trim()).length >= 3 && responsibleFor.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setResponsibleFor([...responsibleFor, ''])}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                )}
              </div>

              <div className="space-y-3">
                <h4 className="font-medium text-red-600">You Are NO LONGER Responsible For</h4>
                {noLongerResponsibleFor.map((item, index) => (
                  <Input
                    key={index}
                    value={item}
                    onChange={(e) => updateNotResponsibleFor(index, e.target.value)}
                    placeholder={`Released task ${index + 1}`}
                  />
                ))}
                {noLongerResponsibleFor.filter(r => r.trim()).length >= 2 && noLongerResponsibleFor.length < 5 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setNoLongerResponsibleFor([...noLongerResponsibleFor, ''])}
                    className="w-full"
                  >
                    <Plus className="h-3 w-3 mr-1" /> Add
                  </Button>
                )}
              </div>
            </div>

            <div className="bg-emerald-500/10 border border-emerald-500/20 p-4 rounded-lg">
              <h4 className="font-medium text-emerald-600 mb-2">📋 This is Your Official Role Description</h4>
              <p className="text-sm text-muted-foreground">
                This document defines your focus for the next 90 days. Be specific about what you will and won't do.
              </p>
            </div>

            <Button
              onClick={handleSubmitRoleDescription}
              disabled={responsibleFor.filter(r => r.trim()).length < 3 || noLongerResponsibleFor.filter(r => r.trim()).length < 2}
              className="w-full"
            >
              Sign & Submit Role Description
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Phase Complete Message */}
      {isGateComplete('role_description') && (
        <Card className="border-green-500 bg-green-500/5">
          <CardContent className="p-6 text-center">
            <CheckCircle2 className="h-12 w-12 text-green-500 mx-auto mb-3" />
            <h3 className="font-semibold text-lg mb-2">Phase 3 Complete!</h3>
            <p className="text-muted-foreground mb-4">
              Your dashboard is built, reviews are scheduled, and your role is defined. Continue to Phase 4 to test the 4-day week.
            </p>
            <Badge className="bg-green-500">3/3 Gates Completed</Badge>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
