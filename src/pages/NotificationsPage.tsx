
import React from 'react';
import NotificationCenter from '@/components/notifications/NotificationCenter';

const NotificationsPage = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Notifications</h1>
      <NotificationCenter />
    </div>
  );
};

export default NotificationsPage;
