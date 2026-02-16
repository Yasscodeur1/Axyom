/**
 * Service d'authentification
 * Gestion du token et des requêtes authentifiées
 */

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

/**
 * Récupérer le token d'authentification depuis localStorage
 */
export const getAuthToken = (): string | null => {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("auth_token");
};

/**
 * Sauvegarder le token d'authentification
 */
export const setAuthToken = (token: string): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("auth_token", token);
};

/**
 * Supprimer le token d'authentification (logout)
 */
export const removeAuthToken = (): void => {
  if (typeof window === "undefined") return;
  localStorage.removeItem("auth_token");
  localStorage.removeItem("user_data");
};

/**
 * Interface pour les données utilisateur
 */
export interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  is_member?: boolean;
  subscription_plan?: string;
  subscription_expires_at?: string;
}

/**
 * Sauvegarder les données utilisateur
 */
export const setUserData = (userData: UserData): void => {
  if (typeof window === "undefined") return;
  localStorage.setItem("user_data", JSON.stringify(userData));
};

/**
 * Récupérer les données utilisateur depuis localStorage
 */
export const getUserData = (): UserData | null => {
  if (typeof window === "undefined") return null;
  const data = localStorage.getItem("user_data");
  if (!data) return null;
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};

/**
 * Vérifier si l'utilisateur est authentifié
 */
export const isAuthenticated = (): boolean => {
  return !!getAuthToken();
};

/**
 * Connexion utilisateur
 */
export const login = async (email: string, password: string) => {
  const response = await fetch(`${API_URL}/api/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur de connexion");
  }

  const data = await response.json();
  
  // Stocker le token
  if (data.access_token || data.token) {
    setAuthToken(data.access_token || data.token);
  }

  // Stocker les données utilisateur
  if (data.user) {
    setUserData(data.user);
  }

  return data;
};

/**
 * Déconnexion utilisateur
 */
export const logout = async () => {
  const token = getAuthToken();
  
  if (token) {
    try {
      await fetch(`${API_URL}/api/logout`, {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${token}`,
          "Accept": "application/json",
        },
      });
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error);
    }
  }

  removeAuthToken();
};

/**
 * Inscription utilisateur
 */
export const register = async (userData: {
  email: string;
  password: string;
  password_confirmation: string;
  first_name: string;
  last_name: string;
  phone?: string;
  address?: string;
  city?: string;
  postal_code?: string;
  country?: string;
  referral_code?: string;
}) => {
  const response = await fetch(`${API_URL}/api/register`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || "Erreur d'inscription");
  }

  const data = await response.json();
  
  // Stocker le token
  if (data.access_token || data.token) {
    setAuthToken(data.access_token || data.token);
  }

  // Stocker les données utilisateur
  if (data.user) {
    setUserData(data.user);
  }

  return data;
};

/**
 * Récupérer les informations de l'utilisateur connecté
 */
export const getCurrentUser = async (): Promise<UserData> => {
  const token = getAuthToken();
  
  if (!token) {
    throw new Error("Non authentifié");
  }

  const response = await fetch(`${API_URL}/api/user`, {
    headers: {
      "Authorization": `Bearer ${token}`,
      "Accept": "application/json",
    },
  });

  if (!response.ok) {
    if (response.status === 401) {
      removeAuthToken();
      throw new Error("Session expirée");
    }
    throw new Error("Erreur lors de la récupération de l'utilisateur");
  }

  const userData = await response.json();
  
  // Mettre à jour les données en cache
  setUserData(userData);
  
  return userData;
};
