interface SortDropdownProps {
  value: string;
  onChange: (v: string) => void;
}

const options = [
  { label: "Highest Rated", value: "rating" },
  { label: "Most Downloaded", value: "downloads" },
  { label: "Recently Added", value: "recent" },
];

const SortDropdown = ({ value, onChange }: SortDropdownProps) => (
  <select
    value={value}
    onChange={(e) => onChange(e.target.value)}
    className="rounded-lg border border-input bg-card text-foreground text-sm px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-ring"
  >
    {options.map((o) => (
      <option key={o.value} value={o.value}>
        {o.label}
      </option>
    ))}
  </select>
);

export default SortDropdown