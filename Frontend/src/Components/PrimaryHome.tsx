import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function Welcome() {
    return (
        <div className="flex flex-col h-screen w-screen bg-gradient-to-b from-slate-950 via-[#08122f] to-black text-slate-100 overflow-hidden">
            <Topbar />
            <div className="flex flex-1 overflow-hidden">
                <Sidebar />

                <main className="flex-1 overflow-y-auto relative p-8">
                    {/* Background glows */}
                    <div className="absolute inset-0">
                        <div className="absolute -top-28 -left-36 w-96 h-96 bg-blue-500/30 blur-[200px] rounded-full" />
                        <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-indigo-500/30 blur-[200px] rounded-full" />
                    </div>

                    {/* Content container */}
                    <div className="relative z-10 max-w-3xl mx-auto space-y-8">
                        {/* Welcome Card */}
                        <section className="rounded-3xl p-8 border border-slate-800 bg-gradient-to-br from-slate-900/60 via-slate-800/50 to-slate-900/30 shadow-[0_0_40px_-10px_rgba(37,99,235,0.2)] backdrop-blur-md text-center">
                            <h1 className="text-3xl sm:text-4xl font-extrabold text-white mb-4">
                                👋 Welcome to Lumos!
                            </h1>
                            <p className="text-slate-400 text-lg sm:text-xl mb-6">
                                Let's build your profile in 5 minutes to start finding scholarships that match you perfectly.
                            </p>

                            {/* Illustration image
                            <div className="my-6 flex justify-center">
                                <img
                                    src="./img1.png"
                                    alt="Student with scholarship documents"
                                    className="w-full h-64 object-contain rounded-2xl border border-slate-700"
                                />
                            </div> */}


                            <p className="text-slate-400 text-left mb-6">
                                We'll ask about:
                            </p>
                            <ul className="list-disc list-inside text-slate-300 text-left space-y-1 mb-6">
                                <li>✓ Academic background</li>
                                <li>✓ Interests & activities</li>
                                <li>✓ Demographics (optional, increases matches by 40%)</li>
                                <li>✓ Upload resume/transcript (optional)</li>
                            </ul>
                            <p className="text-slate-400 mb-6">🔒 Your data is private and never shared</p>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button className="px-6 py-3 rounded-full bg-gradient-to-r from-blue-600 to-indigo-500 text-white font-semibold hover:scale-[1.03] hover:shadow-[0_0_20px_-5px_rgba(99,102,241,0.6)] transition">
                                    Start Building Profile →
                                </button>
                                <button className="text-slate-400 hover:text-blue-400 text-sm mt-2 sm:mt-0">
                                    Skip for Now
                                </button>
                            </div>
                        </section>
                    </div>
                </main>
            </div>
        </div>
    );
}
