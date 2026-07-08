
import React, { useState } from 'react';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Search from './pages/Search';
import Recommendation from './pages/Recommendation';
import ConstitutionTest from './pages/ConstitutionTest';
import UserManagement from './pages/UserManagement';
import { PageView, User } from './types';

const App: React.FC = () => {
  // Simple state-based router for demo purposes.
  // In a real app, use react-router-dom
  const [user, setUser] = useState<User | null>(null);
  const [currentPage, setCurrentPage] = useState<PageView>('dashboard');

  const handleLogin = (userData: User) => {
    setUser(userData);
    setCurrentPage('dashboard');
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentPage('login');
  };

  // Render the appropriate page content
  const renderContent = () => {
    switch (currentPage) {
      case 'dashboard':
        return <Dashboard user={user!} onNavigate={setCurrentPage} />;
      case 'search':
        return <Search />;
      case 'recommendation':
        return <Recommendation />;
      case 'test':
        return <ConstitutionTest />;
      case 'users':
        return user?.role === 'admin' ? (
          <UserManagement currentUser={user} />
        ) : (
          <div className="text-center py-20">无权访问</div>
        );
      default:
        return <Dashboard user={user!} onNavigate={setCurrentPage} />;
    }
  };

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-tcm-50 font-sans text-tcm-900">
      <Navbar 
        user={user} 
        currentPage={currentPage} 
        onNavigate={setCurrentPage}
        onLogout={handleLogout}
      />
      <main className="flex-1 ml-64 p-8 transition-all duration-300">
        {renderContent()}
      </main>
    </div>
  );
};

export default App;
