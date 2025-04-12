import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

// Import components
import Dashboard from '../pages/Dashboard.tsx';
import Trade from '../pages/Trade.tsx';
import Portfolio from '../pages/Portfolio.tsx';

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex flex-col min-h-screen">
        <header className="bg-gray-800 text-white py-4">
          <div className="container mx-auto flex justify-between items-center px-4">
            <h1 className="text-2xl font-bold">Perpetual DEX</h1>
            <nav>
              <ul className="flex space-x-6">
                <li>
                  <Link to="/" className="hover:text-blue-300">Dashboard</Link>
                </li>
                <li>
                  <Link to="/trade" className="hover:text-blue-300">Trade</Link>
                </li>
                <li>
                  <Link to="/portfolio" className="hover:text-blue-300">Portfolio</Link>
                </li>
              </ul>
            </nav>
          </div>
        </header>

        <main className="flex-grow container mx-auto px-4 py-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/trade" element={<Trade />} />
            <Route path="/portfolio" element={<Portfolio />} />
          </Routes>
        </main>

        <footer className="bg-gray-800 text-white py-4">
          <div className="container mx-auto px-4 text-center">
            <p>© 2023 Perpetual DEX. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </Router>
  );
};

export default App;