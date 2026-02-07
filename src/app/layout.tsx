import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { getSession } from '@/utils/session';
import LogoutButton from '@/views/LogoutButton';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Politician9000',
  description: 'ดูและติดตามคำมั่นสัญญาทางการเมืองของนักการเมืองไทย',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();

  return (
    <html lang="th">
      <body className={inter.className}>
        <div className="min-h-screen bg-gray-50">
          <nav className="bg-white shadow-sm border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-16 items-center">
                <div className="flex-shrink-0">
                  <h1 className="text-xl font-bold text-blue-500">
                    Politician9000
                  </h1>
                </div>
                <div className="flex space-x-4 items-center">
                  <a
                    href="/"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    คำมั่นสัญญา
                  </a>
                  <a
                    href="/politicians"
                    className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
                  >
                    นักการเมือง
                  </a>
                  {session ? (
                    <>
                      <span className="text-gray-700 text-sm">
                        Welcome, <span className="font-medium">{session.user.username}</span>
                        {session.user.role === 'admin' && (
                          <span className="ml-1 px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                            Admin
                          </span>
                        )}
                      </span>
                      <LogoutButton />
                    </>
                  ) : (
                    <a
                      href="/login"
                      className="bg-blue-500 text-white hover:bg-blue-600 px-4 py-2 rounded-md text-sm font-medium"
                    >
                      Login
                    </a>
                  )}
                </div>
              </div>
            </div>
          </nav>
          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
