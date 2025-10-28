import { useState, useEffect } from 'react';

// Define the interface for the BeforeInstallPromptEvent, which is not yet a standard
// part of the TypeScript DOM library.
interface BeforeInstallPromptEvent extends Event {
  readonly platforms: Array<string>;
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed',
    platform: string,
  }>;
  prompt(): Promise<void>;
}

export const usePWAInstall = () => {
  const [installPrompt, setInstallPrompt] = useState<BeforeInstallPromptEvent | null>(null);

  useEffect(() => {
    const handler = (e: Event) => {
      // Prevent the mini-infobar from appearing on mobile.
      e.preventDefault();
      // Stash the event so it can be triggered later.
      setInstallPrompt(e as BeforeInstallPromptEvent);
    };

    window.addEventListener('beforeinstallprompt', handler);

    // Listen for the 'appinstalled' event to know when the app has been successfully installed.
    const appInstalledHandler = () => {
      // Clear the deferred prompt, as it can only be used once.
      setInstallPrompt(null);
    };

    window.addEventListener('appinstalled', appInstalledHandler);


    // Cleanup event listeners when the component unmounts.
    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
      window.removeEventListener('appinstalled', appInstalledHandler);
    };
  }, []);

  const triggerInstall = () => {
    if (!installPrompt) {
      return;
    }
    // Show the browser's installation prompt.
    installPrompt.prompt();
  };

  return { 
    // A boolean to indicate if the installation prompt is available.
    canInstall: !!installPrompt, 
    // A function to trigger the installation prompt.
    triggerInstall 
  };
};
