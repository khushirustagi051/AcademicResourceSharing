import { Star, Download, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

interface Resource {
  id: number;
  title: string;
  subject: string;
  semester: string;
  rating: number;
  downloads: number;
  isVerified: boolean;
  type: string;
}

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="bg-card rounded-xl p-6 shadow-[var(--card-shadow)] hover:shadow-[var(--card-shadow-hover)] transition-shadow flex flex-col">
    <div className="flex items-start justify-between mb-3">
      <span className="text-xs font-medium text-accent-foreground bg-accent px-2.5 py-1 rounded-md">
        {resource.type}
      </span>
      {resource.isVerified && (
        <span className="flex items-center gap-1 text-xs font-medium text-primary">
          <BadgeCheck className="w-4 h-4" /> Verified
        </span>
      )}
    </div>
    <h3 className="text-base font-semibold text-foreground mb-1 line-clamp-2">
      {resource.title}
    </h3>
    <p className="text-sm text-muted-foreground mb-4">
      {resource.subject} • Sem {resource.semester}
    </p>
    <div className="flex items-center gap-4 text-sm text-muted-foreground mt-auto mb-4">
      <span className="flex items-center gap-1">
        <Star className="w-4 h-4 text-yellow-500 fill-yellow-500" />
        {resource.rating.toFixed(1)}
      </span>
      <span className="flex items-center gap-1">
        <Download className="w-4 h-4" />
        {resource.downloads}
      </span>
    </div>
    <Link
      to={`/resource/${resource.id}`}
      className="inline-flex items-center justify-center rounded-lg bg-primary text-primary-foreground font-medium px-4 py-2.5 text-sm hover:opacity-90 transition-opacity"
    >
      View Details
    </Link>
  </div>
);

export default ResourceCard;
export type { Resource };
