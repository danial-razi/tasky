import React, { useState } from 'react';
import { SunIcon, MoonIcon, ExportIcon, UndoIcon, RedoIcon, TagIcon, InstallIcon } from './Icons';
import { usePWAInstall } from '../hooks/usePWAInstall';

interface HeaderProps {
  theme: 'light' | 'dark';
  toggleTheme: () => void;
  onExportJSON: () => void;
  onExportCSV: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  onOpenTagManager: () => void;
}

const Header: React.FC<HeaderProps> = ({ theme, toggleTheme, onExportJSON, onExportCSV, onUndo, onRedo, canUndo, canRedo, onOpenTagManager }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { canInstall, triggerInstall } = usePWAInstall();

  return (
    <header className="py-4">
      <div className="max-w-4xl mx-auto px-4 flex justify-between items-center">
        <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100">
          Tasky
        </h1>
        <div className="flex items-center gap-2 sm:gap-4">
          {canInstall && (
            <button
              onClick={triggerInstall}
              className="flex items-center gap-2 px-3 py-2 bg-sky-600 text-white font-semibold rounded-md hover:bg-sky-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-sky-500 dark:focus:ring-offset-zinc-950 transition-colors"
              aria-label="Install app"
              title="Install App"
            >
              <InstallIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Install App</span>
            </button>
          )}

          <div className="flex items-center space-x-1">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Undo"
              title="Undo"
            >
              <UndoIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-transparent"
              aria-label="Redo"
              title="Redo"
            >
              <RedoIcon className="w-6 h-6" />
            </button>
            <button
              onClick={onOpenTagManager}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
              aria-label="Manage tags"
              title="Manage Tags"
            >
              <TagIcon className="w-6 h-6" />
            </button>
            <div className="relative">
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
                aria-label="Export options"
                title="Export Tasks"
              >
                <ExportIcon className="w-6 h-6" />
              </button>
              {isMenuOpen && (
                <div 
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-zinc-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="options-menu"
                >
                  <button onClick={() => { onExportJSON(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700">
                    Export to JSON
                  </button>
                  <button onClick={() => { onExportCSV(); setIsMenuOpen(false); }} className="w-full text-left block px-4 py-2 text-sm text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-zinc-700">
                    Export to CSV
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:bg-slate-200 dark:hover:bg-zinc-800"
              aria-label="Toggle theme"
              title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
            >
              {theme === 'light' ? <MoonIcon className="w-6 h-6" /> : <SunIcon className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default React.memo(Header);