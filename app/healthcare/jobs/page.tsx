import Link from "next/link"
import { Facebook, Instagram, Linkedin, Globe } from "lucide-react"
import { HealthcareJobsList } from "@/components/healthcare-jobs-list"
import { Navbar } from "@/components/navbar"

export const metadata = {
  title: "Healthcare Jobs | coordinators.pro",
  description: "Browse curated healthcare job listings — nursing, clinical, administrative, and more.",
}

export default function HealthcarePage() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden">
      <Navbar forceWhite />

      {/* Hero */}
      <section className="sticky top-0 z-0 overflow-hidden">
        {/* Background photo */}
        <img src="https://img.freepik.com/free-photo/low-angle-view-skyscrapers_1359-1105.jpg?semt=ais_hybrid&w=740&q=80" alt="" className="absolute inset-0 w-full h-full object-cover" />
        {/* Blue-purple tint overlay matching reference */}
        <div className="absolute inset-0" style={{ background: 'rgba(42, 52, 110, 0.80)' }} />

        <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 pt-28 pb-16 min-h-[420px]">
          {/* Logo */}
          <div className="flex items-center gap-3 mb-12 mt-4">
            <img src="/logo.png" alt="coordinators.pro" className="h-16 w-auto brightness-0 invert" />
            {/* <span className="text-white text-2xl font-bold tracking-widest uppercase">coordinators</span> */}
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-[#F47521] uppercase leading-[1.1] tracking-tight max-w-4xl">
            Unlock Your<br />Career Potential<br />with coordinators!
          </h1>

          {/* Bottom links */}
          <div className="mt-16 w-full flex flex-col sm:flex-row items-center justify-end gap-8 sm:gap-16">
            <Link
              href="https://www.linkedin.com/company/coordinators-pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Check us out on LinkedIn</p>
                <p className="text-white text-sm font-bold group-hover:text-[#F47521] transition-colors">linkedin.com/company/coordinators-pro</p>
              </div>
              <div className="w-10 h-10 rounded border-2 border-[#F47521] flex items-center justify-center shrink-0">
                <Linkedin className="w-5 h-5 text-[#F47521]" />
              </div>
            </Link>

            <Link
              href="https://coordinators.pro"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 group"
            >
              <div className="text-right">
                <p className="text-white/50 text-[10px] uppercase tracking-widest font-semibold">Visit our website</p>
                <p className="text-white text-sm font-bold group-hover:text-[#F47521] transition-colors">www.coordinators.pro</p>
              </div>
              <div className="w-10 h-10 rounded border-2 border-[#F47521] flex items-center justify-center shrink-0">
                <Globe className="w-5 h-5 text-[#F47521]" />
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Content scrolls over the sticky hero */}
      <div className="relative z-10">

      {/* About Us Section */}
      <section className="bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <p className=" text-md font-semibold uppercase tracking-widest mb-4 ">About Us</p>
              <div className="space-y-6 text-lg text-slate-600 leading-relaxed">
                <p>
                  At Coordinators, we connect great healthcare practices with high potential support talent. If you're looking to grow and tap into your potential, let's explore! We don't just staff positions — we build bridges to transformative opportunities for both healthcare practices and candidates.
                </p>
                <p>
                  At Coordinators, our mission goes beyond staffing; we aim to reshape how people engage with their work. By enabling both companies and candidates to break free from limiting patterns and embrace transformative possibilities, we create a foundation for sustainable growth and success.
                </p>
                <p className=" text-foreground">We're here to help you succeed. Join us!</p>
                <Link
                  href="https://coordinators.pro/manifesto"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 mt-2 text-[#F47521] font-semibold hover:underline transition-colors"
                >
                  Read our manifesto →
                </Link>
              </div>
            </div>
            <div className="rounded-2xl overflow-hidden bg-muted/30 aspect-video flex items-center justify-center">
              <img
                src="https://png.pngtree.com/thumb_back/fh260/background/20210906/pngtree-white-collar-workers-use-tablet-to-talk-about-work-image_804665.jpg"
                alt="Coordinators team"
                className="w-full h-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Why Coordinators Section - removed per requirements */}

      {/* Jobs Section */}
      <section id="jobs" className="bg-[#fafafa] py-16">
        <div className="max-w-4xl mx-auto px-6 md:px-8">
          <h2 className="text-center text-sm font-semibold uppercase tracking-[0.3em] text-foreground mb-12">
            Open Positions
          </h2>
          <HealthcareJobsList />
        </div>
      </section>



      {/* Footer */}
      <footer className="bg-[#0B1C53] text-white py-16">
        <div className="max-w-7xl mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between gap-12 mb-12">
            <div className="max-w-2xl">
              <div className="flex items-center gap-2 mb-6">
                <img src="/logo.png" alt="coordinators.pro" className="h-16 w-auto brightness-0 invert" />
              </div>
              <p className="text-slate-300 leading-relaxed max-w-md">
                Connecting healthcare professionals with organizations that value their expertise and support their growth.
              </p>
              <nav className="flex flex-wrap gap-x-8 gap-y-4 mt-8">
                <Link href="/" className="text-md font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  All Jobs
                </Link>
                <Link href="#jobs" className="text-md font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  Healthcare Jobs
                </Link>
                <Link href="#faqs" className="text-md font-semibold hover:text-primary transition-colors whitespace-nowrap">
                  FAQs
                </Link>
              </nav>
            </div>

            <div className="flex flex-col items-start md:items-end">
              <h3 className="text-slate-400 text-sm font-medium mb-6 uppercase tracking-wider">Our socials</h3>
              <div className="flex flex-col gap-4">
                <Link href="https://www.linkedin.com/company/coordinators-pro" className="flex items-center gap-3 text-sm hover:text-primary transition-colors">
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

          <div className="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-400">
            <p>© 2026 coordinators.pro. All rights reserved.</p>
            <div className="flex gap-6">
              <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
              <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
              <Link href="#" className="hover:text-white transition-colors">Cookies Settings</Link>
            </div>
          </div>
        </div>
      </footer>
      </div>{/* end sticky scroll wrapper */}
    </div>
  )
}
