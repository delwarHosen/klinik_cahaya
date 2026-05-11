// hooks/usePageLoader.ts
import { useRouter } from 'expo-router';
import { useCallback } from 'react';

export function usePageLoader() {
  const router = useRouter();

  const navigate = useCallback(
    (path: string) => {
      router.push(path as any);
    },
    [router]
  );

  
  return { loading: false, navigate };
}