export default function Spinner({ full = false }) {
  return (
    <div className={`flex items-center justify-center ${full ? 'min-h-[60vh]' : 'py-10'}`} role="status" aria-label="Loading">
      <div className="h-9 w-9 animate-spin rounded-full border-4 border-royal-200 border-t-royal-700" />
    </div>
  );
}
