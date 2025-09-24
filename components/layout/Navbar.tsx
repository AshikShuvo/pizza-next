import Link from 'next/link';

export default function Navbar() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="container mx-auto">
        <div className="flex items-center justify-between">
          <Link href={`/`} className="text-xl font-bold hover:text-gray-300">
            Peppes App
          </Link>
          
          <div className="space-x-4">
            <Link href={`/`} className="hover:text-gray-300">
              Home
            </Link>
            <Link href={`/`} className="hover:text-gray-300">
              About
            </Link>
            <Link href={`/`} className="hover:text-gray-300">
              Contact
            </Link>
          </div>
        </div>
      </nav>
    </header>
  );
}
