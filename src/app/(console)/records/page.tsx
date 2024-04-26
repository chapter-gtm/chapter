import { Records } from "@/components/record/Records";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Records: Nectar Console",
};

export default function RecordsPage() {
  return (
    <>
      <div className="flex flex-col mt-3 px-4">
        <div className="bg-white rounded-lg flex-col">
          <Records />
        </div>
      </div>
    </>
  );
}
