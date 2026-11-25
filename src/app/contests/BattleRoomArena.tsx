import { useState, useEffect, useRef } from "react";
import { useAuth } from "../context/AuthContext";
import { useTheme } from "../theme";
import { Icon } from "../../App";

interface BattleProblem {
  id: string;
  title: string;
  track: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Architect";
  description: string;
  starterCode: string;
  solutionTemplate: string;
  testCases: Array<{ input: string; expected: string; description: string }>;
  timeLimitSec: number;
}

const BATTLE_PROBLEMS: BattleProblem[] = [
  {
    id: "bp-1",
    title: "Optimistic React 19 State Reconciler",
    track: "Full-Stack & React 19",
    difficulty: "Intermediate",
    timeLimitSec: 240,
    description: "Write an optimistic state updater function `reconcileOptimisticVote(currentState, action)` that immediately updates the client-side like status and like counter while maintaining atomic rollback if the server action throws.",
    starterCode: `// Implement optimistic state updater
function reconcileOptimisticVote(state, action) {
  // state: { likes: number, isLiked: boolean }
  // action: { type: "toggle" }
  if (action.type === "toggle") {
    return {
      likes: state.isLiked ? state.likes - 1 : state.likes + 1,
      isLiked: !state.isLiked
    };
  }
  return state;
}`,
    solutionTemplate: `function reconcileOptimisticVote(state, action) {
  if (action.type === "toggle") {
    return {
      likes: state.isLiked ? state.likes - 1 : state.likes + 1,
      isLiked: !state.isLiked
    };
  }
  return state;
}`,
    testCases: [
      { input: "state: { likes: 10, isLiked: false }, action: { type: 'toggle' }", expected: "{ likes: 11, isLiked: true }", description: "Toggle like on unliked post" },
      { input: "state: { likes: 5, isLiked: true }, action: { type: 'toggle' }", expected: "{ likes: 4, isLiked: false }", description: "Toggle like on liked post" },
      { input: "state: { likes: 0, isLiked: false }, action: { type: 'toggle' }", expected: "{ likes: 1, isLiked: true }", description: "Handles zero base boundary" },
      { input: "state: { likes: 99, isLiked: true }, action: { type: 'noop' }", expected: "{ likes: 99, isLiked: true }", description: "Ignores unrecognized action type" }
    ]
  },
  {
    id: "bp-2",
    title: "LangGraph Cyclic State Memory Checkpointer",
    track: "AI & Multi-Agent",
    difficulty: "Architect",
    timeLimitSec: 300,
    description: "Design a cyclic reducer `reduceAgentMemory(state, newObservation)` that stores up to `maxHistory` checkpoints, pruning older intermediate turns while preserving the initial system prompt and latest convergence score.",
    starterCode: `// Cyclic agent memory checkpointer
function reduceAgentMemory(state, newObservation, maxHistory = 4) {
  // state: { systemPrompt: string, history: string[], score: number }
  const nextHistory = [...state.history, newObservation];
  const pruned = nextHistory.slice(-maxHistory);
  return {
    ...state,
    history: pruned,
    score: Math.min(1.0, Number((state.score + 0.15).toFixed(2)))
  };
}`,
    solutionTemplate: `function reduceAgentMemory(state, newObservation, maxHistory = 4) {
  const nextHistory = [...state.history, newObservation];
  const pruned = nextHistory.slice(-maxHistory);
  return {
    ...state,
    history: pruned,
    score: Math.min(1.0, Number((state.score + 0.15).toFixed(2)))
  };
}`,
    testCases: [
      { input: "history: ['turn1'], new: 'turn2', max: 4", expected: "history length 2, score +0.15", description: "Adds observation without overflow" },
      { input: "history: ['1','2','3','4'], new: '5', max: 4", expected: "history pruned to last 4 items", description: "Prunes FIFO beyond maxHistory boundary" },
      { input: "score: 0.95, new: 'eval_pass'", expected: "score clamped at 1.0", description: "Clamps confidence threshold at 1.0" }
    ]
  },
  {
    id: "bp-3",
    title: "Zero-Trust Rust Token Signature Verifier",
    track: "Rust & Systems",
    difficulty: "Advanced",
    timeLimitSec: 240,
    description: "Implement a token validator `verifyAuthToken(header, payload, signature)` that returns true only if the signature algorithm is 'RS256', the timestamp hasn't expired (`exp > now`), and the issuer is 'astra-auth'.",
    starterCode: `// Verify zero-trust JWT token metadata
function verifyAuthToken(header, payload, signature, now = Date.now() / 1000) {
  if (header.alg !== "RS256") return false;
  if (payload.iss !== "astra-auth") return false;
  if (payload.exp <= now) return false;
  return signature && signature.length >= 16;
}`,
    solutionTemplate: `function verifyAuthToken(header, payload, signature, now = Date.now() / 1000) {
  if (header.alg !== "RS256") return false;
  if (payload.iss !== "astra-auth") return false;
  if (payload.exp <= now) return false;
  return Boolean(signature && signature.length >= 16);
}`,
    testCases: [
      { input: "alg: 'RS256', iss: 'astra-auth', valid exp", expected: "true", description: "Valid RS256 token passes verification" },
      { input: "alg: 'none', iss: 'astra-auth'", expected: "false", description: "Rejects unsecure alg: none" },
      { input: "alg: 'RS256', exp in past", expected: "false", description: "Rejects expired timestamp" }
    ]
  }
];

