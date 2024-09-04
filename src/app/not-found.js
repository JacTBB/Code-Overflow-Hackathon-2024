import BottomGradient from "@/components/bottom_gradient";
import HomeIcon from "@/components/home_icon";
import Link from "next/link";

export default function NotFound() {
  return (
    <main className="p-16">
      <div className="max-w-md w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 bg-white">
        <div className="w-full max-w-md space-y-8">
          <h2 className="font-bold text-xl text-neutral-800 dark:text-neutral-200">
            404: Page Not Found
          </h2>
          <div className="flex flex-col space-y-4">
            {/* <span className="text-neutral-700 darK:text-neutral-300-sm">
              Click here to{" "}
              <Link href={"/"} className="font-extrabold">
                Go back to the homepage
              </Link>
            </span> */}
            <Link
              className="relative group/btn flex space-x-2 items-center justify-start px-4 w-full text-black rounded-md h-10 font-medium shadow-input bg-gray-50 dark:bg-zinc-900 dark:shadow-[0px_0px_1px_1px_var(--neutral-800)]"
              type="button"
              href="/"
            >
              <HomeIcon />
              <BottomGradient />
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
