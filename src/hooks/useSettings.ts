import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';

export interface Setting {
  key: string;
  value: string;
}

export const useSettings = () => {
  const [settings, setSettings] = useState<Setting[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSettings = async () => {
    const { data, error } = await supabase
      .from('site_settings')
      .select('key, value');
    
    if (!error && data) {
      setSettings(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  return { settings, loading, refreshSettings: fetchSettings };
};
