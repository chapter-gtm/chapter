import { ServerCrash } from "lucide-react";

export function ErrorMessage() {
  return (
    <div className="flex h-[450px] shrink-0 items-center justify-center rounded-md border border-dashed">
      <div className="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
        <ServerCrash />
        <h3 className="mt-4 text-lg font-semibold">Something went wrong</h3>
        <p className="mb-4 mt-2 text-sm text-muted-foreground">
          Please contact support, we&apos;ll sort it out for you!
        </p>
      </div>
    </div>
  );
}
