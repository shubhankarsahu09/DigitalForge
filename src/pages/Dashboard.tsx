import { useState } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Search, Filter, BookOpen } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { cn } from "../lib/utils";

const CATEGORIES = ["Video Editing", "Coding"];

const COURSES: any[] = [];

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const activeCategory = category ? (category.charAt(0).toUpperCase() + category.slice(1)) : "All";
  const [searchQuery, setSearchQuery] = useState("");



  const filteredCourses = COURSES.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "purchased" && course.isPurchased);
    return matchesCategory && matchesSearch && matchesTab;
  });

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f0f0ee] text-[#1d1d1f] font-sans">
      {/* Background Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        className="absolute inset-0 w-full h-full object-cover"
      >
        <source src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260508_215831_c6a8989c-d716-4d8d-8745-e972a2eec711.mp4" type="video/mp4" />
      </video>

      {/* Foreground Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Hero Section */}
        <div className="min-h-screen flex items-end pb-10 sm:pb-16 lg:pb-20 px-6 sm:px-12 md:px-20 lg:px-28">
          <div className="max-w-xs">
            {/* Badge link */}
            <div className="inline-flex items-center gap-1.5 text-[11.5px] font-medium text-blue-500 mb-3">
              New PDF Playbooks Available
              <span className="inline-block transition-transform duration-200">→</span>
            </div>

            {/* Headline */}
            <h1 className="text-[1.5rem] sm:text-[1.75rem] leading-[1.15] font-medium text-gray-900 tracking-tight mb-3">
              Forge your path to absolute mastery.
            </h1>

            {/* Subtext */}
            <p className="text-[13px] text-gray-400 font-normal mb-3">
              High-density, structured learning materials designed for absolute efficiency.
            </p>

            {/* CTA anchor */}
            <button 
              onClick={() => navigate("/dashboard")}
              className="inline-flex items-center gap-2 text-[13px] font-medium text-blue-500 border border-blue-400 rounded-full px-5 py-2.5 hover:bg-blue-500 hover:text-white hover:border-blue-500 transition-all duration-200 group"
            >
              Explore Library
              <span className="transition-transform duration-200 group-hover:translate-x-0.5">→</span>
            </button>
          </div>
        </div>

        {/* Dashboard Content (Search & Grid) */}
        <main className="relative bg-white/80 backdrop-blur-2xl py-20 px-8 md:px-28 border-t border-black/5">
          <div className="max-w-7xl mx-auto">
            {/* Header info */}
            <div className="flex flex-col md:flex-row md:items-end justify-between gap-12 mb-12">
              <div>
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="flex items-center gap-3 mb-6"
                >
                  <div className="w-1.5 h-1.5 rounded-full bg-black/20" />
                  <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-black/40">
                    Your Library
                  </span>
                </motion.div>
                <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-[#1d1d1f]">
                  {activeTab === "purchased" ? "Your" : (category ? activeCategory : "Explore")} <span className="text-black/40 font-serif-italic font-normal">Playbooks.</span>
                </h2>
              </div>
              <div className="flex items-center gap-12 border-l border-black/5 pl-12">
                <div className="flex flex-col">
                  <span className="text-4xl font-bold text-[#1d1d1f]">{COURSES.length}</span>
                  <span className="text-[10px] font-bold text-black/50 uppercase tracking-widest mt-1">Playbooks</span>
                </div>
              </div>
            </div>

            {/* Controls */}
            <section className="flex flex-col md:flex-row gap-6 mb-12">
              <div className="relative flex-1 group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-[#86868b] group-focus-within:text-black transition-colors" size={18} />
                <input
                  type="text"
                  placeholder={`Search ${category ? activeCategory : 'library'}...`}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-black/5 border-none rounded-2xl py-4 pl-12 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-[#86868b]/50"
                />
              </div>

              <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
                <Link
                  to="/dashboard"
                  className={cn(
                    "px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95",
                    !category ? "bg-black text-white shadow-lg" : "bg-black/5 text-[#1d1d1f] hover:bg-black/10"
                  )}
                >
                  All
                </Link>
                {CATEGORIES.map((cat) => (
                  <Link
                    key={cat}
                    to={`/dashboard/${cat.toLowerCase()}`}
                    className={cn(
                      "px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95",
                      category === cat.toLowerCase() ? "bg-black text-white shadow-lg" : "bg-black/5 text-[#1d1d1f] hover:bg-black/10"
                    )}
                  >
                    {cat}
                  </Link>
                ))}
              </div>
            </section>

            {/* Course Grid */}
            <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ y: -8 }}
                  className="group bg-white/50 backdrop-blur-sm border border-black/5 rounded-[2.5rem] p-10 flex flex-col h-full cursor-pointer hover:bg-white transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-black/5 flex items-center justify-center text-black/20 group-hover:text-black transition-colors">
                      <FileText size={28} />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-bold tracking-widest text-black/30 uppercase">{course.category}</span>
                      <div className="w-8 h-1 bg-black/5 rounded-full" />
                    </div>
                  </div>
                  <h3 className="text-2xl font-bold mb-4 text-[#1d1d1f]">{course.title}</h3>
                  <p className="text-[#424245] font-medium text-base mb-10 line-clamp-2 leading-relaxed flex-grow">{course.description}</p>
                  <div className="flex items-center justify-between pt-8 border-t border-black/5">
                    <div className="flex flex-col gap-1">
                      <span className="text-[11px] font-bold text-black/40 uppercase tracking-wider">PDF Playbook</span>
                      <div className="flex items-center gap-3 text-sm font-medium text-black/60">
                        <span className="flex items-center gap-1.5"><BookOpen size={14} /> {course.pages}p</span>
                        <span className="w-1 h-1 rounded-full bg-black/10" />
                        <span>{course.size}</span>
                      </div>
                    </div>
                    <button className="w-12 h-12 rounded-full bg-black/5 hover:bg-black text-black/40 hover:text-white transition-all flex items-center justify-center">
                      <Download size={20} />
                    </button>
                  </div>
                </motion.div>
              ))}
            </section>

            {filteredCourses.length === 0 && (
              <div className="text-center py-40">
                <div className="w-20 h-20 bg-black/5 rounded-full flex items-center justify-center mx-auto mb-6 text-black/10">
                  <Filter size={32} />
                </div>
                <p className="text-[#86868b] text-lg font-medium">No playbooks found in this category.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
