import { OctagonX } from "lucide-react";
import Link from "next/link";

import BottomGradient from "./bottom_gradient";
import HomeIcon from "./home_icon";

export default function LoadingError() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <OctagonX className="size-20 text-destructive-foreground mb-3" />
      <span className="text-3xl font-semibold">Something went wrong.</span>

      <Link
        className="relative group/btn flex space-x-2 items-center justify-start px-4 w-40 my-8 text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
        type="button"
        href="/"
      >
        <HomeIcon />
        <BottomGradient />
      </Link>
    </div>
  );
}
