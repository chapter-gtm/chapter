import clsx from "clsx";

export default function EmojiHeader({ status }: { status: string }) {
  return (
    <div className="flex flex-row items-center gap-x-3 px-6 my-6">
      <div className="">
        <span
          className={clsx(
            " flex justify-center items-center w-12 h-12 rounded-lg border border-slate-200 text-center text-xl",
            {
              "bg-gray-100": status === "Thread",
              "bg-yellow-100": status === "Welcome",
              "bg-green-100": status === "Thanks",
            }
          )}
        >
          {status === "Thanks" ? "🙏" : status === "Thread" ? "🌊" : "💬"}
        </span>
      </div>
      <div className="text-base font-medium text-slate-700">{status}</div>
    </div>
  );
}
