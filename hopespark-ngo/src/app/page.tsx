import Link from "next/link";
import { HandHeart, ShieldCheck, Zap, Globe } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#FFFBF7] flex flex-col">
      {/* Navigation */}
      <nav className="h-20 px-6 md:px-12 flex items-center justify-between border-b border-[#F3F4F6] bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-[#1D9E75] flex items-center justify-center shadow-lg shadow-[#1D9E75]/20">
            <HandHeart className="text-white w-5 h-5" />
          </div>
          <span className="font-bold text-xl text-[#1A1A19] tracking-tight">HopeSpark</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-sm font-semibold text-[#5F5E5A] hover:text-[#1A1A19] transition-colors">
            Partner Login
          </Link>
          <Button asChild className="bg-[#1D9E75] hover:bg-[#0F6E56] text-white rounded-full px-6">
            <Link href="/apply">Join the Network</Link>
          </Button>
        </div>
      </nav>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="relative pt-20 pb-32 overflow-hidden">
          <div className="max-w-6xl mx-auto px-6 text-center">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#E1F5EE] text-[#085041] text-xs font-bold mb-8 transition-all hover:scale-105">
              <Zap className="w-3 h-3 text-[#1D9E75]" />
              <span className="tracking-widest uppercase">Now live: bridging aid in real-time</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-black text-[#1A1A19] mb-8 leading-[1.1] tracking-tight">
              Small sparks of hope,<br />
              <span className="text-[#1D9E75]">igniting global change.</span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg md:text-xl text-[#5F5E5A] mb-12 leading-relaxed">
              HopeSpark is the first secure, anonymous-first platform connecting verified NGOs directly with children in need. Respond to help requests in real-time.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button asChild size="lg" className="h-14 px-8 text-lg bg-[#1D9E75] hover:bg-[#0F6E56] rounded-2xl shadow-xl shadow-[#1D9E75]/20 transition-all hover:-translate-y-1">
                <Link href="/apply">Get Started as a Partner</Link>
              </Button>
              <Link href="/login" className="text-sm font-bold text-[#1A1A19] hover:underline underline-offset-4">
                Already a partner? Sign In
              </Link>
            </div>
          </div>
          
          {/* Abstract background elements */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 -z-10 w-[1000px] h-[600px] bg-gradient-to-b from-[#E1F5EE]/50 to-transparent blur-3xl rounded-full opacity-50" />
        </section>

        {/* Features / Why HopeSpark */}
        <section className="py-24 bg-white border-y border-[#F3F4F6]">
          <div className="max-w-6xl mx-auto px-6">
            <div className="grid md:grid-cols-3 gap-12">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#EEEDFE] flex items-center justify-center shadow-sm">
                  <ShieldCheck className="text-[#3C3489] w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A19]">Verified & Secure</h3>
                <p className="text-[#5F5E5A] leading-relaxed">
                  Every help request is moderated by AI and human oversight. Contact details are only shared upon explicit consent from the child.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#FEF3C7] flex items-center justify-center shadow-sm">
                  <Zap className="text-[#BA7517] w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A19]">Real-time Response</h3>
                <p className="text-[#5F5E5A] leading-relaxed">
                  Receive instant notifications for help requests within your city. Respond in seconds, deliver aid in hours.
                </p>
              </div>
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#E1F5EE] flex items-center justify-center shadow-sm">
                  <Globe className="text-[#1D9E75] w-6 h-6" />
                </div>
                <h3 className="text-xl font-bold text-[#1A1A19]">Measurable Impact</h3>
                <p className="text-[#5F5E5A] leading-relaxed">
                  Track every delivery and measure your organization's impact with a comprehensive dashboard and real-time analytics.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Stats / Proof */}
        <section className="py-24 bg-[#1D1A3A] text-white">
          <div className="max-w-6xl mx-auto px-6 flex flex-col items-center text-center">
            <h2 className="text-3xl md:text-5xl font-black mb-16 leading-tight">
              A community of care, <br />built on trust.
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-24">
              <div>
                <div className="text-4xl md:text-6xl font-black text-[#1D9E75] mb-2">500+</div>
                <p className="text-white/60 font-medium font-sans">NGO Partners</p>
              </div>
              <div>
                <div className="text-4xl md:text-6xl font-black text-[#7F77DD] mb-2">12k+</div>
                <p className="text-white/60 font-medium font-sans">Children Helped</p>
              </div>
              <div>
                <div className="text-4xl md:text-6xl font-black text-[#E24B4A] mb-2">84%</div>
                <p className="text-white/60 font-medium font-sans">Response Rate</p>
              </div>
              <div>
                <div className="text-4xl md:text-6xl font-black text-white mb-2">24h</div>
                <p className="text-white/60 font-medium font-sans">Avg. Resolution</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-12 border-t border-[#F3F4F6] bg-white">
        <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-lg bg-[#1D9E75] flex items-center justify-center">
              <HandHeart className="text-white w-4 h-4" />
            </div>
            <span className="font-bold text-lg text-[#1A1A19]">HopeSpark NGO Portal</span>
          </div>
          <p className="text-sm text-[#5F5E5A]">© 2024 HopeSpark Foundation. All rights reserved.</p>
          <div className="flex gap-6 text-sm font-semibold text-[#5F5E5A]">
            <Link href="/privacy" className="hover:text-[#1A1A19]">Privacy</Link>
            <Link href="/terms" className="hover:text-[#1A1A19]">Terms</Link>
            <Link href="/contact" className="hover:text-[#1A1A19]">Support</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
