const AUTH_STORAGE_KEY = 'RH_ADMIN_AUTH_V1';

interface AuthConfig {
  pinHash: string;
  recoveryEmail: string;
}

const textEncoder = new TextEncoder();

async function hashPin(pin: string): Promise<string> {
  const digest = await crypto.subtle.digest('SHA-256', textEncoder.encode(`RH:${pin}:V1`));
  return Array.from(new Uint8Array(digest), (byte) => byte.toString(16).padStart(2, '0')).join('');
}

export async function getAuthConfig(recoveryEmail: string): Promise<AuthConfig> {
  const stored = localStorage.getItem(AUTH_STORAGE_KEY);
  if (stored) {
    try {
      const parsed = JSON.parse(stored) as Partial<AuthConfig>;
      if (parsed.pinHash && typeof parsed.pinHash === 'string') {
        return {
          pinHash: parsed.pinHash,
          recoveryEmail: typeof parsed.recoveryEmail === 'string' && parsed.recoveryEmail
            ? parsed.recoveryEmail
            : recoveryEmail,
        };
      }
    } catch {
      // Invalid local configuration is replaced below.
    }
  }

  const config = { pinHash: await hashPin('1234'), recoveryEmail };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(config));
  return config;
}

export async function verifyPin(pin: string, recoveryEmail: string): Promise<boolean> {
  const config = await getAuthConfig(recoveryEmail);
  return (await hashPin(pin)) === config.pinHash;
}

export async function updatePin(pin: string, recoveryEmail: string): Promise<void> {
  const config = { pinHash: await hashPin(pin), recoveryEmail: recoveryEmail.trim().toLowerCase() };
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(config));
}

export async function setRecoveryEmail(recoveryEmail: string): Promise<void> {
  const config = await getAuthConfig(recoveryEmail);
  localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify({
    ...config,
    recoveryEmail: recoveryEmail.trim().toLowerCase(),
  }));
}
