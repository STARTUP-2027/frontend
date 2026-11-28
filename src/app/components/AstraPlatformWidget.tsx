"use client";

import { useState, useEffect, useRef, type FormEvent } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";

// ================= TYPES & CONSTANTS =================
export interface ChatLinkItem {
  title: string;
  path: string;
  icon: string;
  badge?: string;
  description: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "bot";
  text: string;
  timestamp: string;
  links?: ChatLinkItem[];
}

export interface GuestInfo {
  name: string;
  email: string;
}

// Exactly 5 Quick Options matching the user's reference screenshot
const QUICK_OPTIONS_ROW_1 = [
  { id: "courses", label: "Explore Courses", icon: "🎓", prompt: "Explore all masterclasses and technical tracks" },
  { id: "dsa", label: "DSA Sheet", icon: "📄", prompt: "Tell me about the 620+ pattern DSA sheets" },
  { id: "arena", label: "Join Arena", icon: "⚡", prompt: "How do I participate in the Code Arena and quizzes?" },
];

const QUICK_OPTIONS_ROW_2 = [
  { id: "plans", label: "Ask About Plans", icon: "❓", prompt: "What are the membership plans, pricing and free trial?" },
  { id: "support", label: "Contact Support", icon: "🎧", prompt: "How can I contact technical support or learning advisors?" },
];

// Play pleasant synthesizer chime via Web Audio API
function playChime(type: "send" | "receive") {
  try {
    const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;
    const ctx = new AudioContextClass();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = "sine";
    const now = ctx.currentTime;

    if (type === "send") {
      osc.frequency.setValueAtTime(440, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.1);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.1);
    } else {
      osc.frequency.setValueAtTime(587.33, now);
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.12);
      gain.gain.setValueAtTime(0.06, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.14);
    }
  } catch {
    // safe fail if audio context is blocked
  }
}

// 3D Friendly Robot Mascot SVG Avatar matching the reference screenshot
function RobotAvatar({ size = "md" }: { size?: "sm" | "md" | "lg" }) {
  const dim = size === "sm" ? "w-6 h-6" : size === "lg" ? "w-12 h-12" : "w-10 h-10";
  return (
    <div className={`${dim} rounded-full bg-white shadow-sm flex items-center justify-center shrink-0 border border-blue-200/80 overflow-hidden`}>
      <svg viewBox="0 0 64 64" className="w-full h-full" fill="none">
        {/* Background Soft Glow */}
        <circle cx="32" cy="32" r="30" fill="#eff6ff" />
        {/* Antenna */}
        <line x1="32" y1="11" x2="32" y2="17" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
        <circle cx="32" cy="9.5" r="3" fill="#60a5fa" />
        {/* Head Shell */}
        <rect x="16" y="17" width="32" height="26" rx="9" fill="#ffffff" stroke="#2563eb" strokeWidth="2.5" />
        {/* Dark Visor Screen */}
        <rect x="20" y="22" width="24" height="13" rx="5" fill="#0f172a" />
        {/* Cyan Glowing Eyes */}
        <circle cx="26" cy="28.5" r="2.5" fill="#38bdf8" />
        <circle cx="38" cy="28.5" r="2.5" fill="#38bdf8" />
        <circle cx="27" cy="27.5" r="0.8" fill="#ffffff" />
        <circle cx="39" cy="27.5" r="0.8" fill="#ffffff" />
        {/* Smile */}
        <path d="M28 38.5 Q32 41.5 36 38.5" stroke="#94a3b8" strokeWidth="1.8" strokeLinecap="round" fill="none" />
        {/* Blue Headphone Earcups */}
        <rect x="12" y="23" width="4.5" height="13" rx="2" fill="#2563eb" />
        <rect x="47.5" y="23" width="4.5" height="13" rx="2" fill="#2563eb" />
        {/* Body Neck Base */}
        <path d="M25 44 L39 44 L43 55 L21 55 Z" fill="#cbd5e1" />
      </svg>
    </div>
  );
}

