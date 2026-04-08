import type { HistoryEntry as HistoryEntryType } from "@/types/terminal";
import HistoryEntry from "./HistoryEntry";

interface HistoryListProps {
  entries: HistoryEntryType[];
}

export default function HistoryList({ entries }: HistoryListProps) {
  return (
    <div className="space-y-3">
      {entries.map((entry) => (
        <HistoryEntry key={entry.id} entry={entry} />
      ))}
    </div>
  );
}
