import { Loader2 } from "lucide-react"

export function LoadingIndicator({ message = "Loading..." }) {
  return (
    <div className="flex flex-col items-center justify-center py-8">
      <Loader2 className="h-8 w-8 text-blue-500 animate-spin mb-4" />
      <p className="text-white text-lg">{message}</p>
    </div>
  )
}