// Smart Intent & Route Matching Engine
function generateBotResponse(prompt: string, userName: string): { text: string; links: ChatLinkItem[] } {
  const query = prompt.toLowerCase();

  // 1. DSA Sheet & Coding Practice
  if (
    query.includes("dsa") ||
    query.includes("sheet") ||
    query.includes("algorithm") ||
    query.includes("leetcode") ||
    query.includes("two sum") ||
    query.includes("binary search") ||
    query.includes("graph") ||
    query.includes("tree") ||
    query.includes("dynamic programming") ||
    query.includes("problem")
  ) {
    return {
      text: `Hey ${userName}! We have an industry-leading **620+ Pattern-Wise DSA Sheet** designed by senior Google & Meta engineers. It breaks problems into structural patterns (Two Pointers, Sliding Window, Trees, Graphs, DP) with time complexity tips and direct code practice.`,
      links: [
        {
          title: "Explore DSA Pattern Sheets",
          path: "/dsa-sheet",
          icon: "🧠",
          badge: "620+ Problems",
          description: "Topic-wise problem matrix with pattern hints and solution tabs",
        },
        {
          title: "Speed Challenge Arena",
          path: "/contests",
          icon: "⚡",
          badge: "Live XP",
          description: "Test algorithmic problem solving against other engineers in real-time",
        },
      ],
    };
  }

  // 2. Contest, Quizzes, Arena, Hackathon
  if (
    query.includes("contest") ||
    query.includes("arena") ||
    query.includes("quiz") ||
    query.includes("hackathon") ||
    query.includes("duel") ||
    query.includes("benchmark") ||
    query.includes("compete") ||
    query.includes("leaderboard") ||
    query.includes("scoreboard")
  ) {
    return {
      text: `Ready to test your architectural and algorithmic skills, ${userName}? Our **Code Arena & Contest Playground** hosts daily system benchmarks, timed code challenges, 1v1 AI code duels, and seasonal hackathons with real-time XP syncing!`,
      links: [
        {
          title: "Code Arena & Benchmark Quizzes",
          path: "/contests",
          icon: "🏆",
          badge: "Season 4 Active",
          description: "Take daily architectural benchmark quizzes and compete on global leaderboards",
        },
        {
          title: "Speed Hackathons & Rubric",
          path: "/admin?tab=hackathons",
          icon: "⚔️",
          badge: "Global Events",
          description: "Review current prize pools, timelines, and autonomous AI hackathons",
        },
      ],
    };
  }

  // 3. AI, Machine Learning, LangGraph, Python
  if (
    query.includes("ai") ||
    query.includes("machine learning") ||
    query.includes("ml") ||
    query.includes("langgraph") ||
    query.includes("agent") ||
    query.includes("python") ||
    query.includes("deep learning") ||
    query.includes("neural") ||
    query.includes("rag") ||
    query.includes("vector")
  ) {
    return {
      text: `Looking to level up in frontier AI? Our **Python 3.12 Core & Multi-Agent Architecture Masterclass** covers LangGraph cyclic state checkpoints, self-healing microservice agents, and hybrid dense/sparse vector search with Qdrant.`,
      links: [
        {
          title: "AI & Multi-Agent Masterclasses",
          path: "/courses?category=ai",
          icon: "🤖",
          badge: "Trending",
          description: "Master modern Python 3.12, LangGraph agents, and production LLM orchestration",
        },
        {
          title: "Solve LangGraph Cyclic Quiz",
          path: "/contests",
          icon: "🧠",
          badge: "+250 XP",
          description: "Test your understanding of state snapshot checkpoints in MemorySaver threads",
        },
      ],
    };
  }

  // 4. Full-Stack, React 19, Web Architecture, Next.js
  if (
    query.includes("full-stack") ||
    query.includes("fullstack") ||
    query.includes("react") ||
    query.includes("next") ||
    query.includes("web") ||
    query.includes("frontend") ||
    query.includes("backend") ||
    query.includes("server actions") ||
    query.includes("css") ||
    query.includes("tailwind")
  ) {
    return {
      text: `Building modern web platforms? Our **Full-Stack Web Architecture Track** covers React 19 Server Components, Server Actions, optimistic state mutations, Next.js App Router, and resilient microservices.`,
      links: [
        {
          title: "Full-Stack Web Architecture Track",
          path: "/courses?category=fullstack",
          icon: "⚛️",
          badge: "Featured",
          description: "Deep dive into distributed web apps, React 19, and cloud-native systems",
        },
        {
          title: "React 19 Server Action Benchmark",
          path: "/contests",
          icon: "💻",
          badge: "+180 XP",
          description: "Practice optimistic state mutation updaters with real live assertions",
        },
      ],
    };
  }

  // 5. Cloud, DevOps, Kubernetes, Rust, Cybersecurity
  if (
    query.includes("cloud") ||
    query.includes("devops") ||
    query.includes("docker") ||
    query.includes("kubernetes") ||
    query.includes("k8s") ||
    query.includes("rust") ||
    query.includes("security") ||
    query.includes("cyber") ||
    query.includes("linux")
  ) {
    return {
      text: `Explore low-level systems and high-scale cloud infrastructure! We offer deep-dive masterclasses in **Rust Systems Programming**, GitOps with ArgoCD, and Zero-Trust Kernel Cybersecurity.`,
      links: [
        {
          title: "Cloud & DevOps Masterclasses",
          path: "/courses?category=devops",
          icon: "☁️",
          badge: "High Scale",
          description: "Learn self-healing GitOps, Kubernetes operators, and distributed caches",
        },
        {
          title: "Cybersecurity & Systems Tracks",
          path: "/courses?category=security",
          icon: "🛡️",
          badge: "Zero-Trust",
          description: "Kernel memory safety, microservice telemetry, and vulnerability auditing",
        },
      ],
    };
  }

  // 6. Course Creation & Creator Studio
  if (
    query.includes("create") ||
    query.includes("admin") ||
    query.includes("studio") ||
    query.includes("author") ||
    query.includes("creator") ||
    query.includes("teach") ||
    query.includes("publish") ||
    query.includes("template")
  ) {
    return {
      text: `Want to create or publish a course? The **Astra Dynamic Course Studio** allows instructors and admins to create dynamic courses: pure video, pure text with interactive diagrams, flowcharts, or live coding playgrounds—all with 1-click duplicate templates!`,
      links: [
        {
          title: "Dynamic Course Creation Studio",
          path: "/admin",
          icon: "✏️",
          badge: "Universal V2",
          description: "Pick from pre-built blueprints or build a custom course from scratch with live student preview",
        },
        {
          title: "Admin Analytics & Students",
          path: "/admin?tab=students",
          icon: "📊",
          badge: "Instructor Console",
          description: "Manage students, analyze completion metrics, and review revenue graphs",
        },
      ],
    };
  }

  // 7. Pricing, Plans, Subscription, Free Trial
  if (
    query.includes("price") ||
    query.includes("pricing") ||
    query.includes("cost") ||
    query.includes("free") ||
    query.includes("trial") ||
    query.includes("subscription") ||
    query.includes("pro") ||
    query.includes("buy") ||
    query.includes("plan")
  ) {
    return {
      text: `Astra Academy offers transparent pricing with a **7-Day Free Trial** on all pro plans. You get unlimited access to 50+ masterclasses, the 620+ DSA Sheet, Contest Arena, and industry-recognized verification certificates!`,
      links: [
        {
          title: "Membership & Pricing Plans",
          path: "/pricing",
          icon: "💎",
          badge: "7-Day Free Trial",
          description: "Compare Starter, Pro, and Enterprise lifetime membership benefits",
        },
        {
          title: "Start Free Student Account",
          path: "/auth/signup",
          icon: "🚀",
          badge: "Zero Card Needed",
          description: "Instant access to all beginner and preview modules with free sign up",
        },
      ],
    };
  }

  // 8. Support & Advisors
  if (query.includes("support") || query.includes("contact") || query.includes("help") || query.includes("advisor") || query.includes("email")) {
    return {
      text: `Our engineering mentors and learning advisors are here for you! You can reach us 24/7 at **support@astra.edu**, join our community Discord, or ask any technical curriculum questions right here.`,
      links: [
        {
          title: "Explore Community & FAQs",
          path: "/pricing#faq",
          icon: "🎧",
          badge: "24/7 Support",
          description: "Read frequent questions or connect directly with senior faculty advisors",
        },
      ],
    };
  }

  // 9. Notes, Flashcards, Bookmarks
  if (query.includes("note") || query.includes("flashcard") || query.includes("bookmark") || query.includes("saved")) {
    return {
      text: `Looking for your study materials? Your **Personal Notes & Flashcards Hub** consolidates all your lecture bookmarks, code snippets, and active spaced-repetition cards in one place.`,
      links: [
        {
          title: "Saved Notes & Flashcards Hub",
          path: "/notes",
          icon: "📝",
          badge: "Spaced Repetition",
          description: "Review, edit, and export your personal course notes and review flashcards",
        },
      ],
    };
  }

  // 10. Account, Login, Sign In
  if (query.includes("login") || query.includes("sign in") || query.includes("signup") || query.includes("register") || query.includes("account")) {
    return {
      text: `You can sign in to your Astra account to sync your study streaks, contest XP, and unlocked certificates across all devices!`,
      links: [
        {
          title: "Sign In to Astra Account",
          path: "/auth/signin",
          icon: "🔐",
          badge: "Existing User",
          description: "Access your student dashboard or instructor console",
        },
        {
          title: "Create New Free Account",
          path: "/auth/signup",
          icon: "✨",
          badge: "Instant Setup",
          description: "Join 150,000+ engineers building modern software",
        },
      ],
    };
  }

  // 11. General / Greeting / Fallback
  return {
    text: `Hello ${userName}! 👋 I am your Astra AI Learning Guide. You can ask me anything about our technical masterclasses, the 620+ pattern DSA sheets, contest arenas, pricing, or course creation. Here are the most popular destinations:`,
    links: [
      {
        title: "All Masterclasses Catalog",
        path: "/courses",
        icon: "📚",
        badge: "50+ Tracks",
        description: "Explore all AI, Full-Stack, Cloud, and Systems masterclasses",
      },
      {
        title: "620+ DSA Problem Sheets",
        path: "/dsa-sheet",
        icon: "🧠",
        badge: "Patterns & Tips",
        description: "Master LeetCode & interview questions categorized by core pattern",
      },
      {
        title: "Code Arena & Quizzes",
        path: "/contests",
        icon: "🏆",
        badge: "Real-time XP",
        description: "Compete in daily architectural benchmark quizzes and speed duels",
      },
      {
        title: "Dynamic Course Creation",
        path: "/admin",
        icon: "✏️",
        badge: "Creator Studio",
        description: "Build interactive video, text, or flowchart courses as an instructor",
      },
    ],
  };
}

