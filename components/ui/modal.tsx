'use client';

import { ReactNode } from 'react';

interface ModalProps {
  title: string;
  children: ReactNode;
  onClose: () => void;
}

export function Modal({ title, children, onClose }: ModalProps) {
  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-stone-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        <div className="flex justify-between items-center px-6 py-5 border-b border-stone-100 bg-stone-50/50">
          <h2 className="text-lg font-bold text-stone-800 tracking-tight">{title}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-stone-200/50 flex items-center justify-center hover:bg-stone-200 text-stone-500 transition-colors"
          >
            ✕
          </button>
        </div>
        <div className="p-6 max-h-[80vh] overflow-y-auto">{children}</div>
      </div>
    </div>
  );
}
