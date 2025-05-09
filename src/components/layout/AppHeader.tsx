import { Target } from 'lucide-react';

export function AppHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 flex">
          <Target className="h-8 w-8 mr-2 text-primary" />
          <span className="text-2xl font-bold tracking-tight">OKR Tracker</span>
        </div>
        {/* Future navigation items can go here */}
      </div>
    </header>
  );
}
