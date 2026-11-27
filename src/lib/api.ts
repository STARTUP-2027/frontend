// Centralized API client for Astra Academy Node.js Backend

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  (typeof window !== "undefined" ? "http://localhost:5000/api" : "http://localhost:5000/api");

export async function fetchFromApi<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : `/${endpoint}`}`;
  try {
    const res = await fetch(url, {
      headers: {
        "Content-Type": "application/json",
        ...options?.headers,
      },
      ...options,
    });
    if (!res.ok) {
      throw new Error(`API Error [${res.status}]: ${res.statusText}`);
    }
    return await res.json();
  } catch (err) {
    console.warn(`API call failed for ${url}, falling back to local fallback if available.`, err);
    throw err;
  }
}

export const astraApi = {
  // Health
  checkHealth: () => fetchFromApi<{ status: string }>("/health"),

  // Subscription & Entitlements API
  getSubscriptionPlans: () =>
    fetchFromApi<{ success: boolean; data: any[] }>("/subscription/plans"),

  getSubscriptionStatus: () =>
    fetchFromApi<{
      success: boolean;
      tier: "free" | "pro" | "enterprise";
      plan: any;
      isTrialActive: boolean;
      trialDaysLeft: number;
      dailyLimit: number | "unlimited";
      dailyProblemsSolved: number;
      remainingProblems: number | "unlimited";
      canAccessStudio: boolean;
      canAccessArena: boolean;
      canClaimCertificate: boolean;
    }>("/subscription/status"),

  getSubscriptionModalConfig: () =>
    fetchFromApi<{ success: boolean; data: any }>("/subscription/modal-config"),

  checkAccess: (resourceType: "course" | "dsa_problem" | "contest", resourceId: string) =>
    fetchFromApi<{ allowed: boolean; reason?: string; modalConfig?: any }>("/subscription/check-access", {
      method: "POST",
      body: JSON.stringify({ resourceType, resourceId }),
    }),

  upgradeSubscription: (params: { planId?: string; startTrial?: boolean }) =>
    fetchFromApi<{ success: boolean; message: string; user: any }>("/subscription/upgrade", {
      method: "POST",
      body: JSON.stringify(params),
    }),

  // Courses
  getCourses: (params?: { category?: string; level?: string; q?: string }) => {
    const query = new URLSearchParams();
    if (params?.category) query.append("category", params.category);
    if (params?.level) query.append("level", params.level);
    if (params?.q) query.append("q", params.q);
    const queryString = query.toString();
    return fetchFromApi<{ success: boolean; count: number; data: any[] }>(`/courses${queryString ? `?${queryString}` : ""}`);
  },

  getCourseById: (id: string) => fetchFromApi<{ success: boolean; data: any }>(`/courses/${id}`),

  getLessonContent: (courseId: string, lessonId: string) =>
    fetchFromApi<{ success: boolean; lesson: any }>(`/courses/${courseId}/lessons/${lessonId}`),

  saveCourse: (courseData: any) =>
    fetchFromApi<{ success: boolean; message: string; data: any }>("/courses", {
      method: "POST",
      body: JSON.stringify(courseData),
    }),

  deleteCourse: (id: string) =>
    fetchFromApi<{ success: boolean; message: string }>("/courses/" + id, {
      method: "DELETE",
    }),

  // DSA Sheets (On-Demand Data Delivery)
  getDsaSheetsIndex: () =>
    fetchFromApi<{ success: boolean; sheets: any[] }>("/dsa-sheets"),

  getDsaSheetBySlug: (slug: string) =>
    fetchFromApi<{ success: boolean; sheet: any }>(`/dsa-sheets/${slug}`),

  recordProblemSolved: (problemId: string) =>
    fetchFromApi<{ success: boolean; dailyProblemsSolved: number; remainingToday: number | "unlimited"; xp: number }>(
      "/dsa-sheets/solve",
      {
        method: "POST",
        body: JSON.stringify({ problemId }),
      }
    ),

  // Auth & Profile
  login: (credentials: { email: string; pass: string }) =>
    fetchFromApi<{ success: boolean; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email: credentials.email, password: credentials.pass }),
    }),

  getProfile: () => fetchFromApi<{ success: boolean; user: any }>("/user/profile"),

  enroll: (courseId: string) =>
    fetchFromApi<{ success: boolean; message: string; enrolledCourseIds: string[]; xp: number }>("/enroll", {
      method: "POST",
      body: JSON.stringify({ courseId }),
    }),

  // Contests
  getContests: () => fetchFromApi<{ success: boolean; data: any[] }>("/contests"),
};
