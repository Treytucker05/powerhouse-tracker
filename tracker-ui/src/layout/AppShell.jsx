import ThemeToggle from "../components/ui/ThemeToggle.jsx";

export default function AppShell({ children }) {
  return (
    <>
      <nav className="bg-gray-800 text-white p-4 flex justify-between">
        <div className="flex space-x-4">
          {/** Navigation buttons inserted in App component */}
        </div>
        <ThemeToggle />
      </nav>
      <main>{children}</main>
    </>
  );
}
