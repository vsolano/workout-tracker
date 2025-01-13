<<<<<<< HEAD
import { useState, useEffect, useCallback } from 'react';
=======
import { useState, useEffect } from 'react';
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45

const useLocalStorage = (key, initialValue) => {
    const [storedValue, setStoredValue] = useState(() => {
        try {
            const item = window.localStorage.getItem(key);
            return item ? JSON.parse(item) : initialValue;
        } catch (error) {
<<<<<<< HEAD
            console.error("Error reading localStorage key “", key, "”: ", error);
=======
            console.log(error);
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
            return initialValue;
        }
    });

<<<<<<< HEAD
    const setValue = useCallback((value) => {
=======
    const setValue = (value) => {
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45
        try {
            const valueToStore = value instanceof Function ? value(storedValue) : value;
            setStoredValue(valueToStore);
            window.localStorage.setItem(key, JSON.stringify(valueToStore));
        } catch (error) {
<<<<<<< HEAD
            console.error("Error setting localStorage key “", key, "”: ", error);
        }
    }, [key, storedValue]);
=======
            console.log(error);
        }
    };
>>>>>>> 4353750def69b51e53ff5b530195d545a5366b45

    return [storedValue, setValue];
};

export default useLocalStorage;
