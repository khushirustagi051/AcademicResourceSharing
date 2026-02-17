interface Filters {
  subjects: string[];
  semesters: string[];
  types: string[];
}

interface FilterSidebarProps {
  filters: Filters;
  onChange: (f: Filters) => void;
}

const subjects = ["Data Structures", "OS", "DBMS", "CN", "Math"];
const semesters = ["1", "2", "3", "4", "5", "6", "7", "8"];
const resourceTypes = ["Notes", "Previous Year Questions", "Assignments"];

const toggle = (arr: string[], val: string) =>
  arr.includes(val) ? arr.filter((v) => v !== val) : [...arr, val];

const FilterSidebar = ({ filters, onChange }: FilterSidebarProps) => {
  const Section = ({
    title,
    items,
    selected,
    field,
  }: {
    title: string;
    items: string[];
    selected: string[];
    field: keyof Filters;
  }) => (
    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-foreground">{title}</h4>
      {items.map((item) => (
        <label key={item} className="flex items-center gap-2 text-sm text-muted-foreground cursor-pointer hover:text-foreground transition-colors">
          <input
            type="checkbox"
            checked={selected.includes(item)}
            onChange={() =>
              onChange({ ...filters, [field]: toggle(selected, item) })
            }
            className="rounded border-input accent-primary"
          />
          {item}
        </label>
      ))}
    </div>
  );

  return (
    <aside className="space-y-6">
      <Section title="Subject" items={subjects} selected={filters.subjects} field="subjects" />
      <Section title="Semester" items={semesters} selected={filters.semesters} field="semesters" />
      <Section title="Resource Type" items={resourceTypes} selected={filters.types} field="types" />
      <button
        onClick={() => onChange({ subjects: [], semesters: [], types: [] })}
        className="text-sm text-primary font-medium hover:underline"
      >
        Clear Filters
      </button>
    </aside>
  );
};

export default FilterSidebar;
export type { Filters };
