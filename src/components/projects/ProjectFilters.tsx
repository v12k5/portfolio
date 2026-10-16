import { filterLabels } from '@/data/ui-text';
import type { FilterId } from '@/data/projects';
export function ProjectFilters({ active, onChange }: { active: FilterId | null; onChange: (value: FilterId | null) => void }) { return <div className="filter-list" role="group" aria-label="Project filters">{filterLabels.map((filter) => <button type="button" className={`filter-pill ${active === filter.id ? 'is-active' : ''}`} aria-pressed={active === filter.id} key={filter.label} onClick={() => onChange(filter.id as FilterId | null)}>{filter.label}</button>)}</div>; }
