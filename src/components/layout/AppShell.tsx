import { Outlet } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { TopHeader } from './TopHeader';
import { ChatbotWidget } from '../chat/ChatbotWidget';

export const AppShell: React.FC = () => {
  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f5f6f8' }}>
      <Sidebar />
      <div style={{ flex: 1, marginLeft: 224, display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
        <TopHeader />
        <main style={{ flex: 1, padding: '24px 28px', maxWidth: '100%', overflowX: 'hidden' }}>
          <Outlet />
        </main>
      </div>

      <ChatbotWidget />
    </div>
  );
};
