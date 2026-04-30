export type AuthState = {
  token: string | null;
  role: 'patient' | 'admin' | null;
  user: Record<string, unknown> | null;
};

export type RootState = {
  auth: AuthState;
  api: ReturnType<typeof import('@/redux/baseApi').baseApi.reducer>;
};