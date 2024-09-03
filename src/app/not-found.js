import Link from "next/link";

export default function Custom404() {
  return (
    <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-br from-[#001D2D] to-[#0A1F2F] px-4 py-12 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <h2 className="text-center text-3xl font-bold tracking-tight text-white">404: Page Not Found</h2>
        <div className="text-md text-center text-white">
          Click here to <Link href={"/"} className="font-extrabold">Go back to the homepage</Link>
        </div>
      </div>
    </div>
  )
}