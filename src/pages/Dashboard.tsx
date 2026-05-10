import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FileText, Download, Search, Filter, BookOpen, Clock, Star } from "lucide-react";
import { useNavigate, useSearchParams, useParams, Link } from "react-router-dom";
import { cn } from "../lib/utils";

const CATEGORIES = ["Video Editing", "Coding", "Design", "Marketing"];

const COURSES: any[] = [];

export default function Dashboard() {
  const navigate = useNavigate();
  const { category } = useParams();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  const activeCategory = category ? (category.charAt(0).toUpperCase() + category.slice(1)) : "All";
  const [searchQuery, setSearchQuery] = useState("");
  const [courses, setCourses] = useState(COURSES);

  // Load purchases from localStorage on mount
  useEffect(() => {
    const savedPurchases = localStorage.getItem("user_purchases");
    if (savedPurchases) {
      const purchasedIds = JSON.parse(savedPurchases);
      setCourses(prev => prev.map(course => ({
        ...course,
        isPurchased: purchasedIds.includes(course.id) || course.isPurchased
      })));
    }
  }, []);

  const handlePurchase = (courseId: number) => {
    setCourses(prev => {
      const updated = prev.map(course => 
        course.id === courseId ? { ...course, isPurchased: true } : course
      );
      
      // Persist to localStorage
      const purchasedIds = updated.filter(c => c.isPurchased).map(c => c.id);
      localStorage.setItem("user_purchases", JSON.stringify(purchasedIds));
      
      return updated;
    });

    // Optional: Redirect to purchased tab after a delay or show a toast
    // For now, we just update the state instantly
  };

  const filteredCourses = courses.filter((course) => {
    const matchesCategory = activeCategory === "All" || course.category === activeCategory;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "purchased" && course.isPurchased);
    return matchesCategory && matchesSearch && matchesTab;
  });

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
              {activeTab === "purchased" ? "My" : "Explore"} <span className={cn("font-serif italic font-normal", activeTab === "purchased" ? "text-emerald-600/40" : "text-black/30")}>Playbooks.</span>
            </motion.h1>
            
            <motion.p 
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-gray-400 max-w-lg leading-relaxed"
            >
              {activeTab === "purchased" 
                ? "Your personal library of high-density learning materials. Continue where you left off."
                : "The most comprehensive blueprints for modern skills. Precision-engineered for your growth."}
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
                    <FileText size={28} />
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
                    <BookOpen size={14} />
                    {course.pages} Pages
                  </div>
                  <div className="w-1 h-1 rounded-full bg-gray-200" />
                  <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-400">
                    <Clock size={14} />
                    {course.size}
                  </div>
                </div>

                <div className={cn("flex items-center gap-4 pt-8 border-t", course.isPurchased ? "border-emerald-50" : "border-gray-50")}>
                  <button 
                    onClick={() => course.isPurchased ? null : handlePurchase(course.id)}
                    className={cn(
                      "flex-1 rounded-xl py-4 text-sm font-bold active:scale-95 transition-all",
                      course.isPurchased 
                        ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/10" 
                        : "bg-black text-white hover:bg-gray-800 shadow-lg shadow-black/10"
                    )}
                  >
                    {course.isPurchased ? "Read Now" : "Get Access"}
                  </button>
                  <button className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center transition-all",
                    course.isPurchased 
                      ? "bg-emerald-50 text-emerald-600 hover:bg-emerald-100" 
                      : "bg-gray-50 text-gray-400 hover:text-black hover:bg-gray-100"
                  )}>
                    <Download size={20} />
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
              {activeTab === "purchased" ? <BookOpen size={32} /> : <Filter size={32} />}
            </div>
            <h3 className="text-xl font-bold mb-2">
              {activeTab === "purchased" ? "Your library is empty" : "No playbooks found"}
            </h3>
            <p className="text-gray-400 mb-8">
              {activeTab === "purchased" 
                ? "You haven't added any playbooks to your collection yet." 
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
