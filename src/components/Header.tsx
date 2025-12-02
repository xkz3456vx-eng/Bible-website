// src/components/Header.tsx
import { Book, Calendar } from 'lucide-react';

interface HeaderProps {
  currentView: 'readings' | 'bible';
  setView: (view: 'readings' | 'bible') => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView }) => {
  return (
    <header style={{
      backgroundColor: '#fff',
      borderBottom: '3px solid #D4AF37',
      padding: '1rem 0',
      boxShadow: '0 2px 10px rgba(0,0,0,0.05)'
    }}>
      <div className="container" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
           <img
             src="https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Emblem_of_the_Papacy_SE.svg/113px-Emblem_of_the_Papacy_SE.svg.png"
             alt="Vatican Emblem"
             style={{ height: '50px' }}
           />
           <div>
             <h1 style={{ margin: 0, fontSize: '1.5rem', color: '#333' }}>Ecclesia Gallia</h1>
             <span style={{ fontSize: '0.8rem', color: '#666', fontStyle: 'italic' }}>Lectures & Bible</span>
           </div>
        </div>

        <nav style={{ display: 'flex', gap: '1rem' }}>
          <button
            onClick={() => setView('readings')}
            style={{
              background: currentView === 'readings' ? '#D4AF37' : 'transparent',
              color: currentView === 'readings' ? '#fff' : '#333',
              border: '1px solid #D4AF37',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'Cinzel, serif'
            }}
          >
            <Calendar size={18} />
            Liturgie
          </button>
          <button
            onClick={() => setView('bible')}
            style={{
              background: currentView === 'bible' ? '#D4AF37' : 'transparent',
              color: currentView === 'bible' ? '#fff' : '#333',
              border: '1px solid #D4AF37',
              padding: '0.5rem 1rem',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              fontFamily: 'Cinzel, serif'
            }}
          >
            <Book size={18} />
            Bible
          </button>
        </nav>
      </div>
    </header>
  );
};

export default Header;
