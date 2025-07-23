/**
 * useAutoSave Hook
 * 
 * Provides auto-save functionality for forms
 */
import { useEffect, useRef, useState } from 'react';
import { useDebounce } from './use-debounce';

interface UseAutoSaveOptions {
  data: any;
  onSave: (data: any) => Promise<void>;
  delay?: number;
  enabled?: boolean;
}

export function useAutoSave({ data, onSave, delay = 2000, enabled = true }: UseAutoSaveOptions) {
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');
  const [lastSaved, setLastSaved] = useState<Date>();
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const lastSavedData = useRef<any>(null);
  const debouncedData = useDebounce(data, delay);

  useEffect(() => {
    if (!enabled || !debouncedData) return;

    // Check if data has actually changed
    const dataString = JSON.stringify(debouncedData);
    const lastSavedString = JSON.stringify(lastSavedData.current);
    
    if (dataString === lastSavedString) return;

    setHasUnsavedChanges(true);
    setStatus('saving');

    onSave(debouncedData)
      .then(() => {
        setStatus('saved');
        setLastSaved(new Date());
        setHasUnsavedChanges(false);
        lastSavedData.current = debouncedData;
        
        // Reset to idle after 3 seconds
        setTimeout(() => setStatus('idle'), 3000);
      })
      .catch((error) => {
        console.error('Auto-save failed:', error);
        setStatus('error');
        
        // Reset to idle after 5 seconds on error
        setTimeout(() => setStatus('idle'), 5000);
      });
  }, [debouncedData, enabled, onSave]);

  // Track initial data
  useEffect(() => {
    if (lastSavedData.current === null && data) {
      lastSavedData.current = data;
    }
  }, [data]);

  return {
    status,
    lastSaved,
    hasUnsavedChanges,
    resetUnsavedChanges: () => setHasUnsavedChanges(false)
  };
}