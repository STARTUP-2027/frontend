import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "code" | "quiz";
  videoUrl?: string;
  summary: string;
  notes: string;
  codeSnippet?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
}

export interface Course {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  description: string;
  category: "ai" | "fullstack" | "security" | "devops" | "design";
  categoryLabel: string;
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  lessonsCount: number;
  studentsCount: number;
  rating: number;
  reviewsCount: number;
  price: number; // 0 for free
  featured?: boolean;
  bestseller?: boolean;
  bannerGradient: string;
  instructor: {
    name: string;
    role: string;
    avatar: string;
    company: string;
  };
  skills: string[];
  modules: Module[];
}

export interface Certificate {
  id: string;
  courseId: string;
  courseTitle: string;
  studentName: string;
  issueDate: string;
  credentialId: string;
}

export interface CourseContextType {
  courses: Course[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  certificates: Certificate[];
  getCourseById: (idOrSlug: string) => Course | undefined;
  enrollInCourse: (courseId: string) => void;
  unenrollFromCourse: (courseId: string) => void;
  isEnrolled: (courseId: string) => boolean;
  completeLesson: (courseId: string, lessonId: string) => void;
  isLessonCompleted: (lessonId: string) => boolean;
  getCourseProgress: (courseId: string) => { completed: number; total: number; percentage: number };
  createCourse: (course: Omit<Course, "id" | "studentsCount" | "rating" | "reviewsCount">) => Course;
  updateCourse: (courseId: string, updated: Partial<Course>) => void;
  deleteCourse: (courseId: string) => void;
  claimCertificate: (courseId: string) => Certificate;
}

const INITIAL_COURSES: Course[] = [
  {
    id: "ai-agents-masterclass",
    slug: "ai-agents-masterclass",
    title: "Autonomous AI Agents & LLM Systems",
    tagline: "Build production-grade Multi-Agent workflows with LangChain, LangGraph, and Vector DBs",
    description: "Learn how to architect, evaluate, and deploy autonomous AI agents. From vector search and RAG retrieval to self-correcting agent graphs and tool execution in production.",
    category: "ai",
    categoryLabel: "AI & Machine Learning",
    level: "Advanced",
    duration: "18.5 Hours",
    lessonsCount: 16,
    studentsCount: 3840,
    rating: 4.95,
    reviewsCount: 720,
    price: 89,
    featured: true,
    bestseller: true,
    bannerGradient: "linear-gradient(135deg, #7c3aed 0%, #4338ca 100%)",
    instructor: {
      name: "Dr. Aris Vance",
      role: "Lead AI Researcher",
      avatar: "AV",
      company: "Astra Labs",
    },
    skills: ["LangGraph", "Vector RAG", "OpenAI / Anthropic APIs", "Agentic Tool Calling", "Evaluation & Tracing"],
    modules: [
      {
        id: "ai-mod-1",
        title: "Module 1: Foundations of Agentic AI & Reasoning",
        duration: "4.2 Hours",
        lessons: [
          {
            id: "ai-1-1",
            title: "Introduction to Agentic Architectures vs Traditional LLM Calls",
            duration: "24 min",
            type: "video",
            videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            summary: "Understand why standard prompt-completion loops hit bottlenecks and how agent loops solve multi-step reasoning.",
            notes: `# Agentic AI Architecture

Unlike traditional LLM prompt-response chains, **Autonomous Agents** operate in an iterative execution cycle:

1. **Perception**: Receiving user intent, context, and environmental variables.
2. **Planning & Reasoning**: Breaking down complex objectives into sequential sub-tasks.
3. **Tool Dispatching**: Executing external APIs (SQL queries, Web Browsers, Shell commands).
4. **Reflection & Self-Correction**: Evaluating results against acceptance criteria before returning the final answer.

\`\`\`python
# Typical Agent Execution Loop
def run_agent_loop(query, tools):
    state = initialize_state(query)
    while not state.is_complete():
        action = plan_next_action(state)
        result = tools.execute(action)
        state.update(result)
    return state.finalize()
\`\`\``,
            codeSnippet: `// Live Agent Execution Simulation in TypeScript
class AIAgent {
  constructor(public name: string, public tools: string[]) {}

  async plan(task: string) {
    console.log(\`[\${this.name}] Analyzing task: "\${task}"\`);
    return [
      { step: 1, action: "Search Knowledge Base" },
      { step: 2, action: "Synthesize Code Snippet" },
      { step: 3, action: "Run Sandbox Tests" }
    ];
  }
}

const agent = new AIAgent("Astra-Coder", ["vector_search", "code_eval"]);
agent.plan("Build a RAG pipeline with Pinecone and Claude 3.7").then(console.log);`,
            quiz: {
              question: "What differentiates an autonomous agent loop from a standard zero-shot LLM completion?",
              options: [
                "Agents use larger context windows only",
                "Agents iteratively observe results, use tools, and self-correct based on environmental feedback",
                "Agents do not require any prompt engineering",
                "Agents can only generate static HTML"
              ],
              correctIndex: 1,
              explanation: "Agents maintain a stateful perception-action loop that can invoke external tools and evaluate intermediate results iteratively."
            }
          },
          {
            id: "ai-1-2",
            title: "Advanced Vector RAG & Hybrid Retrieval Pipelines",
            duration: "32 min",
            type: "code",
            videoUrl: "https://www.youtube-nocookie.com/embed/L_Guz73G6ew",
            summary: "Master dense vector embeddings, sparse BM25 keyword matching, reciprocal rank fusion, and reranking.",
            notes: `# Hybrid Retrieval & Re-ranking

Standard cosine similarity search often misses exact keyword nuances (part numbers, error codes, IDs).

**Hybrid Search** merges:
- **Dense Vector Search**: Semantic meaning using OpenAI \`text-embedding-3-large\`
- **Sparse Lexical Search**: Exact keyword match using BM25
- **Cross-Encoder Re-ranker**: Scoring top 25 candidates using Cohere ReRank 3.5

\`\`\`typescript
const topDocuments = await hybridRetriever.search({
  query: "CVE-2024-3094 buffer overflow exploit",
  alpha: 0.6, // Weight between dense and sparse
  topK: 10
});
\`\`\``,
            codeSnippet: `// Hybrid Reranking Logic
interface Document { id: string; text: string; denseScore: number; sparseScore: number; }

function reciprocalRankFusion(docs: Document[], k = 60): Array<Document & { finalScore: number }> {
  return docs.map(doc => ({
    ...doc,
    finalScore: (1 / (k + doc.denseScore)) + (1 / (k + doc.sparseScore))
  })).sort((a, b) => b.finalScore - a.finalScore);
}

const sampleDocs: Document[] = [
  { id: "1", text: "Vector DB Scaling in Prod", denseScore: 0.94, sparseScore: 0.42 },
  { id: "2", text: "Embedding Fine-tuning guide", denseScore: 0.88, sparseScore: 0.91 }
];
console.log("Reranked Docs:", reciprocalRankFusion(sampleDocs));`,
            quiz: {
              question: "Why is Hybrid Search preferred over pure vector cosine search in production RAG systems?",
              options: [
                "It eliminates the need for vector databases",
                "It combines semantic similarity with exact keyword precision and handles edge cases like product SKUs or error codes",
                "It guarantees zero latency",
                "It uses less memory"
              ],
              correctIndex: 1,
              explanation: "Hybrid search merges vector embeddings for semantic context with BM25 keyword search for exact terms, delivering superior accuracy."
            }
          },
          {
            id: "ai-1-3",
            title: "Building Stateful Multi-Agent Graphs with LangGraph",
            duration: "45 min",
            type: "video",
            videoUrl: "https://www.youtube-nocookie.com/embed/hvAPnpSfSGo",
            summary: "Construct multi-agent cyclic graphs with human-in-the-loop checkpoints and state persistence.",
            notes: `# Stateful Multi-Agent Graphs

LangGraph models complex agent architectures as directed cyclic graphs:
- **Nodes**: Compute steps (Researcher Agent, Reviewer Agent, Coder Agent)
- **Edges**: Conditional routing based on the state payload
- **Checkpointers**: Saving conversation memory and enabling time-travel debugging.`,
            codeSnippet: `// Graph definition prototype
const graphDefinition = {
  nodes: ["UserQuery", "ResearchNode", "CodeGenerator", "SecurityReviewer", "FinalOutput"],
  conditionalEdges: {
    SecurityReviewer: (state: { passed: boolean }) => state.passed ? "FinalOutput" : "CodeGenerator"
  }
};
console.log("Multi-Agent Graph State machine configured successfully!");`,
            quiz: {
              question: "What is the primary advantage of a cyclic graph architecture for agent workflows?",
              options: [
                "It ensures code runs only once",
                "It enables agents to loop back, refine drafts, and retry until validation conditions pass",
                "It removes all network latency",
                "It avoids storing state"
              ],
              correctIndex: 1,
              explanation: "Cyclic graphs allow agents to loop back to prior steps for iterative self-correction, debugging, and revision."
            }
          }
        ]
      },
      {
        id: "ai-mod-2",
        title: "Module 2: Real-time Tool Calling, Sandboxing & Safety",
        duration: "5.5 Hours",
        lessons: [
          {
            id: "ai-2-1",
            title: "Dynamic Tool Execution & Structured Output Validation with Zod",
            duration: "30 min",
            type: "code",
            summary: "Learn how to enforce 100% strict JSON schemas and run tools safely inside ephemeral sandboxes.",
            notes: `# Structured Output & Schema Enforcement

Using Zod schemas guarantees that LLM responses strictly conform to runtime TypeScript contracts without parse errors.`,
            codeSnippet: `import { z } from "zod";

const FlightBookingSchema = z.object({
  flightNumber: z.string(),
  passengers: z.number().min(1).max(9),
  cabinClass: z.enum(["economy", "premium", "business", "first"]),
  returnDate: z.string().optional()
});

console.log("Schema compiled. Ready for strict OpenAI Function Calling!");`
          }
        ]
      }
    ]
  },
  {
    id: "fullstack-react-nextjs",
    slug: "fullstack-react-nextjs",
    title: "Full-Stack Web Architecture: React 19 & Next.js",
    tagline: "Build ultra-fast, distributed web applications with Server Components, SSR, and Edge DBs",
    description: "Deep dive into React 19 Actions, Server Components, Streaming SSR, Optimistic UI, and edge-deployed Postgres architectures with Turborepo.",
    category: "fullstack",
    categoryLabel: "Full-Stack Engineering",
    level: "Intermediate",
    duration: "22 Hours",
    lessonsCount: 24,
    studentsCount: 5120,
    rating: 4.92,
    reviewsCount: 980,
    price: 79,
    featured: true,
    bannerGradient: "linear-gradient(135deg, #0284c7 0%, #0369a1 100%)",
    instructor: {
      name: "Jordan Bell",
      role: "Principal Systems Architect",
      avatar: "JB",
      company: "Arc Cloud",
    },
    skills: ["React 19", "Next.js App Router", "Server Actions", "PostgreSQL", "Tailwind CSS v4", "Optimistic Mutations"],
    modules: [
      {
        id: "fs-mod-1",
        title: "Module 1: React 19 Foundations & Server Components",
        duration: "6.0 Hours",
        lessons: [
          {
            id: "fs-1-1",
            title: "Mental Model: Server Components vs Client Boundaries",
            duration: "28 min",
            type: "video",
            videoUrl: "https://www.youtube-nocookie.com/embed/w7ejDZ8SWv8",
            summary: "Master zero-bundle-size server components, hydration boundaries, and streaming with Suspense.",
            notes: `# React Server Components (RSC)

Server Components execute exclusively on the server, generating an efficient virtual DOM stream without shipping JavaScript to the client.

Benefits:
- 0 KB client bundle size for heavyweight dependencies (marked, shiki, date-fns)
- Direct backend database & secret access
- Instant streaming using React \`<Suspense />\` boundaries.`,
            codeSnippet: `// Server Component example
export async function CourseDashboard({ studentId }: { studentId: string }) {
  // Direct DB query on server
  const courses = await db.query('SELECT * FROM enrollments WHERE user_id = $1', [studentId]);
  
  return (
    <div className="grid grid-cols-3 gap-6">
      {courses.map(c => <CourseCard key={c.id} course={c} />)}
    </div>
  );
}`,
            quiz: {
              question: "What is the primary client-side performance benefit of React Server Components?",
              options: [
                "They run on the client's GPU",
                "They do not add any JavaScript to the client bundle size",
                "They disable HTML rendering",
                "They require client-side useEffect hooks"
              ],
              correctIndex: 1,
              explanation: "RSCs execute only on the server, reducing the amount of JavaScript sent to the browser to zero for server-only components."
            }
          },
          {
            id: "fs-1-2",
            title: "React 19 useActionState, useOptimistic & Form Actions",
            duration: "35 min",
            type: "code",
            summary: "Implement instantaneous UI updates without loading spinners using useOptimistic.",
            notes: `# Optimistic UI with React 19

\`useOptimistic\` provides immediate feedback while asynchronous network mutations are pending in the background.`,
            codeSnippet: `import { useOptimistic, useTransition } from "react";

export function LikeButton({ likes, onLike }: { likes: number; onLike: () => Promise<void> }) {
  const [isPending, startTransition] = useTransition();
  const [optimisticLikes, setOptimisticLikes] = useOptimistic(
    likes,
    (state, count: number) => state + count
  );

  return (
    <button 
      onClick={() => {
        startTransition(async () => {
          setOptimisticLikes(1);
          await onLike();
        });
      }}
      className="btn"
    >
      ❤️ {optimisticLikes} {isPending && "(syncing...)"}
    </button>
  );
}`
          }
        ]
      }
    ]
  },
  {
    id: "rust-systems",
    slug: "rust-systems",
    title: "High-Performance Systems & Zero Trust Security",
    tagline: "Build memory-safe, ultra-low-latency backend microservices with Rust and Tokio",
    description: "Master Rust memory model, ownership, lifetimes, asynchronous runtime with Tokio, cryptographic hashing, and Zero-Trust network protocol implementation.",
    category: "security",
    categoryLabel: "Cybersecurity & Systems",
    level: "Advanced",
    duration: "26 Hours",
    lessonsCount: 30,
    studentsCount: 2940,
    rating: 4.97,
    reviewsCount: 510,
    price: 99,
    bannerGradient: "linear-gradient(135deg, #10b981 0%, #047857 100%)",
    instructor: {
      name: "Marcus Sterling",
      role: "Senior Security Engineer",
      avatar: "MS",
      company: "ZeroKey",
    },
    skills: ["Rust", "Tokio Async", "Zero-Trust Architecture", "Memory Safety", "OAuth2 / mTLS", "Cryptography"],
    modules: [
      {
        id: "rs-mod-1",
        title: "Module 1: Memory Safety, Ownership & Lifetimes",
        duration: "5.2 Hours",
        lessons: [
          {
            id: "rs-1-1",
            title: "The Ownership Model & Borrow Checker Demystified",
            duration: "30 min",
            type: "video",
            summary: "Learn how Rust eliminates data races, use-after-free, and null pointer exceptions at compile time.",
            notes: `# Rust Ownership Model

1. Each value in Rust has an owner.
2. There can only be one owner at a time.
3. When the owner goes out of scope, the value is dropped.

\`\`\`rust
fn main() {
    let s1 = String::from("Astra Security");
    let s2 = s1; // s1 moved to s2 (shallow copy of pointer)
    // println!("{}", s1); // Compile Error! Prevents double-free bugs
    println!("{}", s2);
}
\`\`\``,
            codeSnippet: `// Rust Concurrent Pipeline Simulation
fn process_security_event(event_id: &str, risk_score: f32) -> String {
    if risk_score > 0.85 {
        format!("[ALERT] Critical incident detected: {}", event_id)
    } else {
        format!("[OK] Event {} verified and cleared", event_id)
    }
}

println!("{}", process_security_event("EVT-9042", 0.94));`
          }
        ]
      }
    ]
  },
  {
    id: "cloud-devops-k8s",
    slug: "cloud-devops-k8s",
    title: "Cloud Infrastructure & GitOps with Kubernetes & Terraform",
    tagline: "Design multi-region scalable cloud platforms with automated CI/CD pipelines",
    description: "From Docker containers to production Kubernetes clusters, Infrastructure as Code with Terraform, Prometheus observability, and automated GitOps with ArgoCD.",
    category: "devops",
    categoryLabel: "DevOps & Cloud",
    level: "Intermediate",
    duration: "20 Hours",
    lessonsCount: 22,
    studentsCount: 3180,
    rating: 4.89,
    reviewsCount: 440,
    price: 69,
    bannerGradient: "linear-gradient(135deg, #f59e0b 0%, #d97706 100%)",
    instructor: {
      name: "Elena Rostova",
      role: "Head of Infrastructure",
      avatar: "ER",
      company: "CloudScale",
    },
    skills: ["Kubernetes", "Docker", "Terraform", "ArgoCD GitOps", "Prometheus & Grafana", "AWS / GCP"],
    modules: [
      {
        id: "k8s-mod-1",
        title: "Module 1: Declarative Infrastructure with Terraform",
        duration: "4.8 Hours",
        lessons: [
          {
            id: "k8s-1-1",
            title: "Architecting VPCs, EKS Clusters, and IAM Roles as Code",
            duration: "34 min",
            type: "video",
            summary: "Provision repeatable cloud environments across AWS and GCP with zero manual console configuration.",
            notes: `# Infrastructure as Code (IaC)

Declarative IaC allows entire cloud architectures to be version controlled, peer-reviewed, and rolled back via Git pull requests.`,
            codeSnippet: `// Terraform HCL Representation
resource "aws_eks_cluster" "primary" {
  name     = "astra-production-cluster"
  role_arn = aws_iam_role.cluster.arn
  version  = "1.30"

  vpc_config {
    subnet_ids = aws_subnet.private[*].id
  }
}`
          }
        ]
      }
    ]
  }
];

const CourseContext = createContext<CourseContextType | null>(null);

export function CourseProvider({ children }: { children: ReactNode }) {
  const { user, updateUserStats } = useAuth();
  
  const [courses, setCourses] = useState<Course[]>(() => {
    const saved = localStorage.getItem("astra_courses_db");
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_COURSES;
      }
    }
    return INITIAL_COURSES;
  });

  const [enrolledCourseIds, setEnrolledCourseIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("astra_enrolled_courses");
    if (saved) {
      try { return JSON.parse(saved); } catch { return ["ai-agents-masterclass", "fullstack-react-nextjs"]; }
    }
    return user ? user.enrolledCourseIds : ["ai-agents-masterclass", "fullstack-react-nextjs"];
  });

  const [completedLessonIds, setCompletedLessonIds] = useState<string[]>(() => {
    const saved = localStorage.getItem("astra_completed_lessons");
    if (saved) {
      try { return JSON.parse(saved); } catch { return ["ai-1-1", "fs-1-1"]; }
    }
    return user ? user.completedLessonIds : ["ai-1-1", "fs-1-1"];
  });

  const [certificates, setCertificates] = useState<Certificate[]>(() => {
    const saved = localStorage.getItem("astra_certificates");
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      {
        id: "cert-01",
        courseId: "fullstack-react-nextjs",
        courseTitle: "Full-Stack Web Architecture: React 19 & Next.js",
        studentName: user ? user.name : "Alex Morgan",
        issueDate: "October 02, 2026",
        credentialId: "ASTRA-CERT-8849-2026",
      }
    ];
  });

  // Persist courses when updated or created
  useEffect(() => {
    localStorage.setItem("astra_courses_db", JSON.stringify(courses));
  }, [courses]);

  useEffect(() => {
    localStorage.setItem("astra_enrolled_courses", JSON.stringify(enrolledCourseIds));
  }, [enrolledCourseIds]);

  useEffect(() => {
    localStorage.setItem("astra_completed_lessons", JSON.stringify(completedLessonIds));
  }, [completedLessonIds]);

  useEffect(() => {
    localStorage.setItem("astra_certificates", JSON.stringify(certificates));
  }, [certificates]);

  const getCourseById = (idOrSlug: string) => {
    return courses.find((c) => c.id === idOrSlug || c.slug === idOrSlug);
  };

  const enrollInCourse = (courseId: string) => {
    if (!enrolledCourseIds.includes(courseId)) {
      const updated = [...enrolledCourseIds, courseId];
      setEnrolledCourseIds(updated);
      updateUserStats(50); // 50 XP for enrolling
    }
  };

  const unenrollFromCourse = (courseId: string) => {
    setEnrolledCourseIds(enrolledCourseIds.filter((id) => id !== courseId));
  };

  const isEnrolled = (courseId: string) => {
    return enrolledCourseIds.includes(courseId);
  };

  const completeLesson = (courseId: string, lessonId: string) => {
    if (!completedLessonIds.includes(lessonId)) {
      const updated = [...completedLessonIds, lessonId];
      setCompletedLessonIds(updated);
      updateUserStats(100, lessonId); // +100 XP for completing a lesson

      // Auto check if course is 100% finished
      const course = getCourseById(courseId);
      if (course) {
        const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
        const allDone = allLessonIds.every((id) => id === lessonId || updated.includes(id));
        if (allDone) {
          claimCertificate(courseId);
        }
      }
    }
  };

  const isLessonCompleted = (lessonId: string) => {
    return completedLessonIds.includes(lessonId);
  };

  const getCourseProgress = (courseId: string) => {
    const course = getCourseById(courseId);
    if (!course) return { completed: 0, total: 0, percentage: 0 };
    const allLessonIds = course.modules.flatMap((m) => m.lessons.map((l) => l.id));
    const total = allLessonIds.length;
    if (total === 0) return { completed: 0, total: 0, percentage: 0 };
    const completed = allLessonIds.filter((id) => completedLessonIds.includes(id)).length;
    const percentage = Math.round((completed / total) * 100);
    return { completed, total, percentage };
  };

  const createCourse = (newCourseData: Omit<Course, "id" | "studentsCount" | "rating" | "reviewsCount">): Course => {
    const newId = newCourseData.slug || "course-" + Date.now();
    const newCourse: Course = {
      ...newCourseData,
      id: newId,
      studentsCount: 1,
      rating: 5.0,
      reviewsCount: 1,
    };
    setCourses((prev) => [newCourse, ...prev]);
    return newCourse;
  };

  const updateCourse = (courseId: string, updated: Partial<Course>) => {
    setCourses((prev) =>
      prev.map((c) => (c.id === courseId ? { ...c, ...updated } : c))
    );
  };

  const deleteCourse = (courseId: string) => {
    setCourses((prev) => prev.filter((c) => c.id !== courseId));
  };

  const claimCertificate = (courseId: string): Certificate => {
    const course = getCourseById(courseId);
    const existing = certificates.find((cert) => cert.courseId === courseId);
    if (existing) return existing;

    const newCert: Certificate = {
      id: `cert-${Date.now()}`,
      courseId,
      courseTitle: course ? course.title : "Course Completion",
      studentName: user ? user.name : "Alex Morgan",
      issueDate: new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" }),
      credentialId: `ASTRA-CERT-${Math.floor(1000 + Math.random() * 9000)}-2026`,
    };

    setCertificates((prev) => [newCert, ...prev]);
    return newCert;
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourseIds,
        completedLessonIds,
        certificates,
        getCourseById,
        enrollInCourse,
        unenrollFromCourse,
        isEnrolled,
        completeLesson,
        isLessonCompleted,
        getCourseProgress,
        createCourse,
        updateCourse,
        deleteCourse,
        claimCertificate,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourses() {
  const context = useContext(CourseContext);
  if (!context) {
    throw new Error("useCourses must be used within a CourseProvider");
  }
  return context;
}
