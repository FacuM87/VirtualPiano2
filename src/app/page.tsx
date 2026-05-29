export default function Home() {
  return (
    <main
      style={{
        display: 'flex',
        minHeight: '100vh',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',
        gap: '1rem',
      }}
    >
      <h1 style={{ fontSize: '1.5rem', letterSpacing: '0.2em', margin: 0 }}>
        VIRTUAL PIANO
      </h1>
      <p style={{ color: '#4a5568', fontSize: '0.875rem', margin: 0 }}>
        Fase 1 — Setup completado
      </p>
    </main>
  )
}
