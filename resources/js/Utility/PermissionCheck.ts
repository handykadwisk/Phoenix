import { useState, useEffect } from 'react';

export function usePermittedClasses(permission: any[]) {
    const [permittedClasses, setPermittedClasses] = useState<string[]>([]);

    useEffect(() => {
        if (permission.length > 0) {
            const extractedClasses = permission.map((p: any) => p.permission_class_name);
            setPermittedClasses(extractedClasses);
        } else {
            setPermittedClasses([]);
        }
    }, [permission]);

    return permittedClasses;
}