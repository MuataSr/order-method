import { Badge } from '@/components/ui/badge';
import { Eye } from 'lucide-react';

export function PreviewModeBadge() {
  return (
    <Badge 
      variant="outline" 
      className="ml-2 bg-blue-500/10 text-blue-700 dark:text-blue-400 border-blue-500/20"
    >
      <Eye className="h-3 w-3 mr-1" />
      Preview Mode
    </Badge>
  );
}
