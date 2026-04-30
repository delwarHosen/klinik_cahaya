import { useAppSelector } from '@/redux/hooks';
import { Redirect, Stack } from 'expo-router';

export default function PatientLayout() {
  const { access_token, role } = useAppSelector((state) => state.auth);

  if (!access_token) return <Redirect href="/(auth)/login" />;
  if (role === 'admin') return <Redirect href="/admin/home" />;

  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}