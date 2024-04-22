import { Records } from "@/components/record/Records";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Records: Nectar Console",
};

export default function RecordsPage() {
  return (
    <>
      <div className="flex flex-1 flex-col">
        <div className="w-2/3 mx-auto pt-4">
          <div className="flex flex-row justify-between space-y-1 center h-[44px] pb-5">
            <h2 className="text-lg font-semibold tracking-tight text-slate-700">
              Data
            </h2>
          </div>
        </div>
        <Records />
      </div>
    </>
  );
}
