import Link from "next/link"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import ChromeIcon from "./chrome_icon"


export default function SignUpComponent() {
    return (
        <div className="flex min-h-[100dvh] flex-col items-center justify-center bg-gradient-to-br from-[#001D2D] to-[#0A1F2F] px-4 py-12 sm:px-6 lg:px-8">
            <div className="w-full max-w-md space-y-8">
                <div>
                    {/* <Image
            src="/placeholder.svg"
            alt="Acme Inc"
            width={48}
            height={48}
            className="mx-auto h-12 w-auto"
            style={{ aspectRatio: "48/48", objectFit: "cover" }}
          /> */}
                    <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-white">Create a new account</h2>
                    <p className="mt-2 text-center text-sm text-white">
                        Or{" "}
                        <Link href="/" className="font-bold text-secondary hover:text-secondary/80">
                            sign in to your account
                        </Link>
                    </p>
                </div>
                <form className="mt-8 space-y-6" action="#" method="POST">
                    <div className="-space-y-px rounded-md shadow-sm">
                        <div className="mb-4">
                            <Label htmlFor="email" className="sr-only">
                                Email address
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                autoComplete="email"
                                required
                                className="relative block w-full rounded-t-md border-0 py-4 px-4 text-white bg-[#0A1F2F] ring-2 ring-inset ring-primary focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Email address"
                            />
                        </div>
                        <div className="mb-4">
                            <Label htmlFor="password" className="sr-only">
                                Password
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="current-password"
                                required
                                className="relative block w-full rounded-b-md border-0 py-4 px-4 text-white bg-[#0A1F2F] ring-2 ring-inset ring-primary focus:z-10 focus:ring-2 focus:ring-primary sm:text-sm sm:leading-6"
                                placeholder="Password"
                            />
                        </div>
                    </div>
                    <div className="flex items-center justify-between">
                        <div className="flex items-center">
                            <Checkbox id="remember-me" name="remember-me" className="text-white w-4 h-4" />
                            <Label htmlFor="remember-me" className="ml-2 text-sm font-medium leading-none text-white">
                                Remember me
                            </Label>
                        </div>
                        <div className="text-sm">
                            <Link href="/forgot" className="font-medium text-secondary hover:text-secondary/80" prefetch={false}>
                                Forgot your password?
                            </Link>
                        </div>
                    </div>
                    <div>
                        <Button
                            type="submit"
                            className="group relative flex w-full justify-center rounded-md bg-primary py-3 px-4 text-sm font-semibold text-primary-foreground shadow-sm hover:bg-primary/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
                            href="/signup"
                        >
                            Sign up
                        </Button>
                    </div>
                </form>
                <Link className="flex bg-white rounded-md" href="/signinGoogle">
                    <Button variant="outline" className="w-full py-3 flex items-center justify-center">
                        <ChromeIcon className="mr-2 h-5 w-5" />
                        <div>
                            Sign up with Google
                        </div>
                    </Button>
                </Link>
            </div>
        </div>
    )
}
