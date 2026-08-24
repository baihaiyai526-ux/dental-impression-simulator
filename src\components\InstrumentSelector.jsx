export default function InstrumentSelector({ options, onChoose, locked }) {
  return (
    <div className="grid gap-3 sm:grid-cols-3">
      {options.map((option) => (
        <button
          key={option.label}
          disabled={locked}
          onClick={() => onChoose(option)}
          className="min-h-24 rounded-lg border border-blue-100 bg-white p-4 text-left shadow-sm transition hover:-translate-y-0.5 hover:border-blue-300 hover:shadow-medical disabled:cursor-not-allowed disabled:opacity-70"
        >
          <span className="block text-sm font-semibold text-slate-900">{option.label}</span>
          <span className="mt-2 block text-xs text-slate-500">点击选择</span>
        </button>
      ))}
    </div>
  );
}
