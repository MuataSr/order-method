'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Info } from 'lucide-react';

interface PreviewModeGateProps {
  gateName: string;
  gateLabel: string;
  day?: number;
  description?: string;
  instructions?: string;
}

export function PreviewModeGate({ 
  gateName, 
  gateLabel, 
  day, 
  description, 
  instructions 
}: PreviewModeGateProps) {
  return (
    <Card className="border-dashed border-2 border-blue-500/30 bg-blue-500/5">
      <CardContent className="p-8">
        <div className="flex items-center justify-center mb-6">
          <Badge variant="secondary" className="text-sm px-4 py-2 bg-blue-500/10 text-blue-700 dark:text-blue-400">
            <Eye className="h-4 w-4 mr-2" />
            Preview Mode - No Submission Required
          </Badge>
        </div>
        
        <div className="text-center space-y-4">
          <h3 className="text-xl font-semibold">{gateLabel}</h3>
          
          {description && (
            <p className="text-muted-foreground max-w-2xl mx-auto">{description}</p>
          )}
          
          {instructions && (
            <div className="bg-background border rounded-lg p-4 text-left max-w-2xl mx-auto">
              <p className="text-sm font-medium mb-2 flex items-center gap-2">
                <Info className="h-4 w-4" />
                Instructions:
              </p>
              <p className="text-sm text-muted-foreground whitespace-pre-wrap">{instructions}</p>
            </div>
          )}
          
          <div className="mt-6 p-4 bg-blue-500/10 rounded-lg max-w-2xl mx-auto">
            <p className="text-sm text-blue-700 dark:text-blue-400">
              {day 
                ? `In normal mode, you would complete this gate to unlock Day ${day + 1}. Preview mode allows you to view all content without restrictions.`
                : 'In normal mode, you would complete this gate to proceed. Preview mode allows you to view all content without restrictions.'
              }
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
