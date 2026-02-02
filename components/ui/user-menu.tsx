'use client';

import { useState, useRef, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut, Shield, ChevronDown, Trash2 } from 'lucide-react';
import { useAuth } from '@/contexts/auth-context';
import { DeleteAccountModal } from '@/components/modals';

export function UserMenu() {
  const router = useRouter();
  const { userProfile, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = async () => {
    setIsOpen(false);
    await logout();
    router.push('/login');
  };

  const handleAdminDashboard = () => {
    setIsOpen(false);
    router.push('/admin');
  };

  const handleDeleteAccount = () => {
    setIsOpen(false);
    setShowDeleteModal(true);
  };

  if (!userProfile) {
    return null;
  }

  const displayName = userProfile.displayName || userProfile.email.split('@')[0];
  const initials = displayName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 p-1.5 hover:bg-stone-100 rounded-xl transition-colors"
      >
        <div className="w-8 h-8 bg-rose-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
          {initials}
        </div>
        <ChevronDown
          className={`w-4 h-4 text-stone-400 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-white rounded-2xl border border-stone-200 shadow-xl overflow-hidden z-50">
          <div className="p-4 border-b border-stone-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-rose-500 rounded-xl flex items-center justify-center text-white font-bold">
                {initials}
              </div>
              <div className="flex-1 min-w-0">
                <p className="font-bold text-stone-900 truncate">{displayName}</p>
                <p className="text-sm text-stone-500 truncate">{userProfile.email}</p>
              </div>
            </div>
            {userProfile.isAdmin && (
              <div className="mt-3 flex items-center gap-1 text-xs text-rose-500">
                <Shield className="w-3 h-3" />
                <span className="font-medium">System-Administrator</span>
              </div>
            )}
          </div>

          <div className="p-2">
            {userProfile.isAdmin && (
              <button
                onClick={handleAdminDashboard}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-700 hover:bg-stone-50 transition-colors"
              >
                <Shield className="w-4 h-4" />
                <span className="font-medium">Admin Dashboard</span>
              </button>
            )}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-stone-600 hover:bg-stone-50 transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span className="font-medium">Abmelden</span>
            </button>

            <div className="border-t border-stone-100 mt-2 pt-2">
              <button
                onClick={handleDeleteAccount}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-colors"
              >
                <Trash2 className="w-4 h-4" />
                <span className="font-medium">Konto löschen</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <DeleteAccountModal onClose={() => setShowDeleteModal(false)} />
      )}
    </div>
  );
}
