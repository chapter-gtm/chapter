import { Metadata } from "next";
import { Records } from "@/components/record/Records";

export const metadata: Metadata = {
  title: "Records: Nectar Console",
};

export default function RecordsPage() {
  return (
    <>
      <div className="basis-1/3 flex-1 flex-shrink-0 overflow-hidden me-8">
        <div className="flex inline-block items-center space-x-3">
          <h2 className="text-lg font-semibold tracking-tight text-slate-700">
            Data
          </h2>
        </div>
        <Records />
      </div>
    </>
  );
}
