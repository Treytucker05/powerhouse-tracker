import { useState } from 'react'
import Sessions from "./pages/Sessions.jsx";
import Intelligence from "./pages/Intelligence.jsx";
import Logger from "./pages/Logger.jsx";
import Home from "./pages/Home.jsx";
import './App.css'

function App() {
  const [currentView, setCurrentView] = useState('home');
  
  const renderView = () => {
    switch (currentView) {
      case 'sessions':
        return <Sessions />;
      case 'intelligence':
        return <Intelligence />;
      case 'logger':
        return <Logger />;      default:
        return <Home onNavigate={setCurrentView} />;
    }
  };

  return (
    <>      <nav className="bg-gray-800 text-white p-4">
        <div className="flex space-x-4">
          <button 
            onClick={() => setCurrentView('home')}
            className={`px-3 py-1 rounded ${currentView === 'home' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
          >
            Home
          </button>
          <button 
            onClick={() => setCurrentView('sessions')}
            className={`px-3 py-1 rounded ${currentView === 'sessions' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
          >
            Sessions
          </button>
          <button 
            onClick={() => setCurrentView('intelligence')}
            className={`px-3 py-1 rounded ${currentView === 'intelligence' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
          >
            Intelligence
          </button>
          <button 
            onClick={() => setCurrentView('logger')}
            className={`px-3 py-1 rounded ${currentView === 'logger' ? 'bg-gray-600' : 'hover:bg-gray-700'}`}
          >
            Logger
          </button>
        </div>
      </nav>
      <main>
        {renderView()}
      </main>
    </>
  )
}

export default App
