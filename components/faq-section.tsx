"use client"

import { useState } from "react"
import { Plus, X } from "lucide-react"
import { cn } from "@/lib/utils"

const faqs = [
  {
    question: "How does coordinators.pro help my career?",
    answer: "We connect you with high-growth companies that offer more than just a paycheck—they offer mentorship, clear career paths, and a culture that values your professional development."
  },
  {
    question: "Is it really faster than typical job boards?",
    answer: "Yes. By bypassing third-party recruiters and applying directly to decision-makers, our candidates typically get feedback up to 3x faster than traditional platforms."
  },
  {
    question: "How do you vet the companies on your platform?",
    answer: "We evaluate every company's culture, financial stability, and employee feedback. We only partner with organizations that provide a healthy, supportive environment for professionals to thrive."
  },
  {
    question: "What kind of roles are listed here?",
    answer: "We focus on specialized coordinator and operations roles across healthcare, tech, and professional services that require high levels of organization, communication, and leadership potential."
  },
  {
    question: "Do I need to pay any fees as a job seeker?",
    answer: "No, coordinators.pro is completely free for professionals. Our mission is to help you find the best career opportunities without any cost to you."
  },
  {
    question: "How often are new opportunities added?",
    answer: "Our curated list is updated daily. We recommend checking back frequently or subscribing to our alerts to stay ahead of new openings in your field."
  }
]

export function FAQSection() {
  const [openIndexes, setOpenIndexes] = useState<number[]>([]) // All closed by default

  const toggleFAQ = (index: number) => {
    setOpenIndexes((prev) =>
      prev.includes(index) ? prev.filter((i) => i !== index) : [...prev, index]
    )
  }

  return (
    <section id="faqs" className="bg-[#FFFFFF] py-24 border-t border-muted/20">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-[#0B1C53] mb-4">FAQs</h2>
          <p className="text-lg text-muted-foreground">
            Answers to what matters most about starting your career through coordinators.pro.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {faqs.map((faq, index) => (
            <div
              key={index}
              className={cn(
                "bg-white rounded-xl border border-slate-200 transition-all duration-200 h-fit",
               
              )}
            >
              <button
                onClick={() => toggleFAQ(index)}
                className="w-full flex items-start justify-between p-6 text-left group"
              >
                <span className="text-lg font-semibold text-[#0B1C53] pr-4">
                  {faq.question}
                </span>
                <span className="mt-1 shrink-0">
                  {openIndexes.includes(index) ? (
                    <X className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  ) : (
                    <Plus className="w-5 h-5 text-slate-400 group-hover:text-primary transition-colors" />
                  )}
                </span>
              </button>
              
              <div
                className={cn(
                  "overflow-hidden transition-all duration-300 ease-in-out",
                  openIndexes.includes(index) ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                )}
              >
                <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                  {faq.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
