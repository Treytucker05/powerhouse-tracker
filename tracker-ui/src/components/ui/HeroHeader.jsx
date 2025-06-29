export default function HeroHeader() {
  return (
    <div className="pt-6 text-center">
      <h1 className="text-4xl md:text-5xl font-extrabold text-white/90 tracking-tight" style={{
        background: 'linear-gradient(135deg, #FFF 0%, #FAFAFA 100%)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text'
      }}>
        Welcome back, <span className="text-accent-red" style={{ textShadow: '0 0 10px rgba(239, 68, 68, 0.3)' }}>Trey</span>! 💪
      </h1>
      <p className="text-gray-400 opacity-80 text-lg">Ready to crush your training goals today?</p>
      <div className="mt-6 w-32 h-px bg-gradient-to-r from-transparent via-accent-red to-transparent mx-auto opacity-50"></div>
    </div>
  );
}
