import { useEffect, useState } from "react"

export function useLocalStorage<T>(key: string, initialValue: T) {
    const [value, setValue] = useState<T>(initialValue);
    const [hydrated, setHydrated] = useState(false);

    useEffect(() => {
        try {
            const stored = window.localStorage.getItem(key)
            if (stored) setValue(JSON.parse(stored));
        } catch {}
        finally{
            setHydrated(true);
        }

    }, [key])
    
    useEffect(() => {
        if(!hydrated) return;

        try {
            window.localStorage.setItem(key, JSON.stringify(value));
        } catch {}
    }, [key, value, hydrated])
 
    return [value, setValue] as const;
}