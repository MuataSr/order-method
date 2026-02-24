'use client';

import { useState } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface VideoPlayerProps {
  videoUrl: string | null;
  title: string;
  onComplete?: () => void;
}

export function VideoPlayer({ videoUrl, title, onComplete }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  // Extract YouTube video ID
  const getYouTubeId = (url: string) => {
    const match = url.match(
      /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/
    );
    return match ? match[1] : null;
  };

  const youtubeId = videoUrl ? getYouTubeId(videoUrl) : null;

  if (!videoUrl) {
    return (
      <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
        <p className="text-muted-foreground">No video available</p>
      </div>
    );
  }

  return (
    <div className="relative group overflow-hidden rounded-lg bg-black">
      {youtubeId ? (
        <div className="aspect-video relative">
          <iframe
            src={`https://www.youtube.com/embed/${youtubeId}?rel=0&modestbranding=1`}
            title={title}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      ) : (
        <div className="aspect-video relative">
          <video
            src={videoUrl}
            className="w-full h-full object-contain"
            controls
            onEnded={onComplete}
          >
            Your browser does not support the video tag.
          </video>
        </div>
      )}
      
      <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
        <Button
          size="sm"
          variant="secondary"
          className="gap-1"
          aria-label="Open video in new tab"
          onClick={() => window.open(videoUrl, '_blank')}
        >
          <ExternalLink className="w-4 h-4" />
          Open
        </Button>
      </div>
    </div>
  );
}
