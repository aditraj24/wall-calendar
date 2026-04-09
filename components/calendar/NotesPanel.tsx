"use client";

type NotesPanelProps = {
  selectedKey: string | null;
  noteValue: string;
  onChange: (value: string) => void;
  primary: string;
};

export default function NotesPanel({
  selectedKey,
  noteValue,
  onChange,
  primary,
}: NotesPanelProps) {
  return (
    <div
      className="rounded-3xl border bg-white p-5 shadow-sm"
      style={{ borderColor: `${primary}30` }}
    >
      <div className="mb-4">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-400">
          Notes
        </p>
        <p className="mt-1 text-sm text-slate-600">
          Write a memo for the selected date or date range.
        </p>
        {selectedKey ? (
          <p className="mt-2 text-xs text-slate-500">
            Notes are saved automatically for the current selection.
          </p>
        ) : null}
      </div>

      {!selectedKey ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-500">
          Select a complete date range to write a note.
        </div>
      ) : (
        <textarea
          value={noteValue}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Write your note here..."
          rows={8}
          className="h-64 w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none ring-0 transition focus:border-slate-400"
          style={{
            boxShadow: `inset 0 0 0 1px ${primary}10`,
          }}
        />
      )}
    </div>
  );
}