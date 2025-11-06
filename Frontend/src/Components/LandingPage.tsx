// Uses Tailwind CSS classes and Material Symbols (loaded in index.html)
export default function LandingPage() {
  return (
    <div className="min-h-screen text-slate-100 bg-gradient-to-b from-slate-900 via-[#071029] to-black">
      {/* Header */}
      <header className="sticky top-0 z-50 backdrop-blur-sm bg-slate-900/60 border-b border-slate-800">
        <div className="container mx-auto px-6 py-4 flex items-center justify-between">
          <a href="/" className="flex items-center gap-3">
            <span className="inline-block w-10 h-10 rounded-full bg-gradient-to-tr from-blue-500 to-indigo-500 shadow-lg" />
            <span className="text-xl font-extrabold tracking-tight">Lumos</span>
          </a>

          <nav className="hidden md:flex items-center gap-8 text-slate-300">
            <a href="#how" className="hover:text-blue-400 transition">
              How it works
            </a>
            <a href="#features" className="hover:text-blue-400 transition">
              Features
            </a>
            <a href="#about" className="hover:text-blue-400 transition">
              About
            </a>
            <a
              href="#"
              className="px-4 py-2 rounded-md bg-gradient-to-r from-blue-600 to-indigo-500 shadow-md text-white font-semibold hover:scale-[1.01] transition"
            >
              <span className="text-white">Sign in</span> 
            </a>
          </nav>

          <div className="md:hidden">
            <button className="p-2 rounded-md bg-slate-800/50">
              <span className="material-symbols-outlined">menu</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero */}
      <main>
        <section className="w-full px-6 pt-20 pb-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            <div>
              <h1 className="text-4xl md:text-6xl font-extrabold leading-tight bg-clip-text text-transparent bg-gradient-to-r from-blue-300 to-indigo-400">
                Find Scholarships That Find You
              </h1>

              <p className="mt-6 text-slate-300 text-lg">
                Lumos uses AI-powered eligibility reasoning and personalized
                essay assistance to match you to scholarships, explain why you
                qualify, and help you apply — so you never miss another
                opportunity.
              </p>

              <div className="mt-8 flex flex-col sm:flex-row gap-4 sm:items-center">
                <a
                  href="#signup"
                  className="inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow-lg hover:scale-105 transition"
                >
                  <span className="material-symbols-outlined text-white">bolt</span>
                  <span className="text-white">Get started</span>
                </a>

                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-full border border-slate-700 text-slate-200 hover:border-blue-500 transition"
                >
                  <span className="material-symbols-outlined">play_circle</span>
                  Watch 2-min demo
                </a>
              </div>

              <ul className="mt-6 flex flex-wrap gap-4 text-sm text-slate-400">
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    check_circle
                  </span>
                  10,000+ scholarships
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    smart_toy
                  </span>
                  AI essay copilot
                </li>
                <li className="flex items-center gap-2">
                  <span className="material-symbols-outlined text-blue-400">
                    calendar_month
                  </span>
                  No fees, free forever
                </li>
              </ul>
            </div>

            <div>
              <div className="relative rounded-2xl overflow-hidden border border-slate-800 shadow-2xl bg-gradient-to-br from-slate-800 to-slate-900 p-6">
                <div className="absolute -left-16 -top-16 w-72 h-72 bg-gradient-to-tr from-blue-500/20 to-indigo-500/10 rounded-full filter blur-3xl" />
                <div className="relative z-10">
                  <div className="rounded-lg bg-gradient-to-br from-slate-900/50 to-slate-800/30 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <div className="text-sm text-slate-400">
                          Matches found
                        </div>
                        <div className="text-3xl font-bold text-white">
                          1,248
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-slate-400">Top match</div>
                        <div className="text-lg font-semibold text-blue-300">
                          STEM Scholars Fund
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 grid grid-cols-2 gap-3">
                      <div className="p-3 bg-slate-900/60 rounded-md">
                        <div className="text-xs text-slate-400">Deadline</div>
                        <div className="text-sm font-medium">Oct 15, 2025</div>
                      </div>
                      <div className="p-3 bg-slate-900/60 rounded-md">
                        <div className="text-xs text-slate-400">Award</div>
                        <div className="text-sm font-medium">$5,000</div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 text-sm text-slate-400">
                    Preview: AI explains why you match and drafts suggested
                    answers.
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features */}
        <section id="features" className="bg-slate-900/30 py-16">
          <div className="w-full px-6">
            <h2 className="text-3xl font-bold text-white mb-8">
              Powerful features to win more awards
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">search</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Smart match</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  AI eligibility reasoning explains fit and flags missing
                  criteria so you know where to focus.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">edit</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Essay copilot</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Personalized prompts and drafting tools preserve your voice
                  while saving hours of work.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">smart_toy</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Auto-apply</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Autofill forms where supported and submit applications faster
                  and more accurately.
                </p>
              </article>

              <article className="p-6 rounded-xl bg-slate-800/50 border border-slate-800 hover:shadow-xl transition">
                <div className="text-4xl text-blue-400">
                  <span className="material-symbols-outlined">leaderboard</span>
                </div>
                <h3 className="mt-4 text-lg font-semibold">Track progress</h3>
                <p className="mt-2 text-slate-300 text-sm">
                  Deadline management, status tracking, and priority ranking
                  help you focus on high-value awards.
                </p>
              </article>
            </div>
          </div>
        </section>

        {/* Testimonials */}
        <section className="py-12">
          <div className="w-full px-6">
            <div className="bg-slate-800/40 rounded-xl p-8 border border-slate-800">
              <blockquote className="text-xl md:text-2xl text-slate-100 italic">
                “Lumos helped me win $15,000 in scholarships — the essay copilot
                saved me weeks of work.”
              </blockquote>
              <div className="mt-4 text-slate-400">
                — Sarah J., Class of 2025
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16">
          <div className="w-full px-6 text-center">
            <div className="max-w-2xl mx-auto bg-gradient-to-r from-slate-900/60 to-slate-800/40 p-10 rounded-2xl border border-slate-800">
              <h3 className="text-2xl md:text-3xl font-bold text-white">
                Ready to fund your education?
              </h3>
              <p className="mt-4 text-slate-300">
                Sign up free to start getting tailored scholarship matches and
                AI-powered application help.
              </p>
              <div className="mt-6 flex flex-col sm:flex-row justify-center gap-4">
                <a
                  href="#signup"
                  className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold shadow"
                >
                  <span className="text-white">Create free account</span>
                </a>
                <a
                  href="#demo"
                  className="px-6 py-3 rounded-full border border-slate-700 text-slate-200"
                >
                  Watch demo
                </a>
              </div>
              <div className="mt-3 text-slate-400 text-sm">
                No credit card required
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800 py-8">
        <div className="w-full px-6 flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-slate-400">
            © 2025 Lumos. All rights reserved.
          </div>
          <nav className="flex gap-6">
            <a href="#about" className="text-slate-300 hover:text-blue-400">
              About
            </a>
            <a href="#privacy" className="text-slate-300 hover:text-blue-400">
              Privacy
            </a>
            <a href="#terms" className="text-slate-300 hover:text-blue-400">
              Terms
            </a>
            <a href="#blog" className="text-slate-300 hover:text-blue-400">
              Blog
            </a>
          </nav>
        </div>
      </footer>
    </div>
  );
}
