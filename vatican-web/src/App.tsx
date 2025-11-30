// src/App.tsx
import { useState } from 'react';
import Header from './components/Header';
import Readings from './components/Readings';
import BibleReader from './components/BibleReader';
import './styles/global.css';

function App() {
  const [currentView, setCurrentView] = useState<'readings' | 'bible'>('readings');

  return (
    <div className="App">
      <Header currentView={currentView} setView={setCurrentView} />
      <main>
        {currentView === 'readings' ? <Readings /> : <BibleReader />}
      </main>
      <footer style={{ textAlign: 'center', padding: '2rem', marginTop: '2rem', borderTop: '1px solid #eee', color: '#666' }}>
        <p>© 2025 Ecclesia Gallia. Lectures de l'AELF. Bible Traduction A.P.E.E.</p>
      </footer>
    </div>
  );
}

export default App;
