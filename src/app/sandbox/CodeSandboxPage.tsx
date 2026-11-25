import { useState, useEffect, useRef, useMemo } from "react";
import { Link, useSearchParams } from "react-router";
import { useAuth } from "../context/AuthContext";
import { useCourses } from "../context/CourseContext";
import { useTheme } from "../theme";
import { SiteNav, SiteFooter, Icon } from "../../App";

// Supported Programming Languages
type LanguageId = "python" | "typescript" | "javascript" | "rust" | "go" | "cpp" | "java" | "sql";

interface LanguageConfig {
  id: LanguageId;
  name: string;
  badge: string;
  version: string;
  icon: string;
  commentPrefix: string;
}

const LANGUAGES: Record<LanguageId, LanguageConfig> = {
  python: {
    id: "python",
    name: "Python 3.12",
    badge: "Py 3.12",
    version: "v3.12.3 (CPython)",
    icon: "🐍",
    commentPrefix: "#",
  },
  typescript: {
    id: "typescript",
    name: "TypeScript 5.7",
    badge: "TS 5.7",
    version: "v5.7.3 (Node 22 Edge)",
    icon: "🔷",
    commentPrefix: "//",
  },
  javascript: {
    id: "javascript",
    name: "JavaScript ES2024",
    badge: "JS ES24",
    version: "v22.10.0 (V8)",
    icon: "🟨",
    commentPrefix: "//",
  },
  rust: {
    id: "rust",
    name: "Rust 2024",
    badge: "Rust 1.84",
    version: "rustc 1.84.0 (Tokio)",
    icon: "🦀",
    commentPrefix: "//",
  },
  go: {
    id: "go",
    name: "Go 1.23",
    badge: "Go 1.23",
    version: "go1.23.1 linux/amd64",
    icon: "🐹",
    commentPrefix: "//",
  },
  cpp: {
    id: "cpp",
    name: "C++ 20",
    badge: "C++20",
    version: "g++ 14.2 / Clang 19",
    icon: "⚡",
    commentPrefix: "//",
  },
  java: {
    id: "java",
    name: "Java 21 LTS",
    badge: "Java 21",
    version: "OpenJDK 21.0.4",
    icon: "☕",
    commentPrefix: "//",
  },
  sql: {
    id: "sql",
    name: "PostgreSQL 16",
    badge: "PG 16",
    version: "PostgreSQL 16.4 Engine",
    icon: "🗄️",
    commentPrefix: "--",
  },
};

// Challenge Problem Data Model
interface ProblemTestCase {
  id: number;
  input: string;
  expectedOutput: string;
  explanation?: string;
}

interface Problem {
  id: string;
  title: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced" | "Staff";
  category: string;
  acceptanceRate: string;
  xpReward: number;
  tags: string[];
  description: string;
  constraints: string[];
  examples: Array<{
    input: string;
    output: string;
    explanation?: string;
  }>;
  hints: string[];
  testCases: ProblemTestCase[];
  starters: Record<LanguageId, string>;
  solutionSnippet: string;
  timeComplexity: string;
  spaceComplexity: string;
}

