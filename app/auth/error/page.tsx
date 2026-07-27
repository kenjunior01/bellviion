import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, AlertTriangle } from "lucide-react"

export default async function Page({
  searchParams,
}: {
  searchParams: Promise<{ error: string }>
}) {
  const params = await searchParams

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <Link
        href="/"
        className="absolute top-6 left-6 flex items-center gap-2 text-gold hover:text-white transition-colors"
      >
        <ArrowLeft className="w-5 h-5" />
        <span className="text-sm">Voltar</span>
      </Link>

      <Card className="bg-black/80 backdrop-blur-xl border border-red-500/30 max-w-md w-full">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center">
            <AlertTriangle className="w-8 h-8 text-red-500" />
          </div>
          <CardTitle className="text-2xl text-white">Algo correu mal</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          {params?.error ? (
            <p className="text-gray-400">Código de erro: {params.error}</p>
          ) : (
            <p className="text-gray-400">Ocorreu um erro não especificado.</p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
