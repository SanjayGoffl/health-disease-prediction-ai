"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Activity, BrainCircuit, Calendar, ShieldCheck, TrendingUp, UserCheck, Zap, Mic, Download, Bell } from "lucide-react";
import { motion } from "framer-motion";

export default function LandingPage() {
  return (
    <div className="flex flex-col min-h-screen">

      {/* Hero Section */}
      <section className="relative flex-1 flex flex-col items-center justify-center text-center px-4 pt-32 pb-20 overflow-hidden">

        {/* Abstract Background Blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-primary/20 blur-[120px] rounded-full opacity-50 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-accent/20 blur-[100px] rounded-full opacity-40 pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 max-w-4xl mx-auto space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-secondary/80 border border-white/20 backdrop-blur-sm">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
            <span className="text-xs font-medium text-primary uppercase tracking-wide">Now with Voice & PDF Export</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
            Your Lifestyle. <br />
            <span className="text-gradient-primary">Your Health Twin.</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            Understand your body's hidden patterns. Track sleep, stress, and habits to predict your energy levels with AI precision.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Button size="lg" className="h-14 px-8 rounded-full text-lg shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all hover:scale-105" asChild>
              <Link href="/dashboard">
                Start Your Journey <Zap className="ml-2 w-5 h-5 fill-current" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="h-14 px-8 rounded-full text-lg border-2 hover:bg-secondary/50" asChild>
              <Link href="/chat">
                <Mic className="mr-2 w-5 h-5" /> Talk to AI
              </Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="py-20 px-4 bg-secondary/30">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">

          <FeatureCard
            icon={TrendingUp}
            title="Real-time Metrics"
            desc="Input daily stats via tactile sliders. Save your history and track long-term vitality trends."
            color="text-emerald-500"
            delay={0.1}
          />

          <FeatureCard
            icon={BrainCircuit}
            title="Voice & Vision AI"
            desc="Chat naturally with your health twin. Show it photos of your meal or speak your symptoms."
            color="text-indigo-500"
            delay={0.2}
          />

          <FeatureCard
            icon={Download}
            title="Professional Reports"
            desc="Export comprehensive PDF health reports to share with your doctor or fitness coach."
            color="text-amber-500"
            delay={0.3}
          />

          <FeatureCard
            icon={Bell}
            title="Smart Reminders"
            desc="Get subtle nudges to stay hydrated and active directly in your browser."
            color="text-cyan-500"
            delay={0.4}
          />

          <FeatureCard
            icon={Calendar}
            title="Pattern History"
            desc="Zoom out to see monthly trends. Spot correlations between sleep debt and stress."
            color="text-rose-500"
            delay={0.5}
          />

          <FeatureCard
            icon={ShieldCheck}
            title="Private & Secure"
            desc="Your health data stays local on your device. Zero cloud storage of sensitive metrics."
            color="text-slate-500"
            delay={0.6}
          />

        </div>
      </section>

      {/* Trust & Privacy */}
      <section className="py-16 border-t border-border/50">
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className="text-2xl font-bold">Private by Design. Secure by Default.</h2>
          <div className="flex flex-wrap justify-center gap-8 md:gap-16">
            <TrustItem icon={ShieldCheck} text="Encrypted Data" />
            <TrustItem icon={UserCheck} text="No Ads Tracking" />
            <TrustItem icon={Activity} text="Medically Grounded" />
          </div>
        </div>
      </section>

    </div>
  );
}

function FeatureCard({ icon: Icon, title, desc, color, delay }: any) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="glass-panel p-8 rounded-3xl relative overflow-hidden group"
    >
      <div className={`absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity duration-500 ${color}`}>
        <Icon className="w-32 h-32" />
      </div>
      <div className={`w-12 h-12 rounded-2xl flex items-center justify-center bg-white shadow-sm mb-6 ${color}`}>
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="text-xl font-bold mb-3">{title}</h3>
      <p className="text-muted-foreground leading-relaxed">
        {desc}
      </p>
    </motion.div>
  )
}

function TrustItem({ icon: Icon, text }: any) {
  return (
    <div className="flex items-center gap-3 text-muted-foreground font-medium">
      <div className="p-2 bg-secondary rounded-full">
        <Icon className="w-5 h-5" />
      </div>
      {text}
    </div>
  )
}
