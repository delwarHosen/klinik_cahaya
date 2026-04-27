// hooks/usePageLoader.ts
import { useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
 
/**
 * usePageLoader
 *
 * Usage:
 *   const { loading, navigate } = usePageLoader();
 *   <PageLoader visible={loading} />
 *   <TouchableOpacity onPress={() => navigate('/patient/doctors_info/book_appointment')} />
 */
export function usePageLoader() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
 
  const navigate = useCallback(
    (path: string, durationMs = 1000) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        router.push(path as any);
      }, durationMs);
    },
    [router]
  );
 
  return { loading, navigate };
}