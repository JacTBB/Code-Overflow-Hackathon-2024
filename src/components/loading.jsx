
import { RefreshCw } from "lucide-react";

export default function Loading() {
  return (
    <div className="flex flex-col justify-center items-center h-screen">
      <RefreshCw className="animate-spin size-20 text-destructive-foreground mb-3" />
      <span className=" text-3xl font-semibold">Loading...</span>
    </div>
  )
}