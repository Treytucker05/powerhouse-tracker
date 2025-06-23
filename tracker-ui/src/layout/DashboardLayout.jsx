import NavBar from '../components/NavBar';
import Header from '../components/dashboard/Header';

export default function DashboardLayout({ children, user, onSignOut }) {
  return (
    <div className="min-h-screen bg-black">
      <Header />
      <NavBar user={user} onSignOut={onSignOut} />
      <main className="container mx-auto px-4 py-6">
        {children}
      </main>
    </div>
  );
}
