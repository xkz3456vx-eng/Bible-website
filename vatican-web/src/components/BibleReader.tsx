// src/components/BibleReader.tsx
import { useState } from 'react';
import type { BibleData } from '../types/bible';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import bibleDataRaw from '../data/fr_apee.json';

const bibleData = bibleDataRaw as BibleData;

const BibleReader: React.FC = () => {
  const [bible] = useState<BibleData | null>(bibleData);
  const [selectedBookIndex, setSelectedBookIndex] = useState(0);
  const [selectedChapter, setSelectedChapter] = useState(0);

  if (!bible) return <div style={{ textAlign: 'center', padding: '2rem' }}>Erreur de chargement.</div>;

  const currentBook = bible[selectedBookIndex];
  const chapters = currentBook.chapters;
  const currentText = chapters[selectedChapter];

  const handleNextChapter = () => {
      if (selectedChapter < chapters.length - 1) {
          setSelectedChapter(selectedChapter + 1);
          window.scrollTo(0,0);
      } else if (selectedBookIndex < bible.length - 1) {
          setSelectedBookIndex(selectedBookIndex + 1);
          setSelectedChapter(0);
          window.scrollTo(0,0);
      }
  };

  const handlePrevChapter = () => {
      if (selectedChapter > 0) {
          setSelectedChapter(selectedChapter - 1);
          window.scrollTo(0,0);
      } else if (selectedBookIndex > 0) {
          setSelectedBookIndex(selectedBookIndex - 1);
          setSelectedChapter(bible[selectedBookIndex - 1].chapters.length - 1);
          window.scrollTo(0,0);
      }
  };

  return (
    <div className="container" style={{ padding: '2rem 0' }}>
      <div className="ornament-border" style={{ background: '#fff', padding: '2rem' }}>

        {/* Navigation Controls */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', justifyContent: 'center', marginBottom: '2rem', borderBottom: '1px solid #eee', paddingBottom: '1rem' }}>
          <select
            value={selectedBookIndex}
            onChange={(e) => {
                setSelectedBookIndex(Number(e.target.value));
                setSelectedChapter(0);
            }}
            style={{ padding: '0.5rem', fontFamily: 'Cinzel, serif', fontSize: '1rem', border: '1px solid #D4AF37', borderRadius: '4px' }}
          >
            {bible.map((book, idx) => (
              <option key={idx} value={idx}>{book.name}</option>
            ))}
          </select>

          <select
            value={selectedChapter}
            onChange={(e) => setSelectedChapter(Number(e.target.value))}
            style={{ padding: '0.5rem', fontFamily: 'Cinzel, serif', fontSize: '1rem', border: '1px solid #D4AF37', borderRadius: '4px' }}
          >
            {chapters.map((_, idx) => (
              <option key={idx} value={idx}>Chapitre {idx + 1}</option>
            ))}
          </select>
        </div>

        {/* Text Display */}
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ textAlign: 'center', marginBottom: '2rem', color: '#000' }}>
                {currentBook.name} {selectedChapter + 1}
            </h2>

            <div className="font-serif" style={{ lineHeight: '1.8', fontSize: '1.2rem', textAlign: 'justify' }}>
                {currentText.map((verse, vIdx) => (
                    <span key={vIdx}>
                        <sup style={{ color: '#D4AF37', fontWeight: 'bold', marginRight: '4px' }}>{vIdx + 1}</sup>
                        {verse}{' '}
                    </span>
                ))}
            </div>
        </div>

        {/* Footer Navigation */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '3rem' }}>
            <button
                onClick={handlePrevChapter}
                disabled={selectedBookIndex === 0 && selectedChapter === 0}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none',
                    color: selectedBookIndex === 0 && selectedChapter === 0 ? '#ccc' : '#333',
                    cursor: selectedBookIndex === 0 && selectedChapter === 0 ? 'default' : 'pointer'
                }}
            >
                <ChevronLeft /> Précédent
            </button>

            <button
                onClick={handleNextChapter}
                disabled={selectedBookIndex === bible.length - 1 && selectedChapter === chapters.length - 1}
                style={{
                    display: 'flex', alignItems: 'center', gap: '0.5rem',
                    background: 'transparent', border: 'none',
                    color: selectedBookIndex === bible.length - 1 && selectedChapter === chapters.length - 1 ? '#ccc' : '#333',
                    cursor: selectedBookIndex === bible.length - 1 && selectedChapter === chapters.length - 1 ? 'default' : 'pointer'
                }}
            >
                Suivant <ChevronRight />
            </button>
        </div>

      </div>
    </div>
  );
};

export default BibleReader;
