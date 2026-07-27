"use client"

import type React from "react"
import { useState } from "react"
import { motion } from "framer-motion"
import { Loader2, CheckCircle, AlertCircle, ShieldCheck, Users, RefreshCw } from "lucide-react"
import Link from "next/link"

export default function SetupPage() {
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle")
  const [message, setMessage] = useState("")
  const [step, setStep] = useState(0)
  const [logs, setLogs] = useState<string[]>([])

  const addLog = (log: string) => {
    setLogs((prev) => [...prev, `[${new Date().toLocaleTimeString()}] ${log}`])
  }

  const runSetup = async () => {
    setStatus("loading")
    setStep(1)
    setMessage("A configurar sistema...")
    setLogs([])

    try {
      addLog("A verificar API...")

      // First check if API is reachable
      const healthCheck = await fetch("/api/auth/setup", { method: "GET" })
      if (!healthCheck.ok) {
        throw new Error("API não disponível")
      }
      addLog("API disponível!")

      addLog("A criar utilizador admin...")

      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          action: "create",
          email: "admin@bellviion.site",
          password: "Sarent0305",
        }),
      })

      const data = await response.json()
      addLog(`Resposta: ${JSON.stringify(data)}`)

      if (!response.ok && !data.exists) {
        throw new Error(data.error || "Erro ao criar utilizador")
      }

      if (data.exists) {
        addLog("Utilizador já existe!")
        setStep(2)
        addLog("A fazer login automático...")

        const loginResponse = await fetch("/api/auth/setup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "login",
            email: "admin@bellviion.site",
            password: "Sarent0305",
          }),
        })

        const loginData = await loginResponse.json()
        addLog(`Login resposta: ${JSON.stringify(loginData)}`)

        if (loginResponse.ok && loginData.success) {
          addLog("Login efectuado!")
          setStep(3)
          setMessage("Login efectuado! A redirecionar...")
          setStatus("success")
          setTimeout(() => {
            window.location.href = "/admin"
          }, 1500)
          return
        } else {
          throw new Error(loginData.error || "Erro no login")
        }
      }

      addLog("Utilizador admin criado!")
      setStep(2)
      addLog("Permissões configuradas!")
      setStep(3)
      setMessage("Setup completo! Pode fazer login agora.")
      setStatus("success")
      addLog("Setup concluído com sucesso!")
    } catch (error) {
      setStatus("error")
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setMessage(errorMessage)
      addLog(`ERRO: ${errorMessage}`)
    }
  }

  const tryDirectLogin = async () => {
    setStatus("loading")
    setMessage("A tentar login...")
    setLogs([])

    try {
      addLog("A verificar conexão...")

      const response = await fetch("/api/auth/setup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "login",
          email: "admin@bellviion.site",
          password: "Sarent0305",
        }),
      })

      const data = await response.json()
      addLog(`Resposta: ${JSON.stringify(data)}`)

      if (!response.ok) {
        throw new Error(data.error || "Erro no login")
      }

      addLog("Login bem sucedido!")
      setMessage("Login efectuado! A redirecionar...")
      setStatus("success")

      setTimeout(() => {
        window.location.href = "/admin"
      }, 1500)
    } catch (error) {
      setStatus("error")
      const errorMessage = error instanceof Error ? error.message : "Erro desconhecido"
      setMessage(errorMessage)
      addLog(`ERRO: ${errorMessage}`)
    }
  }

  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-light text-gold mb-2">BELLVION Setup</h1>
          <p className="text-gray-400">Configuração inicial da plataforma</p>
        </div>

        <div className="bg-gray-900 border border-gray-800 rounded-xl p-6 space-y-6">
          {/* Steps */}
          <div className="space-y-4">
            <SetupStep
              number={1}
              title="Criar Utilizador Admin"
              description="admin@bellviion.site"
              icon={<Users className="w-4 h-4" />}
              status={step >= 1 ? (step > 1 ? "done" : status === "loading" ? "loading" : "pending") : "pending"}
            />
            <SetupStep
              number={2}
              title="Configurar Permissões"
              description="Super Admin"
              icon={<ShieldCheck className="w-4 h-4" />}
              status={step >= 2 ? (step > 2 ? "done" : status === "loading" ? "loading" : "pending") : "pending"}
            />
            <SetupStep
              number={3}
              title="Finalizar Setup"
              description="Pronto para usar"
              icon={<CheckCircle className="w-4 h-4" />}
              status={step >= 3 ? "done" : "pending"}
            />
          </div>

          {/* Logs */}
          {logs.length > 0 && (
            <div className="bg-black/50 rounded-lg p-3 max-h-40 overflow-y-auto">
              {logs.map((log, i) => (
                <p key={i} className="text-xs text-gray-400 font-mono break-all">
                  {log}
                </p>
              ))}
            </div>
          )}

          {/* Status Message */}
          {message && (
            <div
              className={`p-4 rounded-lg flex items-center gap-3 ${
                status === "error"
                  ? "bg-red-500/10 border border-red-500/30 text-red-400"
                  : status === "success"
                    ? "bg-green-500/10 border border-green-500/30 text-green-400"
                    : "bg-gold/10 border border-gold/30 text-gold"
              }`}
            >
              {status === "loading" && <Loader2 className="w-5 h-5 animate-spin flex-shrink-0" />}
              {status === "success" && <CheckCircle className="w-5 h-5 flex-shrink-0" />}
              {status === "error" && <AlertCircle className="w-5 h-5 flex-shrink-0" />}
              <span className="text-sm">{message}</span>
            </div>
          )}

          {/* Action Buttons */}
          {status === "idle" && (
            <div className="space-y-3">
              <button
                onClick={runSetup}
                className="w-full py-4 bg-gold text-black font-medium rounded-lg hover:bg-white transition-colors flex items-center justify-center gap-2"
              >
                <ShieldCheck className="w-5 h-5" />
                Criar Novo Admin
              </button>
              <button
                onClick={tryDirectLogin}
                className="w-full py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <Users className="w-4 h-4" />
                Tentar Login Directo
              </button>
            </div>
          )}

          {status === "loading" && (
            <div className="text-center py-4">
              <Loader2 className="w-8 h-8 text-gold animate-spin mx-auto" />
              <p className="text-gray-400 text-sm mt-2">A processar...</p>
            </div>
          )}

          {status === "success" && (
            <a
              href="/admin"
              className="block w-full py-4 bg-gold text-black font-medium rounded-lg hover:bg-white transition-colors text-center"
            >
              Ir para Admin
            </a>
          )}

          {status === "error" && (
            <div className="space-y-3">
              <button
                onClick={() => {
                  setStatus("idle")
                  setStep(0)
                  setMessage("")
                  setLogs([])
                }}
                className="w-full py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors flex items-center justify-center gap-2"
              >
                <RefreshCw className="w-4 h-4" />
                Tentar Novamente
              </button>
              <Link
                href="/auth/login"
                className="block w-full py-3 border border-gold/30 text-gold rounded-lg hover:bg-gold/10 transition-colors text-center"
              >
                Ir para Login Manual
              </Link>
            </div>
          )}
        </div>

        {/* Credentials Info */}
        <div className="mt-6 p-4 bg-gray-900/50 border border-gold/20 rounded-lg">
          <h3 className="text-sm font-medium text-gold mb-2">Credenciais de Admin:</h3>
          <div className="space-y-1 text-xs text-gray-400">
            <p>
              <span className="text-gray-500">Email:</span> admin@bellviion.site
            </p>
            <p>
              <span className="text-gray-500">Senha:</span> Sarent0305
            </p>
          </div>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-gold/60 hover:text-gold text-sm">
            ← Voltar à página inicial
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

function SetupStep({
  number,
  title,
  description,
  icon,
  status,
}: {
  number: number
  title: string
  description: string
  icon: React.ReactNode
  status: "pending" | "loading" | "done"
}) {
  return (
    <div
      className={`flex items-center gap-4 p-3 rounded-lg transition-colors ${
        status === "done" ? "bg-green-500/10" : status === "loading" ? "bg-gold/10" : "bg-gray-800/50"
      }`}
    >
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          status === "done"
            ? "bg-green-500 text-white"
            : status === "loading"
              ? "bg-gold text-black"
              : "bg-gray-700 text-gray-400"
        }`}
      >
        {status === "loading" ? (
          <Loader2 className="w-4 h-4 animate-spin" />
        ) : status === "done" ? (
          <CheckCircle className="w-4 h-4" />
        ) : (
          icon
        )}
      </div>
      <div>
        <p
          className={`font-medium ${
            status === "done" ? "text-green-400" : status === "loading" ? "text-gold" : "text-gray-300"
          }`}
        >
          {title}
        </p>
        <p className="text-xs text-gray-500">{description}</p>
      </div>
    </div>
  )
}
