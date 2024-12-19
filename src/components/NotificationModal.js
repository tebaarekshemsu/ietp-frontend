import React, { useEffect } from 'react';
import { X } from 'react-feather';

const NotificationModal = ({ isOpen, onClose, notifications }) => {
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg p-6 w-full max-w-md shadow-lg transform scale-95 animate-fadeIn">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold text-green-800">Notifications</h2>
          <button
            onClick={onClose}
            className="text-green-800 hover:text-green-600"
            aria-label="Close Notifications"
          >
            <X size={24} />
          </button>
        </div>

        {notifications.length > 0 ? (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {notifications.map((notification, index) => (
              <li
                key={index}
                className={`bg-green-100 border-l-4 ${
                  notification.read ? 'border-gray-500' : 'border-green-700'
                } text-green-800 p-4 rounded`}
              >
                <p className="font-medium">{notification.message}</p>
                <p className="text-sm text-green-600 mt-1">
                  {new Date(notification.timestamp).toLocaleString(undefined, {
                    dateStyle: 'medium',
                    timeStyle: 'short',
                  })}
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-green-600">No new notifications</p>
        )}
      </div>
    </div>
  );
};

export default NotificationModal;
