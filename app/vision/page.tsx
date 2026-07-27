"use client"

import { motion } from "framer-motion"
import BackButton from "@/components/BackButton"

export default function VisionPage() {
  return (
    <div className="min-h-screen bg-black text-white">
      <BackButton />

      {/* Hero Section */}
      <section className="pt-24 min-h-screen flex items-center justify-center">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.h1
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-5xl md:text-7xl font-light tracking-wide mb-8"
          >
            Nossa <span className="text-gold">Visão</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-xl md:text-2xl font-light leading-relaxed text-gray-300"
          >
            Transcender os limites do luxo através da inovação e da arte
          </motion.p>
        </div>
      </section>

      {/* Story Sections */}
      <section className="py-20">
        <div className="max-w-6xl mx-auto px-6">
          {/* Section 1: Origins */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-16 items-center mb-32"
          >
            <div className="space-y-8">
              <h2 className="text-4xl font-light tracking-wide">
                Igualdade através da <span className="text-gold">Excelência</span>
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Na BELLVION, acreditamos que o verdadeiro luxo não é sobre exclusão, mas sobre elevar cada indivíduo ao
                seu potencial máximo. Cada peça é criada para empoderar, não para dividir.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Nossa missão é democratizar a excelência, tornando o extraordinário acessível àqueles que valorizam a
                verdadeira qualidade e artesanato.
              </p>
            </div>
            <div className="relative">
              <motion.div
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(203, 161, 53, 0.3)",
                    "0 0 40px rgba(203, 161, 53, 0.5)",
                    "0 0 20px rgba(203, 161, 53, 0.3)",
                  ],
                }}
                transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY }}
                className="w-full h-96 bg-gradient-to-br from-gold/20 to-transparent rounded-lg glow"
              />
            </div>
          </motion.div>

          {/* Section 2: Philosophy */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="grid md:grid-cols-2 gap-16 items-center mb-32"
          >
            <div className="relative order-2 md:order-1">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 8, repeat: Number.POSITIVE_INFINITY }}
                className="w-full h-96 bg-gradient-to-tl from-white/10 to-gold/20 rounded-lg"
              />
            </div>
            <div className="space-y-8 order-1 md:order-2">
              <h2 className="text-4xl font-light tracking-wide">
                O <span className="text-gold">Poder</span> da Transformação
              </h2>
              <p className="text-lg leading-relaxed text-gray-300">
                Cada criação BELLVION carrega consigo o poder de transformar não apenas a aparência, mas a essência de
                quem a usa. Acreditamos que o verdadeiro luxo reside na capacidade de inspirar mudança.
              </p>
              <p className="text-lg leading-relaxed text-gray-300">
                Através do design inovador e da qualidade incomparável, criamos peças que se tornam extensões da
                personalidade, amplificando a confiança e a individualidade.
              </p>
            </div>
          </motion.div>

          {/* Section 3: Legacy */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 1 }}
            className="text-center space-y-12"
          >
            <h2 className="text-5xl font-light tracking-wide">
              Construindo <span className="text-gold">Legados</span>
            </h2>
            <div className="max-w-4xl mx-auto">
              <p className="text-xl leading-relaxed text-gray-300 mb-8">
                O nosso compromisso vai além da criação de produtos excepcionais. Estamos construindo um legado que
                transcende gerações, onde cada peça conta uma história única e atemporal.
              </p>
              <motion.div
                animate={{
                  scale: [1, 1.05, 1],
                  opacity: [0.7, 1, 0.7],
                }}
                transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
                className="text-6xl font-serif text-gold mb-12"
              >
                ∞
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <h3 className="text-3xl font-light tracking-wide">Pronto para Fazer Parte?</h3>
            <p className="text-lg text-gray-300">
              Junte-se ao círculo exclusivo BELLVION e descubra um mundo onde o luxo encontra o propósito.
            </p>
            <a
              href="/circle"
              className="inline-block px-12 py-4 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm luxury-hover"
            >
              Entrar no Círculo
            </a>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
