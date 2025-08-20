// File: frontend/src/components/UpdatePrompt.jsx
// Purpose: Shows a popup to the user when a new version of the app is available.

import { useRegisterSW } from 'virtual:pwa-register/react'
import { RefreshCw } from 'lucide-react';

function UpdatePrompt() {
  const {
    needRefresh: [needRefresh], // We don't need the 'setNeedRefresh' function
    updateServiceWorker,
  } = useRegisterSW({
    onRegistered(r) {
      console.log('Service Worker registered:', r)
    },
    onRegisterError(error) {
      console.log('Service Worker registration error:', error)
    },
  })

  // THE FIX: The unused 'close' function has been completely removed.

  if (!needRefresh) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="p-4 bg-white rounded-lg shadow-lg border flex items-center gap-4">
        <div className="text-sm font-semibold text-gray-800">
          A new version is available!
        </div>
        <button
          onClick={() => updateServiceWorker(true)}
          className="px-4 py-2 bg-blue-500 text-white text-sm font-bold rounded-md hover:bg-blue-600 flex items-center gap-2"
        >
          <RefreshCw size={16} />
          Reload
        </button>
      </div>
    </div>
  )
}

export default UpdatePrompt;