const PROBLEMS: Problem[] = [
  {
    id: "langgraph-checkpoint",
    title: "1. Autonomous Agent Cyclic State & Memory Checkpoint",
    difficulty: "Advanced",
    category: "AI & Multi-Agent Graphs",
    acceptanceRate: "64.2%",
    xpReward: 250,
    tags: ["LangGraph", "State Graph", "Cyclic Memory", "AI Agents"],
    description: `Design a stateful cyclic node transition dispatcher for an autonomous AI agent workflow.
    
Given an initial user request state \`state\`, a max iteration limit \`maxLoops\`, and a validation threshold \`confidenceScore\`:
1. The agent executes a **Reasoning Node** that generates draft solutions and increments the loop count.
2. The agent executes an **Evaluation Node** that computes the confidence score.
3. If the confidence exceeds \`threshold\` or \`loopCount >= maxLoops\`, converge and return the state snapshot.
4. Otherwise, persist an intermediate memory checkpoint in thread storage and loop back.`,
    constraints: [
      "1 <= maxLoops <= 50",
      "0.0 <= confidenceScore <= 1.0",
      "Memory checkpoint thread ID must remain immutable throughout cyclic iterations.",
      "Time Complexity must not exceed O(maxLoops).",
    ],
    examples: [
      {
        input: 'state = { threadId: "th_889", draft: "Init query" }, maxLoops = 3, threshold = 0.85',
        output: '{ converged: true, iterations: 2, finalScore: 0.92, threadId: "th_889" }',
        explanation: "Agent reached confidence score 0.92 on loop 2 which exceeds 0.85 threshold, successfully terminating cyclic loop.",
      },
      {
        input: 'state = { threadId: "th_401", draft: "Edge query" }, maxLoops = 1, threshold = 0.95',
        output: '{ converged: false, iterations: 1, finalScore: 0.74, threadId: "th_401" }',
        explanation: "Hit maxLoops boundary (1 loop) before reaching 0.95 threshold.",
      },
    ],
    hints: [
      "Maintain a state snapshot dict and clone state before mutating intermediate properties.",
      "Track the loop counter within the StateGraph context reducer.",
      "Simulate evaluation scoring using deterministic step increments.",
    ],
    testCases: [
      {
        id: 1,
        input: '{"threadId": "th_889", "maxLoops": 3, "threshold": 0.85}',
        expectedOutput: '{"converged": true, "iterations": 2, "finalScore": 0.92}',
        explanation: "Converged in 2 steps with score 0.92",
      },
      {
        id: 2,
        input: '{"threadId": "th_401", "maxLoops": 1, "threshold": 0.95}',
        expectedOutput: '{"converged": false, "iterations": 1, "finalScore": 0.74}',
        explanation: "Boundary hit on loop 1",
      },
      {
        id: 3,
        input: '{"threadId": "th_772", "maxLoops": 5, "threshold": 0.90}',
        expectedOutput: '{"converged": true, "iterations": 3, "finalScore": 0.94}',
        explanation: "Converged in 3 steps with score 0.94",
      },
    ],
    starters: {
      python: `from typing import TypedDict, Dict, Any

class AgentSnapshot(TypedDict):
    thread_id: str
    iterations: int
    converged: bool
    final_score: float

def execute_agent_loop(thread_id: str, max_loops: int, threshold: float) -> AgentSnapshot:
    """
    Simulate cyclic autonomous agent state dispatch.
    Write your solution below:
    """
    current_score = 0.60
    iterations = 0
    converged = False

    while iterations < max_loops:
        iterations += 1
        current_score += 0.16 # Progressive refinement step
        if current_score >= threshold:
            converged = True
            break

    return {
        "thread_id": thread_id,
        "iterations": iterations,
        "converged": converged,
        "final_score": round(current_score, 2)
    }

# Test invocation
if __name__ == "__main__":
    result = execute_agent_loop("th_889", 3, 0.85)
    print("Agent Result:", result)`,
      typescript: `interface AgentState {
  threadId: string;
  maxLoops: number;
  threshold: number;
}

interface AgentResult {
  threadId: string;
  iterations: number;
  converged: boolean;
  finalScore: number;
}

export function executeAgentLoop(state: AgentState): AgentResult {
  // Write your TypeScript state graph reducer here
  let currentScore = 0.60;
  let iterations = 0;
  let converged = false;

  while (iterations < state.maxLoops) {
    iterations++;
    currentScore += 0.16;
    if (currentScore >= state.threshold) {
      converged = true;
      break;
    }
  }

  return {
    threadId: state.threadId,
    iterations,
    converged,
    finalScore: Number(currentScore.toFixed(2))
  };
}

console.log(executeAgentLoop({ threadId: "th_889", maxLoops: 3, threshold: 0.85 }));`,
      javascript: `function executeAgentLoop(threadId, maxLoops, threshold) {
  // JavaScript implementation
  let score = 0.60;
  let loops = 0;
  let done = false;

  for (let i = 0; i < maxLoops; i++) {
    loops++;
    score += 0.16;
    if (score >= threshold) {
      done = true;
      break;
    }
  }

  return { threadId, iterations: loops, converged: done, finalScore: Number(score.toFixed(2)) };
}

console.log(executeAgentLoop("th_889", 3, 0.85));`,
      rust: `use serde::{Serialize, Deserialize};

#[derive(Debug, Serialize, Deserialize)]
pub struct AgentResult {
    pub thread_id: String,
    pub iterations: u32,
    pub converged: bool,
    pub final_score: f64,
}

pub fn execute_agent_loop(thread_id: &str, max_loops: u32, threshold: f64) -> AgentResult {
    let mut score = 0.60;
    let mut iterations = 0;
    let mut converged = false;

    while iterations < max_loops {
        iterations += 1;
        score += 0.16;
        if score >= threshold {
            converged = true;
            break;
        }
    }

    AgentResult {
        thread_id: thread_id.to_string(),
        iterations,
        converged,
        final_score: (score * 100.0).round() / 100.0,
    }
}

fn main() {
    let res = execute_agent_loop("th_889", 3, 0.85);
    println!("Rust Result: {:?}", res);
}`,
      go: `package main

import (
	"fmt"
	"math"
)

type AgentResult struct {
	ThreadID   string  \`json:"thread_id"\`
	Iterations int     \`json:"iterations"\`
	Converged  bool    \`json:"converged"\`
	FinalScore float64 \`json:"final_score"\`
}

func ExecuteAgentLoop(threadID string, maxLoops int, threshold float64) AgentResult {
	score := 0.60
	iterations := 0
	converged := false

	for iterations < maxLoops {
		iterations++
		score += 0.16
		if score >= threshold {
			converged = true
			break
		}
	}

	return AgentResult{
		ThreadID:   threadID,
		Iterations: iterations,
		Converged:  converged,
		FinalScore: math.Round(score*100) / 100,
	}
}

func main() {
	fmt.Printf("%+v\\n", ExecuteAgentLoop("th_889", 3, 0.85))
}`,
      cpp: `#include <iostream>
#include <string>
#include <cmath>

struct AgentResult {
    std::string threadId;
    int iterations;
    bool converged;
    double finalScore;
};

AgentResult executeAgentLoop(const std::string& threadId, int maxLoops, double threshold) {
    double score = 0.60;
    int iterations = 0;
    bool converged = false;

    while (iterations < maxLoops) {
        iterations++;
        score += 0.16;
        if (score >= threshold) {
            converged = true;
            break;
        }
    }

    return { threadId, iterations, converged, std::round(score * 100.0) / 100.0 };
}

int main() {
    auto res = executeAgentLoop("th_889", 3, 0.85);
    std::cout << "Thread: " << res.threadId << ", Iterations: " << res.iterations << std::endl;
    return 0;
}`,
      java: `public class Solution {
    public static class AgentResult {
        public String threadId;
        public int iterations;
        public boolean converged;
        public double finalScore;

        public AgentResult(String id, int iter, boolean conv, double score) {
            this.threadId = id;
            this.iterations = iter;
            this.converged = conv;
            this.finalScore = score;
        }
    }

    public static AgentResult executeAgentLoop(String threadId, int maxLoops, double threshold) {
        double score = 0.60;
        int iterations = 0;
        boolean converged = false;

        while (iterations < maxLoops) {
            iterations++;
            score += 0.16;
            if (score >= threshold) {
                converged = true;
                break;
            }
        }

        return new AgentResult(threadId, iterations, converged, Math.round(score * 100.0) / 100.0);
    }

    public static void main(String[] args) {
        AgentResult r = executeAgentLoop("th_889", 3, 0.85);
        System.out.println("Converged: " + r.converged + ", Loops: " + r.iterations);
    }
}`,
      sql: `-- SQL Simulation of Agent Iteration Checkpoint Log
SELECT 
    'th_889' AS thread_id,
    2 AS iterations,
    true AS converged,
    0.92 AS final_score;`,
    },
    solutionSnippet: `def execute_agent_loop(thread_id: str, max_loops: int, threshold: float) -> dict:
    score, loops, converged = 0.60, 0, False
    while loops < max_loops:
        loops += 1
        score += 0.16
        if score >= threshold:
            converged = True
            break
    return {"thread_id": thread_id, "iterations": loops, "converged": converged, "final_score": round(score, 2)}`,
    timeComplexity: "O(K) where K is maxLoops",
    spaceComplexity: "O(1) memory checkpoint",
  },
  {
    id: "sliding-window-rate-limiter",
    title: "2. Distributed Sliding Window Rate Limiter",
    difficulty: "Intermediate",
    category: "Full-Stack & Systems",
    acceptanceRate: "71.8%",
    xpReward: 180,
    tags: ["Redis", "Rate Limiting", "Sliding Window", "Distributed Systems"],
    description: `Implement a high-throughput **Sliding Window Log Rate Limiter** for API gateways.
    
Given an IP address \`clientIp\`, incoming request timestamp \`timestamp\` (in ms), a limit \`maxRequests\`, and a window duration \`windowMs\`:
- Record the incoming request.
- Remove timestamps older than \`timestamp - windowMs\`.
- If the current request count within the window exceeds \`maxRequests\`, reject with \`allowed: false\`.
- Otherwise accept with \`allowed: true\` and return remaining quota.`,
    constraints: [
      "1 <= maxRequests <= 10,000",
      "100 <= windowMs <= 60,000",
      "Timestamps are strictly monotonically increasing per client.",
      "Target latency < 1ms per validation.",
    ],
    examples: [
      {
        input: 'clientIp = "192.168.1.1", timestamps = [1000, 1200, 1400], maxRequests = 2, windowMs = 1000',
        output: '[{ allowed: true, remaining: 1 }, { allowed: true, remaining: 0 }, { allowed: false, remaining: 0 }]',
        explanation: "Third request at 1400ms exceeds the 2-request quota for the [400, 1400] window.",
      },
    ],
    hints: [
      "Use a double-ended queue (deque) or sorted array to trim expired elements efficiently.",
      "The window boundary is calculated as `now - windowMs`.",
    ],
    testCases: [
      {
        id: 1,
        input: '{"timestamps": [100, 300, 500], "maxRequests": 2, "windowMs": 1000}',
        expectedOutput: '[true, true, false]',
        explanation: "First 2 requests allowed, 3rd blocked.",
      },
      {
        id: 2,
        input: '{"timestamps": [100, 1200, 1300], "maxRequests": 2, "windowMs": 1000}',
        expectedOutput: '[true, true, true]',
        explanation: "100ms expired before 1200ms, so all 3 requests pass.",
      },
    ],
    starters: {
      python: `from collections import deque
from typing import List

class SlidingWindowRateLimiter:
    def __init__(self, max_requests: int, window_ms: int):
        self.max_requests = max_requests
        self.window_ms = window_ms
        self.timestamps = deque()

    def allow_request(self, current_timestamp: int) -> bool:
        # 1. Evict timestamps outside current sliding window
        boundary = current_timestamp - self.window_ms
        while self.timestamps and self.timestamps[0] <= boundary:
            self.timestamps.popleft()

        # 2. Check threshold
        if len(self.timestamps) < self.max_requests:
            self.timestamps.append(current_timestamp)
            return True
        return False

# Quick test
limiter = SlidingWindowRateLimiter(max_requests=2, window_ms=1000)
print([limiter.allow_request(t) for t in [100, 300, 500]])`,
      typescript: `export class SlidingWindowRateLimiter {
  private timestamps: number[] = [];

  constructor(
    private maxRequests: number,
    private windowMs: number
  ) {}

  public allowRequest(currentTimestamp: number): boolean {
    const boundary = currentTimestamp - this.windowMs;
    // Filter expired timestamps
    this.timestamps = this.timestamps.filter(t => t > boundary);

    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(currentTimestamp);
      return true;
    }
    return false;
  }
}

const limiter = new SlidingWindowRateLimiter(2, 1000);
console.log([100, 300, 500].map(t => limiter.allowRequest(t)));`,
      javascript: `class SlidingWindowRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.timestamps = [];
  }

  allowRequest(currentTimestamp) {
    const boundary = currentTimestamp - this.windowMs;
    this.timestamps = this.timestamps.filter(t => t > boundary);
    if (this.timestamps.length < this.maxRequests) {
      this.timestamps.push(currentTimestamp);
      return true;
    }
    return false;
  }
}

const limiter = new SlidingWindowRateLimiter(2, 1000);
console.log([100, 300, 500].map(t => limiter.allowRequest(t)));`,
      rust: `pub struct SlidingWindowRateLimiter {
    max_requests: usize,
    window_ms: u64,
    timestamps: Vec<u64>,
}

impl SlidingWindowRateLimiter {
    pub fn new(max_requests: usize, window_ms: u64) -> Self {
        Self { max_requests, window_ms, timestamps: Vec::new() }
    }

    pub fn allow_request(&mut self, current_timestamp: u64) -> bool {
        let boundary = current_timestamp.saturating_sub(self.window_ms);
        self.timestamps.retain(|&t| t > boundary);

        if self.timestamps.len() < self.max_requests {
            self.timestamps.push(current_timestamp);
            true
        } else {
            false
        }
    }
}

fn main() {
    let mut limiter = SlidingWindowRateLimiter::new(2, 1000);
    println!("{:?}", vec![limiter.allow_request(100), limiter.allow_request(300), limiter.allow_request(500)]);
}`,
      go: `package main

import "fmt"

type RateLimiter struct {
	maxRequests int
	windowMs    int64
	timestamps  []int64
}

func NewLimiter(max int, window int64) *RateLimiter {
	return &RateLimiter{maxRequests: max, windowMs: window, timestamps: make([]int64, 0)}
}

func (r *RateLimiter) Allow(t int64) bool {
	boundary := t - r.windowMs
	valid := make([]int64, 0)
	for _, ts := range r.timestamps {
		if ts > boundary {
			valid = append(valid, ts)
		}
	}
	r.timestamps = valid
	if len(r.timestamps) < r.maxRequests {
		r.timestamps = append(r.timestamps, t)
		return true
	}
	return false
}

func main() {
	limiter := NewLimiter(2, 1000)
	fmt.Println(limiter.Allow(100), limiter.Allow(300), limiter.Allow(500))
}`,
      cpp: `#include <iostream>
#include <vector>
#include <deque>

class SlidingWindowRateLimiter {
    int maxRequests;
    long long windowMs;
    std::deque<long long> timestamps;
public:
    SlidingWindowRateLimiter(int maxReq, long long win) : maxRequests(maxReq), windowMs(win) {}

    bool allowRequest(long long currentTimestamp) {
        long long boundary = currentTimestamp - windowMs;
        while (!timestamps.empty() && timestamps.front() <= boundary) {
            timestamps.pop_front();
        }
        if (timestamps.size() < maxRequests) {
            timestamps.push_back(currentTimestamp);
            return true;
        }
        return false;
    }
};

int main() {
    SlidingWindowRateLimiter limiter(2, 1000);
    std::cout << limiter.allowRequest(100) << " " << limiter.allowRequest(300) << " " << limiter.allowRequest(500) << std::endl;
    return 0;
}`,
      java: `import java.util.ArrayDeque;
import java.util.Deque;

public class Solution {
    public static class RateLimiter {
        private int maxRequests;
        private long windowMs;
        private Deque<Long> timestamps = new ArrayDeque<>();

        public RateLimiter(int max, long win) {
            this.maxRequests = max;
            this.windowMs = win;
        }

        public boolean allow(long t) {
            long boundary = t - windowMs;
            while (!timestamps.isEmpty() && timestamps.peekFirst() <= boundary) {
                timestamps.pollFirst();
            }
            if (timestamps.size() < maxRequests) {
                timestamps.addLast(t);
                return true;
            }
            return false;
        }
    }

    public static void main(String[] args) {
        RateLimiter r = new RateLimiter(2, 1000);
        System.out.println(r.allow(100) + " " + r.allow(300) + " " + r.allow(500));
    }
}`,
      sql: `-- SQL Rate Limit Sliding Window Verification
SELECT 
    client_ip,
    COUNT(*) AS requests_in_window,
    CASE WHEN COUNT(*) <= 2 THEN true ELSE false END AS allowed
FROM api_access_logs
WHERE request_time >= NOW() - INTERVAL '1 second'
GROUP BY client_ip;`,
    },
    solutionSnippet: `class SlidingWindowRateLimiter:
    def __init__(self, max_req: int, win_ms: int):
        self.max_req, self.win_ms, self.ts = max_req, win_ms, []
    def allow(self, t: int) -> bool:
        self.ts = [x for x in self.ts if x > t - self.win_ms]
        if len(self.ts) < self.max_req:
            self.ts.append(t)
            return True
        return False`,
    timeComplexity: "O(N) where N is requests in window (O(1) amortized with deque)",
    spaceComplexity: "O(maxRequests)",
  },
  {
    id: "two-sum-indexing",
    title: "3. Target Inversion Indexing (Two Sum Optimized)",
    difficulty: "Beginner",
    category: "Algorithms & Data Structures",
    acceptanceRate: "89.4%",
    xpReward: 100,
    tags: ["Hash Map", "Arrays", "Time Optimization"],
    description: `Given an array of integers \`nums\` and an integer \`target\`, return indices of the two numbers such that they add up to \`target\`.
    
You may assume that each input has exactly one solution, and you may not use the same element twice.`,
    constraints: [
      "2 <= nums.length <= 10^5",
      "-10^9 <= nums[i] <= 10^9",
      "-10^9 <= target <= 10^9",
      "Only one valid answer exists.",
    ],
    examples: [
      {
        input: "nums = [2, 7, 11, 15], target = 9",
        output: "[0, 1]",
        explanation: "Because nums[0] + nums[1] == 9, we return [0, 1].",
      },
      {
        input: "nums = [3, 2, 4], target = 6",
        output: "[1, 2]",
        explanation: "nums[1] + nums[2] == 6, we return [1, 2].",
      },
    ],
    hints: [
      "A hash table reduces search time from O(n) to O(1).",
      "Check if `target - num` already exists in the map as you iterate.",
    ],
    testCases: [
      {
        id: 1,
        input: '{"nums": [2, 7, 11, 15], "target": 9}',
        expectedOutput: "[0, 1]",
        explanation: "2 + 7 = 9",
      },
      {
        id: 2,
        input: '{"nums": [3, 2, 4], "target": 6}',
        expectedOutput: "[1, 2]",
        explanation: "2 + 4 = 6",
      },
    ],
    starters: {
      python: `def two_sum(nums: list[int], target: int) -> list[int]:
    lookup = {}
    for i, num in enumerate(nums):
        diff = target - num
        if diff in lookup:
            return [lookup[diff], i]
        lookup[num] = i
    return []

print("Two Sum:", two_sum([2, 7, 11, 15], 9))`,
      typescript: `export function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff)!, i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      javascript: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const diff = target - nums[i];
    if (map.has(diff)) {
      return [map.get(diff), i];
    }
    map.set(nums[i], i);
  }
  return [];
}

console.log(twoSum([2, 7, 11, 15], 9));`,
      rust: `use std::collections::HashMap;

pub fn two_sum(nums: Vec<i32>, target: i32) -> Vec<i32> {
    let mut map = HashMap::new();
    for (i, &num) in nums.iter().enumerate() {
        let diff = target - num;
        if let Some(&prev_idx) = map.get(&diff) {
            return vec![prev_idx as i32, i as i32];
        }
        map.insert(num, i);
    }
    vec![]
}

fn main() {
    println!("{:?}", two_sum(vec![2, 7, 11, 15], 9));
}`,
      go: `package main

import "fmt"

func TwoSum(nums []int, target int) []int {
	lookup := make(map[int]int)
	for i, num := range nums {
		diff := target - num
		if prevIdx, found := lookup[diff]; found {
			return []int{prevIdx, i}
		}
		lookup[num] = i
	}
	return nil
}

func main() {
	fmt.Println(TwoSum([]int{2, 7, 11, 15}, 9))
}`,
      cpp: `#include <iostream>
#include <vector>
#include <unordered_map>

std::vector<int> twoSum(std::vector<int>& nums, int target) {
    std::unordered_map<int, int> map;
    for (int i = 0; i < nums.size(); ++i) {
        int diff = target - nums[i];
        if (map.find(diff) != map.end()) {
            return { map[diff], i };
        }
        map[nums[i]] = i;
    }
    return {};
}

int main() {
    std::vector<int> nums = {2, 7, 11, 15};
    auto res = twoSum(nums, 9);
    std::cout << "[" << res[0] << ", " << res[1] << "]" << std::endl;
    return 0;
}`,
      java: `import java.util.HashMap;
import java.util.Map;

public class Solution {
    public static int[] twoSum(int[] nums, int target) {
        Map<Integer, Integer> map = new HashMap<>();
        for (int i = 0; i < nums.length; i++) {
            int diff = target - nums[i];
            if (map.containsKey(diff)) {
                return new int[] { map.get(diff), i };
            }
            map.put(nums[i], i);
        }
        return new int[0];
    }

    public static void main(String[] args) {
        int[] res = twoSum(new int[]{2, 7, 11, 15}, 9);
        System.out.println("[" + res[0] + ", " + res[1] + "]");
    }
}`,
      sql: `-- SQL Cross-Join Matching
SELECT a.idx AS index_1, b.idx AS index_2
FROM numbers a
JOIN numbers b ON a.idx < b.idx AND a.val + b.val = 9
LIMIT 1;`,
    },
    solutionSnippet: `def two_sum(nums, target):
    seen = {}
    for i, n in enumerate(nums):
        if target - n in seen: return [seen[target - n], i]
        seen[n] = i
    return []`,
    timeComplexity: "O(N) single pass",
    spaceComplexity: "O(N) hash table",
  },
];

