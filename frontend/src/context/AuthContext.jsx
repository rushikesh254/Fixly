import { createContext, useContext, useEffect, useState } from "react";
import {
  getMe as getMeApi,
  googleLogin as googleLoginApi,
  login as loginApi,
  logout as logoutApi,
  resendVerification as resendVerificationApi,
  signup as signupApi,
  updateProfile as updateProfileApi,
} from "../api/auth";
import { setAccessToken, getAccessToken } from "../api/axios";

const AuthContext = createContext();

// Map the backend user shape (profileImage, _id) to the shape
// the existing components expect (image, id) without touching mocks.
const normalizeUser = (user) => {
  if (!user) return null;
  return {
    _id: user._id,
    id: user._id,
    name: user.name,
    email: user.email,
    image: user.profileImage || "",
    profileImage: user.profileImage || "",
    phoneNumber: user.phoneNumber || "",
    bio: user.bio || "",
    role: user.role,
    isVerified: user.isVerified,
    status: user.status || "active",
    gender: user.gender || "",
    dob: user.dob || "",
    // one address per account, editable but never duplicated
    address: user.address || null,

    // provider only, ignored for the other roles
    providerName: user.providerName || "",
    providerStatus: user.providerStatus || "",
    category: user.category?.name || "",
    categoryId: user.category?._id || "",
    experience: user.experience || "",
    coverImage: user.coverImage || "",
    galleryImages: user.galleryImages || [],
  };
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Restore the session on refresh: the access token lives in localStorage
  // (set by the axios module) and the refresh token in the httpOnly cookie.
  useEffect(() => {
    const restoreSession = async () => {
      // logged-out visitor: no access token means no session to restore, so
      // skip the /me call and the pointless refresh attempt it would trigger.
      if (!getAccessToken()) {
        setLoading(false);
        return;
      }
      try {
        const { data } = await getMeApi();
        setUser(normalizeUser(data.user));
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    restoreSession();

    // Fired by the axios interceptor when a token refresh fails
    const handleAuthLogout = () => {
      setUser(null);
    };
    window.addEventListener("auth:logout", handleAuthLogout);
    return () => window.removeEventListener("auth:logout", handleAuthLogout);
  }, []);

  const login = async (email, password) => {
    const { data } = await loginApi({ email, password });
    setAccessToken(data.accessToken);
    setUser(normalizeUser(data.user));
    return data.user;
  };

  const signup = async ({ name, email, password, role }) => {
    const { data } = await signupApi({ name, email, password, role });
    return data;
  };

  const resendVerification = async (email) => {
    const { data } = await resendVerificationApi(email);
    return data;
  };

  const googleLogin = async (tokenId) => {
    const { data } = await googleLoginApi(tokenId);
    setAccessToken(data.accessToken);
    setUser(normalizeUser(data.user));
    return data.user;
  };

  const logout = async () => {
    try {
      await logoutApi();
    } catch {
      // ignore network/refresh failures; always clear local state
    }
    setAccessToken(null);
    setUser(null);
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const updateProfile = async ({
    name,
    phoneNumber,
    bio,
    gender,
    dob,
    profileImage,
  }) => {
    const formData = new FormData();
    if (name !== undefined) formData.append("name", name);
    if (phoneNumber !== undefined) formData.append("phoneNumber", phoneNumber);
    if (bio !== undefined) formData.append("bio", bio);
    if (gender !== undefined) formData.append("gender", gender);
    // an empty value would fail date coercion on the server
    if (dob) formData.append("dob", dob);
    if (profileImage) formData.append("profileImage", profileImage);

    const { data } = await updateProfileApi(formData);
    setUser(normalizeUser(data.user));
    return data;
  };

  return (
    <AuthContext.Provider
      value={{ user, setUser, login, signup, resendVerification, googleLogin, logout, updateUser, updateProfile, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

function useAuth() {
  return useContext(AuthContext);
}

// eslint-disable-next-line react-refresh/only-export-components
export { useAuth };
