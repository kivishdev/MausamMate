// ========================================================================
// File: frontend/src/components/InfoCard.jsx (UPDATED VERSION)
// Purpose: Refined info card component
// ========================================================================
function InfoCard({ icon, title, value, description, children }) {
  return (
    <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
      <div className="flex items-center text-gray-500 text-xs font-medium mb-3 uppercase tracking-wide">
        {icon}
        <span className="ml-2">{title}</span>
      </div>
      <div className="space-y-1">
        {value && <p className="text-2xl font-semibold text-gray-800">{value}</p>}
        {description && <p className="text-sm text-gray-500">{description}</p>}
        {children}
      </div>
    </div>
  );
}
export default InfoCard;