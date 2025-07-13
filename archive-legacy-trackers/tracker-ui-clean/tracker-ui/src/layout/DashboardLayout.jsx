import Header from '../components/dashboard/Header';

export default function DashboardLayout({ children, user, onSignOut }) {
  return (
    <div className="min-h-screen bg-black">
      <Header user={user} onSignOut={onSignOut} />      {/* Add top padding to account for fixed header */}
      <main 
        className="container mx-auto px-6 py-6 transition-all duration-300 ease-in-out max-w-7xl" 
        style={{ 
          paddingTop: '80px', // Space for single header (80px)
          minHeight: 'calc(100vh - 80px)'
        }}
      >
        {children}
      </main>
    </div>
  );
}
