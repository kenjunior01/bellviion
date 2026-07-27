"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Crown, Infinity, Star, Lock, Gift, Users, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

const membershipTiers = [
  {
    id: "visionary",
    name: "Visionário",
    icon: Star,
    color: "from-amber-500 to-amber-600",
    description: "Acesso à visão da marca",
    price: "Convite",
    benefits: [
      "Acesso a coleções exclusivas",
      "Newsletter mensal curada",
      "5% de desconto em compras",
      "Acesso a eventos virtuais",
    ],
  },
  {
    id: "eternal",
    name: "Eterno",
    icon: Infinity,
    color: "from-yellow-400 to-amber-500",
    description: "Experiência hiper-personalizada",
    price: "Convite",
    benefits: [
      "Tudo do Visionário, mais:",
      "Serviço de concierge dedicado",
      "10% de desconto permanente",
      "Previews antecipadas (48h)",
      "Coleções limitadas exclusivas",
      "Convites para eventos presenciais",
    ],
  },
  {
    id: "legendary",
    name: "Lendário",
    icon: Crown,
    color: "from-yellow-300 to-yellow-500",
    description: "O topo da exclusividade",
    price: "Convite",
    benefits: [
      "Tudo do Eterno, mais:",
      "Consultoria de estilo pessoal",
      "15% de desconto permanente",
      "Pré-acesso (72h antes)",
      "Peças personalizadas sob encomenda",
      "Acesso a eventos e experiências VIP",
      "Suporte prioritário 24/7",
    ],
  },
]

interface CircleMembershipProps {
  onApply?: () => void
}

export function CircleMembershipSystem({ onApply }: CircleMembershipProps) {
  const [selectedTier, setSelectedTier] = useState<string | null>(null)

  return (
    <div className="space-y-16">
      {/* Introduction */}
      <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} className="text-center space-y-6">
        <h2 className="text-4xl md:text-5xl font-light tracking-wide">O Círculo BELLVION</h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Uma comunidade de visionários que partilham a paixão pela excelência, inovação e exclusividade. Cada membro
          contribui para a evolução contínua da marca.
        </p>
        <p className="text-gold text-sm tracking-widest">ONDE VISÕES SE ENCONTRAM E LEGADOS NASCEM</p>
      </motion.div>

      {/* Membership Tiers */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {membershipTiers.map((tier, index) => {
          const Icon = tier.icon
          const isSelected = selectedTier === tier.id

          return (
            <motion.div
              key={tier.id}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              whileHover={{ y: -10 }}
              className="cursor-pointer"
              onClick={() => setSelectedTier(isSelected ? null : tier.id)}
            >
              <Card
                className={`relative h-full border-2 transition-all duration-500 ${
                  isSelected ? `border-gold bg-gray-900/80` : `border-gold/30 bg-gray-900/50 hover:border-gold/50`
                }`}
              >
                {/* Glow Effect */}
                {isSelected && (
                  <motion.div
                    layoutId="selectedGlow"
                    className="absolute inset-0 bg-gradient-to-br from-gold/20 to-transparent rounded-lg pointer-events-none"
                  />
                )}

                <div className="p-8 space-y-6 relative z-10 flex flex-col h-full">
                  {/* Header */}
                  <div className="space-y-3">
                    <div className={`w-12 h-12 rounded-full bg-gradient-to-br ${tier.color} flex items-center justify-center`}>
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <h3 className="text-2xl font-light tracking-wide">{tier.name}</h3>
                    <p className="text-gold text-sm">{tier.description}</p>
                  </div>

                  {/* Benefits */}
                  <div className="flex-1 space-y-3">
                    {tier.benefits.map((benefit, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <Gift className="w-4 h-4 text-gold mt-1 flex-shrink-0" />
                        <p className="text-gray-300 text-sm leading-relaxed">{benefit}</p>
                      </div>
                    ))}
                  </div>

                  {/* Price */}
                  <div className="pt-4 border-t border-gold/20">
                    <p className="text-gold font-light text-lg tracking-wider">{tier.price}</p>
                  </div>
                </div>
              </Card>
            </motion.div>
          )
        })}
      </div>

      {/* Expanded Details */}
      {selectedTier && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="border border-gold/20 rounded-lg p-8 bg-gradient-to-br from-gray-900/50 to-black/50 space-y-6"
        >
          <h3 className="text-2xl font-light tracking-wide text-gold">
            Detalhes do Tier {membershipTiers.find((t) => t.id === selectedTier)?.name}
          </h3>

          <div className="grid md:grid-cols-2 gap-8">
            {/* Left Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-gold font-light mb-3 tracking-wider">O QUE VOCÊ RECEBE</h4>
                <ul className="space-y-2">
                  {membershipTiers
                    .find((t) => t.id === selectedTier)
                    ?.benefits.map((benefit, i) => (
                      <li key={i} className="flex items-center gap-2 text-gray-300">
                        <Star className="w-4 h-4 text-gold" />
                        {benefit}
                      </li>
                    ))}
                </ul>
              </div>
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              <div>
                <h4 className="text-gold font-light mb-3 tracking-wider">PERKS EXCLUSIVOS</h4>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center gap-2">
                    <Users className="w-4 h-4 text-gold" />
                    Comunidade privada de membros
                  </li>
                  <li className="flex items-center gap-2">
                    <Lock className="w-4 h-4 text-gold" />
                    Acesso a conteúdos restringidos
                  </li>
                  <li className="flex items-center gap-2">
                    <ArrowRight className="w-4 h-4 text-gold" />
                    Influência nas futuras coleções
                  </li>
                </ul>
              </div>

              <Button
                onClick={onApply}
                className="w-full bg-gold text-black hover:bg-gold/90 py-6 font-light tracking-wider"
              >
                CANDIDATAR-SE AGORA
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      {/* How It Works */}
      <motion.div initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} className="bg-gray-900/50 border border-gold/20 rounded-lg p-8 space-y-6">
        <h3 className="text-2xl font-light tracking-wide">COMO FUNCIONA</h3>
        <div className="grid md:grid-cols-4 gap-6">
          {[
            { step: "1", title: "Candidatura", desc: "Preencha o formulário e conte-nos a sua visão" },
            { step: "2", title: "Revisão", desc: "Nossa equipa analisa a sua candidatura" },
            { step: "3", title: "Aprovação", desc: "Seja aceite na comunidade do Círculo" },
            { step: "4", title: "Acesso", desc: "Desfrute de benefícios exclusivos imediatamente" },
          ].map((item, i) => (
            <div key={i} className="text-center space-y-3">
              <div className="w-10 h-10 rounded-full bg-gold/20 border border-gold flex items-center justify-center mx-auto">
                <span className="text-gold font-bold">{item.step}</span>
              </div>
              <h4 className="font-light text-gold">{item.title}</h4>
              <p className="text-gray-400 text-sm">{item.desc}</p>
            </div>
          ))}
        </div>
      </motion.div>

      {/* CTA */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="text-center space-y-6 py-12 border-y border-gold/20"
      >
        <h2 className="text-3xl md:text-4xl font-light tracking-wide">Pronto para Ascender?</h2>
        <p className="text-gray-300 max-w-2xl mx-auto">
          Junte-se a uma comunidade global de visionários que definem o padrão de luxo moderno.
        </p>
        <Button onClick={onApply} className="bg-gold text-black hover:bg-gold/90 px-12 py-6 font-light tracking-wider">
          CANDIDATAR-SE AO CÍRCULO
        </Button>
      </motion.div>
    </div>
  )
}