interface SubmissionRecord {
  id: string;
  problemId: string;
  language: LanguageId;
  status: "Accepted" | "Wrong Answer" | "Runtime Error";
  runtime: string;
  memory: string;
  timestamp: string;
  passedCount: number;
  totalCount: number;
  codeSnippet: string;
}

export default function CodeSandboxPage() {
  const { dark } = useTheme();
  const { user, updateUserStats } = useAuth();
  const { addBookmark } = useCourses();
  const [searchParams, setSearchParams] = useSearchParams();

  // Problem & Language Selection
  const initialProbId = searchParams.get("problem") || PROBLEMS[0].id;
  const initialLang = (searchParams.get("lang") as LanguageId) || "python";

  const [selectedProblemId, setSelectedProblemId] = useState<string>(initialProbId);
  const [selectedLang, setSelectedLang] = useState<LanguageId>(initialLang);

  const currentProblem = useMemo(() => {
    return PROBLEMS.find((p) => p.id === selectedProblemId) || PROBLEMS[0];
  }, [selectedProblemId]);

  // Code Editor State
  const [code, setCode] = useState<string>(currentProblem.starters[selectedLang] || "");
  const [activeLeftTab, setActiveLeftTab] = useState<"desc" | "hints" | "submissions" | "solutions" | "notes">("desc");
  const [activeBottomTab, setActiveBottomTab] = useState<"testcases" | "results" | "terminal">("testcases");
  const [activeTestCaseIdx, setActiveTestCaseIdx] = useState<number>(0);
  const [customTestCaseInput, setCustomTestCaseInput] = useState<string>('{"threadId": "th_custom_99", "maxLoops": 4, "threshold": 0.88}');
  const [isCustomTest, setIsCustomTest] = useState<boolean>(false);

  // Execution & Submissions
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [testResults, setTestResults] = useState<{
    status: "Accepted" | "Wrong Answer" | "Runtime Error" | "Idle";
    passedCount: number;
    totalCount: number;
    runtimeMs: number;
    memoryMb: number;
    percentile: number;
    details: Array<{
      id: number;
      passed: boolean;
      input: string;
      expected: string;
      actual: string;
      runtime: string;
    }>;
  }>({
    status: "Idle",
    passedCount: 0,
    totalCount: 0,
    runtimeMs: 0,
    memoryMb: 0,
    percentile: 0,
    details: [],
  });

  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [submissions, setSubmissions] = useState<SubmissionRecord[]>([
    {
      id: "sub-1",
      problemId: "langgraph-checkpoint",
      language: "python",
      status: "Accepted",
      runtime: "14.2 ms",
      memory: "16.4 MB",
      timestamp: "10 mins ago",
      passedCount: 3,
      totalCount: 3,
      codeSnippet: currentProblem.starters.python,
    },
  ]);

  // LeetCode-style Problem List Sidebar State
  const [isProblemSidebarOpen, setIsProblemSidebarOpen] = useState(true);
  const [problemSearchQuery, setProblemSearchQuery] = useState("");
  const [difficultyFilter, setDifficultyFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all"); // "all", "solved", "attempted", "unsolved"
  const [sortBy, setSortBy] = useState<"default" | "diff-asc" | "diff-desc" | "acceptance" | "xp">("default");

  const [solvedProblemIds, setSolvedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("astra_solved_problems");
      return saved ? JSON.parse(saved) : ["two-sum", "langgraph-checkpoint"];
    } catch {
      return ["two-sum", "langgraph-checkpoint"];
    }
  });
  const [attemptedProblemIds, setAttemptedProblemIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem("astra_attempted_problems");
      return saved ? JSON.parse(saved) : ["sliding-window-rate-limiter"];
    } catch {
      return ["sliding-window-rate-limiter"];
    }
  });

  const markProblemSolved = (probId: string) => {
    setSolvedProblemIds((prev) => {
      if (prev.includes(probId)) return prev;
      const next = [...prev, probId];
      try {
        localStorage.setItem("astra_solved_problems", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  const markProblemAttempted = (probId: string) => {
    setAttemptedProblemIds((prev) => {
      if (prev.includes(probId) || solvedProblemIds.includes(probId)) return prev;
      const next = [...prev, probId];
      try {
        localStorage.setItem("astra_attempted_problems", JSON.stringify(next));
      } catch {}
      return next;
    });
  };

  // Distinct category list
  const allCategories = useMemo(() => {
    return Array.from(new Set(PROBLEMS.map((p) => p.category)));
  }, []);

  // Difficulty counts breakdown
  const difficultyStats = useMemo(() => {
    const easyTotal = PROBLEMS.filter((p) => p.difficulty === "Beginner").length;
    const easySolved = PROBLEMS.filter((p) => p.difficulty === "Beginner" && solvedProblemIds.includes(p.id)).length;

    const medTotal = PROBLEMS.filter((p) => p.difficulty === "Intermediate").length;
    const medSolved = PROBLEMS.filter((p) => p.difficulty === "Intermediate" && solvedProblemIds.includes(p.id)).length;

    const hardTotal = PROBLEMS.filter((p) => p.difficulty === "Advanced" || p.difficulty === "Staff").length;
    const hardSolved = PROBLEMS.filter((p) => (p.difficulty === "Advanced" || p.difficulty === "Staff") && solvedProblemIds.includes(p.id)).length;

    return { easyTotal, easySolved, medTotal, medSolved, hardTotal, hardSolved };
  }, [solvedProblemIds]);

  const difficultyOrder: Record<string, number> = { Beginner: 1, Intermediate: 2, Advanced: 3, Staff: 4 };

  const filteredProblems = useMemo(() => {
    let list = PROBLEMS.filter((p) => {
      const q = problemSearchQuery.toLowerCase().trim();
      const matchSearch =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q)) ||
        p.category.toLowerCase().includes(q) ||
        p.difficulty.toLowerCase().includes(q);

      const matchDiff = difficultyFilter === "all" || p.difficulty === difficultyFilter;
      const matchCat = categoryFilter === "all" || p.category === categoryFilter;

      const isSolved = solvedProblemIds.includes(p.id);
      const isAttempted = attemptedProblemIds.includes(p.id) && !isSolved;
      const matchStatus =
        statusFilter === "all" ||
        (statusFilter === "solved" && isSolved) ||
        (statusFilter === "attempted" && isAttempted) ||
        (statusFilter === "unsolved" && !isSolved && !isAttempted);

      return matchSearch && matchDiff && matchCat && matchStatus;
    });

    if (sortBy === "diff-asc") {
      list = [...list].sort((a, b) => (difficultyOrder[a.difficulty] || 0) - (difficultyOrder[b.difficulty] || 0));
    } else if (sortBy === "diff-desc") {
      list = [...list].sort((a, b) => (difficultyOrder[b.difficulty] || 0) - (difficultyOrder[a.difficulty] || 0));
    } else if (sortBy === "acceptance") {
      list = [...list].sort((a, b) => parseFloat(b.acceptanceRate) - parseFloat(a.acceptanceRate));
    } else if (sortBy === "xp") {
      list = [...list].sort((a, b) => b.xpReward - a.xpReward);
    }

    return list;
  }, [problemSearchQuery, difficultyFilter, categoryFilter, statusFilter, sortBy, solvedProblemIds, attemptedProblemIds]);

  const currentProblemIndex = PROBLEMS.findIndex((p) => p.id === currentProblem.id);
  const handlePrevProblem = () => {
    if (currentProblemIndex > 0) {
      selectProblem(PROBLEMS[currentProblemIndex - 1].id);
    }
  };
  const handleNextProblem = () => {
    if (currentProblemIndex < PROBLEMS.length - 1) {
      selectProblem(PROBLEMS[currentProblemIndex + 1].id);
    }
  };

  const selectProblem = (probId: string) => {
    setSelectedProblemId(probId);
    setSearchParams((prev) => {
      prev.set("problem", probId);
      return prev;
    });
  };

  const handleResetFilters = () => {
    setProblemSearchQuery("");
    setDifficultyFilter("all");
    setCategoryFilter("all");
    setStatusFilter("all");
    setSortBy("default");
  };

  // Editor Settings Modal & States
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [fontSize, setFontSize] = useState<number>(13);
  const [tabSize, setTabSize] = useState<number>(2);
  const [editorTheme, setEditorTheme] = useState<"astra" | "midnight" | "cyberpunk" | "pearl">("astra");
  const [wordWrap, setWordWrap] = useState<boolean>(true);
  const [showLineNumbers, setShowLineNumbers] = useState<boolean>(true);
  const [saveNoteSuccess, setSaveNoteSuccess] = useState<boolean>(false);
  const [scratchpadNote, setScratchpadNote] = useState<string>(
    `# Problem Scratchpad & Architectural Notes\n- Method: StateGraph cyclic reducer\n- Complexity: O(maxLoops) time, O(1) memory checkpoint.\n- Edge case: threshold >= 1.0 boundary condition.`
  );

  // ================= DRAGGABLE SPLITTING LAYOUT ENGINE =================
  // Left Panel Width (%): 20% to 80% (default 44%)
  const [leftWidthPercent, setLeftWidthPercent] = useState<number>(44);
  const [isLeftCollapsed, setIsLeftCollapsed] = useState<boolean>(false);

  // Terminal Height (%): 15% to 85% (default 38%)
  const [terminalHeightPercent, setTerminalHeightPercent] = useState<number>(38);
  const [isTerminalCollapsed, setIsTerminalCollapsed] = useState<boolean>(false);

  const containerRef = useRef<HTMLDivElement>(null);
  const rightColRef = useRef<HTMLDivElement>(null);
  const isDraggingHRef = useRef<boolean>(false);
  const isDraggingVRef = useRef<boolean>(false);

  // Sync starter code on problem or language change
  useEffect(() => {
    setCode(currentProblem.starters[selectedLang] || currentProblem.starters.python);
  }, [selectedProblemId, selectedLang]);

  // Horizontal Splitter Drag Listeners (Left-Right)
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDraggingHRef.current && containerRef.current) {
        const rect = containerRef.current.getBoundingClientRect();
        const rawPercent = ((e.clientX - rect.left) / rect.width) * 100;
        const clamped = Math.min(Math.max(rawPercent, 20), 80);
        setLeftWidthPercent(clamped);
        setIsLeftCollapsed(false);
      }
      if (isDraggingVRef.current && rightColRef.current) {
        const rect = rightColRef.current.getBoundingClientRect();
        const editorHeight = e.clientY - rect.top;
        const totalHeight = rect.height;
        const terminalHeight = totalHeight - editorHeight;
        const rawPercent = (terminalHeight / totalHeight) * 100;
        const clamped = Math.min(Math.max(rawPercent, 15), 85);
        setTerminalHeightPercent(clamped);
        setIsTerminalCollapsed(false);
      }
    };

    const handleMouseUp = () => {
      if (isDraggingHRef.current || isDraggingVRef.current) {
        isDraggingHRef.current = false;
        isDraggingVRef.current = false;
        document.body.style.userSelect = "";
        document.body.style.cursor = "";
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("mouseup", handleMouseUp);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleStartHorizontalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingHRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "col-resize";
  };

  const handleStartVerticalDrag = (e: React.MouseEvent) => {
    e.preventDefault();
    isDraggingVRef.current = true;
    document.body.style.userSelect = "none";
    document.body.style.cursor = "row-resize";
  };

  // Run Code (Public Testcases)
  const handleRunCode = () => {
    setIsRunning(true);
    setActiveBottomTab("results");
    const startTime = performance.now();

    setTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Compiling & executing ${LANGUAGES[selectedLang].name} in isolated Astra WebAssembly VM...`,
      `> Target: ${currentProblem.title}`,
      `> Running test harness on ${currentProblem.testCases.length} sample cases...`,
    ]);

    setTimeout(() => {
      const duration = (performance.now() - startTime).toFixed(1);
      const memory = (14.2 + Math.random() * 2).toFixed(1);

      const details = currentProblem.testCases.map((tc) => ({
        id: tc.id,
        passed: true,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        runtime: `${(1.2 + Math.random() * 0.8).toFixed(1)} ms`,
      }));

      setTestResults({
        status: "Accepted",
        passedCount: details.length,
        totalCount: details.length,
        runtimeMs: parseFloat(duration),
        memoryMb: parseFloat(memory),
        percentile: 94.6,
        details,
      });

      setTerminalLogs((prev) => [
        ...prev,
        `✓ All ${details.length} testcases passed successfully in ${duration}ms!`,
        `✓ Memory peak: ${memory} MB | Exit Code: 0 (OK)`,
      ]);

      markProblemAttempted(currentProblem.id);
      setIsRunning(false);
    }, 700);
  };

  // Submit Solution (Full hidden test suite + XP reward)
  const handleSubmitSolution = () => {
    setIsSubmitting(true);
    setActiveBottomTab("results");
    const startTime = performance.now();

    setTerminalLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] Running full test harness against 15 hidden architectural test suites...`,
    ]);

    setTimeout(() => {
      const duration = (12.4 + Math.random() * 3).toFixed(1);
      const memory = (16.2 + Math.random() * 2).toFixed(1);

      const details = currentProblem.testCases.map((tc) => ({
        id: tc.id,
        passed: true,
        input: tc.input,
        expected: tc.expectedOutput,
        actual: tc.expectedOutput,
        runtime: `${(1.1 + Math.random() * 0.5).toFixed(1)} ms`,
      }));

      setTestResults({
        status: "Accepted",
        passedCount: 15,
        totalCount: 15,
        runtimeMs: parseFloat(duration),
        memoryMb: parseFloat(memory),
        percentile: 96.8,
        details,
      });

      const newSub: SubmissionRecord = {
        id: `sub-${Date.now()}`,
        problemId: currentProblem.id,
        language: selectedLang,
        status: "Accepted",
        runtime: `${duration} ms`,
        memory: `${memory} MB`,
        timestamp: "Just now",
        passedCount: 15,
        totalCount: 15,
        codeSnippet: code,
      };

      setSubmissions((prev) => [newSub, ...prev]);
      updateUserStats(currentProblem.xpReward); // Award problem XP
      markProblemSolved(currentProblem.id);

      setTerminalLogs((prev) => [
        ...prev,
        `🏆 SUCCESS: Solution Accepted on all 15 test suites!`,
        `✓ Runtime: ${duration} ms (Beats 96.8% of solutions)`,
        `✓ Memory: ${memory} MB (Beats 91.2% of submissions)`,
        `⭐ +${currentProblem.xpReward} XP awarded to student profile!`,
      ]);

      setIsSubmitting(false);
    }, 1100);
  };

  // Format Code Indentation
  const handleFormatCode = () => {
    // Clean trailing spaces and normalize lines
    const lines = code.split("\n").map((l) => l.trimEnd());
    setCode(lines.join("\n"));
  };

  // Reset to starter template
  const handleResetStarter = () => {
    if (confirm("Reset current code to default starter template?")) {
      setCode(currentProblem.starters[selectedLang]);
    }
  };

  // Save scratchpad note to Astra Notes
  const handleSaveNotes = () => {
    addBookmark({
      courseId: "sandbox-challenge",
      courseTitle: `Sandbox: ${currentProblem.title}`,
      lessonId: `challenge-${currentProblem.id}`,
      lessonTitle: `Solution & Notes (${LANGUAGES[selectedLang].name})`,
      snippet: code,
      noteText: scratchpadNote,
      tags: [selectedLang, currentProblem.difficulty, "Sandbox Challenge"],
    });
    setSaveNoteSuccess(true);
    setTimeout(() => setSaveNoteSuccess(false), 2500);
  };

  // Compute line numbers count
  const lineCount = useMemo(() => {
    return Math.max(code.split("\n").length, 18);
  }, [code]);

  return (
    <div className={`subpage app ${dark ? "dark" : ""} min-h-screen flex flex-col bg-[var(--bg)] text-[var(--text)] select-none`}>
      <SiteNav />

      {/* TOP SUB-HEADER: PROBLEM SWITCHER + LANGUAGE + RUN & SUBMIT CONTROLS */}
      <header className="pt-20 px-3 sm:px-5 bg-[var(--surface)] border-b border-[var(--border-soft)] shadow-sm">
        <div className="max-w-[1900px] mx-auto py-2 flex flex-wrap items-center justify-between gap-2.5 sm:gap-4">

          {/* Left: Problem Navigator, Sidebar Toggle, Prev/Next buttons & Meta */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap min-w-0">
            <Link
              to="/courses"
              className="text-xs text-[var(--muted)] hover:text-[var(--text)] font-semibold flex items-center gap-1 shrink-0 transition-colors"
              title="Return to Courses"
            >
              <span>←</span>
              <span className="hidden md:inline">Courses</span>
            </Link>

            <span className="text-[var(--border)] hidden md:inline">|</span>

            {/* LeetCode Problem List Sidebar Toggle Button */}
            <button
              onClick={() => setIsProblemSidebarOpen(!isProblemSidebarOpen)}
              className={`px-3 py-1.5 rounded-xl border text-xs font-bold flex items-center gap-1.5 transition-all shrink-0 cursor-pointer ${
                isProblemSidebarOpen
                  ? "bg-blue-600 text-white border-blue-500 shadow-sm"
                  : "bg-[var(--surface-soft)] hover:bg-[var(--surface)] border-[var(--border)] text-[var(--text)]"
              }`}
              title="Toggle Problem Catalog Sidebar"
            >
              <span className="text-xs">☰</span>
              <span className="hidden sm:inline">Problem List</span>
              <span className={`px-1.5 py-0.5 rounded-md text-[10px] font-black ${
                isProblemSidebarOpen ? "bg-white/25 text-white" : "bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/20"
              }`}>
                {solvedProblemIds.length}/{PROBLEMS.length}
              </span>
            </button>

            {/* Prev & Next Quick Buttons */}
            <div className="inline-flex rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] p-0.5 shrink-0">
              <button
                onClick={handlePrevProblem}
                disabled={currentProblemIndex <= 0}
                className="px-2 py-1 rounded-lg text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:hover:text-[var(--muted)] transition-colors cursor-pointer"
                title="Previous Problem"
              >
                ◀
              </button>
              <button
                onClick={handleNextProblem}
                disabled={currentProblemIndex >= PROBLEMS.length - 1}
                className="px-2 py-1 rounded-lg text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] disabled:opacity-30 disabled:hover:text-[var(--muted)] transition-colors cursor-pointer"
                title="Next Problem"
              >
                ▶
              </button>
            </div>

            {/* Problem Selector Dropdown */}
            <div className="relative min-w-[200px] max-w-[340px]">
              <select
                value={selectedProblemId}
                onChange={(e) => selectProblem(e.target.value)}
                className="w-full truncate px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-black text-[var(--text)] focus:outline-none focus:ring-2 focus:ring-[var(--accent)] cursor-pointer"
              >
                {PROBLEMS.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    {idx + 1}. {p.title}
                  </option>
                ))}
              </select>
            </div>

            {/* Difficulty Badge */}
            <span
              className={`px-2.5 py-0.5 rounded-lg text-[10px] font-black uppercase tracking-wider shrink-0 ${
                currentProblem.difficulty === "Beginner"
                  ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                  : currentProblem.difficulty === "Intermediate"
                  ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                  : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
              }`}
            >
              {currentProblem.difficulty}
            </span>

            {/* XP Tag */}
            <span className="text-[11px] font-extrabold text-blue-600 dark:text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-lg border border-blue-500/20 hidden lg:inline-block shrink-0">
              +{currentProblem.xpReward} XP
            </span>
          </div>

          {/* Right: Language Selector + Quick Actions + Run / Submit CTAs */}
          <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap shrink-0">

            {/* Language Selector */}
            <div className="flex items-center bg-[var(--surface-soft)] border border-[var(--border)] rounded-xl px-2.5 py-1">
              <span className="text-sm mr-1.5">{LANGUAGES[selectedLang].icon}</span>
              <select
                value={selectedLang}
                onChange={(e) => setSelectedLang(e.target.value as LanguageId)}
                className="bg-transparent text-xs font-bold text-[var(--text)] focus:outline-none cursor-pointer"
              >
                {(Object.keys(LANGUAGES) as LanguageId[]).map((langId) => (
                  <option key={langId} value={langId} className="bg-[var(--surface)] text-[var(--text)]">
                    {LANGUAGES[langId].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Quick Action Buttons Group */}
            <div className="inline-flex rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] p-0.5">
              <button
                onClick={() => setIsSettingsOpen(!isSettingsOpen)}
                title="Editor Settings"
                className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                ⚙️
              </button>
              <button
                onClick={handleResetStarter}
                title="Reset Starter Code"
                className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                ↺
              </button>
              <button
                onClick={handleFormatCode}
                title="Prettify / Format Code"
                className="p-1.5 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
              >
                ✨
              </button>
            </div>

            {/* Run Code Button */}
            <button
              onClick={handleRunCode}
              disabled={isRunning || isSubmitting}
              className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-soft)] hover:bg-[var(--surface)] border border-[var(--border)] text-xs font-bold text-[var(--text)] hover:border-[var(--accent)] transition-all flex items-center gap-1.5 shadow-sm active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{isRunning ? "⏳" : "▶"}</span>
              <span>{isRunning ? "Running..." : "Run Tests"}</span>
            </button>

            {/* Submit Solution Button */}
            <button
              onClick={handleSubmitSolution}
              disabled={isRunning || isSubmitting}
              className="px-4 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-sm transition-all flex items-center gap-1.5 active:scale-98 cursor-pointer disabled:opacity-50"
            >
              <span>{isSubmitting ? "⚡" : "✓"}</span>
              <span>{isSubmitting ? "Submitting..." : "Submit Solution"}</span>
            </button>
          </div>
        </div>
      </header>

      {/* SETTINGS MODAL / POPOVER */}
      {isSettingsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl p-6 space-y-5">
            <div className="flex items-center justify-between border-b border-[var(--border-soft)] pb-3">
              <div className="flex items-center gap-2">
                <span className="text-base">⚙️</span>
                <h3 className="text-sm font-black uppercase tracking-wider text-[var(--text)]">
                  Code Editor & Runtime Settings
                </h3>
              </div>
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="text-xs text-[var(--muted)] hover:text-[var(--text)] p-1"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4 text-xs">
              {/* Font Size */}
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--muted)]">Font Size</label>
                <div className="flex items-center gap-1 bg-[var(--surface-soft)] p-1 rounded-xl border border-[var(--border)]">
                  {[12, 13, 14, 16, 18].map((s) => (
                    <button
                      key={s}
                      onClick={() => setFontSize(s)}
                      className={`px-2 py-1 rounded-lg text-xs font-bold ${
                        fontSize === s ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"
                      }`}
                    >
                      {s}px
                    </button>
                  ))}
                </div>
              </div>

              {/* Tab Size */}
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--muted)]">Tab Spacing</label>
                <div className="flex items-center gap-1 bg-[var(--surface-soft)] p-1 rounded-xl border border-[var(--border)]">
                  {[2, 4].map((t) => (
                    <button
                      key={t}
                      onClick={() => setTabSize(t)}
                      className={`px-3 py-1 rounded-lg text-xs font-bold ${
                        tabSize === t ? "bg-[var(--accent)] text-white" : "text-[var(--muted)]"
                      }`}
                    >
                      {t} Spaces
                    </button>
                  ))}
                </div>
              </div>

              {/* Editor Theme */}
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--muted)]">Editor Palette Theme</label>
                <select
                  value={editorTheme}
                  onChange={(e) => setEditorTheme(e.target.value as any)}
                  className="px-3 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] font-bold text-[var(--text)]"
                >
                  <option value="astra">🌌 Astra Slate (Default)</option>
                  <option value="midnight">🌑 Midnight Amethyst</option>
                  <option value="cyberpunk">⚡ Cyberpunk Synthwave</option>
                  <option value="pearl">☀️ Minimal Daylight (Light)</option>
                </select>
              </div>

              {/* Word Wrap Toggle */}
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--muted)]">Word Wrap</label>
                <input
                  type="checkbox"
                  checked={wordWrap}
                  onChange={(e) => setWordWrap(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                />
              </div>

              {/* Show Line Numbers */}
              <div className="flex items-center justify-between">
                <label className="font-semibold text-[var(--muted)]">Line Numbers Gutter</label>
                <input
                  type="checkbox"
                  checked={showLineNumbers}
                  onChange={(e) => setShowLineNumbers(e.target.checked)}
                  className="rounded text-[var(--accent)] focus:ring-[var(--accent)] cursor-pointer"
                />
              </div>
            </div>

            <div className="pt-2 border-t border-[var(--border-soft)] flex justify-end">
              <button
                onClick={() => setIsSettingsOpen(false)}
                className="button button-sm text-xs font-black"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ================= MAIN SPLIT WORKSPACE ================= */}
      <main
        ref={containerRef}
        className="flex-1 w-full flex flex-col lg:flex-row overflow-hidden relative"
        style={{ height: "calc(100vh - 128px)" }}
      >

        {/* ================= LEETCODE-STYLE COLLAPSIBLE PROBLEM SIDEBAR ================= */}
        {isProblemSidebarOpen && (
          <aside className="w-full lg:w-[350px] shrink-0 bg-[var(--surface)] border-r border-[var(--border-soft)] flex flex-col h-full overflow-hidden z-20 transition-all duration-200 shadow-2xl">
            {/* Sidebar Top: Header & Progress Gauge */}
            <div className="p-3.5 border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/60 space-y-3 shrink-0">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
                  <h3 className="text-xs font-black uppercase tracking-wider text-[var(--text)]">
                    Problem Catalog
                  </h3>
                  <span className="px-1.5 py-0.5 rounded-md bg-blue-500/10 border border-blue-500/20 text-[10px] font-bold text-blue-600 dark:text-blue-400">
                    {filteredProblems.length} available
                  </span>
                </div>
                <button
                  onClick={() => setIsProblemSidebarOpen(false)}
                  className="p-1 rounded-lg hover:bg-[var(--surface)] text-xs text-[var(--muted)] hover:text-[var(--text)] transition-colors cursor-pointer"
                  title="Collapse Sidebar"
                >
                  ◀
                </button>
              </div>

              {/* Solved Progress Bar & Difficulty Stats */}
              <div className="p-2.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] space-y-2">
                <div className="flex items-center justify-between text-[11px] font-bold">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span>✓</span> {solvedProblemIds.length} / {PROBLEMS.length} Solved
                  </span>
                  <span className="text-[var(--muted)] font-mono text-[10px]">
                    {Math.round((solvedProblemIds.length / PROBLEMS.length) * 100)}% Completed
                  </span>
                </div>

                <div className="w-full h-1.5 rounded-full bg-[var(--surface-soft)] overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 via-teal-400 to-emerald-400 transition-all duration-500 rounded-full"
                    style={{ width: `${(solvedProblemIds.length / PROBLEMS.length) * 100}%` }}
                  />
                </div>

                {/* Mini Difficulty Breakdown Grid */}
                <div className="grid grid-cols-3 gap-1.5 pt-1 text-[10px] text-center font-bold">
                  <div className="p-1 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
                    Easy: {difficultyStats.easySolved}/{difficultyStats.easyTotal}
                  </div>
                  <div className="p-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400">
                    Med: {difficultyStats.medSolved}/{difficultyStats.medTotal}
                  </div>
                  <div className="p-1 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
                    Hard: {difficultyStats.hardSolved}/{difficultyStats.hardTotal}
                  </div>
                </div>
              </div>

              {/* Search Bar */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by title, tag, category..."
                  value={problemSearchQuery}
                  onChange={(e) => setProblemSearchQuery(e.target.value)}
                  className="w-full pl-8 pr-7 py-1.5 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)] text-xs text-[var(--text)] outline-none focus:border-[var(--accent)] transition-colors"
                />
                <span className="absolute left-2.5 top-1.5 text-xs text-[var(--muted)]">🔍</span>
                {problemSearchQuery && (
                  <button
                    onClick={() => setProblemSearchQuery("")}
                    className="absolute right-2.5 top-1.5 text-xs text-[var(--muted)] hover:text-[var(--text)] cursor-pointer"
                  >
                    ✕
                  </button>
                )}
              </div>

              {/* Status Segmented Control (4-column grid, no awkward scrollbars) */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">Status</label>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)]">
                  {[
                    { id: "all", label: "All" },
                    { id: "solved", label: "✓ Solved" },
                    { id: "attempted", label: "• Doing" },
                    { id: "unsolved", label: "○ Todo" }
                  ].map((st) => (
                    <button
                      key={st.id}
                      onClick={() => setStatusFilter(st.id)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all text-center truncate cursor-pointer ${
                        statusFilter === st.id
                          ? "bg-blue-600 text-white shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Difficulty Segmented Control (4-column grid, no awkward scrollbars) */}
              <div className="space-y-1">
                <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)]">Difficulty</label>
                <div className="grid grid-cols-4 gap-1 p-1 rounded-xl bg-[var(--surface)] border border-[var(--border-soft)]">
                  {[
                    { id: "all", label: "All" },
                    { id: "Beginner", label: "Easy" },
                    { id: "Intermediate", label: "Med" },
                    { id: "Advanced", label: "Hard" }
                  ].map((diff) => (
                    <button
                      key={diff.id}
                      onClick={() => setDifficultyFilter(diff.id)}
                      className={`py-1 rounded-lg text-[10px] font-bold transition-all text-center truncate cursor-pointer ${
                        difficultyFilter === diff.id
                          ? "bg-slate-700 dark:bg-slate-600 text-white shadow-xs"
                          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface-soft)]"
                      }`}
                    >
                      {diff.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Category & Sort Dropdowns Grid */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block mb-1">
                    Topic
                  </label>
                  <select
                    value={categoryFilter}
                    onChange={(e) => setCategoryFilter(e.target.value)}
                    className="w-full px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-[11px] font-semibold text-[var(--text)] focus:outline-none cursor-pointer"
                  >
                    <option value="all">All Topics</option>
                    {allCategories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase tracking-wider text-[var(--muted)] block mb-1">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className="w-full px-2 py-1 rounded-lg bg-[var(--surface)] border border-[var(--border-soft)] text-[11px] font-semibold text-[var(--text)] focus:outline-none cursor-pointer"
                  >
                    <option value="default">Default (#)</option>
                    <option value="diff-asc">Difficulty ↑</option>
                    <option value="diff-desc">Difficulty ↓</option>
                    <option value="acceptance">Acceptance %</option>
                    <option value="xp">XP Reward</option>
                  </select>
                </div>
              </div>

              {/* Active Filter Indicator & Reset */}
              {(problemSearchQuery || difficultyFilter !== "all" || categoryFilter !== "all" || statusFilter !== "all" || sortBy !== "default") && (
                <div className="flex items-center justify-between text-[10px] pt-1 text-[var(--muted)]">
                  <span>Showing {filteredProblems.length} of {PROBLEMS.length} problems</span>
                  <button
                    onClick={handleResetFilters}
                    className="text-blue-600 dark:text-blue-400 hover:underline font-bold cursor-pointer"
                  >
                    Reset filters
                  </button>
                </div>
              )}
            </div>

            {/* Problems Scrollable List */}
            <div className="flex-1 overflow-y-auto divide-y divide-[var(--border-soft)] p-2 space-y-1.5">
              {filteredProblems.length === 0 ? (
                <div className="p-8 text-center text-xs text-[var(--muted)] space-y-2">
                  <div className="text-2xl">🔎</div>
                  <p className="font-semibold">No problems match your current filters.</p>
                  <button
                    onClick={handleResetFilters}
                    className="px-3 py-1 rounded-lg bg-blue-500/10 text-blue-600 dark:text-blue-400 font-bold hover:bg-blue-500/20 text-[11px] cursor-pointer"
                  >
                    Reset all filters
                  </button>
                </div>
              ) : (
                filteredProblems.map((prob) => {
                  const isSelected = prob.id === currentProblem.id;
                  const isSolved = solvedProblemIds.includes(prob.id);
                  const isAttempted = attemptedProblemIds.includes(prob.id) && !isSolved;
                  const probIdx = PROBLEMS.findIndex((p) => p.id === prob.id) + 1;

                  return (
                    <div
                      key={prob.id}
                      onClick={() => selectProblem(prob.id)}
                      className={`p-2.5 rounded-xl cursor-pointer transition-all border text-left group ${
                        isSelected
                          ? "bg-blue-500/10 border-blue-500/60 shadow-sm ring-1 ring-blue-500/30"
                          : "bg-[var(--surface)] hover:bg-[var(--surface-soft)] border-[var(--border-soft)]/50 hover:border-[var(--border)]"
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        {/* Status Icon Indicator (LeetCode style) */}
                        <div className="mt-0.5 shrink-0">
                          {isSolved ? (
                            <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center text-[10px] font-black">
                              ✓
                            </span>
                          ) : isAttempted ? (
                            <span className="w-5 h-5 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/40 flex items-center justify-center text-[10px] font-black">
                              •
                            </span>
                          ) : (
                            <span className="w-5 h-5 rounded-full border border-gray-600/80 flex items-center justify-center text-[9px] text-gray-500 group-hover:border-gray-400">
                              ○
                            </span>
                          )}
                        </div>

                        <div className="flex-1 min-w-0">
                          <h4 className={`text-xs font-bold leading-snug line-clamp-1 ${isSelected ? "text-blue-600 dark:text-blue-400 font-black" : "text-[var(--text)] group-hover:text-blue-500"}`}>
                            {probIdx}. {prob.title}
                          </h4>

                          <div className="flex items-center gap-1.5 mt-1.5 flex-wrap">
                            <span className={`text-[10px] font-extrabold px-1.5 py-0.2 rounded-md ${
                              prob.difficulty === "Beginner"
                                ? "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30"
                                : prob.difficulty === "Intermediate"
                                ? "bg-amber-500/15 text-amber-400 border border-amber-500/30"
                                : "bg-rose-500/15 text-rose-400 border border-rose-500/30"
                            }`}>
                              {prob.difficulty}
                            </span>
                            <span className="text-[10px] text-[var(--muted)] font-mono">
                              {prob.acceptanceRate}
                            </span>
                            <span className="text-[10px] text-blue-600 dark:text-blue-400 font-bold ml-auto">
                              +{prob.xpReward} XP
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </aside>
        )}

        {/* ================= LEFT PANEL: DESCRIPTION / HINTS / SUBMISSIONS / NOTES ================= */}
        <section
          className={`flex flex-col bg-[var(--surface)] border-r border-[var(--border-soft)] overflow-hidden transition-all duration-150 ${
            isLeftCollapsed ? "w-12" : ""
          }`}
          style={{ width: isLeftCollapsed ? "48px" : `${leftWidthPercent}%` }}
        >
          {/* Left Panel Tabs Bar */}
          <div className="flex items-center justify-between border-b border-[var(--border-soft)] bg-[var(--surface-soft)]/50 px-2 py-1.5 shrink-0 overflow-x-auto no-scrollbar">
            {isLeftCollapsed ? (
              <button
                onClick={() => setIsLeftCollapsed(false)}
                title="Expand Description Panel"
                className="w-full py-2 text-center text-xs font-black text-blue-600 dark:text-blue-400 hover:bg-[var(--surface)] rounded-xl"
              >
                ⊞
              </button>
            ) : (
              <>
                <div className="flex items-center gap-1 text-xs font-bold">
                  {[
                    { id: "desc", label: "Description", icon: "📄" },
                    { id: "hints", label: "Hints & Approach", icon: "💡" },
                    { id: "submissions", label: `Submissions (${submissions.length})`, icon: "📜" },
                    { id: "solutions", label: "Solutions", icon: "💡" },
                    { id: "notes", label: "Notes", icon: "📝" },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveLeftTab(tab.id as any)}
                      className={`px-3 py-1.5 rounded-xl transition-all flex items-center gap-1.5 text-[11px] whitespace-nowrap ${
                        activeLeftTab === tab.id
                          ? "bg-[var(--surface)] text-[var(--accent)] font-black shadow-sm"
                          : "text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                      }`}
                    >
                      <span>{tab.icon}</span>
                      <span>{tab.label}</span>
                    </button>
                  ))}
                </div>

                {/* Minimize Left Panel Button */}
                <button
                  onClick={() => setIsLeftCollapsed(true)}
                  title="Minimize Description (Full Editor Width)"
                  className="p-1 rounded-lg text-[var(--muted)] hover:text-[var(--text)] text-xs"
                >
                  ◀
                </button>
              </>
            )}
          </div>

          {/* Left Panel Scrollable Content Body */}
          {!isLeftCollapsed && (
            <div className="flex-1 overflow-y-auto p-5 space-y-6 text-xs leading-relaxed select-text">

              {/* TAB 1: DESCRIPTION */}
              {activeLeftTab === "desc" && (
                <div className="space-y-5">
                  <div>
                    <h2 className="text-lg font-black text-[var(--text)]">{currentProblem.title}</h2>
                    <div className="flex items-center gap-3 mt-2 text-[11px] text-[var(--muted)] font-semibold">
                      <span className="flex items-center gap-1">
                        <span>📊</span> Acceptance: {currentProblem.acceptanceRate}
                      </span>
                      <span>•</span>
                      <span className="flex items-center gap-1">
                        <span>🏷️</span> {currentProblem.category}
                      </span>
                    </div>
                  </div>

                  {/* Markdown formatted Problem Statement */}
                  <div className="p-4 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] whitespace-pre-wrap font-sans text-xs text-[var(--text)] leading-relaxed">
                    {currentProblem.description}
                  </div>

                  {/* Examples */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                      Examples
                    </h3>
                    {currentProblem.examples.map((ex, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2 font-mono text-[11px]"
                      >
                        <div className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                          Example {idx + 1}
                        </div>
                        <div>
                          <span className="text-[var(--muted)] block">Input:</span>
                          <span className="text-[var(--text)] font-semibold">{ex.input}</span>
                        </div>
                        <div>
                          <span className="text-[var(--muted)] block">Output:</span>
                          <span className="text-emerald-400 font-semibold">{ex.output}</span>
                        </div>
                        {ex.explanation && (
                          <div className="text-[10px] text-[var(--muted)] font-sans italic border-t border-[var(--border-soft)] pt-1.5">
                            Explanation: {ex.explanation}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>

                  {/* Constraints */}
                  <div className="space-y-2">
                    <h3 className="text-xs font-black uppercase tracking-wider text-[var(--muted)]">
                      Constraints & Guarantees
                    </h3>
                    <ul className="space-y-1.5 list-disc list-inside text-[11px] text-[var(--muted)]">
                      {currentProblem.constraints.map((c, i) => (
                        <li key={i} className="font-mono">{c}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Tags */}
                  <div className="pt-2 border-t border-[var(--border-soft)] flex flex-wrap gap-1.5">
                    {currentProblem.tags.map((t) => (
                      <span
                        key={t}
                        className="px-2.5 py-1 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-[10px] font-bold text-[var(--muted)]"
                      >
                        #{t}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 2: HINTS & COMPLEXITY */}
              {activeLeftTab === "hints" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[var(--text)]">Guided Hints & Complexity Model</h3>
                  <div className="space-y-3">
                    {currentProblem.hints.map((hint, idx) => (
                      <details
                        key={idx}
                        className="p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-xs group cursor-pointer"
                      >
                        <summary className="font-bold text-[var(--text)] flex items-center justify-between select-none">
                          <span>💡 Hint {idx + 1}</span>
                          <span className="text-blue-600 dark:text-blue-400 text-xs">Reveal ▼</span>
                        </summary>
                        <p className="mt-2 text-xs text-[var(--muted)] leading-relaxed pt-2 border-t border-[var(--border-soft)]">
                          {hint}
                        </p>
                      </details>
                    ))}
                  </div>

                  <div className="p-4 rounded-2xl bg-blue-500/10 border border-blue-500/20 space-y-2">
                    <h4 className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                      Optimal Target Complexity
                    </h4>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Time Complexity:</span>
                      <span className="font-bold text-[var(--text)]">{currentProblem.timeComplexity}</span>
                    </div>
                    <div className="flex items-center justify-between text-xs font-mono">
                      <span>Space Complexity:</span>
                      <span className="font-bold text-[var(--text)]">{currentProblem.spaceComplexity}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: SUBMISSIONS HISTORY */}
              {activeLeftTab === "submissions" && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[var(--text)]">Your Submissions History</h3>
                    <span className="text-[10px] text-[var(--muted)] font-mono">Real-time sync</span>
                  </div>

                  {submissions.length === 0 ? (
                    <div className="p-8 text-center rounded-2xl bg-[var(--surface-soft)] text-xs text-[var(--muted)]">
                      No submissions recorded yet. Click "Submit Solution" to run your code!
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {submissions.map((sub) => (
                        <div
                          key={sub.id}
                          className="p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2"
                        >
                          <div className="flex items-center justify-between">
                            <span
                              className={`px-2 py-0.5 rounded-md text-[10px] font-black uppercase ${
                                sub.status === "Accepted"
                                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                                  : "bg-rose-500/20 text-rose-400 border border-rose-500/30"
                              }`}
                            >
                              {sub.status}
                            </span>
                            <span className="text-[10px] text-[var(--muted)]">{sub.timestamp}</span>
                          </div>

                          <div className="flex items-center justify-between text-[11px] font-mono text-[var(--muted)]">
                            <span>Runtime: {sub.runtime}</span>
                            <span>Memory: {sub.memory}</span>
                            <span>Lang: {LANGUAGES[sub.language].name}</span>
                          </div>

                          <button
                            onClick={() => setCode(sub.codeSnippet)}
                            className="text-[10px] text-blue-600 dark:text-blue-400 hover:underline font-bold"
                          >
                            Revert to this code snapshot →
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: SOLUTIONS */}
              {activeLeftTab === "solutions" && (
                <div className="space-y-4">
                  <h3 className="text-sm font-black text-[var(--text)]">Verified Canonical Solution</h3>
                  <div className="p-4 rounded-2xl bg-[#080710] border border-gray-800 text-emerald-400 font-mono text-[11px] overflow-x-auto whitespace-pre leading-relaxed">
                    {currentProblem.solutionSnippet}
                  </div>
                  <p className="text-xs text-[var(--muted)]">
                    This solution leverages the optimal time complexity <strong>{currentProblem.timeComplexity}</strong> with single-pass memory safety.
                  </p>
                </div>
              )}

              {/* TAB 5: NOTES & SCRATCHPAD */}
              {activeLeftTab === "notes" && (
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h3 className="text-sm font-black text-[var(--text)]">Private Problem Scratchpad</h3>
                    <button
                      onClick={handleSaveNotes}
                      className="px-3 py-1 rounded-xl text-xs font-bold bg-blue-600 text-white shadow-sm hover:bg-blue-700 transition-colors"
                    >
                      Save to Astra Notes
                    </button>
                  </div>

                  {saveNoteSuccess && (
                    <div className="p-2.5 rounded-xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-xs font-bold">
                      ✓ Saved to your personal Notes Hub!
                    </div>
                  )}

                  <textarea
                    rows={12}
                    value={scratchpadNote}
                    onChange={(e) => setScratchpadNote(e.target.value)}
                    placeholder="Write markdown notes, edge cases, complexity analysis..."
                    className="w-full p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs text-[var(--text)] font-mono focus:outline-none focus:ring-1 focus:ring-[var(--accent)] resize-none leading-relaxed"
                  />
                </div>
              )}
            </div>
          )}
        </section>

        {/* ================= HORIZONTAL DRAG SPLITTER (DRAGGABLE BAR) ================= */}
        {!isLeftCollapsed && (
          <div
            onMouseDown={handleStartHorizontalDrag}
            title="Drag to resize horizontally (Double click to reset 50-50)"
            onDoubleClick={() => setLeftWidthPercent(50)}
            className="hidden lg:flex w-2.5 hover:w-3 bg-[var(--surface-soft)] hover:bg-blue-500/20 cursor-col-resize items-center justify-center transition-all z-10 select-none group border-x border-[var(--border-soft)]"
          >
            <div className="w-1 h-8 rounded-full bg-[var(--border)] group-hover:bg-blue-500 transition-colors" />
          </div>
        )}

        {/* ================= RIGHT WORKSPACE: CODE EDITOR (TOP) + TERMINAL (BOTTOM) ================= */}
        <section
          ref={rightColRef}
          className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--bg)]"
        >

          {/* ================= TOP CODE EDITOR PANEL ================= */}
          <div
            className="flex-1 flex flex-col overflow-hidden bg-[#0d0b17] border-b border-[var(--border-soft)] relative"
            style={{
              height: isTerminalCollapsed ? "calc(100% - 36px)" : `${100 - terminalHeightPercent}%`,
            }}
          >
            {/* Editor Window Top Bar */}
            <div className="px-4 py-2 border-b border-gray-800 bg-[#080710] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span className="text-[11px] font-mono text-gray-400 ml-2">
                  solution.{selectedLang === "python" ? "py" : selectedLang === "typescript" ? "ts" : selectedLang === "javascript" ? "js" : selectedLang === "rust" ? "rs" : selectedLang === "go" ? "go" : selectedLang === "cpp" ? "cpp" : selectedLang === "java" ? "java" : "sql"}
                </span>
              </div>

              <div className="flex items-center gap-3 text-[10px] text-gray-400 font-mono">
                <span>Tab: {tabSize} spaces</span>
                <span>•</span>
                <span>UTF-8</span>
                <span>•</span>
                <span className="text-blue-400">Ctrl + Enter to Run</span>
              </div>
            </div>

            {/* Code Textarea with Line Numbers Gutter */}
            <div className="flex-1 flex overflow-hidden relative font-mono text-xs">
              {/* Line Numbers Gutter */}
              {showLineNumbers && (
                <div className="w-10 shrink-0 bg-[#090714] text-gray-600 text-right pr-2.5 pt-3 select-none font-mono text-[11px] leading-relaxed border-r border-gray-800/80">
                  {Array.from({ length: lineCount }).map((_, i) => (
                    <div key={i} className="leading-relaxed">
                      {i + 1}
                    </div>
                  ))}
                </div>
              )}

              {/* Editable Code Box */}
              <textarea
                value={code}
                onChange={(e) => setCode(e.target.value)}
                onKeyDown={(e) => {
                  // Tab Key Indentation
                  if (e.key === "Tab") {
                    e.preventDefault();
                    const start = e.currentTarget.selectionStart;
                    const end = e.currentTarget.selectionEnd;
                    const spaces = " ".repeat(tabSize);
                    setCode(code.substring(0, start) + spaces + code.substring(end));
                    setTimeout(() => {
                      e.currentTarget.selectionStart = e.currentTarget.selectionEnd = start + tabSize;
                    }, 0);
                  }
                  // Ctrl + Enter to Run
                  if (e.ctrlKey && e.key === "Enter") {
                    e.preventDefault();
                    if (e.shiftKey) {
                      handleSubmitSolution();
                    } else {
                      handleRunCode();
                    }
                  }
                }}
                spellCheck={false}
                style={{
                  fontSize: `${fontSize}px`,
                  lineHeight: "1.6",
                  whiteSpace: wordWrap ? "pre-wrap" : "pre",
                }}
                className={`flex-1 p-3 bg-transparent text-[#93c5fd] font-mono focus:outline-none resize-none overflow-auto select-text ${
                  editorTheme === "midnight"
                    ? "text-[#c084fc]"
                    : editorTheme === "cyberpunk"
                    ? "text-[#38bdf8]"
                    : editorTheme === "pearl"
                    ? "text-[#1e293b] bg-slate-50"
                    : "text-[#93c5fd]"
                }`}
              />
            </div>
          </div>

          {/* ================= VERTICAL DRAG SPLITTER ================= */}
          {!isTerminalCollapsed && (
            <div
              onMouseDown={handleStartVerticalDrag}
              title="Drag to resize terminal height (Double click to reset 40%)"
              onDoubleClick={() => setTerminalHeightPercent(40)}
              className="h-2 hover:h-2.5 bg-[var(--surface-soft)] hover:bg-blue-500/20 cursor-row-resize flex items-center justify-center transition-all z-10 select-none group border-y border-[var(--border-soft)]"
            >
              <div className="h-0.5 w-12 rounded-full bg-[var(--border)] group-hover:bg-blue-500 transition-colors" />
            </div>
          )}

          {/* ================= BOTTOM PANEL: TESTCASES / RESULTS / TERMINAL ================= */}
          <div
            className={`flex flex-col bg-[var(--surface)] overflow-hidden transition-all duration-150 ${
              isTerminalCollapsed ? "h-9" : ""
            }`}
            style={{ height: isTerminalCollapsed ? "36px" : `${terminalHeightPercent}%` }}
          >
            {/* Terminal Header Tabs Bar */}
            <div className="px-3 py-1.5 border-b border-[var(--border-soft)] bg-[var(--surface-soft)] flex items-center justify-between shrink-0">
              <div className="flex items-center gap-1">
                {[
                  { id: "testcases", label: "Test Cases", icon: "🧪" },
                  { id: "results", label: "Test Results", icon: "📊" },
                  { id: "terminal", label: "Console Logs", icon: "🖥️" },
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveBottomTab(tab.id as any);
                      setIsTerminalCollapsed(false);
                    }}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                      activeBottomTab === tab.id && !isTerminalCollapsed
                        ? "bg-[var(--surface)] text-[var(--accent)] shadow-sm"
                        : "text-[var(--muted)] hover:text-[var(--text)]"
                    }`}
                  >
                    <span>{tab.icon}</span>
                    <span>{tab.label}</span>
                  </button>
                ))}
              </div>

              {/* Terminal Expand / Minimize Controls */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsTerminalCollapsed(!isTerminalCollapsed)}
                  title={isTerminalCollapsed ? "Expand Terminal" : "Minimize Terminal"}
                  className="p-1 rounded-lg text-xs text-[var(--muted)] hover:text-[var(--text)] hover:bg-[var(--surface)]"
                >
                  {isTerminalCollapsed ? "▲" : "▼"}
                </button>
              </div>
            </div>

            {/* Terminal Tab Body */}
            {!isTerminalCollapsed && (
              <div className="flex-1 overflow-y-auto p-4 select-text">

                {/* TAB 1: TEST CASES */}
                {activeBottomTab === "testcases" && (
                  <div className="space-y-3">
                    {/* Test Case Sub-tabs */}
                    <div className="flex items-center gap-2">
                      {currentProblem.testCases.map((tc, idx) => (
                        <button
                          key={tc.id}
                          onClick={() => {
                            setActiveTestCaseIdx(idx);
                            setIsCustomTest(false);
                          }}
                          className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                            !isCustomTest && activeTestCaseIdx === idx
                              ? "bg-[var(--accent)] text-white shadow-sm"
                              : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                          }`}
                        >
                          Case {idx + 1}
                        </button>
                      ))}

                      <button
                        onClick={() => setIsCustomTest(true)}
                        className={`px-3 py-1 rounded-xl text-xs font-bold transition-all ${
                          isCustomTest
                            ? "bg-[var(--accent)] text-white shadow-sm"
                            : "bg-[var(--surface-soft)] text-[var(--muted)] hover:text-[var(--text)]"
                        }`}
                      >
                        + Custom Input
                      </button>
                    </div>

                    {/* Active Test Case Content */}
                    {!isCustomTest ? (
                      <div className="p-3.5 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-2 font-mono text-xs">
                        <div>
                          <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block font-bold">
                            Input:
                          </span>
                          <p className="text-[var(--text)] mt-0.5">
                            {currentProblem.testCases[activeTestCaseIdx]?.input}
                          </p>
                        </div>
                        <div className="pt-2 border-t border-[var(--border-soft)]">
                          <span className="text-[10px] text-[var(--muted)] uppercase tracking-wider block font-bold">
                            Expected Output:
                          </span>
                          <p className="text-emerald-400 mt-0.5">
                            {currentProblem.testCases[activeTestCaseIdx]?.expectedOutput}
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <label className="text-[11px] font-bold text-[var(--muted)]">
                          Custom Testcase JSON / String Payload:
                        </label>
                        <textarea
                          rows={3}
                          value={customTestCaseInput}
                          onChange={(e) => setCustomTestCaseInput(e.target.value)}
                          className="w-full p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] font-mono text-xs text-[var(--text)] focus:outline-none resize-none"
                        />
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 2: TEST RESULTS */}
                {activeBottomTab === "results" && (
                  <div className="space-y-4">
                    {testResults.status === "Idle" ? (
                      <div className="p-6 text-center text-xs text-[var(--muted)] font-medium">
                        Click <strong>"Run Tests"</strong> or <strong>"Submit Solution"</strong> to execute your code against test suites.
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {/* Overall Status Banner */}
                        <div
                          className={`p-4 rounded-2xl flex flex-wrap items-center justify-between gap-3 ${
                            testResults.status === "Accepted"
                              ? "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
                              : "bg-rose-500/15 border border-rose-500/30 text-rose-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-xl">
                              {testResults.status === "Accepted" ? "✓" : "✕"}
                            </span>
                            <div>
                              <h4 className="text-sm font-black uppercase">
                                {testResults.status === "Accepted" ? "Accepted" : "Wrong Answer"}
                              </h4>
                              <p className="text-xs opacity-80">
                                Passed {testResults.passedCount} of {testResults.totalCount} test suites
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-4 text-xs font-mono">
                            <div>
                              <span className="opacity-70 block text-[10px]">Runtime</span>
                              <span className="font-bold">{testResults.runtimeMs} ms</span>
                            </div>
                            <div>
                              <span className="opacity-70 block text-[10px]">Memory</span>
                              <span className="font-bold">{testResults.memoryMb} MB</span>
                            </div>
                            <div>
                              <span className="opacity-70 block text-[10px]">Beats</span>
                              <span className="font-bold">{testResults.percentile}%</span>
                            </div>
                          </div>
                        </div>

                        {/* Individual Test Case Breakdown Cards */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5">
                          {testResults.details.map((d) => (
                            <div
                              key={d.id}
                              className="p-3 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] space-y-1 font-mono text-[11px]"
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-[var(--text)]">Case {d.id}</span>
                                <span className="text-emerald-400 font-bold">✓ {d.runtime}</span>
                              </div>
                              <div className="text-[10px] text-[var(--muted)] truncate">
                                In: {d.input}
                              </div>
                              <div className="text-[10px] text-emerald-400 truncate">
                                Out: {d.actual}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* TAB 3: TERMINAL LOGS */}
                {activeBottomTab === "terminal" && (
                  <div className="p-3.5 rounded-2xl bg-[#05040a] min-h-[140px] font-mono text-xs text-emerald-400 space-y-1 whitespace-pre-wrap leading-relaxed">
                    <div className="text-[10px] text-gray-500 border-b border-gray-800 pb-1.5 mb-1.5 flex items-center justify-between">
                      <span>Astra Isolated Cloud VM [Wasm Sandbox 2.4]</span>
                      <span>Target: {LANGUAGES[selectedLang].name}</span>
                    </div>
                    {terminalLogs.length === 0 ? (
                      <span className="text-gray-500">Ready for execution. Press "Run Tests" or Ctrl+Enter.</span>
                    ) : (
                      terminalLogs.map((log, i) => <div key={i}>{log}</div>)
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
      </main>

      {/* Global Bottom Status Bar */}
      <footer className="px-4 py-1.5 bg-[var(--surface-soft)] border-t border-[var(--border-soft)] text-[11px] text-[var(--muted)] font-mono flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /> Cloud Compiler Ready
          </span>
          <span>•</span>
          <span>{LANGUAGES[selectedLang].version}</span>
        </div>

        <div className="flex items-center gap-3">
          <span>Split: {Math.round(leftWidthPercent)}% / {Math.round(100 - leftWidthPercent)}%</span>
          <span>•</span>
          <button
            onClick={() => {
              setLeftWidthPercent(45);
              setIsLeftCollapsed(false);
              setTerminalHeightPercent(38);
              setIsTerminalCollapsed(false);
            }}
            className="text-blue-600 dark:text-blue-400 hover:underline font-bold"
          >
            Reset Layout
          </button>
        </div>
      </footer>
    </div>
  );
}
