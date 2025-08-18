'use client';

export default function LoadingScreen() {
  return (
    <div className="grid h-screen w-screen place-items-center bg-main-background">
      <div className="flex flex-col items-center gap-3">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-400 border-t-transparent" />
      </div>
    </div>
  );
}
