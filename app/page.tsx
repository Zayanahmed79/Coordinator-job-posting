import { JobsList } from "@/components/jobs-list"

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-background">
        <div className="max-w-7xl mx-auto px-6 py-5 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="coordinators.pro" className="h-10 w-auto" />

          </div>
          <nav className="hidden md:flex items-center gap-10">
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              How It Works
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Companies
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Resources
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              Blog
            </a>
            <a href="#" className="text-sm text-foreground hover:text-primary transition-colors font-medium">
              FAQ
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-background pt-12 pb-16">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-normal text-foreground leading-tight tracking-tight max-w-2xl">
            Find your next
            <br />
            <span className="text-foreground">career opportunity.</span>
          </h1>
          <p className="mt-6 text-muted-foreground text-lg max-w-xl leading-relaxed">
            Browse curated job listings from top companies—so you can find the perfect role, advance your career, and achieve your professional goals.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#jobs"
              className="inline-flex items-center justify-center px-8 py-4 bg-primary text-primary-foreground text-base font-semibold rounded-full hover:bg-[#e06610] transition-colors"
            >
              Browse All Jobs
            </a>
            <span className="px-6 py-3 border-2 border-primary text-primary rounded-full text-sm font-medium bg-transparent">
              No account needed
            </span>
          </div>
        </div>
      </section>

      {/* Jobs Section */}
      <section id="jobs" className="bg-card py-16">
        <div className="max-w-7xl mx-auto px-8 md:px-16">
          <h2 className="text-2xl font-semibold text-foreground mb-8">Latest Openings</h2>
          <JobsList />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background py-12">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <img src="/logo.png" alt="coordinators.pro" className="h-8 w-auto" />

          </div>
          <p className="text-sm text-muted-foreground">
            Find your dream job today. Browse opportunities from top companies.
          </p>
        </div>
      </footer>
    </div>
  )
}
