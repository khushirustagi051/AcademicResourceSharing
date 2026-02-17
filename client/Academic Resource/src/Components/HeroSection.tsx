import { Link } from "react-router-dom";

const HeroSection = () => (
  <section className="py-20 md:py-32 px-6">
    <div className="max-w-4xl mx-auto text-center space-y-8">
      <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground leading-tight">
        All Your Campus Study Resources.{" "}
        <span className="text-primary">One Place.</span>
      </h1>
      <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
        Share and access notes, previous year question papers, assignments, and
        study materials — uploaded by students, for students.
      </p>
      <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
        <Link
          to="/browse"
          className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-semibold px-8 py-3.5 text-sm shadow-md hover:opacity-90 transition-opacity"
        >
          Explore Resources
        </Link>
        <Link
          to="/upload"
          className="inline-flex items-center justify-center rounded-lg border-2 border-primary text-primary font-semibold px-8 py-3.5 text-sm hover:bg-accent transition-colors"
        >
          Upload Notes
        </Link>
      </div>
    </div>
  </section>
);

export default HeroSection;
