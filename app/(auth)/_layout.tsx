import { useAppSelector } from '@/redux/hooks';
import { Redirect, Stack } from 'expo-router';

export default function AuthLayout() {
  const { access_token, role } = useAppSelector((state) => state.auth);

  
  if (access_token) {
    if (role === 'admin') return <Redirect href="/admin/home" />;
    return <Redirect href="/patient/(tabs)/home" />;
  }

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}