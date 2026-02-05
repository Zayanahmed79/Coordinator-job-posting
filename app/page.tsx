import Link from "next/link"
import { Facebook, Instagram, Linkedin, ArrowUpRight, FileText, ShieldCheck } from "lucide-react"
import { JobsList } from "@/components/jobs-list"
import { Navbar } from "@/components/navbar"
import { FAQSection } from "@/components/faq-section"

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar />

      {/* Hero */}
      <section className="bg-[#D8D1C1] pt-16 lg:pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-8 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="order-2 lg:order-1 text-center lg:text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-tight tracking-tight max-w-2xl mx-auto lg:mx-0 wrap-break-word">
              Find your next
              <br />
              <span className="text-foreground">career opportunity.</span>
            </h1>
            <p className="mt-6 text-muted-foreground text-lg max-w-xl leading-relaxed mx-auto lg:mx-0">
              Browse curated job listings from top companies—so you can find the perfect role, advance your career, and achieve your professional goals.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center lg:justify-start gap-4">
              <Link
                href="#jobs"
                className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-full hover:bg-[#e06610] transition-colors"
              >
                Browse All Jobs
              </Link>
            </div>
          </div>
          <div className="order-1 lg:order-2">
            <img 
              src="/hero.png" 
              alt="Professional career growth" 
              className="z-10 w-full h-auto max-w-lg mx-auto drop-shadow-2xl"
            />
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section id="why-were-better" className="bg-white py-20 border-y border-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-start">
            <div>
              <h2 className="text-4xl md:text-5xl lg:text-7xl font-normal text-foreground leading-[1.1] mb-8">
                Why your career
                <br />
                starts right here
              </h2>
              <p className="text-xl text-muted-foreground leading-relaxed max-w-xl">
                We're not just another job board. We bridge the gap between talented professionals and companies that truly value them, providing a streamlined path to your next big milestone.
              </p>
            </div>

            <div className="space-y-12 lg:pt-4">
              <div className="flex gap-6">
                <div className="mt-1 shrink-0">
                  <ArrowUpRight className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Vetted Opportunities</h3>
                  <p className="text-lg text-muted-foreground">
                    Discover high-growth roles from industry-leading companies, thoroughly vetted to ensure culture fit and competitive pay.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="mt-1 shrink-0">
                  <FileText className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Direct Applications</h3>
                  <p className="text-lg text-muted-foreground">
                    Skip the middleman. Your applications go directly to hiring managers, significantly speeding up the selection process.
                  </p>
                </div>
              </div>

              <div className="flex gap-6">
                <div className="mt-1 shrink-0">
                  <ShieldCheck className="text-primary w-8 h-8" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-foreground mb-2">Career Advancement</h3>
                  <p className="text-lg text-muted-foreground">
                    We focus on roles that offer clear professional development and opportunities to master new technologies and leadership.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="bg-card py-24">
        <div className="max-w-7xl mx-auto px-6 md:px-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
            <div>
              <h2 className="text-3xl font-semibold text-foreground">Latest Openings</h2>
              <p className="mt-2 text-muted-foreground">Find the role that matches your ambition.</p>
            </div>
          
          </div>
          <JobsList />
        </div>
      </section>

      {/* How it Works Section */}
      <section id="how-it-works" className="bg-white py-24 border-t border-muted/20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-semibold text-foreground mb-4">How it works</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              A simple, streamlined process to connect you with the support you need.
            </p>
          </div>

          <div className="relative">
            {/* Connection Lines (Desktop) */}
            <div className="hidden md:flex absolute top-12 left-0 w-full justify-around items-center px-24 z-0">
              <div className="h-0.5 w-full bg-primary/20 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-10 border-l-primary/40"></div>
              </div>
              <div className="w-48"></div> {/* Gap for the middle circle */}
              <div className="h-0.5 w-full bg-primary/20 relative">
                <div className="absolute right-0 top-1/2 -translate-y-1/2 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-l-10 border-l-primary/40"></div>
              </div>
            </div>

            <div className="grid md:grid-cols-3 gap-12 relative z-10">
              {/* Step 1 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-semibold text-primary mb-8 bg-white shadow-sm">
                  1
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 px-4">Discover</h3>
                <p className="text-muted-foreground leading-relaxed px-2">
                  Browse our exclusively curated list of high-growth roles and innovative companies.
                </p>
              </div>

              {/* Step 2 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-semibold text-primary mb-8 bg-white shadow-sm">
                  2
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 px-4">Apply with ease</h3>
                <p className="text-muted-foreground leading-relaxed px-2">
                  No complex portals. Apply directly with your profile or resume in just a few clicks.
                </p>
              </div>

              {/* Step 3 */}
              <div className="flex flex-col items-center text-center">
                <div className="w-24 h-24 rounded-full border-2 border-primary flex items-center justify-center text-3xl font-semibold text-primary mb-8 bg-white shadow-sm">
                  3
                </div>
                <h3 className="text-xl font-bold text-foreground mb-4 px-4">Scale up</h3>
                <p className="text-muted-foreground leading-relaxed px-2">
                  Interact directly with teams and start your journey toward professional excellence.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-[#0B1C53] py-20 overflow-hidden relative">
        <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-96 h-96 bg-black/5 rounded-full blur-3xl"></div>
        
        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <h2 className="text-3xl md:text-5xl font-bold text-primary-foreground mb-8 leading-tight"> Ready to build the future you deserve?</h2>
          <p className="text-xl text-primary-foreground/80 mb-10 max-w-2xl mx-auto">
            Join thousands of professionals who have found their next big opportunity through our vetted network.
          </p>
          <Link
            href="#jobs"
            className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-full hover:bg-[#e06610] transition-colors"
          >
            Start Your Journey Now
          </Link>
        </div>
      </section>

      <FAQSection />

      {/* Footer */}
      <footer className="bg-[#0B1C53] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="coordinators.pro" className="h-16 w-auto brightness-0 invert" />
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md">
                Connecting talented professionals with world-class opportunities. Your next career milestone is just one application away.
              </p>
              <nav className="flex flex-wrap gap-x-8 gap-y-4 mt-8">
                <Link href="#how-it-works" className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  How It Works
                </Link>
                <Link href="#jobs" className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  Jobs
                </Link>
                <Link href="#why-were-better" className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  Why We're Better
                </Link>
                <Link href="#faqs" className="text-sm font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  FAQs
                </Link>
              </nav>
            </div>
            
            <div className="flex flex-col items-start md:items-end">
              <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">Our socials</h3>
              <div className="flex flex-col gap-4">
                <Link href="#" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Linkedin size={20} />
                  LinkedIn
                </Link>
                <Link href="#" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Facebook size={20} />
                  Facebook
                </Link>
                <Link href="#" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
                  <Instagram size={20} />
                  Instagram
                </Link>
              </div>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2026 coordinators.pro. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies Settings</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
