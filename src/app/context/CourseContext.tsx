import { createContext, useContext, useState, useEffect, type ReactNode } from "react";
import { useAuth } from "./AuthContext";

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  points?: number;
}

export interface CourseResource {
  id: string;
  name: string;
  type: "pdf" | "code" | "cheat-sheet" | "doc" | "diagram";
  url?: string;
  size?: string;
  description?: string;
}

export interface ChapterTimestamp {
  time: string;
  seconds: number;
  label: string;
}

export interface HierarchyItem {
  id: string;
  title: string;
  type: "module" | "submodule" | "lesson" | "video" | "reading" | "lab" | "quiz" | "exercise";
  duration?: string;
  summary?: string;
  notes?: string;
  videoUrl?: string;
  transcript?: string;
  timestamps?: ChapterTimestamp[];
  codeSnippet?: string;
  labObjective?: string;
  expectedOutput?: string;
  quizzes?: QuizQuestion[];
  resources?: CourseResource[];
  flashcards?: Array<{ front: string; back: string }>;
  children?: HierarchyItem[];
}

export interface Lesson {
  id: string;
  title: string;
  duration: string;
  type: "video" | "code" | "quiz" | "reading" | "lab";
  videoUrl?: string;
  transcript?: string;
  timestamps?: ChapterTimestamp[];
  summary: string;
  notes: string;
  codeSnippet?: string;
  labObjective?: string;
  expectedOutput?: string;
  quiz?: {
    question: string;
    options: string[];
    correctIndex: number;
    explanation: string;
  };
  quizzes?: QuizQuestion[];
  resources?: CourseResource[];
  flashcards?: Array<{ front: string; back: string }>;
  children?: HierarchyItem[];
}

export interface Module {
  id: string;
  title: string;
  duration: string;
  lessons: Lesson[];
  submodules?: HierarchyItem[];
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
  thumbnailUrl?: string;
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
  skills?: string[];
  instructorName?: string;
}

export interface BookmarkNote {
  id: string;
  courseId: string;
  courseTitle: string;
  lessonId: string;
  lessonTitle: string;
  snippet?: string;
  noteText: string;
  tags?: string[];
  createdAt: string;
}

export interface Flashcard {
  id: string;
  courseId?: string;
  category: string;
  front: string;
  back: string;
  mastered?: boolean;
}

