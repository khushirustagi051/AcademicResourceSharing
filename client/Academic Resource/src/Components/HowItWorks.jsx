import { LogIn, Upload, Download } from "lucide-react";

const steps = [
  { icon: LogIn, label: "Sign in with your campus account" },
  { icon: Upload, label: "Upload or browse study resources" },
  { icon: Download, label: "Download, rate, and help others learn" },
];

const HowItWorks = () => (
  <section className="py-20 px-6">
    <div className="max-w-5xl mx-auto text-center">
      <h2 className="text-3xl font-bold text-foreground mb-14">
        How It Works
      </h2>
      <div className="grid md:grid-cols-3 gap-10">
        {steps.map((s, i) => (
          <div key={i} className="flex flex-col items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-accent-foreground text-xl font-bold">
              <s.icon className="w-7 h-7" />
            </div>
            <span className="text-xs font-semibold text-primary uppercase tracking-wider">
              Step {i + 1}
            </span>
            <p className="text-foreground font-medium">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  </section>
);

export default HowItWorks;
