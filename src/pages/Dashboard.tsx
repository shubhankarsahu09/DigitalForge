import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Cpu, ExternalLink, Search, Box, Clock, Star, Download, Filter } from "lucide-react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { cn } from "../lib/utils";
import { supabase } from "../lib/supabase";
import { useAuth } from "../hooks/useAuth";

const PRODUCTS: any[] = [
  {
    id: 1,
    title: "Frame To Video Converter",
    description: "Pro-level sequence encoding instantly. Convert image frames to MP4 directly in the browser.",
    topic: "Premiere Pro",
    type: "Tools",
    pages: "v1.0.0",
    size: "WASM Engine",
    isPurchased: false,
    route: "/tools/frameweaver"
  }
];

const TOPICS = ["All", "Blender", "After Effects", "Premiere Pro", "Coding"];
const TYPES = ["All", "Tools", "Assets"];

export default function Dashboard() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const activeTab = searchParams.get("tab") || "all";
  
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopic, setActiveTopic] = useState("All");
  const [activeType, setActiveType] = useState("All");
  const [courses, setCourses] = useState(PRODUCTS);

  // Load purchases from Supabase on mount
  useEffect(() => {
    if (!user) return;
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
      const { error } = await supabase
        .from('purchases')
        .insert({ user_id: user.id, course_id: String(courseId) });
      if (error && error.code !== '23505') throw error;
      setCourses(prev => prev.map(course =>
        course.id === courseId ? { ...course, isPurchased: true } : course
      ));
    } catch (error) {
      console.error("Error saving purchase:", error);
      alert("Failed to save purchase. Please try again.");
    }
  };

  const filteredCourses = courses.filter((course) => {
    const matchesTopic = activeTopic === "All" || course.topic === activeTopic;
    const matchesType = activeType === "All" || course.type === activeType;
    const matchesSearch = course.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === "all" || (activeTab === "purchased" && course.isPurchased);
    return matchesTopic && matchesType && matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Background elements to match landing page */}
      <div className="absolute top-0 inset-x-0 h-[500px] bg-gradient-to-b from-white/[0.03] to-transparent pointer-events-none" />
      <div className="absolute -top-40 -right-40 w-96 h-96 bg-foreground/[0.02] rounded-full blur-[100px] pointer-events-none" />

      {/* Top spacing for Navbar */}
      <div className="h-28" />

      <main className="max-w-7xl mx-auto px-6 w-full flex-1 pb-20 relative z-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 mb-16">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center gap-3"
            >
              <div className="w-8 h-[1px] bg-foreground/40" />
              <span className="text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground">
                {activeTab === "purchased" ? "Your Workspace" : "Product Discovery"}
              </span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-6xl lg:text-7xl font-medium tracking-tight"
            >
              {activeTab === "purchased" ? "My" : "Explore"} <span className="font-serif italic text-muted-foreground">Products.</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted-foreground max-w-lg leading-relaxed"
            >
              {activeTab === "purchased"
                ? "Your personal workspace of high-performance tools and assets."
                : "The most powerful tools and high-quality assets for modern creators."}
            </motion.p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex items-center gap-10 border-l border-border pl-10 h-20"
          >
            <div className="flex flex-col">
              <span className="text-3xl font-medium">{filteredCourses.length}</span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                {activeTab === "purchased" ? "Owned" : "Available"}
              </span>
            </div>
            <div className="flex flex-col">
              <span className="text-3xl font-medium text-muted-foreground">
                {courses.filter(c => c.isPurchased).length}
              </span>
              <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">Mastered</span>
            </div>
          </motion.div>
        </div>

        {/* Filters & Search */}
        <section className="sticky top-20 z-30 bg-background/80 backdrop-blur-xl py-6 mb-12 border-b border-border">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="relative flex-1 group">
              <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search all products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-card border border-border rounded-full py-4 pl-14 pr-6 text-sm focus:outline-none focus:ring-1 focus:ring-ring transition-all placeholder:text-foreground/30 text-foreground"
              />
            </div>
            
            <div className="flex items-center gap-4 overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
              <div className="flex items-center gap-2 bg-card border border-border rounded-full p-1.5">
                {TOPICS.map(topic => (
                  <button
                    key={topic}
                    onClick={() => setActiveTopic(topic)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                      activeTopic === topic 
                        ? "bg-foreground text-background" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary"
                    )}
                  >
                    {topic}
                  </button>
                ))}
              </div>

              <div className="flex items-center gap-2 bg-card border border-border rounded-full p-1.5">
                {TYPES.map(type => (
                  <button
                    key={type}
                    onClick={() => setActiveType(type)}
                    className={cn(
                      "px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all",
                      activeType === type 
                        ? "bg-secondary text-foreground" 
                        : "text-muted-foreground hover:text-foreground hover:bg-secondary/50"
                    )}
                  >
                    {type}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Content Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCourses.map((course, idx) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
              className="group relative border border-border rounded-3xl p-8 flex flex-col h-full bg-foreground/[0.02] hover:bg-foreground/[0.04] transition-all duration-300"
            >
              <div className="relative z-10 flex flex-col h-full">
                <div className="flex items-start justify-between mb-8">
                  <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-muted-foreground group-hover:text-foreground transition-colors">
                    {course.type === 'Tools' ? <Cpu size={24} /> : <Box size={24} />}
                  </div>
                  <div className="flex flex-col items-end gap-2">
                    <span className="text-[10px] font-bold tracking-widest uppercase text-muted-foreground group-hover:text-muted-foreground transition-colors">
                      {course.topic} • {course.type}
                    </span>
                    {course.isPurchased && (
                      <span className="flex items-center gap-1 text-[9px] font-bold bg-secondary text-foreground px-2.5 py-1 rounded-full tracking-wider border border-border">
                        <Star size={8} fill="currentColor" /> OWNED
                      </span>
                    )}
                  </div>
                </div>

                <h3 className="text-xl font-medium mb-3 tracking-tight text-foreground group-hover:text-foreground transition-colors">
                  {course.title}
                </h3>

                <p className="text-muted-foreground text-sm mb-8 line-clamp-2 leading-relaxed flex-1">
                  {course.description}
                </p>

                <div className="flex items-center gap-4 mb-8">
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Box size={14} />
                    {course.pages || 'v1.0.0'}
                  </div>
                  <div className="w-1 h-1 rounded-full bg-muted" />
                  <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
                    <Clock size={14} />
                    {course.size}
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-6 border-t border-border">
                  <button
                    onClick={() => course.isPurchased ? navigate(course.route) : navigate(`/checkout/${course.id}`)}
                    className={cn(
                      "flex-1 rounded-full py-3.5 text-xs font-bold tracking-wider uppercase transition-all",
                      course.isPurchased
                        ? "bg-secondary text-foreground hover:bg-muted"
                        : "bg-foreground text-background hover:bg-foreground/90"
                    )}
                  >
                    {course.isPurchased ? "Launch" : "Get Access"}
                  </button>
                  <button 
                    onClick={() => course.isPurchased ? window.open(course.route, '_blank') : null}
                    className="w-12 h-12 rounded-full flex items-center justify-center bg-card text-muted-foreground hover:bg-secondary hover:text-foreground transition-all border border-border"
                  >
                    {course.isPurchased ? <ExternalLink size={18} /> : <Download size={18} />}
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredCourses.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center py-32 text-center"
          >
            <div className="w-24 h-24 rounded-full border border-border flex items-center justify-center mb-8 relative">
              <div className="absolute inset-0 bg-card rounded-full blur-xl" />
              <Filter size={32} className="text-muted-foreground relative z-10" />
            </div>
            <h3 className="text-2xl font-medium tracking-tight mb-3 text-foreground">
              {activeTab === "purchased" ? "Your workspace is empty" : "No products found"}
            </h3>
            <p className="text-muted-foreground max-w-sm mx-auto leading-relaxed mb-8">
              {activeTab === "purchased"
                ? "You haven't acquired any products yet. Once you do, they will appear in your workspace."
                : "Try adjusting your filters or search query to find what you're looking for."}
            </p>
            {activeTab === "purchased" && (
              <button
                onClick={() => navigate("/products")}
                className="bg-foreground text-background px-8 py-3.5 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-foreground/90 transition-all"
              >
                Browse Products
              </button>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
