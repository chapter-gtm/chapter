import Link from "next/link";
import { Button } from "@/components/ui/button";

interface PageHeaderProps {
  title?: string;
  action?: string;
}

export function PageHeaderRow({ title, action }: PageHeaderProps) {
    return (
        <div className="flex flex-row justify-between space-y-1 items-center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
                {title}
            </h2>
            { action && (
                <Button>{action}</Button>
            )}
        </div>
    );
}
