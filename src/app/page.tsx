import { Suspense } from "react"
import { StoreRoot } from "@/components/store/store-root"

export default function Page() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-ink">
          <div className="w-10 h-10 border-4 border-volt/20 border-t-volt rounded-full animate-spin" />
        </div>
      }
    >
      <StoreRoot />
    </Suspense>
  )
}
