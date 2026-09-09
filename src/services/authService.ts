import { CmsUser } from '../types/cms';
import { SupabaseService } from './supabaseService';

// Precomputed SHA-256 cryptographic digests for authorized Super Admins
const AUTHORIZED_ADMIN_DIGESTS: Record<string, { hash: string; user: CmsUser }> = {
  'bhatsaakib505@gmail.com': {
    hash: '2daa8799c6405067870d1d7384369f058fdf2a5a6a13a43bd17ab1a36e5a10fe',
    user: {
      id: 'admin-saakib',
      name: 'Saquib Nazeer',
      email: 'bhatsaakib505@gmail.com',
      role: 'Super Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
      contributionsCount: 14,
      lastLogin: 'Active Now',
      districtLocation: 'Srinagar'
    }
  },
  'mohmmadaminbhat1@gmail.com': {
    hash: 'd3b3d01778cc3bd5a294015147ca56d91929e43d05638f955aefaf8451ac961a',
    user: {
      id: 'admin-sahil',
      name: 'Bhat Sahil',
      email: 'mohmmadaminbhat1@gmail.com',
      role: 'Super Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      contributionsCount: 28,
      lastLogin: 'Active Now',
      districtLocation: 'Srinagar'
    }
  },
  'saahilahbhat1@gmail.com': {
    hash: 'd3b3d01778cc3bd5a294015147ca56d91929e43d05638f955aefaf8451ac961a',
    user: {
      id: 'admin-sahil',
      name: 'Bhat Sahil',
      email: 'mohmmadaminbhat1@gmail.com',
      role: 'Super Admin',
      status: 'Active',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
      contributionsCount: 28,
      lastLogin: 'Active Now',
      districtLocation: 'Srinagar'
    }
  }
};

/**
 * Compute SHA-256 hash using native Web Crypto API
 */
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

export class AuthService {
  /**
   * Authenticate user credentials securely without exposing plain-text passwords
   */
  static async authenticate(emailInput: string, passwordInput: string): Promise<{ success: boolean; user?: CmsUser; message?: string }> {
    const email = emailInput.trim().toLowerCase();
    const password = passwordInput.trim();

    if (!email || !password) {
      return { success: false, message: 'Please enter both email and password.' };
    }

    // Compute input password hash
    const inputHash = await sha256(password);

    // 1. Check Dynamically Created or Updated CMS Users from Database First
    try {
      const users = await SupabaseService.getUsers();
      const matchedUser = users.find(u => u.email.toLowerCase() === email);

      if (matchedUser) {
        if (matchedUser.status !== 'Active') {
          return { success: false, message: 'Your account is currently disabled or suspended. Contact Super Admin.' };
        }

        // If user has a modified/set passwordHash stored in DB
        const userHash = (matchedUser as any).passwordHash;
        if (userHash) {
          if (userHash === inputHash) {
            const user = { ...matchedUser, lastLogin: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) };
            await SupabaseService.saveUser(user).catch(() => {});
            await SupabaseService.addActivityLog({
              user: user.name,
              action: 'Logged into Admin Dashboard',
              target: 'Security Session',
              badgeType: 'security'
            }).catch(() => {});
            return { success: true, user };
          } else {
            return { success: false, message: 'Invalid password. Please check your credentials.' };
          }
        }
      }
    } catch (err) {
      console.warn('Database user auth error:', err);
    }

    // 2. Fallback to Primary Authorized Super Admin Precomputed Hashes
    const primaryAdmin = AUTHORIZED_ADMIN_DIGESTS[email];
    if (primaryAdmin) {
      if (primaryAdmin.hash === inputHash) {
        const user = { ...primaryAdmin.user, lastLogin: new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' }) };
        await SupabaseService.addActivityLog({
          user: user.name,
          action: 'Logged into Admin Dashboard',
          target: 'Security Session',
          badgeType: 'security'
        }).catch(() => {});
        return { success: true, user };
      } else {
        return { success: false, message: 'Invalid password. Please check your credentials.' };
      }
    }

    return { success: false, message: 'Unauthorized email address. Only designated editorial users can access this system.' };
  }
}
