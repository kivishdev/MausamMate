// ========================================================================
// File: frontend/src/components/Tabs.jsx (FINAL CORRECTED VERSION)
// Purpose: Modern tab design with all three functional tabs.
// ========================================================================
function Tabs({ activeTab, setActiveTab }) {
  // THE FIX: We are using our original 3-tab plan for better functionality.
  const tabs = ['Today', 'Hourly', 'Daily'];

  return (
    <div className="bg-white rounded-xl p-1 shadow-sm border border-gray-100">
      <div className="flex">
        {tabs.map((tab) => (
          <button
            key={tab}
            // THE FIX: The onClick logic is now simplified for 3 tabs.
            onClick={() => setActiveTab(tab)}
            className={`px-6 py-3 text-sm font-medium rounded-lg transition-all duration-200 flex-1
              ${ // THE FIX: The active state logic is also simplified.
                activeTab === tab
                ? 'bg-gray-100 text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }
            `}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}
export default Tabs;
