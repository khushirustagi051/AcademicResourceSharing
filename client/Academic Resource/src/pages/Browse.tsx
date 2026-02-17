import { useState, useMemo } from "react";
import { Filter } from "lucide-react";
import Navbar from "@/components/Navbar";
import SiteFooter from "@/components/SiteFooter";
import SearchBar from "@/components/SearchBar";
import FilterSidebar, { type Filters } from "@/components/FilterSidebar";
import SortDropdown from "@/components/SortDropdown";
import ResourceCard, { type Resource } from "@/components/ResourceCard";

const mockData: Resource[] = [
  { id: 1, title: "Data Structures Complete Notes", subject: "Data Structures", semester: "3", rating: 4.8, downloads: 342, isVerified: true, type: "Notes" },
  { id: 2, title: "OS Mid-Sem PYQs 2024", subject: "OS", semester: "4", rating: 4.5, downloads: 278, isVerified: true, type: "Previous Year Questions" },
  { id: 3, title: "DBMS Assignment Solutions", subject: "DBMS", semester: "4", rating: 4.2, downloads: 189, isVerified: false, type: "Assignments" },
  { id: 4, title: "CN Lab Manual & Viva Questions", subject: "CN", semester: "5", rating: 4.6, downloads: 215, isVerified: true, type: "Notes" },
  { id: 5, title: "Discrete Math Formula Sheet", subject: "Math", semester: "2", rating: 4.9, downloads: 410, isVerified: true, type: "Notes" },
  { id: 6, title: "OS End-Sem PYQs 2023", subject: "OS", semester: "4", rating: 4.3, downloads: 198, isVerified: false, type: "Previous Year Questions" },
  { id: 7, title: "Data Structures Lab Programs", subject: "Data Structures", semester: "3", rating: 4.1, downloads: 156, isVerified: false, type: "Assignments" },
  { id: 8, title: "DBMS ER Diagram Notes", subject: "DBMS", semester: "4", rating: 4.7, downloads: 301, isVerified: true, type: "Notes" },
  { id: 9, title: "Math PYQs Collection", subject: "Math", semester: "2", rating: 4.4, downloads: 245, isVerified: true, type: "Previous Year Questions" },
];

const Browse = () => {
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("rating");
  const [filters, setFilters] = useState<Filters>({ subjects: [], semesters: [], types: [] });
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let res = mockData.filter((r) => {
      const q = search.toLowerCase();
      if (q && !r.title.toLowerCase().includes(q) && !r.subject.toLowerCase().includes(q)) return false;
      if (filters.subjects.length && !filters.subjects.includes(r.subject)) return false;
      if (filters.semesters.length && !filters.semesters.includes(r.semester)) return false;
      if (filters.types.length && !filters.types.includes(r.type)) return false;
      return true;
    });
    if (sort === "rating") res.sort((a, b) => b.rating - a.rating);
    else if (sort === "downloads") res.sort((a, b) => b.downloads - a.downloads);
    else res.sort((a, b) => b.id - a.id);
    return res;
  }, [search, sort, filters]);

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-7xl mx-auto w-full px-6 py-8">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
          <h1 className="text-2xl font-bold text-foreground">Browse Study Resources</h1>
          <div className="flex items-center gap-3">
            <SortDropdown value={sort} onChange={setSort} />
            <button
              className="md:hidden flex items-center gap-2 text-sm font-medium text-primary border border-primary rounded-lg px-3 py-2.5"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4" /> Filters
            </button>
          </div>
        </div>

        <div className="flex-1 mb-6">
          <SearchBar value={search} onChange={setSearch} />
        </div>

        <div className="flex gap-8">
          {/* Desktop sidebar */}
          <div className="hidden md:block w-56 shrink-0">
            <FilterSidebar filters={filters} onChange={setFilters} />
          </div>

          {/* Mobile filters */}
          {showFilters && (
            <div className="md:hidden fixed inset-0 z-40 bg-background/80 backdrop-blur-sm" onClick={() => setShowFilters(false)}>
              <div className="absolute left-0 top-0 h-full w-72 bg-card p-6 shadow-lg overflow-y-auto" onClick={(e) => e.stopPropagation()}>
                <FilterSidebar filters={filters} onChange={setFilters} />
              </div>
            </div>
          )}

          {/* Grid */}
          <div className="flex-1">
            {filtered.length > 0 ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map((r) => (
                  <ResourceCard key={r.id} resource={r} />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <p className="text-muted-foreground">No resources found. Try changing filters.</p>
              </div>
            )}
          </div>
        </div>
      </main>
      <SiteFooter />
    </div>
  );
};

export default Browse