export default function AstraPlatformWidget() {
  const { user, isLoggedIn } = useAuth();
  const navigate = useNavigate();

  // Widget Open / Closed State
  const [isOpen, setIsOpen] = useState(false);

  // Guest Lead Capture state
  const [guestUser, setGuestUser] = useState<GuestInfo | null>(() => {
    try {
      const stored = localStorage.getItem("astra_guest_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [leadName, setLeadName] = useState("");
  const [leadEmail, setLeadEmail] = useState("");
  const [leadError, setLeadError] = useState("");
  const [pendingPrompt, setPendingPrompt] = useState("");

  // Determine active display name
  const activeUserName = isLoggedIn && user ? user.name : guestUser ? guestUser.name : "siddhant";
  const requiresGuestAuth = !isLoggedIn && !guestUser;

  // Chat conversation state
  const [messages, setMessages] = useState<ChatMessage[]>(() => {
    try {
      const stored = localStorage.getItem("astra_chat_history");
      if (stored) return JSON.parse(stored);
    } catch {
      // ignore
    }
    return [
      {
        id: "msg-welcome",
        sender: "bot",
        text: `Chat cleared! How can I help you today, **${activeUserName}**?`,
        timestamp: "12:46 PM",
      },
    ];
  });

  const [inputVal, setInputVal] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  // Position & Dragging State for Circular Floating Button (defaults to bottom-right corner)
  const [iconPos, setIconPos] = useState<{ x: number; y: number } | null>(null);

  // Clear any legacy saved position on mount so widget always loads at bottom-right corner
  useEffect(() => {
    try {
      localStorage.removeItem("astra_chat_icon_pos");
    } catch {
      // ignore
    }
  }, []);

  // Position & Dragging State for Chat Window
  const [windowPos, setWindowPos] = useState<{ x: number; y: number } | null>(null);

  // Quick suggestions visibility (collapsible)
  const [showQuickOptions, setShowQuickOptions] = useState<boolean>(() => {
    try {
      const saved = localStorage.getItem("astra_widget_options_visible");
      return saved !== null ? JSON.parse(saved) : true;
    } catch {
      return true;
    }
  });

  const toggleQuickOptions = () => {
    setShowQuickOptions((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("astra_widget_options_visible", JSON.stringify(next));
      } catch {
        // ignore
      }
      return next;
    });
  };

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatInputRef = useRef<HTMLInputElement>(null);

  // Persist messages
  useEffect(() => {
    try {
      localStorage.setItem("astra_chat_history", JSON.stringify(messages));
    } catch {
      // ignore
    }
  }, [messages]);

  // Auto-scroll chat to bottom
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isTyping, isOpen]);

  // Focus input and clamp chat window if opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => chatInputRef.current?.focus(), 150);
      setWindowPos((prev) => {
        if (!prev) return null;
        const windowWidth = Math.min(380, window.innerWidth - 24);
        const windowHeight = Math.min(520, window.innerHeight - 32);
        return {
          x: Math.max(12, Math.min(window.innerWidth - windowWidth - 12, prev.x)),
          y: Math.max(12, Math.min(window.innerHeight - windowHeight - 12, prev.y)),
        };
      });
    }
  }, [isOpen]);

  // Adjust icon position and window position if viewport resizes
  useEffect(() => {
    const handleResize = () => {
      setIconPos((prev) => {
        if (!prev) return null;
        return {
          x: Math.min(prev.x, Math.max(20, window.innerWidth - 76)),
          y: Math.min(prev.y, Math.max(20, window.innerHeight - 84)),
        };
      });

      setWindowPos((prev) => {
        if (!prev) return null;
        const windowWidth = Math.min(380, window.innerWidth - 24);
        const windowHeight = Math.min(520, window.innerHeight - 32);
        return {
          x: Math.max(12, Math.min(window.innerWidth - windowWidth - 12, prev.x)),
          y: Math.max(12, Math.min(window.innerHeight - windowHeight - 12, prev.y)),
        };
      });
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ================= DRAG LOGIC FOR CIRCULAR ICON =================
  const isDraggingIconRef = useRef(false);
  const dragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });
  const hasMovedRef = useRef(false);

  const handleIconPointerDown = (clientX: number, clientY: number, target: HTMLElement) => {
    isDraggingIconRef.current = true;
    hasMovedRef.current = false;
    const rect = target.getBoundingClientRect();
    dragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: iconPos ? iconPos.x : rect.left,
      initialY: iconPos ? iconPos.y : rect.top,
    };

    const handlePointerMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingIconRef.current) return;
      const currentX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const currentY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = currentX - dragStartRef.current.startX;
      const deltaY = currentY - dragStartRef.current.startY;

      if (Math.hypot(deltaX, deltaY) > 5) {
        hasMovedRef.current = true;
      }

      const clampedX = Math.max(16, Math.min(window.innerWidth - 72, dragStartRef.current.initialX + deltaX));
      const clampedY = Math.max(16, Math.min(window.innerHeight - 72, dragStartRef.current.initialY + deltaY));

      setIconPos({ x: clampedX, y: clampedY });
    };

    const handlePointerUp = () => {
      if (!isDraggingIconRef.current) return;
      isDraggingIconRef.current = false;
      window.removeEventListener("mousemove", handlePointerMove);
      window.removeEventListener("mouseup", handlePointerUp);
      window.removeEventListener("touchmove", handlePointerMove);
      window.removeEventListener("touchend", handlePointerUp);

      // Tap without drag toggles chat open/close
      if (!hasMovedRef.current) {
        setIsOpen((prev) => !prev);
      }
    };

    window.addEventListener("mousemove", handlePointerMove);
    window.addEventListener("mouseup", handlePointerUp);
    window.addEventListener("touchmove", handlePointerMove, { passive: false });
    window.addEventListener("touchend", handlePointerUp);
  };

  // ================= DRAG LOGIC FOR CHAT WINDOW =================
  const isDraggingWindowRef = useRef(false);
  const windowDragStartRef = useRef({ startX: 0, startY: 0, initialX: 0, initialY: 0 });

  const handleWindowHeaderPointerDown = (clientX: number, clientY: number) => {
    isDraggingWindowRef.current = true;
    const currentWindowX = windowPos ? windowPos.x : Math.max(16, window.innerWidth - 380 - 16);
    const currentWindowY = windowPos ? windowPos.y : Math.max(16, window.innerHeight - 520 - 16);

    windowDragStartRef.current = {
      startX: clientX,
      startY: clientY,
      initialX: currentWindowX,
      initialY: currentWindowY,
    };

    const handleWindowMove = (e: MouseEvent | TouchEvent) => {
      if (!isDraggingWindowRef.current) return;
      const currX = "touches" in e ? e.touches[0].clientX : e.clientX;
      const currY = "touches" in e ? e.touches[0].clientY : e.clientY;
      const deltaX = currX - windowDragStartRef.current.startX;
      const deltaY = currY - windowDragStartRef.current.startY;

      const windowWidth = Math.min(380, window.innerWidth - 24);
      const windowHeight = Math.min(520, window.innerHeight - 32);

      const clampedX = Math.max(12, Math.min(window.innerWidth - windowWidth - 12, windowDragStartRef.current.initialX + deltaX));
      const clampedY = Math.max(12, Math.min(window.innerHeight - windowHeight - 12, windowDragStartRef.current.initialY + deltaY));

      setWindowPos({ x: clampedX, y: clampedY });
    };

    const handleWindowUp = () => {
      isDraggingWindowRef.current = false;
      window.removeEventListener("mousemove", handleWindowMove);
      window.removeEventListener("mouseup", handleWindowUp);
      window.removeEventListener("touchmove", handleWindowMove);
      window.removeEventListener("touchend", handleWindowUp);
    };

    window.addEventListener("mousemove", handleWindowMove);
    window.addEventListener("mouseup", handleWindowUp);
    window.addEventListener("touchmove", handleWindowMove, { passive: false });
    window.addEventListener("touchend", handleWindowUp);
  };

  // ================= MESSAGE SENDING LOGIC =================
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend !== undefined ? textToSend : inputVal;
    const text = rawText.trim();
    if (!text) return;

    if (requiresGuestAuth) {
      setPendingPrompt(text);
      setInputVal("");
      return;
    }

    playChime("send");

    const userMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "user",
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputVal("");
    setIsTyping(true);

    setTimeout(() => {
      const botResponse = generateBotResponse(text, activeUserName);
      const botMsg: ChatMessage = {
        id: `msg-${Date.now() + 1}`,
        sender: "bot",
        text: botResponse.text,
        links: botResponse.links,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
      playChime("receive");
    }, 600);
  };

  // Handle Guest Info Submission
  const handleGuestSubmit = (e: FormEvent) => {
    e.preventDefault();
    setLeadError("");

    const trimmedName = leadName.trim();
    const trimmedEmail = leadEmail.trim();

    if (!trimmedName) {
      setLeadError("Please enter your name.");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(trimmedEmail)) {
      setLeadError("Please enter a valid email address.");
      return;
    }

    const newGuest: GuestInfo = { name: trimmedName, email: trimmedEmail };
    setGuestUser(newGuest);
    try {
      localStorage.setItem("astra_guest_user", JSON.stringify(newGuest));
    } catch {
      // ignore
    }

    const welcomeMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      sender: "bot",
      text: `Chat cleared! How can I help you today, **${trimmedName}**?`,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, welcomeMsg]);

    if (pendingPrompt) {
      setTimeout(() => {
        handleSendMessage(pendingPrompt);
        setPendingPrompt("");
      }, 300);
    }
  };

  const handleLinkClick = (path: string) => {
    navigate(path);
  };

  // Coordinates when docked
  const defaultWindowRight = 16;
  const defaultWindowBottom = 16;

  return (
    <>
      {/* =================================================================== */}
      {/* 1. COLLAPSED BLUE CIRCULAR FLOATING BUTTON (DRAGGABLE ANYWHERE)     */}
      {/* =================================================================== */}
      {!isOpen && (
        <div
          style={
            iconPos
              ? {
                  position: "fixed",
                  left: `${iconPos.x}px`,
                  top: `${iconPos.y}px`,
                  zIndex: 60,
                }
              : {
                  position: "fixed",
                  right: "24px",
                  bottom: "24px",
                  zIndex: 60,
                }
          }
          className="select-none print:hidden touch-none"
        >
          <div
            onMouseDown={(e) => {
              e.preventDefault();
              handleIconPointerDown(e.clientX, e.clientY, e.currentTarget);
            }}
            onTouchStart={(e) => {
              const touch = e.touches[0];
              handleIconPointerDown(touch.clientX, touch.clientY, e.currentTarget);
            }}
            title="Astra AI Guide"
            className="group relative w-14 h-14 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-xl shadow-blue-600/35 hover:scale-105 active:scale-95 transition-all flex items-center justify-center cursor-grab active:cursor-grabbing border-2 border-white/40"
          >
            {/* Live Green Online Dot */}
            <span className="absolute 0.5 top-0.5 right-0.5 flex h-3.5 w-3.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white dark:border-slate-900" />
            </span>

            {/* Speech Bubble Icon with 3 Dots inside matching reference */}
            <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24">
              <path d="M12 3c-4.97 0-9 3.58-9 8 0 1.57.51 3.03 1.41 4.28L3 21l5.96-1.39C10.02 19.83 11 20 12 20c4.97 0 9-3.58 9-8s-4.03-8-9-8zm-4 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm4 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
            </svg>
          </div>
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. CHATTING INTERFACE WINDOW (EXACT COLOR, WAVE HEADER, OPTIONS)   */}
      {/* =================================================================== */}
      {isOpen && (
        <div
          style={
            windowPos
              ? {
                  position: "fixed",
                  left: `${windowPos.x}px`,
                  top: `${windowPos.y}px`,
                  zIndex: 65,
                }
              : {
                  position: "fixed",
                  right: `${defaultWindowRight}px`,
                  bottom: `${defaultWindowBottom}px`,
                  zIndex: 65,
                }
          }
          className="select-none print:hidden flex flex-col rounded-[26px] bg-[var(--surface)] border border-slate-200/90 dark:border-slate-800 shadow-2xl shadow-blue-950/20 overflow-hidden text-[var(--text)] transition-all animate-scale-in w-[92vw] sm:w-[380px] h-[520px] max-h-[calc(100vh-32px)] max-h-[calc(100dvh-32px)]"
        >
          {/* ================= VIBRANT BLUE WAVE HEADER ================= */}
          <div
            onMouseDown={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              handleWindowHeaderPointerDown(e.clientX, e.clientY);
            }}
            onTouchStart={(e) => {
              if ((e.target as HTMLElement).closest("button")) return;
              const touch = e.touches[0];
              handleWindowHeaderPointerDown(touch.clientX, touch.clientY);
            }}
            className="relative bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white pt-4 pb-6 px-4 cursor-grab active:cursor-grabbing shrink-0"
          >
            <div className="flex items-center justify-between relative z-10">
              {/* Left: 3D Robot Mascot Avatar & Identity */}
              <div className="flex items-center gap-3 pointer-events-none">
                <RobotAvatar size="md" />

                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm font-black tracking-tight text-white leading-tight">
                      Astra AI Guide
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-400/25 border border-emerald-300/40 text-emerald-200 text-[10px] font-bold tracking-wide">
                      Online
                    </span>
                  </div>
                  <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                    Your learning assistant
                  </p>
                </div>
              </div>

              {/* Right: Circular Glass Header Controls (_ and ✕) */}
              <div className="flex items-center gap-1.5">
                {/* Minimize Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Minimize"
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  <span className="block w-2.5 h-0.5 bg-white rounded-full -mt-1" />
                </button>

                {/* Close Button */}
                <button
                  onClick={() => setIsOpen(false)}
                  title="Close"
                  className="w-7 h-7 rounded-full bg-white/20 hover:bg-white/30 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Signature Curved Organic Wave SVG Transition at bottom */}
            <div className="absolute -bottom-0.5 left-0 right-0 overflow-hidden leading-none pointer-events-none">
              <svg viewBox="0 0 500 35" preserveAspectRatio="none" className="w-full h-4 sm:h-5 fill-[var(--surface)] block">
                <path d="M0,0 C160,32 340,32 500,2 L500,35 L0,35 Z" />
              </svg>
            </div>
          </div>

          {/* ================= CHAT MESSAGE STREAM ================= */}
          <div className="flex-1 px-4 py-3 overflow-y-auto space-y-3 bg-[var(--surface)] text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div className="flex items-start gap-2 max-w-[88%]">
                  {msg.sender === "bot" && (
                    <RobotAvatar size="sm" />
                  )}

                  <div
                    className={`rounded-2xl p-3 leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white rounded-br-xs font-medium shadow-sm"
                        : "bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 rounded-tl-xs border border-slate-200/50 dark:border-slate-700/50 shadow-2xs"
                    }`}
                  >
                    <p className="whitespace-pre-wrap">{msg.text}</p>

                    {/* DIRECT PAGE NAVIGATION LINK CARDS */}
                    {msg.links && msg.links.length > 0 && (
                      <div className="mt-2.5 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 space-y-1.5">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block">
                          Suggested Routes:
                        </span>
                        <div className="grid grid-cols-1 gap-1.5">
                          {msg.links.map((lnk, idx) => (
                            <Link
                              key={idx}
                              to={lnk.path}
                              onClick={() => handleLinkClick(lnk.path)}
                              className="group p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 hover:shadow-xs transition-all flex items-start justify-between gap-2 text-left"
                            >
                              <div className="flex items-start gap-2">
                                <span className="text-sm leading-none mt-0.5">{lnk.icon}</span>
                                <div>
                                  <div className="flex items-center gap-1.5">
                                    <span className="font-extrabold text-[11px] text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                                      {lnk.title}
                                    </span>
                                    {lnk.badge && (
                                      <span className="px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 text-[9px] font-bold font-mono">
                                        {lnk.badge}
                                      </span>
                                    )}
                                  </div>
                                  <p className="text-[10px] text-slate-500 dark:text-slate-400 line-clamp-1 mt-0.5">
                                    {lnk.description}
                                  </p>
                                </div>
                              </div>
                              <span className="text-slate-400 group-hover:text-blue-600 font-bold transition-transform group-hover:translate-x-0.5">
                                →
                              </span>
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                <span className="text-[10px] text-slate-400 font-medium mt-1 px-8">
                  {msg.timestamp}
                </span>
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2">
                <RobotAvatar size="sm" />
                <div className="px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50 rounded-tl-xs flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.2s]" />
                  <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-bounce [animation-delay:0.4s]" />
                  <span className="text-[10px] text-slate-400 font-medium ml-1">Astra AI is typing...</span>
                </div>
              </div>
            )}

            {/* ================= GUEST LEAD CAPTURE FORM ================= */}
            {requiresGuestAuth && (
              <div className="my-2 p-3.5 rounded-2xl bg-blue-50/80 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-800/60 text-slate-900 dark:text-white space-y-2.5 animate-fade-in shadow-xs">
                <div className="flex items-center gap-2">
                  <span className="text-base">👋</span>
                  <div>
                    <h4 className="text-xs font-black">Welcome to Astra Academy!</h4>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400">Please enter your name & email to start chatting</p>
                  </div>
                </div>

                <form onSubmit={handleGuestSubmit} className="space-y-2">
                  <input
                    type="text"
                    value={leadName}
                    onChange={(e) => setLeadName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  <input
                    type="email"
                    value={leadEmail}
                    onChange={(e) => setLeadEmail(e.target.value)}
                    placeholder="Your Email Address"
                    className="w-full px-3 py-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />

                  {leadError && (
                    <p className="text-[10px] text-rose-500 font-bold">{leadError}</p>
                  )}

                  <button
                    type="submit"
                    className="w-full py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-black shadow-xs active:scale-98 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Start Chatting</span>
                    <span>→</span>
                  </button>
                </form>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* ================= COLLAPSIBLE QUICK OPTION PILLS ================= */}
          <div className="px-3.5 pt-1.5 pb-2 border-t border-slate-100 dark:border-slate-800 bg-[var(--surface)] transition-all shrink-0">
            {showQuickOptions ? (
              <div className="space-y-1.5 animate-fade-in">
                {/* Header row with Title and Hide toggle */}
                <div className="flex items-center justify-between px-0.5">
                  <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider flex items-center gap-1">
                    <span>⚡</span> Suggestions
                  </span>
                  <button
                    type="button"
                    onClick={toggleQuickOptions}
                    title="Hide suggestions"
                    className="text-[10px] font-semibold text-slate-400 hover:text-blue-600 dark:hover:text-blue-400 flex items-center gap-0.5 cursor-pointer py-0.5 px-1.5 rounded hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span>Hide</span>
                    <svg className="w-3 h-3 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>
                </div>

                {/* Row 1: 3 pills */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {QUICK_OPTIONS_ROW_1.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSendMessage(opt.prompt)}
                      className="px-3 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span className="text-xs">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>

                {/* Row 2: 2 pills */}
                <div className="flex items-center justify-center gap-1.5 flex-wrap">
                  {QUICK_OPTIONS_ROW_2.map((opt) => (
                    <button
                      key={opt.id}
                      onClick={() => handleSendMessage(opt.prompt)}
                      className="px-3.5 py-1 rounded-full bg-white dark:bg-slate-800 border border-slate-200/90 dark:border-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-200 hover:border-blue-400 hover:text-blue-600 dark:hover:text-blue-400 shadow-2xs hover:shadow-xs transition-all flex items-center gap-1 cursor-pointer shrink-0"
                    >
                      <span className="text-xs">{opt.icon}</span>
                      <span>{opt.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            ) : (
              /* Collapsed state: single clean row with 'Show Options' */
              <div className="flex items-center justify-between px-0.5 py-0.5 animate-fade-in">
                <span className="text-[10px] text-slate-400 dark:text-slate-500 font-medium">Suggestions hidden</span>
                <button
                  type="button"
                  onClick={toggleQuickOptions}
                  title="Show suggestions"
                  className="text-[10px] font-bold text-blue-600 dark:text-blue-400 hover:underline flex items-center gap-1 cursor-pointer py-0.5 px-2 rounded-full bg-blue-50 dark:bg-blue-950/40 border border-blue-200/60 dark:border-blue-800/60 transition-colors"
                >
                  <span>⚡ Show Options</span>
                  <svg className="w-2.5 h-2.5 stroke-current fill-none" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
                  </svg>
                </button>
              </div>
            )}
          </div>

          {/* ================= CHAT INPUT BOX & SAFETY FOOTER ================= */}
          <div className="px-3.5 pb-3 pt-1 bg-[var(--surface)] shrink-0">
            {/* White Pill Input Container */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage();
              }}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 shadow-2xs"
            >
              {/* Paperclip Icon */}
              <button
                type="button"
                onClick={() => handleSendMessage("Can I share code or ask an architectural question?")}
                title="Attach file or code"
                className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 p-0.5 transition-colors cursor-pointer shrink-0"
              >
                <svg className="w-4 h-4 fill-none stroke-current" strokeWidth="2" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>

              {/* Text Input */}
              <input
                ref={chatInputRef}
                type="text"
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask Astra AI anything..."
                className="flex-1 bg-transparent border-0 text-xs text-slate-800 dark:text-slate-100 placeholder:text-slate-400 focus:outline-none font-medium min-w-0"
              />

              {/* Blue Circular Send Button with Arrow -> */}
              <button
                type="submit"
                disabled={!inputVal.trim() && !pendingPrompt}
                className="w-8 h-8 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center transition-all disabled:opacity-40 disabled:cursor-not-allowed shadow-xs active:scale-95 cursor-pointer shrink-0"
                title="Send Message"
              >
                <svg className="w-3.5 h-3.5 fill-none stroke-current stroke-2.5" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </button>
            </form>

            {/* Exact Footer Note matching screenshot */}
            <div className="flex items-center justify-center gap-1 pt-2 text-[10px] text-slate-400 font-medium">
              <svg className="w-3 h-3 text-blue-500 fill-current" viewBox="0 0 24 24">
                <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-2 16l-4-4 1.41-1.41L10 14.17l6.59-6.59L18 9l-8 8z" />
              </svg>
              <span>Your data is safe with us</span>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
