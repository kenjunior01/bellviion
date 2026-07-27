"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import Link from "next/link"
import { ArrowLeft, Users, Star, Shield, Zap, Crown, CheckCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useLanguage } from "@/contexts/LanguageContext"
import LanguageSelector from "@/components/LanguageSelector"

export default function InfluencerPage() {
  const { t } = useLanguage()
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    instagram: "",
    followers: "",
    niche: "",
    experience: "",
    contentStrategy: "",
    portfolio: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch("/api/submit-influencer", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          type: "influencer_application",
        }),
      })

      if (response.ok) {
        setSubmitted(true)
      }
    } catch (error) {
      console.error("Error submitting application:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  if (submitted) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center max-w-2xl mx-auto px-6">
          <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="space-y-8">
            <div className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center mx-auto mb-8">
              <CheckCircle className="w-8 h-8 text-gold" />
            </div>
            <h1 className="text-4xl font-light tracking-wide mb-6">Application Submitted</h1>
            <p className="text-xl text-gold mb-4">{t("influencer.contactMessage")}</p>
            <p className="text-gray-300">{t("influencer.reviewMessage")}</p>
            <Link
              href="/"
              className="inline-block mt-8 px-8 py-3 border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm"
            >
              {t("common.return")} Home
            </Link>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 p-6 bg-black/80 backdrop-blur-sm">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Link href="/" className="flex items-center space-x-2 text-gold hover:text-white transition-colors">
            <ArrowLeft className="w-5 h-5" />
            <span>{t("common.return")}</span>
          </Link>
          <Link href="/" className="text-2xl font-light tracking-wider">
            <span className="text-gold">BV</span>
          </Link>
          <LanguageSelector />
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 pb-16">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="space-y-8"
          >
            <div className="flex justify-center mb-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 20, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                className="w-24 h-24 border-2 border-gold rounded-full flex items-center justify-center"
              >
                <Users className="w-8 h-8 text-gold" />
              </motion.div>
            </div>

            <h1 className="text-5xl md:text-7xl font-light tracking-wide">{t("influencer.title")}</h1>
            <p className="text-xl md:text-2xl font-light text-gold">{t("influencer.subtitle")}</p>
            <p className="text-lg text-gray-300 leading-relaxed max-w-3xl mx-auto">{t("influencer.description")}</p>
          </motion.div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gradient-to-b from-black to-gray-900">
        <div className="max-w-6xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl font-light tracking-wide text-gold mb-8">{t("influencer.why")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { icon: <Star className="w-8 h-8" />, text: t("influencer.benefit1") },
              { icon: <Crown className="w-8 h-8" />, text: t("influencer.benefit2") },
              { icon: <Shield className="w-8 h-8" />, text: t("influencer.benefit3") },
              { icon: <Zap className="w-8 h-8" />, text: t("influencer.benefit4") },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.8 }}
                className="text-center p-6 bg-gray-900/50 rounded-lg border border-gold/20 hover:border-gold/50 transition-all duration-300"
              >
                <div className="text-gold mb-4 flex justify-center">{benefit.icon}</div>
                <p className="text-gray-300 leading-relaxed">{benefit.text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Requirements Section */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light tracking-wide text-gold mb-8">{t("influencer.requirements")}</h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {[t("influencer.req1"), t("influencer.req2"), t("influencer.req3"), t("influencer.req4")].map(
              (req, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.8 }}
                  className="flex items-start space-x-4 p-4 bg-gray-900/30 rounded-lg"
                >
                  <CheckCircle className="w-6 h-6 text-gold flex-shrink-0 mt-1" />
                  <p className="text-gray-300 leading-relaxed">{req}</p>
                </motion.div>
              ),
            )}
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section className="py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-3xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 1 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-light tracking-wide text-gold mb-4">{t("influencer.application")}</h2>
          </motion.div>

          <motion.form
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 1 }}
            onSubmit={handleSubmit}
            className="space-y-8"
          >
            {/* Personal Information */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm tracking-wide text-gray-300">
                  {t("influencer.fullName")} *
                </Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white"
                  placeholder={t("common.name")}
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm tracking-wide text-gray-300">
                  {t("influencer.email")} *
                </Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white"
                  placeholder={t("common.emailPlaceholder")}
                  required
                />
              </div>
            </div>

            {/* Social Media */}
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="instagram" className="text-sm tracking-wide text-gray-300">
                  {t("influencer.instagram")} *
                </Label>
                <Input
                  id="instagram"
                  value={formData.instagram}
                  onChange={(e) => setFormData({ ...formData, instagram: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white"
                  placeholder="@yourusername"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="followers" className="text-sm tracking-wide text-gray-300">
                  {t("influencer.followers")} *
                </Label>
                <Input
                  id="followers"
                  value={formData.followers}
                  onChange={(e) => setFormData({ ...formData, followers: e.target.value })}
                  className="bg-transparent border-gray-600 focus:border-gold text-white"
                  placeholder="10,000"
                  required
                />
              </div>
            </div>

            {/* Content Niche */}
            <div className="space-y-2">
              <Label htmlFor="niche" className="text-sm tracking-wide text-gray-300">
                {t("influencer.niche")} *
              </Label>
              <Select onValueChange={(value) => setFormData({ ...formData, niche: value })}>
                <SelectTrigger className="bg-transparent border-gray-600 focus:border-gold text-white">
                  <SelectValue placeholder={t("influencer.selectNiche")} />
                </SelectTrigger>
                <SelectContent className="bg-gray-900 border-gray-600">
                  <SelectItem value="fashion">{t("influencer.fashion")}</SelectItem>
                  <SelectItem value="luxury">{t("influencer.luxury")}</SelectItem>
                  <SelectItem value="lifestyle">{t("influencer.lifestyle")}</SelectItem>
                  <SelectItem value="beauty">{t("influencer.beauty")}</SelectItem>
                  <SelectItem value="travel">{t("influencer.travel")}</SelectItem>
                  <SelectItem value="other">{t("influencer.other")}</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Experience */}
            <div className="space-y-2">
              <Label htmlFor="experience" className="text-lg font-light tracking-wide">
                {t("influencer.experience")} *
              </Label>
              <p className="text-sm text-gray-400 mb-4">{t("influencer.experienceDesc")}</p>
              <Textarea
                id="experience"
                value={formData.experience}
                onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                placeholder={t("influencer.experiencePlaceholder")}
                required
              />
            </div>

            {/* Content Strategy */}
            <div className="space-y-2">
              <Label htmlFor="contentStrategy" className="text-lg font-light tracking-wide">
                {t("influencer.content")} *
              </Label>
              <p className="text-sm text-gray-400 mb-4">{t("influencer.contentDesc")}</p>
              <Textarea
                id="contentStrategy"
                value={formData.contentStrategy}
                onChange={(e) => setFormData({ ...formData, contentStrategy: e.target.value })}
                className="bg-transparent border-gray-600 focus:border-gold text-white min-h-32"
                placeholder={t("influencer.contentPlaceholder")}
                required
              />
            </div>

            {/* Portfolio */}
            <div className="space-y-2">
              <Label htmlFor="portfolio" className="text-lg font-light tracking-wide">
                {t("influencer.portfolio")}
              </Label>
              <p className="text-sm text-gray-400 mb-4">{t("influencer.portfolioDesc")}</p>
              <Textarea
                id="portfolio"
                value={formData.portfolio}
                onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                className="bg-transparent border-gray-600 focus:border-gold text-white min-h-24"
                placeholder={t("influencer.portfolioPlaceholder")}
              />
            </div>

            {/* Submit */}
            <div className="text-center pt-8">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="px-16 py-4 bg-transparent border border-gold text-gold hover:bg-gold hover:text-black transition-all duration-500 tracking-widest text-sm disabled:opacity-50"
              >
                {isSubmitting ? "SUBMITTING..." : t("influencer.submit")}
              </Button>

              <div className="mt-8 p-6 bg-gray-900 rounded-lg">
                <p className="text-lg font-light text-gold mb-2">"{t("influencer.contactMessage")}"</p>
                <p className="text-sm text-gray-400 leading-relaxed">{t("influencer.reviewMessage")}</p>
              </div>
            </div>
          </motion.form>
        </div>
      </section>
    </div>
  )
}
