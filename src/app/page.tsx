import { Suspense } from "react"
import { redirect } from "next/navigation"
import { StoreRoot } from "@/components/store/store-root"

export default async function Page({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  const params = await searchParams
  if (params.shop && params.hmac) {
    const installUrl = new URL("/api/shopify/oauth", "http://localhost")
    for (const [key, value] of Object.entries(params)) {
      if (typeof value === "string") installUrl.searchParams.set(key, value)
    }
    redirect(`${installUrl.pathname}?${installUrl.searchParams.toString()}`)
  }

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
