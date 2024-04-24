import { Separator } from "@/components/ui/separator";
import { DataRecord } from "@/types/record";

interface RecordPartsProps {
  record: DataRecord;
}

export function RecordParts({ record }: RecordPartsProps) {
  return (
    <>
      {record.parts.map((part, partIndex) => (
        <div className="flex flex-col gap-y-3 p-3" key={partIndex}>
          <div className="max-w-[75%] px-3 py-2 text-xs text-slate-500 ml-0">
            {part.author}
          </div>
          <div className=" max-w-[75%] gap-2 rounded-lg px-3 py-2 text-sm bg-white">
            {part.body}
          </div>
        </div>
      ))}
    </>
  );
}
