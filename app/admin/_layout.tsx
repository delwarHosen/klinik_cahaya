import { useAppSelector } from '@/redux/hooks';
import { Redirect, Stack } from 'expo-router';

export default function AdminLayout() {
  const { access_token, role } = useAppSelector((state) => state.auth);

  if (!access_token) return <Redirect href="/(auth)/login" />;
  if (role !== 'admin') return <Redirect href="/patient/(tabs)/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}