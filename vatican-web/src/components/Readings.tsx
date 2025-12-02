// src/components/Readings.tsx
import React, { useEffect, useState } from 'react';
import { fetchDailyReadings } from '../services/aelf';
import type { AelfResponse, AelfLecture } from '../types/aelf';
import { format } from 'date-fns';
import { fr } from 'date-fns/locale';

const Readings: React.FC = () => {
  const [data, setData] = useState<AelfResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDailyReadings(new Date())
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Chargement de la liturgie...</div>;
  if (error) return <div style={{ textAlign: 'center', color: 'red', padding: '2rem' }}>Erreur: {error}</div>;
  if (!data) return null;

  const info = data.informations;
  const messe = data.messes[0];

  const getColorClass = (color: string) => {
    if (color.includes('vert')) return 'liturgy-green';
    if (color.includes('rouge')) return 'liturgy-red';
    if (color.includes('violet')) return 'liturgy-violet';
    return 'liturgy-white';
  };

  return (
    <div className="container" style={{ paddingBottom: '2rem' }}>
      <div style={{ textAlign: 'center', margin: '2rem 0' }}>
        <h2 style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>
            {info.semaine || info.jour_liturgique_nom}
        </h2>
        <div style={{ fontSize: '1.2rem', color: '#666' }}>
          {format(new Date(), 'EEEE d MMMM yyyy', { locale: fr })}
        </div>
        <div style={{
            display: 'inline-block',
            marginTop: '1rem',
            padding: '0.2rem 1rem',
            borderRadius: '20px',
            backgroundColor: 'var(--vatican-gold)',
            color: 'white',
            textTransform: 'capitalize'
        }}>
            {info.couleur}
        </div>
      </div>

      <div style={{ display: 'grid', gap: '2rem' }}>
        {messe.lectures.map((lecture: AelfLecture, index: number) => (
          <div key={index} className={`ornament-border ${getColorClass(info.couleur)}`} style={{ background: '#fff' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '1rem', borderBottom: '1px solid #eee', paddingBottom: '0.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', color: '#444' }}>
                    {lecture.type === 'evangile' ? 'Évangile' :
                     lecture.type === 'psaume' ? 'Psaume' :
                     lecture.type === 'lecture_1' ? 'Première Lecture' :
                     lecture.type === 'lecture_2' ? 'Deuxième Lecture' : lecture.type}
                </h3>
                <span style={{ fontFamily: 'serif', fontStyle: 'italic', color: '#888' }}>{lecture.ref}</span>
            </div>

            {lecture.titre && <h4 style={{ color: '#000', marginBottom: '1rem' }}>{lecture.titre}</h4>}

            <div
                className="font-serif"
                style={{ lineHeight: '1.8', fontSize: '1.1rem', textAlign: 'justify' }}
                dangerouslySetInnerHTML={{ __html: lecture.contenu }}
            />

            {lecture.verset_evangile && (
                <div style={{ marginTop: '1rem', fontStyle: 'italic', borderLeft: '3px solid gold', paddingLeft: '1rem' }}>
                    <strong>Acclamation :</strong> <span dangerouslySetInnerHTML={{ __html: lecture.verset_evangile }} />
                </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Readings;
