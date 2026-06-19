import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, ExternalLink, Search, Filter, Box, Clock, Star } from "lucide-react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const CATEGORIES = ["Video Editing", "Coding", "Design", "Marketing"];

const COURSES = [
  { id: 1, title: "Smart SEO Analyzer", description: "Instantly analyze any webpage for SEO best practices and get actionable fixes.", category: "Marketing", pages: "v2.1", size: "Cloud App", isPurchased: false },
  { id: 2, title: "Automated Video Editor", description: "Upload raw footage and let our AI cut, trim, and caption your content.", category: "Video Editing", pages: "v1.4", size: "Desktop", isPurchased: false },
  { id: 3, title: "Code Boilerplate Gen", description: "Generate production-ready SaaS boilerplates in React, Next.js, and Node.", category: "Coding", pages: "v3.0", size: "CLI Tool", isPurchased: false },
  { id: 4, title: "Figma to React", description: "Convert your Figma designs directly into pixel-perfect React components.", category: "Design", pages: "v1.2", size: "Plugin", isPurchased: false },
  { id: 5, title: "Marketing Flow Builder", description: "Pre-built email and SMS workflows to instantly boost your conversion rates.", category: "Marketing", pages: "v2.0", size: "Web App", isPurchased: false },
  { id: 6, title: "Schema Visualizer", description: "Connect your Postgres DB and get a beautiful interactive map of your tables.", category: "Coding", pages: "v1.1", size: "Cloud App", isPurchased: false }
];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const activeCategory = category ? (category.charAt(0).toUpperCase() + category.slice(1)) : "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(COURSES);
  const [activeTool, setActiveTool] = useState<any>(null);

  // Load purchases from Supabase on mount
  useEffect(() => {
    if (!user) {
      return;
    }

    const fetchPurchases = async () => {
      try {
        const { data, error } = await supabase
          .from('purchases')
          .select('course_id')
          .eq('user_id', user.id);

        if (error) throw error;

        if (data) {
          const purchasedIds = data.map(p => p.course_id);
          setCourses(prev => prev.map(course => ({
            ...course,
            isPurchased: purchasedIds.includes(String(course.id)) || course.isPurchased
          })));
        }
      } catch (error) {
        console.error("Error fetching purchases:", error);
      }
    };

    fetchPurchases();
  }, [user]);

  const handlePurchase = async (courseId: number) => {
    if (!user) return;

    try {
      // 1. Save to Supabase
      const { error } = await supabase
        .from('purchases')
        .insert({ 
          user_id: user.id, 
          course_id: String(courseId) 
        });

      if (error) {
        // If it already exists (Unique constraint), we just continue
        if (error.code !== '23505') throw error;
      }

      // 2. Update local state
      setCourses(prev => prev.map(course => 
        course.id === courseId ? { ...course, isPurchased: true } : course
      ));

    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Failed to save purchase. Please try again.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "purchased" && course.isPurchased);
    return matchesCategory && matchesSearch && matchesTab;
  });

  if (activeTool) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col pt-20">
        <div className="border-b border-white/10 p-4 flex items-center justify-between">
           <div className="flex items-center gap-4">
             <button onClick={() => setActiveTool(null)} className="text-white/60 hover:text-white px-4 py-2 border border-white/10 rounded-lg transition-colors text-sm font-medium">Back to Dashboard</button>
             <h2 className="text-lg font-bold tracking-tight">{activeTool.title}</h2>
           </div>
           <div className="flex items-center gap-4">
             <span className="text-emerald-500 text-xs font-mono font-bold tracking-widest bg-emerald-500/10 px-3 py-1 rounded-full">{activeTool.pages}</span>
           </div>
        </div>
        <div className="flex-1 flex items-center justify-center bg-zinc-950 p-8">
           <motion.div initial={{opacity: 0, scale: 0.95}} animate={{opacity: 1, scale: 1}} className="max-w-2xl text-center flex flex-col items-center">
             <div className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center mb-8">
               <Cpu size={40} className="text-white/60" />
             </div>
             <h3 className="text-4xl font-medium tracking-tight mb-4">{activeTool.title} Workspace</h3>
             <p className="text-white/40 text-lg mb-10 leading-relaxed max-w-xl mx-auto">This is a premium high-performance environment for {activeTool.title}. The sleek, focused dark mode design removes all distractions so you can perform your best work.</p>
             <button className="bg-white text-black px-10 py-4 rounded-full font-bold text-sm tracking-widest uppercase hover:scale-105 active:scale-95 transition-all shadow-[0_0_40px_rgba(255,255,255,0.2)]">Execute Task</button>
           </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FBFBFD] text-[#1D1D1F]">
      {/* Top spacing for Navbar */}
      <div className="h-20" />

      <main className="max-w-7xl mx-auto px-6 py-12 md:py-20">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-2"
            >
              <div className={cn("w-8 h-[2px]", activeTab === "purchased" ? "bg-emerald-500" : "bg-blue-500")} />
              <span className={cn("text-[10px] font-bold tracking-[0.2em] uppercase", activeTab === "purchased" ? "text-emerald-600" : "text-blue-500")}>
                {activeTab === "purchased" ? "Your Collection" : "Discover Knowledge"}
              </span>
            </motion.div>
            
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl font-bold tracking-tight"
            >
              {activeTab === "purchased" ? "My" : "Explore"} <span className={cn("font-serif italic font-normal", activeTab === "purchased" ? "text-emerald-600/40" : "text-black/30")}>Tools.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed"
            >
              {activeTab === "purchased" 
                ? "Your personal library of high-performance tools. Access them anywhere."
                : "The most powerful tools for modern professionals. Precision-engineered for your workflow."}
            </motion.p>
          </div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-10 border-l border-gray-100 pl-10 h-24"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-bold">{filteredCourses.length}</span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">
                {activeTab === "purchased" ? "Owned" : "Available"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className={cn("text-3xl font-bold", activeTab === "purchased" && "text-emerald-600")}>
                {COURSES.filter(c => c.isPurchased).length}
              </span>
              <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Mastered</span>
            </div>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <section className="sticky top-20 z-30 bg-[#FBFBFD]/80 backdrop-blur-md py-6 mb-12 border-b border-gray-100">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-black transition-colors" size={18} />
              <input
                type="text"
                placeholder={`Search in ${category ? activeCategory : 'all categories'}...`}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100/50 border-none rounded-2xl py-4 pl-12 pr-6 text-base focus:outline-none focus:ring-2 focus:ring-black/5 transition-all placeholder:text-gray-400/60"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto pb-2 lg:pb-0 no-scrollbar">
              <Link
                to="/dashboard"
                className={cn(
                  "px-6 py-3 rounded-full text-sm font-medium whitespace-nowrap transition-all active:scale-95",
                  !category ? "bg-black text-white shadow-xl shadow-black/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
                    category === cat.toLowerCase() ? "bg-black text-white shadow-xl shadow-black/10" : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                  )}
                >
                  {cat}
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className={cn(
                "group relative border rounded-[2rem] p-8 flex flex-col h-full hover:shadow-2xl transition-all duration-500 hover:-translate-y-1 overflow-hidden",
                course.isPurchased 
                  ? "bg-white border-emerald-100 hover:shadow-emerald-500/5" 
                  : "bg-white border-gray-100 hover:shadow-black/5"
              )}
            >
              {/* Card Decor */}
              <div className={cn(
                "absolute top-0 right-0 w-32 h-32 rounded-bl-[4rem] -mr-16 -mt-16 transition-transform duration-500 group-hover:scale-110",
                course.isPurchased ? "bg-emerald-50" : "bg-gray-50"
              )} />
              
              <div className="relative z-10">
                <div className="flex items-start justify-between mb-8">
                  <div className={cn(
                    "w-14 h-14 rounded-2xl flex items-center justify-center transition-colors duration-500",
                    course.isPurchased ? "bg-emerald-50 text-emerald-300 group-hover:text-emerald-600" : "bg-gray-50 text-gray-300 group-hover:text-black"
                  )}>
                    <Cpu size={28} />
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className={cn(
                      "text-[10px] font-bold tracking-widest uppercase transition-colors",
                      course.isPurchased ? "text-emerald-600/40" : "text-gray-300 group-hover:text-blue-500"
                    )}>
                      {course.category}
                    </span>
                    {course.isPurchased && (
                      <span className="flex items-center gap-1 text-[9px] font-bold bg-emerald-500 text-white px-2 py-0.5 rounded-full tracking-wider">
                        <Star size={8} fill="currentColor" /> OWNED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className={cn(
                  "text-2xl font-bold mb-4 tracking-tight leading-tight transition-colors",
                  course.isPurchased ? "group-hover:text-emerald-700" : "group-hover:text-blue-600"
                )}>
                  {course.title}
                </h3>
                
                <p className="text-gray-500 text-base mb-10 line-clamp-2 leading-relaxed">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                    <Box size={14} />
                    {course.pages || 'v1.0.0'} Version
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                    <Clock size={14} />
                    {course.size}
                  </div>
                </div>

                <div className={cn("flex items-center gap-4 pt-8 border-t", course.isPurchased ? "border-emerald-50" : "border-gray-50")}>
                  <button 
                    onClick={() => course.isPurchased ? setActiveTool(course) : handlePurchase(course.id)}
                    className={cn(
                      "flex-1 rounded-xl py-4 text-sm font-bold active:scale-95 transition-all",
                      course.isPurchased 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/10" 
                        : "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10"
                    )}
                  >
                    {course.isPurchased ? "Launch Tool" : "Get Access"}
                  </button>
                  <button 
                    onClick={() => course.isPurchased ? setActiveTool(course) : null}
                    className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                    course.isPurchased 
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100 cursor-pointer" 
                      : "bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100 cursor-default"
                  )}>
                    <ExternalLink size={20} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {filteredCourses.length === 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-40 bg-white rounded-[3rem] border border-dashed border-gray-200"
          >
            <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-200">
              {activeTab === "purchased" ? <Box size={32} /> : <Filter size={32} />}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {activeTab === "purchased" ? "Your workspace is empty" : "No tools found"}
            </h3>
            <p className="text-gray-400 mb-8">
              {activeTab === "purchased" 
                ? "You haven't added any tools to your collection yet." 
                : "Try adjusting your search or category filters."}
            </p>
            {activeTab === "purchased" && (
              <button 
                onClick={() => navigate("/dashboard")}
                className="bg-black text-white px-8 py-3 rounded-full text-sm font-bold hover:bg-gray-800 transition-all"
              >
                Go to Library
              </button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
