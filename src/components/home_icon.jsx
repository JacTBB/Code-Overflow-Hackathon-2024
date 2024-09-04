import { IconHome } from "@tabler/icons-react";

export default function HomeIcon(){
  return(
    <>
      <IconHome className="h-4 w-4 text-neutral-800 dark:text-neutral-300" />
      <span className="text-neutral-700 dark:text-neutral-300 text-sm">
      Back to Home
      </span>
    </>
  )
}