import { BookOpen, Search, Star } from "lucide-react";

const features = [
  {
    icon: BookOpen,
    title: "Organized Resources",
    description: "Categorized by subject and semester for easy navigation.",
  },
  {
    icon: Search,
    title: "Search & Filter Easily",
    description: "Quickly find exam-relevant materials in seconds.",
  },
  {
    icon: Star,
    title: "Rate & Review",
    description: "Learn from top-rated resources chosen by your peers.",
  },
];

const Features = () => (
  <section className="py-20 px-6 bg-secondary/50">
    <div className="max-w-7xl mx-auto">
      <h2 className="text-3xl font-bold text-center text-foreground mb-12">
        Why Students Love It
      </h2>
      <div className="grid md:grid-cols-3 gap-8">
        {features.map((f) => (
          <div
            key={f.title}
            className="bg-card rounded-xl p-8 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow"
          >
            <div className="w-12 h-12 rounded-lg bg-accent flex items-center justify-center mb-5">
              <f.icon className="w-6 h-6 text-accent-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground mb-2">
              {f.title}
            </h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default Features