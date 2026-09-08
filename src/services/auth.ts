import { supabase, isSupabaseConfigured } from "../lib/supabase";
import { User, Profile } from "../types";

const LOCAL_USERS_KEY = "ai_prep_users";
const LOCAL_SESSION_KEY = "ai_prep_session";

interface StoredUser {
  id: string;
  email: string;
  fullName: string;
  passwordHash: string;
  createdAt: string;
}

// Simple fast SHA-256 equivalent for local password hashing
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + "_ai_prep_salt_9281");
  const hashBuffer = await crypto.subtle.digest("SHA-256", data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

export const authService = {
  async getCurrentUser(): Promise<User | null> {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { user } } = await supabase.auth.getUser();
        if (user) {
          return {
            id: user.id,
            email: user.email || "",
            fullName: user.user_metadata?.full_name || user.email?.split("@")[0] || "Student",
            createdAt: user.created_at,
          };
        }
      } catch (err) {
        console.warn("Supabase getUser error:", err);
      }
    }

    const sessionStr = localStorage.getItem(LOCAL_SESSION_KEY);
    if (!sessionStr) return null;
    try {
      const user = JSON.parse(sessionStr);
      return user;
    } catch {
      return null;
    }
  },

  async getCurrentSession(): Promise<User | null> {
    return this.getCurrentUser();
  },

  async signUp(fullName: string, email: string, password: string): Promise<{ user: User; error?: string }> {
    const trimmedName = fullName.trim();
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedName) {
      throw new Error("Please enter your name.");
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      throw new Error("Please enter a valid email address.");
    }

    if (password.length < 8) {
      throw new Error("Password must contain at least 8 characters.");
    }

    // Supabase Auth
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: trimmedEmail,
        password,
        options: {
          data: {
            full_name: trimmedName,
          },
        },
      });

      if (error) {
        if (error.message.toLowerCase().includes("already registered") || error.status === 422) {
          throw new Error("An account with this email already exists.");
        }
        throw new Error(error.message);
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: trimmedEmail,
          fullName: trimmedName,
          createdAt: data.user.created_at,
        };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
        return { user };
      }
    }

    // Local Storage persistence engine
    const usersStr = localStorage.getItem(LOCAL_USERS_KEY) || "[]";
    const users: StoredUser[] = JSON.parse(usersStr);

    if (users.some((u) => u.email === trimmedEmail)) {
      throw new Error("An account with this email already exists.");
    }

    const passwordHash = await hashPassword(password);
    const newUser: StoredUser = {
      id: "usr_" + Math.random().toString(36).substring(2, 9) + Date.now().toString(36),
      email: trimmedEmail,
      fullName: trimmedName,
      passwordHash,
      createdAt: new Date().toISOString(),
    };

    users.push(newUser);
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));

    const userObj: User = {
      id: newUser.id,
      email: newUser.email,
      fullName: newUser.fullName,
      createdAt: newUser.createdAt,
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
    return { user: userObj };
  },

  async login(email: string, password: string): Promise<{ user: User }> {
    const trimmedEmail = email.trim().toLowerCase();

    if (!trimmedEmail) {
      throw new Error("Please enter your email address.");
    }
    if (!password) {
      throw new Error("Please enter your password.");
    }

    // Try Supabase first if configured
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: trimmedEmail,
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes("invalid login credentials")) {
          throw new Error("Invalid email or password. Please try again.");
        }
        throw new Error(error.message);
      }

      if (data.user) {
        const user: User = {
          id: data.user.id,
          email: trimmedEmail,
          fullName: data.user.user_metadata?.full_name || trimmedEmail.split("@")[0] || "Student",
          createdAt: data.user.created_at,
        };
        localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(user));
        return { user };
      }
    }

    // Local fallback verification
    const usersStr = localStorage.getItem(LOCAL_USERS_KEY) || "[]";
    const users: StoredUser[] = JSON.parse(usersStr);
    const existingUser = users.find((u) => u.email === trimmedEmail);

    if (!existingUser) {
      throw new Error("No account found with this email.");
    }

    const inputHash = await hashPassword(password);
    if (inputHash !== existingUser.passwordHash) {
      throw new Error("Invalid email or password. Please try again.");
    }

    const userObj: User = {
      id: existingUser.id,
      email: existingUser.email,
      fullName: existingUser.fullName,
      createdAt: existingUser.createdAt,
    };

    localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify(userObj));
    return { user: userObj };
  },

  async resetPassword(email: string): Promise<void> {
    const trimmedEmail = email.trim().toLowerCase();
    if (!trimmedEmail) {
      throw new Error("Please enter your email address.");
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.resetPasswordForEmail(trimmedEmail);
      if (error) throw new Error(error.message);
      return;
    }

    const usersStr = localStorage.getItem(LOCAL_USERS_KEY) || "[]";
    const users: StoredUser[] = JSON.parse(usersStr);
    const userExists = users.some((u) => u.email === trimmedEmail);

    if (!userExists) {
      throw new Error("No account found with this email.");
    }
  },

  async updatePassword(newPassword: string): Promise<void> {
    if (newPassword.length < 8) {
      throw new Error("Password must contain at least 8 characters.");
    }

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw new Error(error.message);
      return;
    }

    const session = await this.getCurrentUser();
    if (!session) throw new Error("No active session found.");

    const usersStr = localStorage.getItem(LOCAL_USERS_KEY) || "[]";
    const users: StoredUser[] = JSON.parse(usersStr);
    const userIdx = users.findIndex((u) => u.id === session.id);

    if (userIdx !== -1) {
      users[userIdx].passwordHash = await hashPassword(newPassword);
      localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
    }
  },

  async logout(): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (err) {
        console.warn("Supabase signOut error:", err);
      }
    }
    localStorage.removeItem(LOCAL_SESSION_KEY);
  },
};
