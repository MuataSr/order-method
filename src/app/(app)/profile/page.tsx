'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/lib/stores/auth-store';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { User, Mail, Calendar, Award, Loader2, Palette } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ThemeToggleInline } from '@/components/theme-toggle';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const queryClient = useQueryClient();
  
  const [name, setName] = useState(user?.name || '');
  const [bio, setBio] = useState(user?.bio || '');

  const { data: enrollments = [] } = useQuery({
    queryKey: ['enrollments', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/user/enrollments?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  const { data: certificates = [] } = useQuery({
    queryKey: ['certificates', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/certificates?userId=${user?.id}`);
      return res.json();
    },
    enabled: !!user?.id,
  });

  const updateMutation = useMutation({
    mutationFn: async (data: { name: string; bio: string }) => {
      const res = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });
      return res.json();
    },
    onSuccess: () => {
      toast.success('Profile updated!');
      queryClient.invalidateQueries({ queryKey: ['user'] });
    },
    onError: () => {
      toast.error('Failed to update profile');
    },
  });

  const handleSave = () => {
    updateMutation.mutate({ name, bio });
  };

  const completedCourses = enrollments.filter((e: any) => e.completedAt).length;
  const totalProgress = enrollments.reduce((acc: number, e: any) => acc + e.progress, 0);
  const avgProgress = enrollments.length > 0 ? totalProgress / enrollments.length : 0;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-muted-foreground">Manage your account settings</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
              <CardDescription>Update your profile details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4 mb-6">
                <Avatar className="h-20 w-20">
                  <AvatarImage src={user?.avatar || ''} />
                  <AvatarFallback className="text-2xl">
                    {user?.name?.charAt(0) || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-medium text-lg">{user?.name}</p>
                  <p className="text-muted-foreground">{user?.email}</p>
                  <Badge variant="secondary" className="mt-1">{user?.role}</Badge>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Your name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={user?.email || ''}
                  disabled
                  className="bg-muted"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Tell us about yourself"
                  rows={3}
                />
              </div>

              <Button onClick={handleSave} disabled={updateMutation.isPending}>
                {updateMutation.isPending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  'Save Changes'
                )}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>My Courses</CardTitle>
              <CardDescription>Your enrolled courses and progress</CardDescription>
            </CardHeader>
            <CardContent>
              {enrollments.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">
                  You haven't enrolled in any courses yet
                </p>
              ) : (
                <div className="space-y-4">
                  {enrollments.slice(0, 5).map((enrollment: any) => (
                    <div key={enrollment.id} className="flex items-center gap-4">
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{enrollment.course?.title}</p>
                        <Progress value={enrollment.progress} className="h-2 mt-1" />
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {Math.round(enrollment.progress)}%
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Learning Stats</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{enrollments.length}</p>
                  <p className="text-sm text-muted-foreground">Enrolled Courses</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-green-500/10 flex items-center justify-center">
                  <Award className="h-5 w-5 text-green-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{completedCourses}</p>
                  <p className="text-sm text-muted-foreground">Completed</p>
                </div>
              </div>

              <Separator />

              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-blue-500" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{certificates.length}</p>
                  <p className="text-sm text-muted-foreground">Certificates</p>
                </div>
              </div>

              <Separator />

              <div>
                <p className="text-sm text-muted-foreground mb-2">Overall Progress</p>
                <Progress value={avgProgress} className="h-3" />
                <p className="text-right text-sm text-muted-foreground mt-1">
                  {Math.round(avgProgress)}%
                </p>
               </div>
             </CardContent>
           </Card>

           <Card>
             <CardHeader>
               <CardTitle className="flex items-center gap-2">
                 <Palette className="h-5 w-5" />
                 Appearance
               </CardTitle>
               <CardDescription>Customize how the app looks</CardDescription>
             </CardHeader>
             <CardContent>
               <div className="space-y-3">
                 <p className="text-sm font-medium">Theme</p>
                 <ThemeToggleInline />
               </div>
             </CardContent>
           </Card>
         </div>
       </div>
     </div>
   );
 }