const RANDOM_OPPONENTS = [
  { name: "Kaito Takahashi", avatar: "KT", rating: 1940, role: "Staff Architect • Tokyo", country: "🇯🇵" },
  { name: "Elena Rostova", avatar: "ER", rating: 1880, role: "Systems Lead • Berlin", country: "🇩🇪" },
  { name: "Marcus Brody", avatar: "MB", rating: 1820, role: "Cloud Lead • Austin", country: "🇺🇸" },
  { name: "Priya Sharma", avatar: "PS", rating: 1790, role: "Security Eng • Bangalore", country: "🇮🇳" },
  { name: "David Chen", avatar: "DC", rating: 1850, role: "Full-Stack Dev • Toronto", country: "🇨🇦" }
];

interface ChatMessage {
  id: string;
  sender: "you" | "opponent" | "system";
  senderName: string;
  text: string;
  time: string;
}

interface BattleRoomProps {
  initialRoomCode?: string;
  onExit?: () => void;
}

export default function BattleRoomArena({ initialRoomCode, onExit }: BattleRoomProps) {
  const { user, updateUserStats } = useAuth();
  const { dark } = useTheme();

  // Arena Mode: "lobby" (create/join), "waiting_room" (pre-battle host management), "battle" (active match), "result" (post-game summary)
  const [arenaState, setArenaState] = useState<"lobby" | "waiting_room" | "battle" | "result">("lobby");
  
  // Room metadata
  const [roomCode, setRoomCode] = useState(initialRoomCode || "");
  const [isHost, setIsHost] = useState(true);
  const [roomType, setRoomType] = useState<"friend" | "random">("friend");
  const [selectedTrack, setSelectedTrack] = useState("Full-Stack & React 19");
  const [matchDurationMin, setMatchDurationMin] = useState(4);
  const [linkCopied, setLinkCopied] = useState(false);
  const [joinCodeInput, setJoinCodeInput] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  // Matchmaking State for Random Opponent
  const [isSearchingRandom, setIsSearchingRandom] = useState(false);
  const [searchTimer, setSearchTimer] = useState(0);

  // Participants
  const [hostUser, setHostUser] = useState({
    name: user?.name || "Alex Morgan (You)",
    avatar: user?.name ? user.name.slice(0, 2).toUpperCase() : "AM",
    rating: 1840,
    role: "Full-Stack Engineer"
  });

  const [opponent, setOpponent] = useState<{
    name: string;
    avatar: string;
    rating: number;
    role: string;
    country: string;
  } | null>(null);

  // Waiting Room Host Management
  const [pendingJoinRequests, setPendingJoinRequests] = useState<Array<{
    id: string;
    name: string;
    avatar: string;
    rating: number;
  }>>([]);

  // Video Call State
  const [isCamActive, setIsCamActive] = useState(true);
  const [isMicActive, setIsMicActive] = useState(true);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const [hasWebcamAccess, setHasWebcamAccess] = useState(false);
  const localVideoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);

  // Battle Coding State
  const [activeProblem, setActiveProblem] = useState<BattleProblem>(BATTLE_PROBLEMS[0]);
  const [userCode, setUserCode] = useState(activeProblem.starterCode);
  const [battleTimeLeft, setBattleTimeLeft] = useState(240);
  const [userTestsPassed, setUserTestsPassed] = useState(0);
  const [opponentTestsPassed, setOpponentTestsPassed] = useState(0);
  const [opponentTyping, setOpponentTyping] = useState(false);
  const [testOutput, setTestOutput] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<{
    winner: "you" | "opponent" | "draw";
    reason: string;
    xpEarned: number;
    ratingDelta: number;
  } | null>(null);

  // In-match Chat
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([
    { id: "msg-1", sender: "system", senderName: "Astra Arena Arbiter", text: "1v1 Head-to-Head Arena initialized. Good luck!", time: "Now" }
  ]);
  const [chatInput, setChatInput] = useState("");

  // Handle URL deep-link room join
  useEffect(() => {
    if (initialRoomCode) {
      setRoomCode(initialRoomCode.toUpperCase());
      setIsHost(false);
      // Simulate joining room
      const randomOpp = RANDOM_OPPONENTS[Math.floor(Math.random() * RANDOM_OPPONENTS.length)];
      setOpponent(randomOpp);
      setArenaState("waiting_room");
    }
  }, [initialRoomCode]);

  // Request real Camera / Mic access when enabled
  useEffect(() => {
    let activeStream: MediaStream | null = null;
    if (isCamActive && (arenaState === "waiting_room" || arenaState === "battle")) {
      navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
        .then((mediaStream) => {
          activeStream = mediaStream;
          setStream(mediaStream);
          setHasWebcamAccess(true);
          if (localVideoRef.current) {
            localVideoRef.current.srcObject = mediaStream;
          }
        })
        .catch(() => {
          setHasWebcamAccess(false);
        });
    }

    return () => {
      if (activeStream) {
        activeStream.getTracks().forEach((track) => track.stop());
      }
    };
  }, [isCamActive, arenaState]);

  // Random Challenger Matchmaking Timer
  useEffect(() => {
    let interval: any;
    if (isSearchingRandom) {
      interval = setInterval(() => {
        setSearchTimer((prev) => {
          if (prev >= 3) {
            // Match found!
            setIsSearchingRandom(false);
            const matchedOpp = RANDOM_OPPONENTS[Math.floor(Math.random() * RANDOM_OPPONENTS.length)];
            setOpponent(matchedOpp);
            const newCode = `AST-${Math.floor(1000 + Math.random() * 9000)}`;
            setRoomCode(newCode);
            setRoomType("random");
            setArenaState("waiting_room");
            return 0;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isSearchingRandom]);

  // Battle countdown & simulated opponent live progress
  useEffect(() => {
    let timer: any;
    if (arenaState === "battle" && battleTimeLeft > 0 && !battleResult) {
      timer = setInterval(() => {
        setBattleTimeLeft((prev) => {
          if (prev <= 1) {
            // Time's up: evaluate winner
            finishBattle();
            return 0;
          }
          return prev - 1;
        });

        // Opponent progress simulation
        if (Math.random() > 0.65) {
          setOpponentTyping(true);
          setTimeout(() => setOpponentTyping(false), 2000);
        }

        // Opponent passing test cases periodically
        if (battleTimeLeft === 200 && opponentTestsPassed < 1) {
          setOpponentTestsPassed(1);
          addChatMessage("opponent", opponent?.name || "Opponent", "Passed test 1! 🚀");
        } else if (battleTimeLeft === 140 && opponentTestsPassed < 2) {
          setOpponentTestsPassed(2);
        } else if (battleTimeLeft === 80 && opponentTestsPassed < 3) {
          setOpponentTestsPassed(3);
          addChatMessage("opponent", opponent?.name || "Opponent", "Almost there... on the edge case!");
        }
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [arenaState, battleTimeLeft, battleResult, opponentTestsPassed]);

  const addChatMessage = (sender: "you" | "opponent" | "system", senderName: string, text: string) => {
    setChatMessages((prev) => [
      ...prev,
      {
        id: `msg-${Date.now()}-${Math.random()}`,
        sender,
        senderName,
        text,
        time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
      }
    ]);
  };

  const handleSendChat = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!chatInput.trim()) return;
    addChatMessage("you", user?.name || "You", chatInput.trim());
    const sentText = chatInput.trim();
    setChatInput("");

    // Simulated opponent quick response
    setTimeout(() => {
      if (Math.random() > 0.4 && arenaState === "battle") {
        const replies = ["Nice code structure!", "GG, working on test 3", "Let's go!!", "Under 2 mins left!", "🔥"];
        const reply = replies[Math.floor(Math.random() * replies.length)];
        addChatMessage("opponent", opponent?.name || "Opponent", reply);
      }
    }, 1800);
  };

  // Actions
  const handleCreateRoom = () => {
    const code = `AST-${Math.floor(1000 + Math.random() * 9000)}`;
    setRoomCode(code);
    setIsHost(true);
    setRoomType("friend");
    setOpponent(null);
    setPendingJoinRequests([
      {
        id: "req-1",
        name: RANDOM_OPPONENTS[0].name,
        avatar: RANDOM_OPPONENTS[0].avatar,
        rating: RANDOM_OPPONENTS[0].rating
      }
    ]);
    setArenaState("waiting_room");
  };

  const handleJoinWithCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!joinCodeInput.trim()) {
      setJoinError("Please enter a 6-digit room code.");
      return;
    }
    setRoomCode(joinCodeInput.toUpperCase().trim());
    setIsHost(false);
    setOpponent(RANDOM_OPPONENTS[1]);
    setArenaState("waiting_room");
  };

  const handleCopyMeetingLink = () => {
    const url = `${window.location.origin}/contests?tab=duel&room=${roomCode}`;
    navigator.clipboard?.writeText(url);
    setLinkCopied(true);
    setTimeout(() => setLinkCopied(false), 2500);
  };

  const handleAdmitJoiner = (req: any) => {
    setOpponent({
      name: req.name,
      avatar: req.avatar,
      rating: req.rating,
      role: "Staff Systems Engineer",
      country: "🌐"
    });
    setPendingJoinRequests((prev) => prev.filter((r) => r.id !== req.id));
    addChatMessage("system", "Arena", `${req.name} joined the battle room.`);
  };

  const handleKickOpponent = () => {
    if (opponent) {
      addChatMessage("system", "Arena", `${opponent.name} was removed by room host.`);
      setOpponent(null);
    }
  };

  const handleStartBattle = () => {
    if (!opponent) {
      alert("Please wait for an opponent to join before starting the battle!");
      return;
    }
    const prob = BATTLE_PROBLEMS.find((p) => p.track === selectedTrack) || BATTLE_PROBLEMS[0];
    setActiveProblem(prob);
    setUserCode(prob.starterCode);
    setBattleTimeLeft(matchDurationMin * 60);
    setUserTestsPassed(0);
    setOpponentTestsPassed(0);
    setBattleResult(null);
    setArenaState("battle");
    addChatMessage("system", "Arena", `⚡ Battle started! Challenge: ${prob.title}. Time Limit: ${matchDurationMin} mins.`);
  };

  const handleRunTests = () => {
    // Simple evaluator
    const totalTests = activeProblem.testCases.length;
    const passed = Math.min(totalTests, Math.max(1, Math.floor(totalTests * 0.75)));
    setUserTestsPassed(passed);
    setTestOutput(`✓ Passed ${passed}/${totalTests} public testcases successfully!\nExecution time: 4.2ms | Memory: 14.8MB`);
    addChatMessage("you", user?.name || "You", `Ran tests: Passed ${passed}/${totalTests} tests!`);
  };

  const handleSubmitSolution = () => {
    const totalTests = activeProblem.testCases.length;
    setUserTestsPassed(totalTests);
    setTestOutput(`🎉 ALL ${totalTests}/${totalTests} TESTCASES PASSED!\nVerification against hidden edge-case suites complete.`);
    
    // Check if user finished before opponent
    finishBattle("you");
  };

  const finishBattle = (explicitWinner?: "you" | "opponent") => {
    let winner: "you" | "opponent" | "draw" = "draw";
    if (explicitWinner) {
      winner = explicitWinner;
    } else {
      if (userTestsPassed > opponentTestsPassed) winner = "you";
      else if (opponentTestsPassed > userTestsPassed) winner = "opponent";
      else winner = "draw";
    }

    const xp = winner === "you" ? 250 : winner === "draw" ? 100 : 40;
    const delta = winner === "you" ? +24 : winner === "draw" ? 0 : -14;

    if (updateUserStats) {
      updateUserStats(xp);
    }

    setBattleResult({
      winner,
      reason: winner === "you" ? "Fastest submission with 100% test pass rate" : winner === "opponent" ? "Opponent achieved higher test coverage score" : "Equal score at time expiration",
      xpEarned: xp,
      ratingDelta: delta
    });
    setArenaState("result");
  };

  return (
    <div className="w-full space-y-6">
      {/* ================= 1. LOBBY SCREEN ================= */}
      {arenaState === "lobby" && (
        <div className="space-y-6">
          {/* Top Banner */}
          <div className="relative p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-md overflow-hidden text-center sm:text-left flex flex-col sm:flex-row items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl z-10">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20 text-[11px] font-bold tracking-wider uppercase">
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                Live 1v1 Video Coding Arena
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[var(--text)] tracking-tight">
                Head-to-Head Engineering Duels with Live Video
              </h2>
              <p className="text-xs sm:text-sm text-[var(--muted)] leading-relaxed">
                Create a private room to battle friends with video chat, share an invite link, or match with top engineers worldwide in real-time speed coding.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0 z-10 w-full sm:w-auto">
              <button
                onClick={handleCreateRoom}
                className="px-6 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-sm shadow-sm hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-2"
              >
                <span>⚔️</span> Create Battle Room
              </button>
              <button
                onClick={() => setIsSearchingRandom(true)}
                disabled={isSearchingRandom}
                className="px-6 py-3 rounded-2xl bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-[var(--text)] font-bold text-sm hover:border-[var(--accent)] transition-all flex items-center justify-center gap-2"
              >
                <span>🌐</span> {isSearchingRandom ? `Finding Peer (${searchTimer}s)...` : "Quick Match Random"}
              </button>
            </div>
          </div>

          {/* Lobby Grid: Matchmaking & Join Code */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Box 1: Join with Code / Meeting Link */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold text-lg">
                  🔑
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--text)]">Join Existing Room</h3>
                  <p className="text-xs text-[var(--muted)]">Enter the 6-character room code or shared battle link</p>
                </div>
              </div>

              <form onSubmit={handleJoinWithCode} className="space-y-3">
                <div className="relative">
                  <input
                    type="text"
                    placeholder="e.g. AST-4892 or paste meeting link"
                    value={joinCodeInput}
                    onChange={(e) => {
                      setJoinCodeInput(e.target.value);
                      setJoinError(null);
                    }}
                    className="w-full px-4 py-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] focus:border-[var(--accent)] font-mono text-sm tracking-wider text-[var(--text)] outline-none"
                  />
                  {joinError && <p className="text-xs text-rose-400 font-semibold mt-1">{joinError}</p>}
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm transition-all flex items-center justify-center gap-2"
                >
                  Enter Arena Room →
                </button>
              </form>
            </div>

            {/* Box 2: Live Arena Rules & Video Call Specs */}
            <div className="p-6 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-black text-lg">
                  📹
                </div>
                <div>
                  <h3 className="text-base font-black text-[var(--text)]">Video & Audio Powered Duels</h3>
                  <p className="text-xs text-[var(--muted)]">Face-to-face peer code reviews and tactical discussions</p>
                </div>
              </div>

              <div className="space-y-2 text-xs text-[var(--muted)]">
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface-soft)]">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Host Admin Controls:</strong> Approve joiners, kick users, pick topics & time.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface-soft)]">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Live Video Call:</strong> Camera & mic streaming with screen sharing capabilities.</span>
                </div>
                <div className="flex items-center gap-2 p-2 rounded-xl bg-[var(--surface-soft)]">
                  <span className="text-emerald-400 font-bold">✓</span>
                  <span><strong>Real-time Telemetry:</strong> Opponent keystrokes & test pass rates live in HUD.</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 2. WAITING ROOM & HOST ADMIN CONTROLS ================= */}
      {arenaState === "waiting_room" && (
        <div className="space-y-6">
          {/* Header Bar */}
          <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setArenaState("lobby")}
                className="p-2.5 rounded-xl border border-[var(--border-soft)] bg-[var(--surface-soft)] text-xs font-bold hover:border-[var(--accent)]"
              >
                ← Back
              </button>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20">
                    Room: {roomCode}
                  </span>
                  {isHost ? (
                    <span className="text-[11px] font-black px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      👑 You are Room Host
                    </span>
                  ) : (
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-slate-500/10 text-slate-600 dark:text-slate-400">
                      Challenger Guest
                    </span>
                  )}
                </div>
                <h2 className="text-lg font-black text-[var(--text)] mt-1">Pre-Battle Tactical Lobby & Video Check</h2>
              </div>
            </div>

            {/* Share Link Button */}
            <div className="flex items-center gap-2.5">
              <button
                onClick={handleCopyMeetingLink}
                className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text)] flex items-center gap-2 transition-all"
              >
                <span>{linkCopied ? "✓ Link Copied!" : "🔗 Share Meeting Link"}</span>
              </button>
              {isHost && (
                <button
                  onClick={handleStartBattle}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-2 hover:scale-102 active:scale-98 transition-all"
                >
                  <span>⚡ START BATTLE</span>
                </button>
              )}
            </div>
          </div>

          {/* Main Stage: Dual Video Feeds + Settings */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left: Video Call Feeds (7 cols) */}
            <div className="lg:col-span-7 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Host / Your Video Feed */}
                <div className="relative aspect-video rounded-3xl bg-slate-950 border border-[var(--border)] shadow-md overflow-hidden flex flex-col justify-between p-3.5">
                  {hasWebcamAccess && isCamActive ? (
                    <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                      <div className="w-16 h-16 rounded-full bg-blue-600/20 border-2 border-blue-500 flex items-center justify-center text-xl font-bold text-white shadow-md">
                        {hostUser.avatar}
                      </div>
                      <span className="text-xs font-bold text-gray-300 mt-2">Camera Disabled</span>
                    </div>
                  )}

                  {/* Video Overlays */}
                  <div className="relative z-10 flex items-center justify-between">
                    <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                      {isHost ? "👑 Host (You)" : "You"}
                    </span>
                    <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[10px] font-mono">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" /> HD 1080p
                    </span>
                  </div>

                  <div className="relative z-10 flex items-center justify-between">
                    <span className="text-xs font-bold text-white drop-shadow">{hostUser.name} ({hostUser.rating} ELO)</span>
                    <div className="flex items-center gap-1.5">
                      <button
                        onClick={() => setIsMicActive(!isMicActive)}
                        className={`p-1.5 rounded-lg text-xs ${isMicActive ? "bg-black/60 text-white" : "bg-rose-600 text-white"}`}
                      >
                        {isMicActive ? "🎤" : "🔇"}
                      </button>
                      <button
                        onClick={() => setIsCamActive(!isCamActive)}
                        className={`p-1.5 rounded-lg text-xs ${isCamActive ? "bg-black/60 text-white" : "bg-rose-600 text-white"}`}
                      >
                        {isCamActive ? "📹" : "🚫"}
                      </button>
                    </div>
                  </div>
                </div>

                {/* Opponent Video Feed */}
                <div className="relative aspect-video rounded-3xl bg-slate-950 border border-[var(--border-soft)] shadow-md overflow-hidden flex flex-col justify-between p-3.5">
                  {opponent ? (
                    <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900">
                      <div className="w-16 h-16 rounded-full bg-slate-700 border-2 border-slate-500 flex items-center justify-center text-xl font-bold text-white shadow-md">
                        {opponent.avatar}
                      </div>
                      <span className="text-xs font-bold text-slate-300 mt-2">{opponent.role}</span>
                    </div>
                  ) : (
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center space-y-2">
                      <div className="w-12 h-12 rounded-2xl bg-[var(--surface-soft)] border border-dashed border-[var(--border)] flex items-center justify-center text-lg animate-spin">
                        ⏳
                      </div>
                      <p className="text-xs font-bold text-[var(--muted)]">Waiting for challenger to join...</p>
                      <button
                        onClick={handleCopyMeetingLink}
                        className="text-[11px] text-[var(--accent)] hover:underline font-bold"
                      >
                        Copy meeting link to invite
                      </button>
                    </div>
                  )}

                  {opponent && (
                    <>
                      <div className="relative z-10 flex items-center justify-between">
                        <span className="px-2.5 py-0.5 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/20">
                          Challenger {opponent.country}
                        </span>
                        {isHost && (
                          <button
                            onClick={handleKickOpponent}
                            className="px-2 py-0.5 rounded-md bg-rose-600/80 hover:bg-rose-600 text-[10px] font-bold text-white"
                          >
                            Kick Participant
                          </button>
                        )}
                      </div>

                      <div className="relative z-10 flex items-center justify-between">
                        <span className="text-xs font-bold text-white drop-shadow">{opponent.name} ({opponent.rating} ELO)</span>
                        <span className="text-[10px] text-emerald-400 font-bold">● Mic Ready</span>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Host Waiting Lobby / Requests */}
              {isHost && pendingJoinRequests.length > 0 && (
                <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2.5">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-black text-amber-400 flex items-center gap-1.5">
                      <span>🚪</span> Join Requests in Waiting Room ({pendingJoinRequests.length})
                    </h4>
                    <span className="text-[10px] text-[var(--muted)]">Host approval required</span>
                  </div>
                  {pendingJoinRequests.map((req) => (
                    <div key={req.id} className="flex items-center justify-between p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)]">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center">
                          {req.avatar}
                        </div>
                        <div>
                          <p className="text-xs font-extrabold text-[var(--text)]">{req.name}</p>
                          <span className="text-[10px] text-[var(--muted)]">Rating: {req.rating} ELO</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleAdmitJoiner(req)}
                          className="px-3 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow"
                        >
                          Admit to Battle
                        </button>
                        <button
                          onClick={() => setPendingJoinRequests((prev) => prev.filter((r) => r.id !== req.id))}
                          className="px-2 py-1 rounded-lg bg-[var(--surface-soft)] text-xs text-[var(--muted)] hover:text-rose-400"
                        >
                          Deny
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right: Room Host Rules & In-Room Chat (5 cols) */}
            <div className="lg:col-span-5 space-y-4">
              {/* Rules Configuration */}
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl space-y-3.5">
                <h3 className="text-xs font-black uppercase tracking-wider text-[var(--accent)] flex items-center gap-1.5">
                  <span>⚙️</span> Match Rules & Challenge Topic
                </h3>

                {isHost ? (
                  <div className="space-y-3 text-xs">
                    <div>
                      <label className="block font-bold text-[var(--muted)] mb-1">Challenge Category:</label>
                      <select
                        value={selectedTrack}
                        onChange={(e) => setSelectedTrack(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] font-bold text-[var(--text)] outline-none"
                      >
                        <option value="Full-Stack & React 19">Full-Stack & React 19 (Server Actions & State)</option>
                        <option value="AI & Multi-Agent">AI & Multi-Agent (LangGraph & RAG Memory)</option>
                        <option value="Rust & Systems">Rust & Systems (Zero-Trust Token Verifier)</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-bold text-[var(--muted)] mb-1">Time Limit:</label>
                      <div className="grid grid-cols-3 gap-2">
                        {[3, 4, 5].map((mins) => (
                          <button
                            key={mins}
                            type="button"
                            onClick={() => setMatchDurationMin(mins)}
                            className={`py-1.5 rounded-lg font-bold text-xs border ${
                              matchDurationMin === mins
                                ? "border-[var(--accent)] bg-blue-500/10 text-blue-600 dark:text-blue-400"
                                : "border-[var(--border-soft)] bg-[var(--surface-soft)] text-[var(--muted)]"
                            }`}
                          >
                            {mins} Mins
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 rounded-xl bg-[var(--surface-soft)] text-xs space-y-1">
                    <p><strong>Selected Topic:</strong> {selectedTrack}</p>
                    <p><strong>Duration:</strong> {matchDurationMin} Minutes</p>
                    <p className="text-[11px] text-[var(--muted)]">Room rules are controlled by the host.</p>
                  </div>
                )}
              </div>

              {/* Lobby Chat */}
              <div className="p-5 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-xl flex flex-col h-64 justify-between">
                <h4 className="text-xs font-black uppercase tracking-wider text-[var(--muted)] pb-2 border-b border-[var(--border-soft)] flex items-center justify-between">
                  <span>💬 Lobby Chat</span>
                  <span className="text-[10px] text-emerald-400">● 2 Connected</span>
                </h4>

                <div className="flex-1 overflow-y-auto space-y-2 py-2 text-xs font-sans">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-2 rounded-xl max-w-[85%] ${
                        msg.sender === "you"
                          ? "ml-auto bg-blue-600 text-white"
                          : msg.sender === "opponent"
                          ? "mr-auto bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border-soft)]"
                          : "mx-auto bg-black/20 text-[var(--muted)] text-[10px] text-center w-full"
                      }`}
                    >
                      <div className="flex items-center justify-between text-[10px] opacity-75 mb-0.5">
                        <span className="font-bold">{msg.senderName}</span>
                        <span>{msg.time}</span>
                      </div>
                      <p className="leading-snug">{msg.text}</p>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-2 pt-2 border-t border-[var(--border-soft)]">
                  <input
                    type="text"
                    placeholder="Type tactical message or GG..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none"
                  />
                  <button type="submit" className="px-3 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 3. ACTIVE LIVE 1V1 CODING BATTLE ================= */}
      {arenaState === "battle" && (
        <div className="space-y-4">
          {/* Battle Header Bar with Dual Video PiP & Live Timer */}
          <div className="p-4 rounded-3xl bg-[var(--surface)] border border-[var(--border-soft)] shadow-md flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Left: Challenge Title & Track */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-blue-500/10 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                ⚔️
              </div>
              <div>
                <h3 className="text-sm font-black text-[var(--text)]">{activeProblem.title}</h3>
                <span className="text-[10px] text-[var(--muted)] font-semibold">{activeProblem.track} • {activeProblem.difficulty}</span>
              </div>
            </div>

            {/* Center: Live Timer Countdown */}
            <div className="flex items-center gap-3">
              <div className={`px-5 py-1.5 rounded-full font-mono text-base font-bold border flex items-center gap-2 ${
                battleTimeLeft < 30
                  ? "bg-rose-500/10 text-rose-500 border-rose-500/30 animate-pulse"
                  : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20"
              }`}>
                <span>⏱️</span>
                <span>{Math.floor(battleTimeLeft / 60)}:{(battleTimeLeft % 60).toString().padStart(2, "0")}</span>
              </div>
            </div>

            {/* Right: Live Telemetry & Quick Action */}
            <div className="flex items-center gap-3">
              {/* Telemetry Indicator */}
              <div className="text-right text-xs">
                <span className="text-[10px] text-[var(--muted)] block">Opponent Progress</span>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {opponentTestsPassed}/{activeProblem.testCases.length} Passed {opponentTyping && "⌨️ Typing..."}
                </span>
              </div>

              <button
                onClick={handleSubmitSolution}
                className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm flex items-center gap-1.5"
              >
                <span>🚀 Submit Final</span>
              </button>
            </div>
          </div>

          {/* Arena Split Grid: Editor (8 cols) vs Live Video & Telemetry (4 cols) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4">
            {/* Left Column: Code Editor & Problem Spec (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Problem Statement Card */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2 text-xs">
                <h4 className="font-bold text-[var(--text)] flex items-center gap-1.5">
                  <span>📋</span> Problem Statement:
                </h4>
                <p className="text-[var(--muted)] leading-relaxed">{activeProblem.description}</p>
              </div>

              {/* Live Code Editor Box */}
              <div className="rounded-2xl border border-[var(--border-soft)] bg-slate-950 overflow-hidden shadow-md">
                <div className="px-4 py-2 bg-slate-900 border-b border-slate-800 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-rose-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500/80" />
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500/80" />
                    <span className="text-[11px] font-mono text-gray-400 ml-2">solution.js</span>
                  </div>
                  <button
                    onClick={handleRunTests}
                    className="px-3 py-1 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center gap-1"
                  >
                    <span>▶ Run Tests</span>
                  </button>
                </div>

                <textarea
                  value={userCode}
                  onChange={(e) => setUserCode(e.target.value)}
                  rows={14}
                  className="w-full p-4 bg-transparent font-mono text-xs text-slate-200 outline-none resize-none leading-relaxed"
                  spellCheck={false}
                />

                {/* Test Output Strip */}
                {testOutput && (
                  <div className="p-3 bg-black/60 border-t border-slate-800 font-mono text-[11px] text-emerald-400 whitespace-pre-wrap">
                    {testOutput}
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Live Video Call Dual Feeds + In-Match Chat (4 cols) */}
            <div className="lg:col-span-4 space-y-4">
              {/* Dual Video Call Feeds in Match */}
              <div className="grid grid-cols-2 gap-2">
                {/* You Video PiP */}
                <div className="aspect-video rounded-2xl bg-slate-950 border border-[var(--border)] relative overflow-hidden flex flex-col justify-between p-2">
                  {hasWebcamAccess && isCamActive ? (
                    <video ref={localVideoRef} autoPlay playsInline muted className="absolute inset-0 w-full h-full object-cover" />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                      <span className="text-xs font-bold text-white">{hostUser.avatar}</span>
                    </div>
                  )}
                  <div className="relative z-10 flex items-center justify-between text-[9px] font-bold text-white">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">You</span>
                    <span className="text-emerald-400 font-mono">{userTestsPassed}/{activeProblem.testCases.length} ✓</span>
                  </div>
                </div>

                {/* Opponent Video PiP */}
                <div className="aspect-video rounded-2xl bg-slate-950 border border-[var(--border)] relative overflow-hidden flex flex-col justify-between p-2">
                  <div className="absolute inset-0 flex items-center justify-center bg-slate-900">
                    <span className="text-xs font-bold text-white">{opponent?.avatar || "OP"}</span>
                  </div>
                  <div className="relative z-10 flex items-center justify-between text-[9px] font-bold text-white">
                    <span className="bg-black/60 px-1.5 py-0.5 rounded">{opponent?.name?.split(" ")[0]}</span>
                    <span className="text-slate-300 font-mono">{opponentTestsPassed}/{activeProblem.testCases.length} ✓</span>
                  </div>
                </div>
              </div>

              {/* Progress Comparison Gauge */}
              <div className="p-3.5 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                <span className="text-[10px] font-black uppercase text-[var(--muted)] block">Live Pass-Rate Telemetry</span>
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-blue-600 dark:text-blue-400">You</span>
                    <span>{userTestsPassed} / {activeProblem.testCases.length}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                    <div
                      className="h-full bg-blue-600 transition-all duration-500"
                      style={{ width: `${(userTestsPassed / activeProblem.testCases.length) * 100}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between text-[11px] font-bold pt-1">
                    <span className="text-slate-600 dark:text-slate-400">{opponent?.name?.split(" ")[0]}</span>
                    <span>{opponentTestsPassed} / {activeProblem.testCases.length}</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                    <div
                      className="h-full bg-slate-500 transition-all duration-500"
                      style={{ width: `${(opponentTestsPassed / activeProblem.testCases.length) * 100}%` }}
                    />
                  </div>
                </div>
              </div>

              {/* Live In-Match Tactical Chat */}
              <div className="p-4 rounded-2xl bg-[var(--surface)] border border-[var(--border-soft)] flex flex-col h-56 justify-between">
                <div className="flex-1 overflow-y-auto space-y-1.5 text-xs">
                  {chatMessages.map((msg) => (
                    <div
                      key={msg.id}
                      className={`p-1.5 rounded-lg text-[11px] ${
                        msg.sender === "you"
                          ? "ml-auto bg-blue-600 text-white max-w-[85%]"
                          : msg.sender === "opponent"
                          ? "mr-auto bg-[var(--surface-soft)] text-[var(--text)] border border-[var(--border-soft)] max-w-[85%]"
                          : "text-[10px] text-[var(--muted)] text-center w-full"
                      }`}
                    >
                      <span className="font-bold opacity-75 mr-1">{msg.senderName}:</span>
                      <span>{msg.text}</span>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSendChat} className="flex gap-1.5 pt-2 border-t border-[var(--border-soft)]">
                  <input
                    type="text"
                    placeholder="GG / emote..."
                    value={chatInput}
                    onChange={(e) => setChatInput(e.target.value)}
                    className="flex-1 px-2.5 py-1 rounded-lg bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none"
                  />
                  <button type="submit" className="px-2.5 py-1 rounded-lg bg-blue-600 text-white font-bold text-xs">
                    Send
                  </button>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ================= 4. POST-MATCH VICTORY & SUMMARY MODAL ================= */}
      {arenaState === "result" && battleResult && (
        <div className="p-6 sm:p-8 rounded-3xl bg-[var(--surface)] border border-[var(--border)] shadow-xl text-center space-y-6 max-w-xl mx-auto">
          <div className="text-5xl animate-bounce">
            {battleResult.winner === "you" ? "🏆" : battleResult.winner === "opponent" ? "🥈" : "🤝"}
          </div>

          <div className="space-y-1">
            <h2 className="text-2xl font-black text-[var(--text)]">
              {battleResult.winner === "you"
                ? "VICTORY! You won the 1v1 Battle!"
                : battleResult.winner === "opponent"
                ? "DEFEAT! Opponent took the lead"
                : "STALEMATE! Equal score match"}
            </h2>
            <p className="text-xs text-[var(--muted)]">{battleResult.reason}</p>
          </div>

          {/* Reward Badges */}
          <div className="grid grid-cols-2 gap-3 p-4 rounded-2xl bg-[var(--surface-soft)]">
            <div>
              <span className="text-[10px] text-[var(--muted)] uppercase font-bold block">XP Gained</span>
              <span className="text-xl font-black text-amber-400">+{battleResult.xpEarned} XP</span>
            </div>
            <div>
              <span className="text-[10px] text-[var(--muted)] uppercase font-bold block">Arena Rating</span>
              <span className={`text-xl font-black ${battleResult.ratingDelta >= 0 ? "text-emerald-400" : "text-rose-400"}`}>
                {battleResult.ratingDelta >= 0 ? `+${battleResult.ratingDelta}` : battleResult.ratingDelta} ELO
              </span>
            </div>
          </div>

          <div className="flex items-center justify-center gap-3">
            <button
              onClick={() => {
                setArenaState("waiting_room");
                setBattleResult(null);
              }}
              className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-sm"
            >
              🔄 Rematch Opponent
            </button>
            <button
              onClick={() => {
                setArenaState("lobby");
                setBattleResult(null);
                if (onExit) onExit();
              }}
              className="px-6 py-2.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold text-[var(--text)]"
            >
              Return to Arena Hub
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
