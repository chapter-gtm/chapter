import Link from "next/link";
import Image from "next/image";

export function Header() {
  return (
    <div className="hidden flex-col md:flex">
      <div className="border-b">
        <div className="flex h-16 items-center px-4">
          <Link href="/">
            <Image
              src="/images/logos/logo.svg"
              width={90}
              height={14}
              alt="Logo"
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
