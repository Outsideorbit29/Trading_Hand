
import React from 'react';
import { CheckCircleIcon, XCircleIcon } from './Icons';

interface ToastProps {
  message: string;
  type: 'success' | 'error';
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  const isSuccess = type === 'success';
  const bgColor = isSuccess ? 'bg-green-500/20' : 'bg-red-500/20';
  const borderColor = isSuccess ? 'border-green-500' : 'border-red-500';
  const textColor = isSuccess ? 'text-green-300' : 'text-red-300';

  return (
    <div 
      className={`fixed top-5 right-5 z-50 flex items-center p-4 rounded-lg shadow-lg border-l-4 ${bgColor} ${borderColor} animate-fade-in-right`}
      role="alert"
    >
      <div className="flex-shrink-0">
        {isSuccess ? <CheckCircleIcon /> : <XCircleIcon />}
      </div>
      <div className={`ml-3 text-sm font-medium ${textColor}`}>
        {message}
      </div>
      <button 
        type="button" 
        className="ml-auto -mx-1.5 -my-1.5 bg-transparent rounded-lg focus:ring-2 focus:ring-gray-400 p-1.5 hover:bg-gray-700/50 inline-flex h-8 w-8 text-gray-400" 
        onClick={onClose} 
        aria-label="Close"
      >
        <span className="sr-only">Close</span>
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"></path></svg>
      </button>
      <style>{`
        @keyframes fade-in-right {
          from {
            opacity: 0;
            transform: translateX(100%);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .animate-fade-in-right {
          animation: fade-in-right 0.5s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Toast;
