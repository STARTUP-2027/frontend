import { createContext, useContext, useState, useEffect, type ReactNode } from "react";

export type UserRole = "student" | "admin" | "visitor";

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar: string;
  title: string;
  xp: number;
  streak: number;
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  isTrialActive?: boolean;
  trialDaysLeft?: number;
}

export interface AuthContextType {
  user: UserProfile | null;
  role: UserRole;
  isLoggedIn: boolean;
  login: (email: string, pass: string) => { success: boolean; message?: string };
  logout: () => void;
  switchRole: (newRole: "student" | "admin" | "visitor") => void;
  updateUserStats: (xpDelta: number, lessonId?: string) => void;
}

const DEFAULT_STUDENT: UserProfile = {
  id: "std_01",
  email: "student@astra.edu",
  name: "Alex Morgan",
  role: "student",
  avatar: "AM",
  title: "Aspiring AI & Full-Stack Engineer",
  xp: 1450,
  streak: 14,
  enrolledCourseIds: ["ai-agents-masterclass", "fullstack-react-nextjs", "rust-systems"],
  completedLessonIds: ["ai-1-1", "ai-1-2", "ai-1-3", "fs-1-1", "fs-1-2"],
  isTrialActive: true,
  trialDaysLeft: 3,
};

const DEFAULT_ADMIN: UserProfile = {
  id: "adm_01",
  email: "admin@astra.edu",
  name: "Dr. Sarah Chen",
  role: "admin",
  avatar: "SC",
  title: "Head of Curriculum & Platform Admin",
  xp: 4900,
  streak: 42,
  enrolledCourseIds: ["ai-agents-masterclass", "fullstack-react-nextjs", "rust-systems", "cloud-devops-k8s"],
  completedLessonIds: [],
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem("astra_learn_user");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return null;
      }
    }
    // Default to visitor on first load or can be null
    return null;
  });

  useEffect(() => {
    if (user) {
      localStorage.setItem("astra_learn_user", JSON.stringify(user));
    } else {
      localStorage.removeItem("astra_learn_user");
    }
  }, [user]);

  const login = (email: string, pass: string): { success: boolean; message?: string } => {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPass = pass.trim();

    // Check fixed credentials for student
    if (
      (cleanEmail === "student@astra.edu" || cleanEmail === "student") &&
      cleanPass === "student123"
    ) {
      setUser(DEFAULT_STUDENT);
      return { success: true };
    }

    // Check fixed credentials for admin
    if (
      (cleanEmail === "admin@astra.edu" || cleanEmail === "admin") &&
      cleanPass === "admin123"
    ) {
      setUser(DEFAULT_ADMIN);
      return { success: true };
    }

    // Default fallback for custom registrations or signins
    if (cleanEmail && cleanPass) {
      // If contains admin in name or email, log in as admin
      if (cleanEmail.includes("admin")) {
        setUser({
          ...DEFAULT_ADMIN,
          email: cleanEmail,
          name: cleanEmail.split("@")[0].toUpperCase() + " (Admin)",
        });
      } else {
        setUser({
          ...DEFAULT_STUDENT,
          email: cleanEmail,
          name: cleanEmail.split("@")[0].charAt(0).toUpperCase() + cleanEmail.split("@")[0].slice(1),
        });
      }
      return { success: true };
    }

    return {
      success: false,
      message: "Invalid credentials. Use student@astra.edu / student123 or admin@astra.edu / admin123",
    };
  };

  const logout = () => {
    setUser(null);
  };

  const switchRole = (newRole: "student" | "admin" | "visitor") => {
    if (newRole === "visitor") {
      setUser(null);
    } else if (newRole === "student") {
      setUser(DEFAULT_STUDENT);
    } else if (newRole === "admin") {
      setUser(DEFAULT_ADMIN);
    }
  };

  const updateUserStats = (xpDelta: number, lessonId?: string) => {
    if (!user) return;
    setUser((prev) => {
      if (!prev) return null;
      const completed = lessonId && !prev.completedLessonIds.includes(lessonId)
        ? [...prev.completedLessonIds, lessonId]
        : prev.completedLessonIds;
      return {
        ...prev,
        xp: prev.xp + xpDelta,
        completedLessonIds: completed,
      };
    });
  };

  const role: UserRole = user ? user.role : "visitor";
  const isLoggedIn = !!user;

  return (
    <AuthContext.Provider
      value={{
        user,
        role,
        isLoggedIn,
        login,
        logout,
        switchRole,
        updateUserStats,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
