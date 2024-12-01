import { Separator } from "@/components/ui/separator"
import Image from "next/image"

export default function AccountSettings() {
  return (
    <div className="flex-1 overflow-y-auto">
      asd
      <div className="flex flex-col w-1/2 mx-auto pt-24 pb-20 px-12">
        <div className="flex flex-inline bg-card rounded-xl h-44 justify-center">
          <Image
            src="/images/customIcons/agent.svg"
            width={80}
            height={80}
            alt="Inbox"
            className="py-3"
          />
        </div>
      </div>
    </div>
  )
}
