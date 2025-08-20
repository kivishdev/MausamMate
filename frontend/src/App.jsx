// ========================================================================
// File: frontend/src/App.jsx (UPDATED FOR SCROLLING)
// ========================================================================
import HomePage from './pages/HomePage';
import UpdatePrompt from './components/UpdatePrompt';

function App() {
  return (
    // THE FIX: We removed 'items-center' to allow the content to grow and scroll from the top.
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex justify-center p-4 font-sans">
      <HomePage />
      <UpdatePrompt />
    </div>
  );
}
export default App;
