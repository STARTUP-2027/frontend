import { useState } from "react";
import { useCourses, type Course, type Module, type Lesson } from "../context/CourseContext";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { astraApi } from "../../lib/api";

export type ContentBlockType =
  | "video"
  | "rich_text"
  | "image"
  | "diagram"
  | "code"
  | "callout"
  | "quiz"
  | "checklist"
  | "animation"
  | "resources";

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  // video
  videoUrl?: string;
  videoDuration?: string;
  videoProvider?: "youtube" | "vimeo" | "mp4" | "stream";
  timestamps?: Array<{ time: string; label: string }>;
  transcript?: string;
  // rich_text
  content?: string;
  // image
  imageUrl?: string;
  imageCaption?: string;
  imageLayout?: "full" | "contained" | "side";
  // diagram
  diagramType?: "flowchart" | "architecture" | "sequence" | "state" | "pipeline";
  diagramCode?: string;
  // code
  codeLanguage?: string;
  codeSnippet?: string;
  codeOutput?: string;
  // callout
  calloutTone?: "tip" | "warning" | "info" | "success" | "protip";
  calloutMessage?: string;
  // quiz
  quizQuestion?: string;
  quizOptions?: string[];
  quizCorrectIndex?: number;
  quizExplanation?: string;
  quizPoints?: number;
  // checklist
  checklistItems?: Array<{ id: string; text: string; done?: boolean }>;
  // animation / embed
  embedUrl?: string;
  animationType?: "lottie" | "codepen" | "figma" | "interactive";
  // resources
  resourceFiles?: Array<{ name: string; url: string; size: string; type: string }>;
}

export interface StudioLesson {
  id: string;
  title: string;
  duration: string;
  format: "video" | "text" | "interactive" | "hybrid" | "quiz";
  freePreview?: boolean;
  blocks: ContentBlock[];
}

export interface StudioModule {
  id: string;
  title: string;
  summary?: string;
  duration: string;
  unlockMode?: "immediate" | "drip";
  lessons: StudioLesson[];
}

export interface CourseDraft {
  id: string;
  title: string;
  tagline: string;
  description: string;
  category: "ai" | "fullstack" | "security" | "devops" | "design";
  level: "Beginner" | "Intermediate" | "Advanced" | "All Levels";
  duration: string;
  accessTier: "free" | "pro" | "enterprise";
  language: string;
  hasCertificate: boolean;
  targetAudience: string;
  prerequisites: string[];
  learningOutcomes: string[];
  skills: string;
  bannerGradient: string;
  thumbnailUrl: string;
  modules: StudioModule[];
}

// =========================================================================
// PREDEFINED COURSE TEMPLATES (Pure Blueprints - Never Modified)
// =========================================================================
export interface CourseTemplateBlueprint {
  id: string;
  title: string;
  tagline: string;
  category: "ai" | "fullstack" | "security" | "devops" | "design";
  badge: string;
  formatTag: string;
  icon: string;
  description: string;
  recommendedFor: string;
  draft: CourseDraft;
}

