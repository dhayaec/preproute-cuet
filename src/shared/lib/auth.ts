export function getToken(): string | null {
  return localStorage.getItem('token') || null;
}

export function hasToken(): boolean {
  return !!getToken();
}

export function validateJwt(token: string): boolean {
  // From Overview doc / backend spec: token is JWT; minimal structural check
  if (!token) return false;
  const parts = token.split('.');
  if (parts.length !== 3) return false;
  try {
    const payload = JSON.parse(atob(parts[1].replace(/-/g, '+').replace(/_/g, '/')));
    if (payload.exp && Date.now() > payload.exp * 1000) return false;
    return true;
  } catch {
    return false;
  }
}

export function isAuthenticated(): boolean {
  const token = getToken();
  if (!token) return false;
  return validateJwt(token);
}
