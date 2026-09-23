import React from 'react';
import { Plus } from 'lucide-react';

export function FloatingAddButton({ onClick }) {
  return (
    <button 
      className="fab-button"
      onClick={onClick}
      title="Tambah Lamaran Baru (+)"
      aria-label="Tambah Lamaran Baru"
    >
      <Plus size={26} />
    </button>
  );
}