const PREDEFINED_TEMPLATES: CourseTemplateBlueprint[] = [
  {
    id: "tpl-video-masterclass",
    title: "Pure Video Masterclass Blueprint",
    tagline: "Lecture walkthroughs with chapter timestamps, video transcripts, and slide downloads",
    category: "fullstack",
    badge: "Video First",
    formatTag: "100% Video Lectures",
    icon: "🎥",
    description: "Designed specifically for video creators. Every topic features a high-definition video player, timed chapter markers, transcripts, and downloadable slides.",
    recommendedFor: "Video instructors, keynote presenters, screencast tutorials",
    draft: {
      id: "draft-video",
      title: "Full-Stack Distributed Systems with Go & gRPC",
      tagline: "High-definition video lectures exploring microservice streaming and Protobufs",
      description: "Master distributed systems architecture through guided video lectures, architectural walkthroughs, and code screencasts.",
      category: "fullstack",
      level: "Intermediate",
      duration: "12 Hours",
      accessTier: "pro",
      language: "English (US)",
      hasCertificate: true,
      targetAudience: "Backend developers, DevOps engineers, and distributed systems architects",
      prerequisites: ["Basic Golang syntax", "Understanding of HTTP/REST APIs"],
      learningOutcomes: [
        "Design sub-millisecond gRPC streaming services",
        "Generate cross-language code with Protocol Buffers v3",
        "Implement mutual TLS (mTLS) zero-trust microservice auth",
      ],
      skills: "Go, gRPC, Protobuf, Docker, Distributed Systems",
      bannerGradient: "linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)",
      thumbnailUrl: "",
      modules: [
        {
          id: "mod-v1",
          title: "Module 1: High-Performance Networking & Binary Protocols",
          summary: "Explore HTTP/2 multiplexing, binary framing, and gRPC wire protocols.",
          duration: "3.5 Hours",
          unlockMode: "immediate",
          lessons: [
            {
              id: "les-v1-1",
              title: "Lecture 1: The Anatomy of gRPC & Protocol Buffers",
              duration: "25 min",
              format: "video",
              freePreview: true,
              blocks: [
                {
                  id: "blk-v1",
                  type: "video",
                  title: "Anatomy of gRPC & Protocol Buffers Walkthrough",
                  videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
                  videoDuration: "25:00",
                  videoProvider: "youtube",
                  timestamps: [
                    { time: "00:00", label: "Protocol Buffers vs REST JSON Benchmarks" },
                    { time: "07:15", label: "HTTP/2 Multiplexing & Connection Pooling" },
                    { time: "16:40", label: "Proto3 Code Generation Deep Dive" },
                  ],
                },
                {
                  id: "blk-v2",
                  type: "callout",
                  calloutTone: "protip",
                  title: "Key Takeaway",
                  calloutMessage: "Binary protobuf serialization achieves 7-10x throughput improvements over JSON strings by eliminating UTF-8 parsing overhead.",
                },
                {
                  id: "blk-v3",
                  type: "resources",
                  title: "Lecture Reference Assets",
                  resourceFiles: [
                    { name: "gRPC_Architecture_Slides.pdf", url: "#", size: "3.4 MB", type: "PDF" },
                    { name: "starter-grpc-proto-repo.zip", url: "#", size: "1.2 MB", type: "ZIP" },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "tpl-text-reading",
    title: "Text & Illustrated Deep-Dive Guide",
    tagline: "Rich reading format with inline diagrams, formulas, callouts, and summary notes",
    category: "ai",
    badge: "Reading & Text",
    formatTag: "100% Reading / Documentation",
    icon: "📖",
    description: "No video required. Optimized for deep technical reading, system documentation, step-by-step illustrations, and architectural essays.",
    recommendedFor: "Technical writers, documentation guides, conceptual CS theory, self-paced reading",
    draft: {
      id: "draft-text",
      title: "Foundations of Vector Search & Dense Embeddings",
      tagline: "A comprehensive reading textbook on HNSW indexing, Cosine similarity, and RAG",
      description: "An illustrated, in-depth text guide covering vector mathematics, similarity metrics, and high-scale semantic retrieval.",
      category: "ai",
      level: "Intermediate",
      duration: "8.5 Hours",
      accessTier: "free",
      language: "English (US)",
      hasCertificate: true,
      targetAudience: "AI engineers, data scientists, and backend developers building search engines",
      prerequisites: ["Basic linear algebra", "Familiarity with Python vectors"],
      learningOutcomes: [
        "Master Hierarchical Navigable Small World (HNSW) graph theory",
        "Evaluate Cosine Distance vs Dot Product vs Euclidean L2",
        "Implement hybrid BM25 and dense vector reranking pipelines",
      ],
      skills: "Vector Search, HNSW, Python, RAG, Embeddings, AI",
      bannerGradient: "linear-gradient(135deg, #10b981 0%, #0284c7 100%)",
      thumbnailUrl: "",
      modules: [
        {
          id: "mod-t1",
          title: "Module 1: The Geometry of Semantic Vector Spaces",
          summary: "Learn how transformer neural networks project text into high-dimensional geometric spaces.",
          duration: "2.5 Hours",
          unlockMode: "immediate",
          lessons: [
            {
              id: "les-t1-1",
              title: "Chapter 1: Dense Vectors & High-Dimensional Distance Metrics",
              duration: "20 min",
              format: "text",
              freePreview: true,
              blocks: [
                {
                  id: "blk-t1",
                  type: "rich_text",
                  title: "High-Dimensional Vector Spaces",
                  content:
                    "Vector embeddings represent unstructured content (documents, audio, images) as dense numerical arrays in a shared multidimensional vector space.\n\nUnlike traditional keyword search which matches exact tokens (e.g. TF-IDF or BM25), semantic vector search identifies conceptual similarity even when zero vocabulary terms overlap.",
                },
                {
                  id: "blk-t2",
                  type: "image",
                  title: "Vector Clustering Visualization",
                  imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
                  imageCaption: "Figure 1: 1536-dimensional embedding clusters projected onto a 2D t-SNE manifold.",
                  imageLayout: "contained",
                },
                {
                  id: "blk-t3",
                  type: "callout",
                  calloutTone: "tip",
                  title: "Mathematical Pro-Tip",
                  calloutMessage:
                    "When embeddings are normalized to unit length (|v| = 1), Cosine Similarity is mathematically identical to the Dot Product, drastically accelerating SIMD hardware compute.",
                },
                {
                  id: "blk-t4",
                  type: "rich_text",
                  title: "Vector Distance Calculations",
                  content:
                    "1. Euclidean (L2) Distance: Measures the geometric length between two vector coordinates.\n2. Cosine Similarity: Measures the angular alignment between two directions regardless of magnitude.\n3. Dot Product: Magnifies matches with larger weights, ideal for non-normalized recommendation systems.",
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "tpl-diagram-architecture",
    title: "System Architecture & Flowchart Blueprint",
    tagline: "Interactive architectural flowcharts, microservice topologies, and design checklists",
    category: "devops",
    badge: "Architecture & Diagrams",
    formatTag: "Flowchart & System Design",
    icon: "📊",
    description: "Built for system architects. Combines interactive SVG flowcharts, data pipelines, trade-off analysis callouts, and design checklists.",
    recommendedFor: "System architects, cloud engineers, DevOps practitioners, high-level design",
    draft: {
      id: "draft-diagram",
      title: "Resilient Cloud Architecture & Disaster Recovery",
      tagline: "Master multi-region failover, event streaming topologies, and resilient microservices",
      description: "Visual, architecture-first curriculum walking through real-world system designs, edge routing, and fault-tolerant cloud infrastructure.",
      category: "devops",
      level: "Advanced",
      duration: "10 Hours",
      accessTier: "pro",
      language: "English (US)",
      hasCertificate: true,
      targetAudience: "Staff software engineers, cloud architects, and tech leads",
      prerequisites: ["Distributed systems fundamentals", "Docker and Kubernetes familiarity"],
      learningOutcomes: [
        "Design zero-data-loss multi-region active-active architectures",
        "Configure Kafka partitioning for ordered distributed event streaming",
        "Prevent cascading failures using circuit breakers and bulkhead pools",
      ],
      skills: "Cloud Architecture, Flowcharts, Kafka, Kubernetes, AWS, High Availability",
      bannerGradient: "linear-gradient(135deg, #06b6d4 0%, #3b82f6 100%)",
      thumbnailUrl: "",
      modules: [
        {
          id: "mod-d1",
          title: "Module 1: Edge Ingress & Microservice Routing Topologies",
          summary: "Design resilient entry gateways, rate limiters, and distributed service meshes.",
          duration: "3.0 Hours",
          unlockMode: "immediate",
          lessons: [
            {
              id: "les-d1-1",
              title: "Topology: Global Edge Ingress to Microservice Cluster",
              duration: "25 min",
              format: "interactive",
              freePreview: true,
              blocks: [
                {
                  id: "blk-d1",
                  type: "diagram",
                  title: "Global Ingress & Service Mesh Flowchart",
                  diagramType: "architecture",
                  diagramCode:
                    "[Global DNS / Cloudflare Edge] -> [API Gateway & Auth Proxy]\n[API Gateway & Auth Proxy] -> [Microservice Mesh Cluster]\n[Microservice Mesh Cluster] -> [Persistent Kafka Event Log]\n[Persistent Kafka Event Log] -> [Distributed Postgres Cluster]",
                },
                {
                  id: "blk-d2",
                  type: "callout",
                  calloutTone: "warning",
                  title: "Circuit Breaker Protection",
                  calloutMessage:
                    "Always configure timeout budgets and jittered exponential backoffs. Synchronous retry storms without backoffs will immediately crash upstream services.",
                },
                {
                  id: "blk-d3",
                  type: "checklist",
                  title: "Production Readiness Architecture Checklist",
                  checklistItems: [
                    { id: "chk-1", text: "Global health checks configured with 10-second heartbeat ping", done: true },
                    { id: "chk-2", text: "Rate limiting thresholds tuned per authenticated tenant token", done: true },
                    { id: "chk-3", text: "Read replicas configured with asynchronous logical replication", done: false },
                    { id: "chk-4", text: "Distributed OpenTelemetry tracing headers propagated across RPC calls", done: false },
                  ],
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "tpl-code-lab",
    title: "Interactive Hands-On Code Lab Blueprint",
    tagline: "Live code snippets, expected terminal outputs, unit test exercises, and syntax runners",
    category: "fullstack",
    badge: "Hands-on Code",
    formatTag: "Executable Code & Labs",
    icon: "💻",
    description: "Hands-on programming curriculum. Provides syntax-highlighted code blocks (Python, Go, TypeScript, Rust), sample terminal outputs, and instant quiz verification.",
    recommendedFor: "Coding bootcamps, language tutorials, backend labs, algorithmic problem solving",
    draft: {
      id: "draft-code",
      title: "Rust for High-Performance Systems Engineering",
      tagline: "Write memory-safe, fearless concurrent programs without a garbage collector",
      description: "Hands-on coding masterclass focusing on ownership, borrowing, lifetime annotations, and zero-cost abstractions in Rust.",
      category: "fullstack",
      level: "Intermediate",
      duration: "14 Hours",
      accessTier: "pro",
      language: "English (US)",
      hasCertificate: true,
      targetAudience: "C++, Go, and TypeScript developers migrating to high-performance systems Rust",
      prerequisites: ["Comfort with command-line tools", "Understanding of pointers and memory"],
      learningOutcomes: [
        "Master the borrow checker and eliminate data races at compile time",
        "Write custom zero-allocation iterators and thread pools",
        "Build a multi-threaded TCP web server using Tokio async runtimes",
      ],
      skills: "Rust, Systems Programming, Concurrency, Memory Safety, Tokio",
      bannerGradient: "linear-gradient(135deg, #f97316 0%, #dc2626 100%)",
      thumbnailUrl: "",
      modules: [
        {
          id: "mod-c1",
          title: "Module 1: Ownership, Borrowing & Memory Lifetimes",
          summary: "Learn how the Rust compiler guarantees memory safety without garbage collection.",
          duration: "4.0 Hours",
          unlockMode: "immediate",
          lessons: [
            {
              id: "les-c1-1",
              title: "Lab: Implementing Safe Concurrent Ring Buffers",
              duration: "30 min",
              format: "interactive",
              freePreview: true,
              blocks: [
                {
                  id: "blk-c1",
                  type: "rich_text",
                  title: "Ownership & Borrowing Constraints",
                  content:
                    "In Rust, every value has exactly one owner at any given moment. You may have either one mutable reference (&mut T) or any number of immutable references (&T), but never both simultaneously.",
                },
                {
                  id: "blk-c2",
                  type: "code",
                  title: "Concurrent Channel Implementation",
                  codeLanguage: "rust",
                  codeSnippet: `use std::sync::mpsc;\nuse std::thread;\nuse std::time::Duration;\n\nfn main() {\n    let (tx, rx) = mpsc::channel();\n\n    thread::spawn(move || {\n        let val = String::from("worker telemetry payload");\n        tx.send(val).unwrap();\n        println!("Worker thread successfully transmitted payload.");\n    });\n\n    let received = rx.recv().unwrap();\n    println!("Main receiver got: {}", received);\n}`,
                  codeOutput: "Worker thread successfully transmitted payload.\nMain receiver got: worker telemetry payload\n[PROCESS TERMINATED 0]",
                },
                {
                  id: "blk-c3",
                  type: "quiz",
                  title: "Rust Memory Model Verification",
                  quizQuestion: "What occurs if you attempt to use a variable after passing it into thread::spawn(move || ...)?",
                  quizOptions: [
                    "Compile error: value used after move",
                    "A runtime null pointer exception is thrown",
                    "The value is automatically duplicated in heap memory",
                    "The variable is converted into an undefined raw pointer",
                  ],
                  quizCorrectIndex: 0,
                  quizExplanation: "Rust's affine type system tracks ownership moves statically. Moving a value transfers exclusive ownership, rendering the original binding unusable.",
                  quizPoints: 25,
                },
              ],
            },
          ],
        },
      ],
    },
  },
  {
    id: "tpl-complete-hybrid",
    title: "Multi-Modal Complete Hybrid Course Blueprint",
    tagline: "The gold standard: Video lecture + Reading notes + SVG Flowchart + Code lab + Checkpoint",
    category: "ai",
    badge: "Flagship Hybrid",
    formatTag: "Video + Text + Flowchart + Code + Quiz",
    icon: "⚡",
    description: "The complete, balanced EdTech masterclass. Every lesson weaves together video lectures, rich markdown, interactive flowcharts, live code snippets, and knowledge checks.",
    recommendedFor: "Flagship courses, university-level curricula, comprehensive certifications",
    draft: {
      id: "draft-hybrid",
      title: "Autonomous Multi-Agent AI Systems with LangGraph",
      tagline: "Build persistent, self-correcting agent graphs with tool execution and memory checkpointing",
      description: "Comprehensive end-to-end curriculum on autonomous multi-agent swarms, recursive tool calling, human-in-the-loop approvals, and production evaluation.",
      category: "ai",
      level: "Advanced",
      duration: "18.5 Hours",
      accessTier: "enterprise",
      language: "English (US)",
      hasCertificate: true,
      targetAudience: "Senior software engineers, AI architects, and machine learning researchers",
      prerequisites: ["Python 3.12 proficiency", "AsyncIO fundamentals", "OpenAI / Claude API key"],
      learningOutcomes: [
        "Design cyclic state graph workflows with conditional routing edges",
        "Implement short-term memory buffers and long-term vector persistence",
        "Build deterministic human-in-the-loop review and rollback triggers",
      ],
      skills: "Python, LangGraph, Multi-Agent Swarms, AI, Claude, AsyncIO",
      bannerGradient: "linear-gradient(135deg, #7c3aed 0%, #ec4899 100%)",
      thumbnailUrl: "",
      modules: [
        {
          id: "mod-h1",
          title: "Module 1: Cyclic Agent State Graphs & Memory Checkpoints",
          summary: "Construct stateful multi-agent graphs with persistent memory checkpoints.",
          duration: "4.5 Hours",
          unlockMode: "immediate",
          lessons: [
            {
              id: "les-h1-1",
              title: "Lesson 1: Multi-Agent Cyclic Graph Architecture",
              duration: "25 min",
              format: "hybrid",
              freePreview: true,
              blocks: [
                {
                  id: "blk-h1",
                  type: "video",
                  title: "Cyclic Multi-Agent Graph Walkthrough",
                  videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
                  videoDuration: "16:40",
                  videoProvider: "youtube",
                  timestamps: [
                    { time: "00:00", label: "State Graph Core Fundamentals" },
                    { time: "05:20", label: "Conditional Router Nodes vs Linear Chains" },
                    { time: "11:45", label: "Memory Checkpoints & Rollbacks" },
                  ],
                },
                {
                  id: "blk-h2",
                  type: "rich_text",
                  title: "State Management in Cyclic Agent Graphs",
                  content:
                    "Unlike linear prompt chains (e.g. LangChain chains), complex autonomous agents require cyclic feedback loops. When an agent tool fails or encounters an edge case, the graph routes execution back to the reasoning node to revise the hypothesis.",
                },
                {
                  id: "blk-h3",
                  type: "diagram",
                  title: "Autonomous Agent Cyclic Feedback Flowchart",
                  diagramType: "flowchart",
                  diagramCode:
                    "[User Prompt & Task Spec] -> [Supervisor Agent Planner]\n[Supervisor Agent Planner] -> [Coder Agent Node]\n[Coder Agent Node] -> [Test Execution Sandbox]\n[Test Execution Sandbox] -> [Supervisor Agent Planner]\n[Supervisor Agent Planner] -> [Verified Production Output]",
                },
                {
                  id: "blk-h4",
                  type: "code",
                  title: "Defining StateGraph in Python 3.12",
                  codeLanguage: "python",
                  codeSnippet: `from typing import Annotated, TypedDict\nimport operator\n\nclass AgentState(TypedDict):\n    messages: Annotated[list[str], operator.add]\n    current_step: str\n    is_resolved: bool\n\ndef planner_node(state: AgentState) -> dict:\n    print(f"Executing reasoning step for: {state['current_step']}")\n    return {"messages": ["Step analyzed successfully."]}\n`,
                  codeOutput: "Executing reasoning step for: initial_synthesis\n[STATE MUTATED OK]",
                },
                {
                  id: "blk-h5",
                  type: "quiz",
                  title: "State Checkpoint Concept Verification",
                  quizQuestion: "Why is an immutable checkpoint persisted after every agent graph node transition?",
                  quizOptions: [
                    "To enable human-in-the-loop review, replayability, and state recovery",
                    "Because GPUs cannot retain memory between two prompt tokens",
                    "To force the agent to restart from scratch upon any timeout",
                    "It is purely required by Python runtime garbage collection",
                  ],
                  quizCorrectIndex: 0,
                  quizExplanation: "Checkpoints provide durable state history, permitting developers to pause workflows, inspect agent thoughts, and time-travel back to previous state nodes.",
                  quizPoints: 20,
                },
              ],
            },
          ],
        },
      ],
    },
  },
];

// Blank Canvas Course Starter (Clean Scratch State)
const BLANK_SCRATCH_DRAFT: CourseDraft = {
  id: "draft-scratch",
  title: "",
  tagline: "",
  description: "",
  category: "fullstack",
  level: "Beginner",
  duration: "8 Hours",
  accessTier: "pro",
  language: "English (US)",
  hasCertificate: true,
  targetAudience: "",
  prerequisites: [],
  learningOutcomes: [],
  skills: "",
  bannerGradient: "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
  thumbnailUrl: "",
  modules: [
    {
      id: "mod-1",
      title: "Module 1: Getting Started & Core Fundamentals",
      summary: "Foundational concepts and setup requirements.",
      duration: "2 Hours",
      unlockMode: "immediate",
      lessons: [
        {
          id: "les-1",
          title: "Topic 1: Overview & First Steps",
          duration: "15 min",
          format: "hybrid",
          freePreview: true,
          blocks: [
            {
              id: "blk-init",
              type: "rich_text",
              title: "Welcome to this Course",
              content: "Start typing your lesson overview, or add any block below (video, flowchart diagram, code runner, quiz, etc.).",
            },
          ],
        },
      ],
    },
  ],
};

interface AdminCourseStudioProps {
  initialCourseId?: string | null;
  onSaved?: (courseId: string) => void;
  onCancel?: () => void;
}

export default function AdminCourseStudio({ initialCourseId, onSaved, onCancel }: AdminCourseStudioProps) {
  const { dark: globalDark } = useTheme();
  const { user } = useAuth();
  const { courses, createCourse, updateCourse } = useCourses();

  // If initialCourseId is provided, find that course from catalog
  const existingCourse = initialCourseId ? courses.find((c) => c.id === initialCourseId) : null;

  // Active Draft State (null = show Template Gallery starter screen!)
  const [courseDraft, setCourseDraft] = useState<CourseDraft | null>(() => {
    if (existingCourse) {
      // Load existing course into draft structure
      return {
        id: existingCourse.id,
        title: existingCourse.title,
        tagline: existingCourse.tagline,
        description: existingCourse.description,
        category: existingCourse.category,
        level: existingCourse.level,
        duration: existingCourse.duration,
        accessTier: "pro",
        language: "English (US)",
        hasCertificate: true,
        targetAudience: "Software Engineers and Technical Professionals",
        prerequisites: ["Fundamental computer science basics"],
        learningOutcomes: existingCourse.skills.map((s) => `Master practical skills in ${s}`),
        skills: existingCourse.skills.join(", "),
        bannerGradient: existingCourse.bannerGradient || "linear-gradient(135deg, #6366f1 0%, #a855f7 100%)",
        thumbnailUrl: existingCourse.thumbnailUrl || "",
        modules: existingCourse.modules.map((m) => ({
          id: m.id,
          title: m.title,
          duration: m.duration,
          unlockMode: "immediate",
          lessons: m.lessons.map((l) => ({
            id: l.id,
            title: l.title,
            duration: l.duration,
            format: l.videoUrl ? "video" : l.codeSnippet ? "interactive" : "text",
            freePreview: true,
            blocks: [
              ...(l.videoUrl
                ? [
                    {
                      id: `blk-vid-${l.id}`,
                      type: "video" as ContentBlockType,
                      title: "Video Lecture",
                      videoUrl: l.videoUrl,
                      videoDuration: l.duration,
                      videoProvider: "youtube" as const,
                    },
                  ]
                : []),
              {
                id: `blk-txt-${l.id}`,
                type: "rich_text" as ContentBlockType,
                title: "Lesson Notes & Theory",
                content: l.notes || l.summary || "Explore the fundamental architecture and design considerations.",
              },
              ...(l.codeSnippet
                ? [
                    {
                      id: `blk-code-${l.id}`,
                      type: "code" as ContentBlockType,
                      title: "Hands-on Code Snippet",
                      codeLanguage: "typescript",
                      codeSnippet: l.codeSnippet,
                      codeOutput: "Successfully executed sample code.",
                    },
                  ]
                : []),
              ...(l.quiz
                ? [
                    {
                      id: `blk-qz-${l.id}`,
                      type: "quiz" as ContentBlockType,
                      title: "Checkpoint Quiz",
                      quizQuestion: l.quiz.question,
                      quizOptions: l.quiz.options,
                      quizCorrectIndex: l.quiz.correctIndex,
                      quizExplanation: l.quiz.explanation,
                    },
                  ]
                : []),
            ],
          })),
        })),
      };
    }
    // Default to null so the user is greeted with the Template Gallery first!
    return null;
  });

  // Track which template was duplicated (for friendly banner notification)
  const [activeTemplateBadge, setActiveTemplateBadge] = useState<string | null>(
    existingCourse ? "Existing Catalog Course" : null
  );

  // View: "editor" (default full width) or "preview" (live student classroom)
  const [activeView, setActiveView] = useState<"editor" | "preview">("editor");
  const [previewViewport, setPreviewViewport] = useState<"desktop" | "tablet" | "mobile">("desktop");
  const [previewDarkTheme, setPreviewDarkTheme] = useState<boolean>(globalDark);

  // Selected Module & Lesson in Editor
  const [activeModuleId, setActiveModuleId] = useState<string>("");
  const [activeLessonId, setActiveLessonId] = useState<string>("");

  // Helper to ensure active module and lesson exist
  const activeModule =
    courseDraft?.modules.find((m) => m.id === activeModuleId) || courseDraft?.modules[0];
  const activeLesson =
    activeModule?.lessons.find((l) => l.id === activeLessonId) || activeModule?.lessons[0];

  // Helper when a template is chosen: DUPLICATES the template!
  const handleSelectTemplate = (tpl: CourseTemplateBlueprint) => {
    // Deep duplicate so the original template is never modified
    const duplicate = structuredClone(tpl.draft);
    duplicate.id = `draft-${Date.now().toString().slice(-6)}`;
    duplicate.title = `${tpl.draft.title} (Draft)`;

    setCourseDraft(duplicate);
    setActiveTemplateBadge(tpl.title);
    if (duplicate.modules.length > 0) {
      setActiveModuleId(duplicate.modules[0].id);
      if (duplicate.modules[0].lessons.length > 0) {
        setActiveLessonId(duplicate.modules[0].lessons[0].id);
      }
    }
    setActiveView("editor");
  };

  // Helper for starting from complete scratch
  const handleStartFromScratch = () => {
    const scratch = structuredClone(BLANK_SCRATCH_DRAFT);
    scratch.id = `draft-${Date.now().toString().slice(-6)}`;
    setCourseDraft(scratch);
    setActiveTemplateBadge("Custom Blank Canvas");
    setActiveModuleId(scratch.modules[0].id);
    setActiveLessonId(scratch.modules[0].lessons[0].id);
    setActiveView("editor");
  };

  // Toast message
  const [toastMsg, setToastMsg] = useState<string | null>(null);
  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  // Live Student Preview states (quizzes interactive answering)
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [showQuizFeedback, setShowQuizFeedback] = useState<Record<string, boolean>>({});

  // Helper to mutate active lesson blocks
  const updateActiveLessonBlocks = (updater: (prev: ContentBlock[]) => ContentBlock[]) => {
    if (!courseDraft || !activeLesson) return;
    setCourseDraft({
      ...courseDraft,
      modules: courseDraft.modules.map((m) => {
        if (m.id !== (activeModule?.id || "")) return m;
        return {
          ...m,
          lessons: m.lessons.map((l) => {
            if (l.id !== (activeLesson?.id || "")) return l;
            return {
              ...l,
              blocks: updater(l.blocks),
            };
          }),
        };
      }),
    });
  };

  // Block management
  const handleAddBlock = (type: ContentBlockType) => {
    const newId = `blk-${Date.now().toString().slice(-4)}`;
    let newBlock: ContentBlock;

    switch (type) {
      case "video":
        newBlock = {
          id: newId,
          type: "video",
          title: "Video Lecture Walkthrough",
          videoUrl: "https://www.youtube-nocookie.com/embed/aircAruvnKk",
          videoDuration: "12:00",
          videoProvider: "youtube",
          timestamps: [
            { time: "00:00", label: "Introduction & Setup" },
            { time: "04:30", label: "Architecture Walkthrough" },
          ],
        };
        break;
      case "rich_text":
        newBlock = {
          id: newId,
          type: "rich_text",
          title: "Core Concepts & Explanations",
          content: "Write in-depth explanations, markdown headers, and theoretical notes here...",
        };
        break;
      case "diagram":
        newBlock = {
          id: newId,
          type: "diagram",
          title: "System Architecture & Flowchart",
          diagramType: "flowchart",
          diagramCode:
            "[Client Browser / App] -> [API Gateway & Ingress]\n[API Gateway & Ingress] -> [Microservice Core Service]\n[Microservice Core Service] -> [Persistent Database Storage]",
        };
        break;
      case "code":
        newBlock = {
          id: newId,
          type: "code",
          title: "Hands-on Code Implementation",
          codeLanguage: "typescript",
          codeSnippet: `// Type-Safe Handler Example\ninterface UserEvent {\n  id: string;\n  name: string;\n}\n\nexport function handleEvent(evt: UserEvent) {\n  console.log("Processed event:", evt.name);\n}`,
          codeOutput: "Processed event: user-auth-verified [STATUS 200 OK]",
        };
        break;
      case "image":
        newBlock = {
          id: newId,
          type: "image",
          title: "Inline Architecture Diagram",
          imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
          imageCaption: "Figure: High-availability component interactions across clusters.",
          imageLayout: "contained",
        };
        break;
      case "callout":
        newBlock = {
          id: newId,
          type: "callout",
          title: "Pro-Tip Highlight",
          calloutTone: "tip",
          calloutMessage: "Highlight key performance considerations, gotchas, or interview tips.",
        };
        break;
      case "quiz":
        newBlock = {
          id: newId,
          type: "quiz",
          title: "Knowledge Checkpoint",
          quizQuestion: "What is the primary advantage of decoupled asynchronous event streams?",
          quizOptions: [
            "Downstream service latency does not block upstream producers",
            "It eliminates the need for database storage completely",
            "It automatically writes all client frontend code",
            "It requires zero network bandwidth",
          ],
          quizCorrectIndex: 0,
          quizExplanation: "Event streams decouple time and state, allowing producers to dispatch events without waiting on downstream consumers.",
          quizPoints: 20,
        };
        break;
      case "checklist":
        newBlock = {
          id: newId,
          type: "checklist",
          title: "Hands-on Action Checklist",
          checklistItems: [
            { id: "c1", text: "Configure environment variables and API keys", done: false },
            { id: "c2", text: "Run database migration script", done: false },
            { id: "c3", text: "Execute automated integration test suite", done: false },
          ],
        };
        break;
      case "resources":
        newBlock = {
          id: newId,
          type: "resources",
          title: "Reference Downloads & Assets",
          resourceFiles: [
            { name: "Architecture_Cheatsheet.pdf", url: "#", size: "2.1 MB", type: "PDF" },
            { name: "starter-lab-code.zip", url: "#", size: "1.4 MB", type: "ZIP" },
          ],
        };
        break;
      default:
        return;
    }

    updateActiveLessonBlocks((prev) => [...prev, newBlock]);
    showToast(`Added ${type} block to topic`);
  };

  const handleUpdateBlock = (blockId: string, partial: Partial<ContentBlock>) => {
    updateActiveLessonBlocks((prev) =>
      prev.map((b) => (b.id === blockId ? { ...b, ...partial } : b))
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    updateActiveLessonBlocks((prev) => prev.filter((b) => b.id !== blockId));
  };

  const handleMoveBlock = (blockId: string, direction: "up" | "down") => {
    updateActiveLessonBlocks((prev) => {
      const idx = prev.findIndex((b) => b.id === blockId);
      if (idx === -1) return prev;
      if (direction === "up" && idx === 0) return prev;
      if (direction === "down" && idx === prev.length - 1) return prev;

      const targetIdx = direction === "up" ? idx - 1 : idx + 1;
      const copy = [...prev];
      const temp = copy[idx];
      copy[idx] = copy[targetIdx];
      copy[targetIdx] = temp;
      return copy;
    });
  };

  // Module and Lesson actions
  const handleAddModule = () => {
    if (!courseDraft) return;
    const newModId = `mod-${Date.now().toString().slice(-4)}`;
    const newMod: StudioModule = {
      id: newModId,
      title: `Module ${courseDraft.modules.length + 1}: Practical Applications`,
      summary: "Understand advanced patterns and architectural trade-offs.",
      duration: "2.5 Hours",
      unlockMode: "immediate",
      lessons: [
        {
          id: `les-${newModId}-1`,
          title: "Topic 1: Architectural Foundations",
          duration: "20 min",
          format: "hybrid",
          freePreview: true,
          blocks: [
            {
              id: `blk-init-${newModId}`,
              type: "rich_text",
              title: "Module Objectives",
              content: "Describe what will be built and mastered in this module.",
            },
          ],
        },
      ],
    };

    setCourseDraft({
      ...courseDraft,
      modules: [...courseDraft.modules, newMod],
    });
    setActiveModuleId(newModId);
    setActiveLessonId(newMod.lessons[0].id);
    showToast("Added new module to curriculum");
  };

  const handleAddLesson = (modId: string) => {
    if (!courseDraft) return;
    const targetMod = courseDraft.modules.find((m) => m.id === modId);
    if (!targetMod) return;

    const newLesId = `les-${Date.now().toString().slice(-4)}`;
    const newLesson: StudioLesson = {
      id: newLesId,
      title: `Topic ${targetMod.lessons.length + 1}: Hands-on Exercise`,
      duration: "20 min",
      format: "hybrid",
      freePreview: true,
      blocks: [
        {
          id: `blk-init-${newLesId}`,
          type: "rich_text",
          title: "Topic Overview",
          content: "Add detailed instructions, code, diagrams, or video lectures below.",
        },
      ],
    };

    setCourseDraft({
      ...courseDraft,
      modules: courseDraft.modules.map((m) =>
        m.id === modId ? { ...m, lessons: [...m.lessons, newLesson] } : m
      ),
    });
    setActiveLessonId(newLesId);
    showToast("Added topic to module");
  };

  // Save / Publish Course to Context
  const handleSaveAndPublish = () => {
    if (!courseDraft) return;
    if (!courseDraft.title.trim()) {
      alert("Please provide a Course Title before publishing.");
      return;
    }

    // Convert draft modules to CourseContext structure
    const convertedModules: Module[] = courseDraft.modules.map((m) => ({
      id: m.id,
      title: m.title,
      duration: m.duration,
      lessons: m.lessons.map((les) => {
        const videoBlock = les.blocks.find((b) => b.type === "video");
        const textBlock = les.blocks.find((b) => b.type === "rich_text");
        const codeBlock = les.blocks.find((b) => b.type === "code");
        const quizBlock = les.blocks.find((b) => b.type === "quiz");

        const convertedLesson: Lesson = {
          id: les.id,
          title: les.title,
          duration: les.duration,
          type: videoBlock ? "video" : codeBlock ? "code" : "reading",
          videoUrl: videoBlock?.videoUrl || "",
          summary: les.blocks.find((b) => b.title)?.title || les.title,
          notes: les.blocks
            .map((b) => {
              if (b.type === "rich_text") return b.content;
              if (b.type === "callout") return `> [!${b.calloutTone?.toUpperCase()}] ${b.calloutMessage}`;
              if (b.type === "diagram") return `\`\`\`mermaid\n${b.diagramCode}\n\`\`\``;
              return "";
            })
            .filter(Boolean)
            .join("\n\n"),
          codeSnippet: codeBlock?.codeSnippet || "",
          blocks: les.blocks,
          quiz: quizBlock
            ? {
                question: quizBlock.quizQuestion || "",
                options: quizBlock.quizOptions || [],
                correctIndex: quizBlock.quizCorrectIndex || 0,
                explanation: quizBlock.quizExplanation || "",
              }
            : undefined,
        };
        return convertedLesson;
      }),
    }));

    const courseSlug = courseDraft.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "");

    const courseData: Course = {
      id: courseDraft.id.startsWith("draft-") ? `course-${Date.now().toString().slice(-4)}` : courseDraft.id,
      slug: courseSlug,
      title: courseDraft.title,
      tagline: courseDraft.tagline || "Comprehensive hands-on curriculum",
      description: courseDraft.description || "In-depth masterclass designed for engineering professionals.",
      category: courseDraft.category,
      categoryLabel:
        courseDraft.category === "ai"
          ? "AI & Autonomous Systems"
          : courseDraft.category === "fullstack"
          ? "Full-Stack & Systems"
          : courseDraft.category === "devops"
          ? "Cloud & DevOps"
          : courseDraft.category === "security"
          ? "Cybersecurity & Networks"
          : "Product & UI/UX",
      level: courseDraft.level,
      duration: courseDraft.duration,
      lessonsCount: convertedModules.reduce((acc, m) => acc + m.lessons.length, 0),
      studentsCount: existingCourse?.studentsCount || 0,
      rating: existingCourse?.rating || 5.0,
      reviewsCount: existingCourse?.reviewsCount || 0,
      price: courseDraft.accessTier === "free" ? 0 : 49,
      featured: true,
      bannerGradient: courseDraft.bannerGradient,
      thumbnailUrl: courseDraft.thumbnailUrl.trim() || undefined,
      instructor: {
        name: user?.name || "Dr. Sarah Chen",
        role: "Principal Systems Architect",
        avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        company: "Astra Systems Lab",
      },
      skills: courseDraft.skills.split(",").map((s) => s.trim()).filter(Boolean),
      modules: convertedModules,
    };

    if (existingCourse) {
      updateCourse(courseData.id, courseData);
    } else {
      createCourse(courseData);
    }

    astraApi.saveCourse(courseData).catch(() => {});

    showToast(`Published "${courseDraft.title}" to catalog successfully!`);
    setTimeout(() => {
      if (onSaved) onSaved(courseData.id);
    }, 1800);
  };

  // Helper visual renderer for Flowcharts
  const renderFlowchartVisual = (code?: string) => {
    const lines = (code || "").split("\n").filter((l) => l.includes("->"));
    if (lines.length === 0) {
      return (
        <div className="p-4 rounded-xl bg-slate-900 text-slate-300 font-mono text-xs">
          {code || "No diagram connections defined"}
        </div>
      );
    }

    return (
      <div className="p-5 rounded-2xl bg-slate-950 border border-slate-800 text-slate-200 space-y-4">
        <div className="flex items-center justify-between text-[11px] text-slate-400 pb-2 border-b border-slate-800">
          <span className="font-mono flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Live SVG Flowchart Diagram
          </span>
          <span className="text-[10px] uppercase font-bold text-cyan-400">Interactive Architecture View</span>
        </div>

        <div className="flex flex-col items-center gap-2.5 py-2">
          {lines.map((line, idx) => {
            const parts = line.split("->").map((p) => p.replace(/[\[\]]/g, "").trim());
            const source = parts[0];
            const target = parts[1];

            return (
              <div key={idx} className="flex flex-col items-center w-full max-w-md">
                <div className="w-full p-2.5 rounded-xl bg-slate-900 border border-cyan-500/30 text-center font-mono text-xs font-bold text-cyan-200 shadow-sm">
                  {source}
                </div>
                <div className="h-5 w-0.5 bg-gradient-to-b from-cyan-500 to-indigo-500 relative my-0.5">
                  <div className="absolute -bottom-1 -left-1 text-[10px] text-indigo-400">▼</div>
                </div>
                {idx === lines.length - 1 && (
                  <div className="w-full p-2.5 rounded-xl bg-indigo-950 border border-indigo-500/40 text-center font-mono text-xs font-bold text-indigo-200 shadow-sm">
                    {target}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // =========================================================================
  // VIEW A: TEMPLATE GALLERY & STARTER PICKER (Shown when no draft is active)
  // =========================================================================
  if (!courseDraft) {
    return (
      <div className="space-y-8 animate-in fade-in duration-200">
        {/* Banner Header */}
        <div className="p-6 md:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xs space-y-3">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--accent)] text-white shadow-xs">
              Universal Course Authoring
            </span>
            <span className="text-xs text-[var(--muted)]">• Choose a Starting Point</span>
          </div>

          <h2 className="text-2xl md:text-3xl font-black tracking-tight text-[var(--foreground)]">
            How would you like to build your course?
          </h2>

          <p className="text-xs md:text-sm text-[var(--muted)] max-w-3xl leading-relaxed">
            Choose a pre-configured template blueprint below to duplicate instantly, or start from complete scratch.
            Templates are <strong>always duplicated safely</strong> so the original designs remain intact and ready for anyone to use.
          </p>
        </div>

        {/* Option 1: Create from Scratch (Hero Card) */}
        <div
          onClick={handleStartFromScratch}
          className="p-6 rounded-3xl bg-gradient-to-r from-blue-600/10 via-[var(--surface)] to-[var(--surface)] border-2 border-blue-500/30 hover:border-blue-500 shadow-sm transition-all cursor-pointer group flex flex-col md:flex-row md:items-center justify-between gap-6"
        >
          <div className="flex items-start gap-4">
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center text-2xl font-black shadow-md shrink-0 group-hover:scale-105 transition-transform">
              ➕
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-bold text-[var(--foreground)]">Create Blank Course from Scratch</h3>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                  Total Flexibility
                </span>
              </div>
              <p className="text-xs text-[var(--muted)] max-w-2xl">
                Start with a 100% empty canvas. You define the title, modules, and assemble any combination of text, inline images, flowcharts, code runners, and quizzes yourself.
              </p>
            </div>
          </div>

          <button className="px-5 py-2.5 rounded-xl text-xs font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-all shrink-0">
            Start Blank Canvas →
          </button>
        </div>

        {/* Option 2: Predefined Duplicatable Templates Gallery */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold uppercase tracking-wider text-[var(--muted)]">
              Or Duplicate a Predefined Template Blueprint ({PREDEFINED_TEMPLATES.length})
            </h3>
            <span className="text-xs text-[var(--muted)]">Clicking duplicates a fresh copy</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {PREDEFINED_TEMPLATES.map((tpl) => (
              <div
                key={tpl.id}
                onClick={() => handleSelectTemplate(tpl)}
                className="p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] hover:border-[var(--accent)] hover:shadow-md transition-all cursor-pointer flex flex-col justify-between gap-4 group"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-2xl group-hover:scale-110 transition-transform">{tpl.icon}</span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[var(--surface-soft)] text-[var(--foreground)] border border-[var(--border)]">
                      {tpl.badge}
                    </span>
                  </div>

                  <div>
                    <h4 className="text-sm font-extrabold text-[var(--foreground)] group-hover:text-[var(--accent)] transition-colors">
                      {tpl.title}
                    </h4>
                    <p className="text-xs text-[var(--muted)] font-medium mt-0.5 line-clamp-2">
                      {tpl.tagline}
                    </p>
                  </div>

                  <p className="text-xs text-[var(--muted)] leading-relaxed line-clamp-3">
                    {tpl.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[var(--border-soft)] flex items-center justify-between text-xs">
                  <span className="text-[11px] font-semibold text-[var(--accent)]">{tpl.formatTag}</span>
                  <span className="font-bold text-[var(--foreground)] group-hover:translate-x-1 transition-transform">
                    Use Template →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // =========================================================================
  // VIEW B: ACTIVE COURSE CREATOR STUDIO & LIVE STUDENT PREVIEW
  // =========================================================================
  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl bg-slate-900 text-white shadow-xl text-xs font-semibold flex items-center gap-2 border border-emerald-500/50 animate-in fade-in slide-in-from-bottom-2">
          <span className="text-emerald-400">✓</span>
          {toastMsg}
        </div>
      )}

      {/* Top Banner & Mode Toggle */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 p-4 md:p-5 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={() => {
              if (confirm("Go back to Template Gallery? Any unsaved edits will be discarded.")) {
                setCourseDraft(null);
              }
            }}
            className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] text-[var(--foreground)] transition-colors shrink-0 flex items-center gap-1.5"
            title="Pick a different template or start over"
          >
            <span>←</span> Templates
          </button>

          <div className="min-w-0">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base font-bold text-[var(--foreground)] truncate">
                {courseDraft.title || "Untitled Course Draft"}
              </h2>
              {activeTemplateBadge && (
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 whitespace-nowrap">
                  Based on: {activeTemplateBadge}
                </span>
              )}
            </div>
            <p className="text-xs text-[var(--muted)] truncate">
              {courseDraft.modules.length} Modules •{" "}
              {courseDraft.modules.reduce((acc, m) => acc + m.lessons.length, 0)} Topics • Universal Multi-Modal Builder
            </p>
          </div>
        </div>

        {/* View Toggles & Actions */}
        <div className="flex items-center gap-2.5 shrink-0 flex-wrap">
          <div className="flex rounded-xl bg-[var(--surface-soft)] p-0.5 border border-[var(--border)] text-xs">
            <button
              onClick={() => setActiveView("editor")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === "editor"
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>✏️</span> Studio Editor
            </button>
            <button
              onClick={() => setActiveView("preview")}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all flex items-center gap-1.5 ${
                activeView === "preview"
                  ? "bg-[var(--accent)] text-white shadow-xs"
                  : "text-[var(--muted)] hover:text-[var(--foreground)]"
              }`}
            >
              <span>👁️</span> Live Student Preview
            </button>
          </div>

          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3.5 py-1.5 rounded-xl text-xs font-semibold bg-[var(--surface-soft)] border border-[var(--border)] hover:bg-[var(--surface)] text-[var(--muted)]"
            >
              Close
            </button>
          )}

          <button
            onClick={handleSaveAndPublish}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all flex items-center gap-1.5"
          >
            <span>💾</span> Publish Course
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* 1. STUDIO EDITOR VIEW (Clean, spacious, full width) */}
      {/* ===================================================================== */}
      {activeView === "editor" && (
        <div className="space-y-6">
          {/* SECTION 1: COURSE METADATA & COMPREHENSIVE SETTINGS */}
          <div className="p-5 md:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-5 shadow-xs">
            <div className="flex items-center justify-between pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)] flex items-center gap-2">
                  <span>1. Course Overview, Metadata & Pedagogical Settings</span>
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Universal configuration compatible with all disciplines, pricing models, and target skill levels.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* Course Title */}
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-[var(--foreground)]">Course Title</label>
                <input
                  type="text"
                  value={courseDraft.title}
                  onChange={(e) => setCourseDraft({ ...courseDraft, title: e.target.value })}
                  placeholder="e.g. Distributed Systems Architecture & Protocol Buffers"
                  className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-sm font-bold text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Tagline */}
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-[var(--foreground)]">Punchy Hook / Tagline</label>
                <input
                  type="text"
                  value={courseDraft.tagline}
                  onChange={(e) => setCourseDraft({ ...courseDraft, tagline: e.target.value })}
                  placeholder="e.g. Master high-throughput microservices, flowcharts, and resilient APIs"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)]"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2 space-y-1">
                <label className="font-bold text-[var(--foreground)]">Full Course Description & Overview</label>
                <textarea
                  value={courseDraft.description}
                  onChange={(e) => setCourseDraft({ ...courseDraft, description: e.target.value })}
                  rows={3}
                  placeholder="Explain the core competencies, projects, and architecture covered throughout this course..."
                  className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-y leading-relaxed"
                />
              </div>

              {/* Domain / Discipline */}
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Discipline / Domain</label>
                <select
                  value={courseDraft.category}
                  onChange={(e) => setCourseDraft({ ...courseDraft, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                >
                  <option value="fullstack">Full-Stack & Systems Engineering</option>
                  <option value="ai">AI & Autonomous Agents</option>
                  <option value="devops">Cloud, DevOps & High Availability</option>
                  <option value="security">Cybersecurity & Networking</option>
                  <option value="design">Product Design & UI/UX</option>
                </select>
              </div>

              {/* Difficulty Level */}
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Difficulty Level</label>
                <select
                  value={courseDraft.level}
                  onChange={(e) => setCourseDraft({ ...courseDraft, level: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--foreground)]"
                >
                  <option value="Beginner">Beginner (Foundations & Syntax)</option>
                  <option value="Intermediate">Intermediate (Real-world Architecture)</option>
                  <option value="Advanced">Advanced (Scale & Internal Mechanics)</option>
                  <option value="All Levels">All Levels (Comprehensive)</option>
                </select>
              </div>

              {/* Duration & Access Tier */}
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Estimated Total Duration</label>
                <input
                  type="text"
                  value={courseDraft.duration}
                  onChange={(e) => setCourseDraft({ ...courseDraft, duration: e.target.value })}
                  placeholder="e.g. 14.5 Hours"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                />
              </div>

              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Subscription Access Tier</label>
                <select
                  value={courseDraft.accessTier}
                  onChange={(e) => setCourseDraft({ ...courseDraft, accessTier: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                >
                  <option value="free">Free Community Course ($0)</option>
                  <option value="pro">Pro Subscription Required ($49/mo)</option>
                  <option value="enterprise">Enterprise Teams Only</option>
                </select>
              </div>

              {/* Target Audience */}
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Target Audience / Who is this for?</label>
                <input
                  type="text"
                  value={courseDraft.targetAudience}
                  onChange={(e) => setCourseDraft({ ...courseDraft, targetAudience: e.target.value })}
                  placeholder="e.g. Junior backend engineers moving to distributed architectures"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                />
              </div>

              {/* Skills Tags */}
              <div className="space-y-1">
                <label className="font-bold text-[var(--foreground)]">Skills Acquired (comma separated)</label>
                <input
                  type="text"
                  value={courseDraft.skills}
                  onChange={(e) => setCourseDraft({ ...courseDraft, skills: e.target.value })}
                  placeholder="Go, gRPC, Protobuf, Kafka, Docker, Microservices"
                  className="w-full p-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs"
                />
              </div>
            </div>
          </div>

          {/* SECTION 2: CURRICULUM HIERARCHY & DYNAMIC CONTENT BLOCKS */}
          <div className="p-5 md:p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border)] space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-[var(--border)]">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-[var(--accent)]">
                  2. Curriculum Hierarchy & Modular Block Assembly
                </h3>
                <p className="text-xs text-[var(--muted)] mt-0.5">
                  Organize units into modules and topics. Each topic can freely mix text, flowcharts, code, videos, and quizzes.
                </p>
              </div>

              <button
                type="button"
                onClick={handleAddModule}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-[var(--accent)] text-white hover:opacity-90 transition-all flex items-center gap-1.5 self-start sm:self-auto shadow-xs"
              >
                <span>+</span> Add New Module
              </button>
            </div>

            {/* Module & Topic Selectors (Full Width, non-cramped) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)]">
              <div className="space-y-1 min-w-0">
                <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider block">
                  Active Module ({courseDraft.modules.length})
                </label>
                <select
                  value={activeModule?.id || ""}
                  onChange={(e) => {
                    const mod = courseDraft.modules.find((m) => m.id === e.target.value);
                    setActiveModuleId(e.target.value);
                    if (mod && mod.lessons.length > 0) {
                      setActiveLessonId(mod.lessons[0].id);
                    }
                  }}
                  className="w-full p-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] font-bold text-[var(--foreground)]"
                >
                  {courseDraft.modules.map((m, idx) => (
                    <option key={m.id} value={m.id}>
                      Module {idx + 1}: {m.title}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1 min-w-0">
                <div className="flex items-center justify-between">
                  <label className="text-[11px] font-bold text-[var(--muted)] uppercase tracking-wider">
                    Active Topic / Lesson ({activeModule?.lessons.length || 0})
                  </label>
                  {activeModule && (
                    <button
                      type="button"
                      onClick={() => handleAddLesson(activeModule.id)}
                      className="text-[11px] text-[var(--accent)] font-bold hover:underline"
                    >
                      + Add Topic
                    </button>
                  )}
                </div>
                <select
                  value={activeLesson?.id || ""}
                  onChange={(e) => setActiveLessonId(e.target.value)}
                  className="w-full p-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] font-bold text-[var(--foreground)]"
                >
                  {activeModule?.lessons.map((les, idx) => (
                    <option key={les.id} value={les.id}>
                      {idx + 1}. {les.title} ({les.blocks.length} blocks)
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Active Topic Config Header */}
            {activeLesson && (
              <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2 space-y-1 min-w-0">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Topic Title
                    </label>
                    <input
                      type="text"
                      value={activeLesson.title}
                      onChange={(e) => {
                        const val = e.target.value;
                        setCourseDraft({
                          ...courseDraft,
                          modules: courseDraft.modules.map((m) =>
                            m.id !== activeModule?.id
                              ? m
                              : {
                                  ...m,
                                  lessons: m.lessons.map((l) =>
                                    l.id !== activeLesson.id ? l : { ...l, title: val }
                                  ),
                                }
                          ),
                        });
                      }}
                      className="w-full p-2.5 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] font-bold text-[var(--foreground)]"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[var(--muted)]">
                      Duration &amp; Access
                    </label>
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        value={activeLesson.duration}
                        onChange={(e) => {
                          const val = e.target.value;
                          setCourseDraft({
                            ...courseDraft,
                            modules: courseDraft.modules.map((m) =>
                              m.id !== activeModule?.id
                                ? m
                                : {
                                    ...m,
                                    lessons: m.lessons.map((l) =>
                                      l.id !== activeLesson.id ? l : { ...l, duration: val }
                                    ),
                                  }
                            ),
                          });
                        }}
                        className="w-full p-2 text-xs rounded-xl bg-[var(--surface)] border border-[var(--border)] text-center font-bold"
                      />
                      <label className="flex items-center gap-1 text-[11px] font-semibold cursor-pointer shrink-0">
                        <input
                          type="checkbox"
                          checked={activeLesson.freePreview ?? true}
                          onChange={(e) => {
                            const checked = e.target.checked;
                            setCourseDraft({
                              ...courseDraft,
                              modules: courseDraft.modules.map((m) =>
                                m.id !== activeModule?.id
                                ? m
                                : {
                                    ...m,
                                    lessons: m.lessons.map((l) =>
                                      l.id !== activeLesson.id ? l : { ...l, freePreview: checked }
                                    ),
                                  }
                              ),
                            });
                          }}
                          className="rounded text-[var(--accent)]"
                        />
                        <span>Free Preview</span>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Block Adder Toolbar */}
            <div className="space-y-2">
              <div className="text-[11px] font-bold uppercase tracking-wider text-[var(--muted)]">
                Insert Content Block into Active Topic:
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5 text-xs">
                {[
                  { type: "rich_text" as ContentBlockType, icon: "📄", label: "Text / Article" },
                  { type: "diagram" as ContentBlockType, icon: "📊", label: "Flowchart / SVG" },
                  { type: "code" as ContentBlockType, icon: "💻", label: "Code Snippet" },
                  { type: "video" as ContentBlockType, icon: "🎥", label: "Video Lecture" },
                  { type: "image" as ContentBlockType, icon: "🖼️", label: "Inline Image" },
                  { type: "callout" as ContentBlockType, icon: "💡", label: "Callout / Tip" },
                  { type: "quiz" as ContentBlockType, icon: "❓", label: "Quiz Question" },
                  { type: "checklist" as ContentBlockType, icon: "📋", label: "Action Checklist" },
                  { type: "resources" as ContentBlockType, icon: "📦", label: "File Downloads" },
                ].map((btn) => (
                  <button
                    key={btn.type}
                    type="button"
                    onClick={() => handleAddBlock(btn.type)}
                    className="p-3 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-[var(--accent)] hover:bg-[var(--surface)] text-[var(--foreground)] font-semibold transition-all flex items-center gap-2 group text-left shadow-2xs"
                  >
                    <span className="text-base group-hover:scale-115 transition-transform">{btn.icon}</span>
                    <span className="truncate">{btn.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Block Sequence List */}
            <div className="space-y-4 pt-2">
              <div className="flex items-center justify-between text-xs text-[var(--muted)] font-semibold border-b border-[var(--border)] pb-2">
                <span>Assembled Content Blocks ({activeLesson?.blocks.length || 0})</span>
                <span>Drag or move up/down to arrange the student reading flow</span>
              </div>

              {activeLesson?.blocks.length === 0 ? (
                <div className="p-10 text-center rounded-2xl border-2 border-dashed border-[var(--border)] text-[var(--muted)] text-xs">
                  This topic is completely blank. Click any block above to insert text, diagrams, code, or quizzes.
                </div>
              ) : (
                activeLesson?.blocks.map((block, index) => (
                  <div
                    key={block.id}
                    className="p-4 md:p-5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] space-y-3 shadow-xs group"
                  >
                    {/* Header with Title and Reorder Controls */}
                    <div className="flex items-center justify-between pb-2 border-b border-[var(--border-soft)] text-xs">
                      <div className="flex items-center gap-2.5 min-w-0">
                        <span className="w-5 h-5 rounded-md bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center font-mono text-[10px] text-[var(--muted)] shrink-0">
                          {index + 1}
                        </span>
                        <span className="font-bold text-[var(--foreground)] capitalize flex items-center gap-1.5 truncate">
                          {block.type === "video" && "🎥 Video Lecture Walkthrough"}
                          {block.type === "rich_text" && "📄 Rich Text / Article"}
                          {block.type === "image" && "🖼️ Inline Image & Caption"}
                          {block.type === "diagram" && "📊 Architecture Diagram & Flowchart"}
                          {block.type === "code" && "💻 Interactive Code Snippet"}
                          {block.type === "callout" && "💡 Callout Highlight"}
                          {block.type === "quiz" && "❓ Checkpoint Knowledge Check"}
                          {block.type === "checklist" && "📋 Action Checklist"}
                          {block.type === "resources" && "📦 Downloadable Files"}
                        </span>
                      </div>

                      <div className="flex items-center gap-1 shrink-0">
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(block.id, "up")}
                          disabled={index === 0}
                          className="p-1 rounded text-xs text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                          title="Move Up"
                        >
                          ▲
                        </button>
                        <button
                          type="button"
                          onClick={() => handleMoveBlock(block.id, "down")}
                          disabled={index === activeLesson.blocks.length - 1}
                          className="p-1 rounded text-xs text-[var(--muted)] hover:text-[var(--foreground)] disabled:opacity-30"
                          title="Move Down"
                        >
                          ▼
                        </button>
                        <button
                          type="button"
                          onClick={() => handleDeleteBlock(block.id)}
                          className="p-1 rounded text-xs text-rose-500 hover:text-rose-700"
                          title="Delete Block"
                        >
                          ✕
                        </button>
                      </div>
                    </div>

                    {/* Block-specific Editors */}
                    {/* 1. Video Block */}
                    {block.type === "video" && (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                          <div className="sm:col-span-2 space-y-1">
                            <label className="block text-[11px] font-semibold text-[var(--muted)]">
                              Video Embed URL (YouTube, Vimeo, MP4 stream)
                            </label>
                            <input
                              type="text"
                              value={block.videoUrl || ""}
                              onChange={(e) => handleUpdateBlock(block.id, { videoUrl: e.target.value })}
                              placeholder="https://www.youtube-nocookie.com/embed/..."
                              className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-mono text-xs"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-[var(--muted)]">
                              Duration
                            </label>
                            <input
                              type="text"
                              value={block.videoDuration || ""}
                              onChange={(e) => handleUpdateBlock(block.id, { videoDuration: e.target.value })}
                              placeholder="e.g. 15:30"
                              className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 2. Rich Text Block */}
                    {block.type === "rich_text" && (
                      <div className="space-y-2 text-xs">
                        <label className="block text-[11px] font-semibold text-[var(--muted)]">
                          Article Content & Explanations (Supports Markdown paragraphs & bullet lists)
                        </label>
                        <textarea
                          value={block.content || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { content: e.target.value })}
                          rows={4}
                          placeholder="Type comprehensive explanations, theoretical principles, step-by-step algorithms..."
                          className="w-full p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs text-[var(--foreground)] focus:outline-none focus:border-[var(--accent)] resize-y leading-relaxed font-sans"
                        />
                      </div>
                    )}

                    {/* 3. Inline Image Block */}
                    {block.type === "image" && (
                      <div className="space-y-3 text-xs">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-[var(--muted)]">Image URL</label>
                            <input
                              type="text"
                              value={block.imageUrl || ""}
                              onChange={(e) => handleUpdateBlock(block.id, { imageUrl: e.target.value })}
                              placeholder="https://images.unsplash.com/..."
                              className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
                            />
                          </div>
                          <div className="space-y-1">
                            <label className="block text-[11px] font-semibold text-[var(--muted)]">Caption / Alt Text</label>
                            <input
                              type="text"
                              value={block.imageCaption || ""}
                              onChange={(e) => handleUpdateBlock(block.id, { imageCaption: e.target.value })}
                              placeholder="Figure 1.1: Architecture diagram"
                              className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)]"
                            />
                          </div>
                        </div>
                      </div>
                    )}

                    {/* 4. Diagram Block */}
                    {block.type === "diagram" && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <label className="text-[11px] font-semibold text-[var(--muted)]">
                            Flowchart Connections ([Node A] -&gt; [Node B])
                          </label>
                          <div className="flex items-center gap-2">
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateBlock(block.id, {
                                  diagramCode:
                                    "[Client] -> [API Gateway]\n[API Gateway] -> [Microservices]\n[Microservices] -> [Database]",
                                })
                              }
                              className="text-[10px] text-cyan-500 font-bold hover:underline"
                            >
                              Preset 1
                            </button>
                            <span>•</span>
                            <button
                              type="button"
                              onClick={() =>
                                handleUpdateBlock(block.id, {
                                  diagramCode:
                                    "[Stream Input] -> [Kafka Topic]\n[Kafka Topic] -> [Worker Workers]\n[Worker Workers] -> [Analytics Sink]",
                                })
                              }
                              className="text-[10px] text-cyan-500 font-bold hover:underline"
                            >
                              Preset 2
                            </button>
                          </div>
                        </div>

                        <textarea
                          value={block.diagramCode || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { diagramCode: e.target.value })}
                          rows={3}
                          placeholder="[Node A] -> [Node B]&#10;[Node B] -> [Node C]"
                          className="w-full p-3 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-mono text-xs text-cyan-600 dark:text-cyan-400 focus:outline-none focus:border-[var(--accent)]"
                        />

                        {/* Live SVG Visual Preview in editor */}
                        <div>{renderFlowchartVisual(block.diagramCode)}</div>
                      </div>
                    )}

                    {/* 5. Code Block */}
                    {block.type === "code" && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="text-[11px] font-semibold text-[var(--muted)]">Language:</span>
                            <select
                              value={block.codeLanguage || "typescript"}
                              onChange={(e) => handleUpdateBlock(block.id, { codeLanguage: e.target.value })}
                              className="p-1 rounded bg-[var(--surface)] border border-[var(--border)] text-xs font-mono font-bold"
                            >
                              <option value="typescript">TypeScript</option>
                              <option value="python">Python</option>
                              <option value="go">Go</option>
                              <option value="rust">Rust</option>
                              <option value="cpp">C++</option>
                              <option value="sql">SQL</option>
                              <option value="bash">Bash</option>
                            </select>
                          </div>
                        </div>

                        <textarea
                          value={block.codeSnippet || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { codeSnippet: e.target.value })}
                          rows={4}
                          placeholder="// Write sample starter code here..."
                          className="w-full p-3 rounded-xl bg-slate-950 text-emerald-400 border border-slate-800 font-mono text-xs focus:outline-none focus:border-[var(--accent)]"
                        />
                      </div>
                    )}

                    {/* 6. Callout Block */}
                    {block.type === "callout" && (
                      <div className="space-y-3 text-xs">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-[11px] font-semibold text-[var(--muted)]">Tone:</span>
                          {(["tip", "warning", "info", "success", "protip"] as const).map((tone) => (
                            <button
                              key={tone}
                              type="button"
                              onClick={() => handleUpdateBlock(block.id, { calloutTone: tone })}
                              className={`px-2.5 py-1 rounded-lg text-xs capitalize font-bold border transition-all ${
                                block.calloutTone === tone
                                  ? "bg-[var(--accent)] text-white border-transparent"
                                  : "bg-[var(--surface)] text-[var(--muted)] border-[var(--border)]"
                              }`}
                            >
                              {tone}
                            </button>
                          ))}
                        </div>
                        <input
                          type="text"
                          value={block.calloutMessage || ""}
                          onChange={(e) => handleUpdateBlock(block.id, { calloutMessage: e.target.value })}
                          placeholder="Highlight critical takeaway or gotcha..."
                          className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] text-xs"
                        />
                      </div>
                    )}

                    {/* 7. Quiz Block */}
                    {block.type === "quiz" && (
                      <div className="space-y-3 text-xs">
                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-[var(--muted)]">Question</label>
                          <input
                            type="text"
                            value={block.quizQuestion || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { quizQuestion: e.target.value })}
                            placeholder="e.g. Which layer manages TCP connection pooling?"
                            className="w-full p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border)] font-bold text-xs"
                          />
                        </div>

                        <div className="space-y-1.5">
                          <label className="block text-[11px] font-semibold text-[var(--muted)]">
                            Choices (Select correct answer radio)
                          </label>
                          {(block.quizOptions || ["", "", "", ""]).map((opt, optIdx) => (
                            <div key={optIdx} className="flex items-center gap-2">
                              <input
                                type="radio"
                                name={`qz-ans-${block.id}`}
                                checked={(block.quizCorrectIndex ?? 0) === optIdx}
                                onChange={() => handleUpdateBlock(block.id, { quizCorrectIndex: optIdx })}
                                className="w-4 h-4 text-[var(--accent)] cursor-pointer"
                              />
                              <input
                                type="text"
                                value={opt}
                                onChange={(e) => {
                                  const copy = [...(block.quizOptions || ["", "", "", ""])];
                                  copy[optIdx] = e.target.value;
                                  handleUpdateBlock(block.id, { quizOptions: copy });
                                }}
                                placeholder={`Option ${optIdx + 1}`}
                                className="flex-1 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs"
                              />
                            </div>
                          ))}
                        </div>

                        <div className="space-y-1">
                          <label className="block text-[11px] font-semibold text-[var(--muted)]">
                            Explanation for Students
                          </label>
                          <input
                            type="text"
                            value={block.quizExplanation || ""}
                            onChange={(e) => handleUpdateBlock(block.id, { quizExplanation: e.target.value })}
                            placeholder="Why this answer is correct..."
                            className="w-full p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs"
                          />
                        </div>
                      </div>
                    )}

                    {/* 8. Checklist Block */}
                    {block.type === "checklist" && (
                      <div className="space-y-2 text-xs">
                        <label className="block text-[11px] font-semibold text-[var(--muted)]">Action Checklist Items</label>
                        <div className="space-y-2">
                          {(block.checklistItems || []).map((item, cIdx) => (
                            <div key={item.id} className="flex items-center gap-2">
                              <input
                                type="text"
                                value={item.text}
                                onChange={(e) => {
                                  const copy = [...(block.checklistItems || [])];
                                  copy[cIdx] = { ...copy[cIdx], text: e.target.value };
                                  handleUpdateBlock(block.id, { checklistItems: copy });
                                }}
                                className="flex-1 p-2 rounded-lg bg-[var(--surface)] border border-[var(--border)] text-xs"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  const copy = (block.checklistItems || []).filter((_, idx) => idx !== cIdx);
                                  handleUpdateBlock(block.id, { checklistItems: copy });
                                }}
                                className="text-xs text-rose-500 hover:text-rose-700 px-1"
                              >
                                ✕
                              </button>
                            </div>
                          ))}
                          <button
                            type="button"
                            onClick={() => {
                              const copy = [
                                ...(block.checklistItems || []),
                                { id: `chk-${Date.now()}`, text: "New action item...", done: false },
                              ];
                              handleUpdateBlock(block.id, { checklistItems: copy });
                            }}
                            className="text-[11px] text-[var(--accent)] font-bold hover:underline"
                          >
                            + Add Item
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. LIVE STUDENT CLASSROOM PREVIEW VIEW */}
      {/* ===================================================================== */}
      {activeView === "preview" && (
        <div className="space-y-4 animate-in fade-in">
          {/* Preview Viewport Toolbar */}
          <div className="flex items-center justify-between p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-[var(--foreground)]">Live Student Classroom Preview</span>
            </div>

            <div className="flex items-center gap-3">
              <div className="flex rounded-xl bg-[var(--surface-soft)] p-0.5 border border-[var(--border)] text-xs">
                <button
                  onClick={() => setPreviewViewport("desktop")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    previewViewport === "desktop" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--muted)]"
                  }`}
                >
                  🖥️ Desktop (Full)
                </button>
                <button
                  onClick={() => setPreviewViewport("tablet")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    previewViewport === "tablet" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--muted)]"
                  }`}
                >
                  📱 Tablet (768px)
                </button>
                <button
                  onClick={() => setPreviewViewport("mobile")}
                  className={`px-3 py-1 rounded-lg text-xs font-semibold ${
                    previewViewport === "mobile" ? "bg-[var(--accent)] text-white shadow-xs" : "text-[var(--muted)]"
                  }`}
                >
                  📲 Mobile (375px)
                </button>
              </div>

              <button
                onClick={() => setPreviewDarkTheme(!previewDarkTheme)}
                className="px-3 py-1.5 text-xs rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] font-semibold text-[var(--foreground)]"
              >
                {previewDarkTheme ? "🌙 Dark" : "☀️ Light"}
              </button>
            </div>
          </div>

          {/* Student Viewport Simulator */}
          <div className="flex justify-center bg-slate-900/10 dark:bg-black/30 p-6 rounded-3xl border border-[var(--border)] overflow-x-auto min-h-[640px]">
            <div
              className={`transition-all duration-300 rounded-2xl border shadow-2xl overflow-hidden flex flex-col ${
                previewDarkTheme ? "bg-slate-950 text-slate-100 border-slate-800" : "bg-white text-slate-900 border-slate-200"
              }`}
              style={{
                width:
                  previewViewport === "desktop"
                    ? "100%"
                    : previewViewport === "tablet"
                    ? "768px"
                    : "375px",
              }}
            >
              {/* Classroom Simulated Header */}
              <div className="px-5 py-3 border-b border-inherit flex items-center justify-between text-xs bg-inherit">
                <div className="flex items-center gap-2 truncate">
                  <span className="font-bold text-[var(--accent)]">Astra Classroom</span>
                  <span className="text-slate-400">/</span>
                  <span className="truncate max-w-[200px] text-slate-400">{courseDraft.title}</span>
                </div>
                <span className="text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                  0% Completed
                </span>
              </div>

              {/* Topic Header */}
              <div className="p-5 border-b border-inherit bg-slate-500/5 space-y-1.5">
                <div className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  {activeModule?.title}
                </div>
                <h1 className="text-lg md:text-xl font-black">{activeLesson?.title}</h1>
                <div className="flex items-center gap-3 text-xs text-slate-400">
                  <span>⏱️ {activeLesson?.duration}</span>
                  <span>•</span>
                  <span>📚 {activeLesson?.blocks.length} Content Blocks</span>
                  <span>•</span>
                  <span className="text-emerald-500 font-bold">Full Access</span>
                </div>
              </div>

              {/* Stream of Blocks */}
              <div className="p-6 space-y-6 flex-1 overflow-y-auto">
                {activeLesson?.blocks.length === 0 ? (
                  <div className="py-12 text-center text-slate-400 text-xs">
                    No content blocks in this topic. Switch back to Studio Editor to add blocks.
                  </div>
                ) : (
                  activeLesson?.blocks.map((block) => (
                    <div key={block.id} className="space-y-3">
                      {/* Video */}
                      {block.type === "video" && block.videoUrl && (
                        <div className="rounded-2xl overflow-hidden shadow-lg border border-inherit aspect-video bg-black">
                          <iframe
                            src={block.videoUrl}
                            title="Video Lecture"
                            className="w-full h-full border-0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                            allowFullScreen
                          />
                        </div>
                      )}

                      {/* Callout */}
                      {block.type === "callout" && (
                        <div
                          className={`p-4 rounded-xl border flex items-start gap-3 ${
                            block.calloutTone === "warning"
                              ? "bg-amber-500/10 border-amber-500/30 text-amber-600 dark:text-amber-400"
                              : block.calloutTone === "success"
                              ? "bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400"
                              : "bg-blue-500/10 border-blue-500/30 text-blue-600 dark:text-blue-400"
                          }`}
                        >
                          <span className="text-base shrink-0">
                            {block.calloutTone === "warning" ? "⚠️" : block.calloutTone === "success" ? "✅" : "💡"}
                          </span>
                          <div>
                            {block.title && <div className="font-bold text-xs mb-0.5">{block.title}</div>}
                            <p className="text-xs leading-relaxed">{block.calloutMessage}</p>
                          </div>
                        </div>
                      )}

                      {/* Rich Text */}
                      {block.type === "rich_text" && (
                        <div className="prose dark:prose-invert max-w-none text-xs md:text-sm leading-relaxed space-y-2">
                          {block.content?.split("\n").map((para, pIdx) => (
                            <p key={pIdx} className="text-slate-700 dark:text-slate-300">
                              {para}
                            </p>
                          ))}
                        </div>
                      )}

                      {/* Diagram Flowchart */}
                      {block.type === "diagram" && (
                        <div className="space-y-2">
                          {block.title && (
                            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
                              {block.title}
                            </h4>
                          )}
                          {renderFlowchartVisual(block.diagramCode)}
                        </div>
                      )}

                      {/* Code Block */}
                      {block.type === "code" && (
                        <div className="rounded-xl overflow-hidden border border-slate-800 bg-slate-950 font-mono text-xs">
                          <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-slate-400 text-[11px]">
                            <span>Language: {block.codeLanguage?.toUpperCase()}</span>
                            <span className="text-emerald-400 font-bold">● Code Snippet</span>
                          </div>
                          <pre className="p-4 text-emerald-400 overflow-x-auto leading-relaxed">
                            {block.codeSnippet}
                          </pre>
                          {block.codeOutput && (
                            <div className="p-3 bg-slate-900/80 border-t border-slate-800 text-[11px] text-slate-300">
                              <span className="text-slate-500 block mb-0.5">Terminal Output:</span>
                              <code>{block.codeOutput}</code>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Inline Image */}
                      {block.type === "image" && block.imageUrl && (
                        <div className="space-y-1.5">
                          <div className="rounded-2xl overflow-hidden border border-inherit">
                            <img
                              src={block.imageUrl}
                              alt={block.imageCaption || "Illustration"}
                              className="w-full object-cover max-h-[380px]"
                            />
                          </div>
                          {block.imageCaption && (
                            <p className="text-[11px] text-center text-slate-400 italic">
                              {block.imageCaption}
                            </p>
                          )}
                        </div>
                      )}

                      {/* Quiz */}
                      {block.type === "quiz" && block.quizQuestion && (
                        <div className="p-5 rounded-2xl border border-inherit bg-slate-500/5 space-y-3">
                          <div className="flex items-center justify-between text-xs font-bold text-indigo-500">
                            <span>❓ Checkpoint Knowledge Check</span>
                            <span className="text-[10px] text-slate-400">Instant Verification</span>
                          </div>
                          <p className="font-bold text-xs md:text-sm">{block.quizQuestion}</p>

                          <div className="space-y-2 pt-1">
                            {block.quizOptions?.map((opt, optIdx) => {
                              const isSelected = selectedQuizAnswers[block.id] === optIdx;
                              const isCorrect = block.quizCorrectIndex === optIdx;
                              const revealed = showQuizFeedback[block.id];

                              return (
                                <button
                                  key={optIdx}
                                  type="button"
                                  onClick={() => {
                                    setSelectedQuizAnswers((prev) => ({ ...prev, [block.id]: optIdx }));
                                    setShowQuizFeedback((prev) => ({ ...prev, [block.id]: true }));
                                  }}
                                  className={`w-full p-3 rounded-xl border text-xs text-left font-medium transition-all flex items-center justify-between ${
                                    revealed && isCorrect
                                      ? "bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold"
                                      : revealed && isSelected && !isCorrect
                                      ? "bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400"
                                      : isSelected
                                      ? "bg-[var(--accent)] text-white border-transparent"
                                      : "bg-inherit border-inherit hover:border-[var(--accent)]"
                                  }`}
                                >
                                  <span>{opt}</span>
                                  {revealed && isCorrect && <span>✓ Correct</span>}
                                  {revealed && isSelected && !isCorrect && <span>✕ Incorrect</span>}
                                </button>
                              );
                            })}
                          </div>

                          {showQuizFeedback[block.id] && block.quizExplanation && (
                            <div className="p-3 rounded-xl bg-slate-500/10 text-xs text-slate-400 italic mt-2">
                              <strong>Explanation:</strong> {block.quizExplanation}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>

              {/* Classroom Bottom Buttons */}
              <div className="p-4 border-t border-inherit flex items-center justify-between text-xs bg-inherit">
                <button className="px-3 py-1.5 rounded-xl border border-inherit text-slate-400 hover:text-inherit">
                  ← Previous Topic
                </button>
                <button className="px-4 py-1.5 rounded-xl bg-[var(--accent)] text-white font-bold hover:opacity-90">
                  Mark Complete & Next →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
