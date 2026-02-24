import { GraduationCap } from 'lucide-react';
import Link from 'next/link';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex">
      <div className="flex-1 flex flex-col justify-center py-12 px-4 sm:px-6 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <Link href="/" className="flex items-center gap-2 mb-8">
              <GraduationCap className="h-10 w-10 text-primary" />
              <span className="font-bold text-2xl">LearnHub</span>
            </Link>
            {children}
          </div>
        </div>
      </div>
      <div className="hidden lg:block relative w-0 flex-1">
        <div className="absolute inset-0 bg-gradient-to-br from-primary/90 via-primary/70 to-primary/50">
          <div className="absolute inset-0 bg-[url('/auth-bg.jpg')] bg-cover bg-center mix-blend-overlay opacity-30" />
          <div className="absolute inset-0 flex items-center justify-center p-12">
            <div className="text-white max-w-md text-center">
              <h2 className="text-3xl font-bold mb-4">
                Transform Your Learning Journey
              </h2>
              <p className="text-white/80">
                Access courses, track progress, and achieve your learning goals with our comprehensive LMS platform.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
