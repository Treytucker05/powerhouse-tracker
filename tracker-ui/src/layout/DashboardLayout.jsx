import NavBar from '../components/NavBar';

export default function DashboardLayout({ children, user, onSignOut }) {
  return (
    <div className="min-h-screen bg-gray-950">
      <NavBar user={user} onSignOut={onSignOut} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