export interface CourseContextType {
  courses: Course[];
  enrolledCourseIds: string[];
  completedLessonIds: string[];
  certificates: Certificate[];
  bookmarks: BookmarkNote[];
  flashcards: Flashcard[];
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
  addBookmark: (bookmark: Omit<BookmarkNote, "id" | "createdAt">) => void;
  removeBookmark: (id: string) => void;
  isBookmarked: (lessonId: string) => boolean;
  toggleFlashcardMastered: (id: string) => void;
  addFlashcard: (card: Omit<Flashcard, "id">) => void;
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
    price: 0,
    featured: true,
    bestseller: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
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
    price: 0,
    featured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80",
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
    price: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=800&q=80",
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
    price: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80",
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
  },
  {
    id: "python-foundations-ai",
    slug: "python-foundations-ai",
    title: "Python 3.12 Core & Data Structures for AI Engineers",
    tagline: "Master clean Python, asynchronous I/O, generators, and core algorithms from scratch",
    description: "Start your engineering journey with Python 3.12, type hinting, object-oriented patterns, async coroutines, and foundational algorithms needed for AI pipelines.",
    category: "ai",
    categoryLabel: "AI & Machine Learning",
    level: "Beginner",
    duration: "14 Hours",
    lessonsCount: 18,
    studentsCount: 6420,
    rating: 4.88,
    reviewsCount: 1120,
    price: 0, // Free course
    featured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
    bannerGradient: "linear-gradient(135deg, #06b6d4 0%, #0284c7 100%)",
    instructor: {
      name: "Sophia Zhang",
      role: "AI Curriculum Lead",
      avatar: "SZ",
      company: "Astra Academy",
    },
    skills: ["Python 3.12", "Type Hinting", "AsyncIO", "Data Structures", "NumPy Basics"],
    modules: [
      {
        id: "py-mod-1",
        title: "Module 1: Modern Python 3.12 & Type System",
        duration: "3.5 Hours",
        lessons: [
          {
            id: "py-1-1",
            title: "Type Annotations, Generics & Structural Pattern Matching",
            duration: "25 min",
            type: "video",
            summary: "Write robust Python using static type checkers and match statements.",
            notes: "# Python 3.12 Type Annotations\nLearn to write robust Python with Pydantic and type hints.",
            codeSnippet: "def process_batch[T](items: list[T]) -> list[T]:\n    return items"
          }
        ]
      }
    ]
  },
  {
    id: "frontend-typescript-css",
    slug: "frontend-typescript-css",
    title: "Design Systems & High-Velocity UI with Modern TypeScript",
    tagline: "Build accessible, fluid component libraries with Tailwind CSS v4 and Framer Motion",
    description: "Master modern frontend engineering: accessible compound components, design tokens, micro-animations, theme managers, and zero-runtime CSS.",
    category: "fullstack",
    categoryLabel: "Full-Stack Engineering",
    level: "Beginner",
    duration: "16 Hours",
    lessonsCount: 20,
    studentsCount: 4210,
    rating: 4.86,
    reviewsCount: 650,
    price: 0,
    bestseller: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1507238691740-187a5b1d37b8?auto=format&fit=crop&w=800&q=80",
    bannerGradient: "linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)",
    instructor: {
      name: "Liam O'Connor",
      role: "Design Technologist",
      avatar: "LO",
      company: "PixelCraft",
    },
    skills: ["TypeScript", "Tailwind CSS v4", "Component Design", "Accessibility (a11y)", "Design Systems"],
    modules: [
      {
        id: "ui-mod-1",
        title: "Module 1: Design Tokens & Fluid CSS",
        duration: "4 Hours",
        lessons: [
          {
            id: "ui-1-1",
            title: "Atomic Tokens & CSS Variables Architecture",
            duration: "30 min",
            type: "video",
            summary: "Structure CSS custom properties for instant dark/light theme shifts.",
            notes: "# Modern Design Tokens\nImplement dynamic tokens for seamless light and dark mode switches.",
            codeSnippet: ":root { --brand-hue: 260; --accent: hsl(var(--brand-hue) 90% 60%); }"
          }
        ]
      }
    ]
  },
  {
    id: "distributed-go-kafka",
    slug: "distributed-go-kafka",
    title: "Distributed Event-Driven Architecture with Go & Apache Kafka",
    tagline: "Design resilient, million-event-per-second streaming data pipelines and microservices",
    description: "Architect mission-critical distributed systems. Learn event sourcing, CQRS patterns, partition balancing, dead-letter queues, and high-concurrency Go worker pools.",
    category: "fullstack",
    categoryLabel: "Full-Stack & Systems",
    level: "Advanced",
    duration: "32 Hours",
    lessonsCount: 36,
    studentsCount: 2150,
    rating: 4.96,
    reviewsCount: 390,
    price: 0,
    featured: true,
    thumbnailUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=800&q=80",
    bannerGradient: "linear-gradient(135deg, #6366f1 0%, #4338ca 100%)",
    instructor: {
      name: "Kaito Takahashi",
      role: "Staff Infrastructure Architect",
      avatar: "KT",
      company: "HyperScale",
    },
    skills: ["Go (Golang)", "Apache Kafka", "Event Sourcing", "CQRS", "Distributed Consensus", "gRPC"],
    modules: [
      {
        id: "go-mod-1",
        title: "Module 1: Kafka Partitioning & Go Consumer Groups",
        duration: "6 Hours",
        lessons: [
          {
            id: "go-1-1",
            title: "Zero-Data-Loss Consumer Group Rebalancing",
            duration: "35 min",
            type: "video",
            summary: "Handle graceful partition rebalances and committed offsets in Go.",
            notes: "# Kafka Consumer Groups in Go\nMaintain exact-once and at-least-once message processing semantics.",
            codeSnippet: "package main\nimport \"github.com/segmentio/kafka-go\"\n// Consumer implementation"
          }
        ]
      }
    ]
  },
  {
    id: "web3-solidity-security",
    slug: "web3-solidity-security",
    title: "Smart Contract Security & Applied Cryptography in Solidity",
    tagline: "Audit EVM smart contracts, prevent reentrancy, and construct cryptographic zero-knowledge proofs",
    description: "Deep dive into EVM bytecode, gas optimization, reentrancy attacks, flash loan defense, multi-signature vaults, and zero-knowledge SNARK verifiers.",
    category: "security",
    categoryLabel: "Cybersecurity & Web3",
    level: "Intermediate",
    duration: "19 Hours",
    lessonsCount: 22,
    studentsCount: 1890,
    rating: 4.81,
    reviewsCount: 280,
    price: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1639762681485-074b7f938ba0?auto=format&fit=crop&w=800&q=80",
    bannerGradient: "linear-gradient(135deg, #14b8a6 0%, #0f766e 100%)",
    instructor: {
      name: "Dr. Maya Patel",
      role: "Protocol Security Auditor",
      avatar: "MP",
      company: "ShieldSec",
    },
    skills: ["Solidity", "Smart Contract Auditing", "EVM Bytecode", "Gas Optimization", "Zero-Knowledge Proofs"],
    modules: [
      {
        id: "sec-mod-1",
        title: "Module 1: Reentrancy & Access Control Vulnerabilities",
        duration: "4.5 Hours",
        lessons: [
          {
            id: "sec-1-1",
            title: "Checks-Effects-Interactions Pattern & ReentrancyGuard",
            duration: "28 min",
            type: "video",
            summary: "Eliminate reentrancy exploits using reentrancy guards and state ordering.",
            notes: "# Smart Contract Defense\nAlways update state variables before triggering external calls.",
            codeSnippet: "// SPDX-License-Identifier: MIT\npragma solidity ^0.8.24;\ncontract Vault { ... }"
          }
        ]
      }
    ]
  },
  {
    id: "sre-ebpf-observability",
    slug: "sre-ebpf-observability",
    title: "Kernel-Level Observability & SRE with eBPF and Prometheus",
    tagline: "Inspect Linux kernel network packets, trace system calls, and debug latency at line rate",
    description: "Master modern SRE and Linux kernel instrumentation using eBPF programs, Cilium service mesh, OpenTelemetry distributed tracing, and Prometheus alerting.",
    category: "devops",
    categoryLabel: "DevOps & Cloud",
    level: "Advanced",
    duration: "25 Hours",
    lessonsCount: 28,
    studentsCount: 1740,
    rating: 4.93,
    reviewsCount: 310,
    price: 0,
    thumbnailUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80",
    bannerGradient: "linear-gradient(135deg, #f97316 0%, #c2410c 100%)",
    instructor: {
      name: "Marcus Brody",
      role: "Principal Reliability Engineer",
      avatar: "MB",
      company: "KernelOps",
    },
    skills: ["eBPF", "Linux Kernel", "Prometheus", "OpenTelemetry", "Cilium", "Distributed Tracing"],
    modules: [
      {
        id: "ebpf-mod-1",
        title: "Module 1: eBPF Architecture & XDP Packet Filters",
        duration: "5 Hours",
        lessons: [
          {
            id: "ebpf-1-1",
            title: "Writing In-Kernel XDP Filters for DDoS Mitigation",
            duration: "32 min",
            type: "video",
            summary: "Drop malicious network packets at the network driver layer before kernel allocation.",
            notes: "# In-Kernel eBPF Filtering\neBPF runs verified sandboxed bytecode inside the Linux kernel.",
            codeSnippet: "SEC(\"xdp\") int xdp_filter(struct xdp_md *ctx) { return XDP_PASS; }"
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
    const initialMap = new Map(INITIAL_COURSES.map(c => [c.id, c]));
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const existingIds = new Set(parsed.map((c: Course) => c.id));
          const merged = parsed.map((c: Course) => {
            const init = initialMap.get(c.id);
            return {
              ...c,
              price: 0,
              thumbnailUrl: c.thumbnailUrl || init?.thumbnailUrl || "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=800&q=80",
            };
          });
          INITIAL_COURSES.forEach((c) => {
            if (!existingIds.has(c.id)) {
              merged.push(c);
            }
          });
          return merged;
        }
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
        skills: ["React 19", "Server Components", "Next.js 15", "Edge Streaming", "PostgreSQL"],
        instructorName: "Elena Rostova",
      }
    ];
  });

  const [bookmarks, setBookmarks] = useState<BookmarkNote[]>(() => {
    const saved = localStorage.getItem("astra_bookmarks");
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      {
        id: "bm-1",
        courseId: "ai-agents-masterclass",
        courseTitle: "Autonomous AI Agents & LLM Systems",
        lessonId: "ai-1-1",
        lessonTitle: "Introduction to Agentic Architectures vs Traditional LLM Calls",
        noteText: "Key concept: Autonomous Agent cycle operates in Perception -> Planning -> Tool Dispatch -> Reflection loop.",
        snippet: `// Agent State Graph Loop\nconst workflow = new StateGraph(AgentState)\n  .addNode("agent", callModel)\n  .addNode("tools", toolExecutor)\n  .addEdge("tools", "agent");`,
        tags: ["Architecture", "LangGraph", "AI"],
        createdAt: "Oct 5, 2026",
      },
      {
        id: "bm-2",
        courseId: "fullstack-react-nextjs",
        courseTitle: "Full-Stack Web Architecture: React 19 & Next.js",
        lessonId: "fs-1-1",
        lessonTitle: "React 19 Server Components Architecture & Actions",
        noteText: "Server Actions eliminate manual API handlers and provide zero-bundle RPC invocation directly with optimistic UI updates.",
        snippet: `"use server";\nexport async function updateProfile(formData: FormData) {\n  const user = await db.user.update({...});\n  revalidatePath("/dashboard");\n}`,
        tags: ["React 19", "Server Actions", "Full-Stack"],
        createdAt: "Oct 6, 2026",
      }
    ];
  });

  const [flashcards, setFlashcards] = useState<Flashcard[]>(() => {
    const saved = localStorage.getItem("astra_flashcards");
    if (saved) {
      try { return JSON.parse(saved); } catch { return []; }
    }
    return [
      {
        id: "fc-1",
        courseId: "ai-agents-masterclass",
        category: "AI & LangGraph",
        front: "What is the primary difference between a Cyclic Agent Graph and a DAG?",
        back: "A Cyclic Graph allows self-reflection, error retries, and multi-step tool execution loops until the objective is satisfied, unlike one-way DAGs.",
        mastered: false,
      },
      {
        id: "fc-2",
        courseId: "fullstack-react-nextjs",
        category: "React 19",
        front: "What is the role of useActionState in React 19?",
        back: "It manages the pending status, returned state, and form action dispatch for asynchronous server actions without manual useState booleans.",
        mastered: true,
      },
      {
        id: "fc-3",
        courseId: "zero-trust-rust-security",
        category: "Rust & Security",
        front: "Why does Rust eliminate Use-After-Free vulnerabilities?",
        back: "Compile-time borrow checker and affine type system guarantee single ownership and automatic memory deallocation without a garbage collector.",
        mastered: false,
      },
      {
        id: "fc-4",
        courseId: "devops-k8s-gitops",
        category: "DevOps & Cloud",
        front: "What is GitOps reconciliation in ArgoCD?",
        back: "Continuous loop comparing the desired Git declaration state against the live Kubernetes cluster state, automatically correcting drift.",
        mastered: false,
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

  useEffect(() => {
    localStorage.setItem("astra_bookmarks", JSON.stringify(bookmarks));
  }, [bookmarks]);

  useEffect(() => {
    localStorage.setItem("astra_flashcards", JSON.stringify(flashcards));
  }, [flashcards]);

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
      skills: course ? course.skills : ["Systems Architecture", "Advanced Computing"],
      instructorName: course ? course.instructor.name : "Dr. Sarah Chen",
    };

    setCertificates((prev) => [newCert, ...prev]);
    return newCert;
  };

  const addBookmark = (bookmark: Omit<BookmarkNote, "id" | "createdAt">) => {
    const newBm: BookmarkNote = {
      ...bookmark,
      id: `bm-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }),
    };
    setBookmarks((prev) => [newBm, ...prev]);
  };

  const removeBookmark = (id: string) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const isBookmarked = (lessonId: string) => {
    return bookmarks.some((b) => b.lessonId === lessonId);
  };

  const toggleFlashcardMastered = (id: string) => {
    setFlashcards((prev) =>
      prev.map((fc) => (fc.id === id ? { ...fc, mastered: !fc.mastered } : fc))
    );
  };

  const addFlashcard = (card: Omit<Flashcard, "id">) => {
    const newFc: Flashcard = {
      ...card,
      id: `fc-${Date.now()}`,
      mastered: false,
    };
    setFlashcards((prev) => [newFc, ...prev]);
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourseIds,
        completedLessonIds,
        certificates,
        bookmarks,
        flashcards,
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
        addBookmark,
        removeBookmark,
        isBookmarked,
        toggleFlashcardMastered,
        addFlashcard,
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
