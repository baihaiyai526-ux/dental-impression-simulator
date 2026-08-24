export default function ToothIcon({ className = "" }) {
  return (
    <div className={`tooth-shine relative h-28 w-24 rounded-[40%_40%_48%_48%] border border-blue-100 shadow-medical ${className}`}>
      <div className="absolute left-1/2 top-5 h-12 w-10 -translate-x-1/2 rounded-full border border-blue-100 bg-white/70" />
      <div className="absolute bottom-4 left-5 h-10 w-5 rounded-b-full bg-blue-50" />
      <div className="absolute bottom-4 right-5 h-10 w-5 rounded-b-full bg-blue-50" />
    </div>
  );
}
