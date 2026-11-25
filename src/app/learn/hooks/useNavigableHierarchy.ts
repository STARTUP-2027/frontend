import { useMemo } from "react";
import type { Course, HierarchyItem, QuizQuestion } from "../../context/CourseContext";
import type { NavigableItem } from "../types";

export function useNavigableHierarchy(course?: Course): NavigableItem[] {
  return useMemo<NavigableItem[]>(() => {
    if (!course) return [];
    const items: NavigableItem[] = [];

    const processHierarchy = (
      nodes: HierarchyItem[],
      modId: string,
      modTitle: string,
      parentSubTitle?: string
    ) => {
      for (const node of nodes) {
        const hasContent =
          node.videoUrl ||
          node.notes ||
          node.codeSnippet ||
          (node.quizzes && node.quizzes.length > 0) ||
          node.type !== "module";

        if (hasContent || !node.children || node.children.length === 0) {
          const itemType: NavigableItem["type"] =
            node.type === "video"
              ? "video"
              : node.type === "quiz"
              ? "quiz"
              : node.type === "lab" || node.type === "exercise"
              ? "lab"
              : node.type === "reading"
              ? "reading"
              : node.videoUrl
              ? "video"
              : node.codeSnippet
              ? "lab"
              : "reading";

          items.push({
            id: node.id,
            title: node.title,
            moduleId: modId,
            moduleTitle: modTitle,
            submoduleTitle: parentSubTitle || node.title,
            type: itemType,
            duration: node.duration || "15 min",
            summary: node.summary || "In-depth concept mastery and architectural verification.",
            notes:
              node.notes ||
              `# ${node.title}\n\nComprehensive architectural overview and step-by-step documentation.`,
            videoUrl: node.videoUrl || "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            transcript:
              node.transcript ||
              "Welcome to this chapter. In this section, we break down foundational system design invariants, state transitions, and real-time execution flows in production environments.",
            timestamps: node.timestamps || [
              { time: "00:00", seconds: 0, label: "Overview & Objectives" },
              { time: "03:45", seconds: 225, label: "Core Architecture Invariants" },
              { time: "08:12", seconds: 492, label: "Interactive Simulation Walkthrough" },
              { time: "14:20", seconds: 860, label: "Production Best Practices" },
            ],
            codeSnippet:
              node.codeSnippet ||
              `// Interactive Execution Sandbox\nfunction executeVerification() {\n  console.log("Validating architectural invariants...");\n  return { status: "OK", latencyMs: 14.2, memoryMb: 12.8 };\n}\n\nexecuteVerification();`,
            labObjective:
              node.labObjective ||
              "Implement the core handler, verify memory checkpoints under load, and pass all automated test suites.",
            expectedOutput:
              node.expectedOutput || "All 5 invariant checks passed successfully.",
            quizzes:
              node.quizzes && node.quizzes.length > 0
                ? node.quizzes
                : [
                    {
                      id: "quiz-default-1",
                      question: `What is the core architectural principle emphasized in ${node.title}?`,
                      options: [
                        "Deterministic state transitions with automated checkpointing",
                        "Unsynchronized global variables in memory",
                        "Disabling network payload validation",
                        "Ignoring edge cases during high concurrency",
                      ],
                      correctIndex: 0,
                      explanation:
                        "State consistency and deterministic execution guarantee resilience across distributed nodes.",
                      points: 50,
                    },
                  ],
            resources: node.resources || [
              {
                id: "res-1",
                name: `${node.title} - Architecture CheatSheet`,
                type: "pdf",
                size: "1.8 MB",
              },
              { id: "res-2", name: "Production Starter Blueprint", type: "code", size: "45 KB" },
            ],
            flashcards: node.flashcards || [
              {
                front: "State Invariant",
                back: "A property that remains true throughout the lifecycle of a node execution loop.",
              },
              {
                front: "Checkpointing",
                back: "Persisting intermediate state to durable storage to support replay and fault recovery.",
              },
            ],
          });
        }

        if (node.children && node.children.length > 0) {
          processHierarchy(node.children, modId, modTitle, node.title);
        }
      }
    };

    course.modules.forEach((mod) => {
      if (mod.submodules && mod.submodules.length > 0) {
        processHierarchy(mod.submodules, mod.id, mod.title);
      } else if (mod.lessons && mod.lessons.length > 0) {
        mod.lessons.forEach((l) => {
          const lQuizzes: QuizQuestion[] =
            l.quizzes && l.quizzes.length > 0
              ? l.quizzes
              : l.quiz
              ? [
                  {
                    id: `quiz-${l.id}`,
                    question: l.quiz.question,
                    options: l.quiz.options,
                    correctIndex: l.quiz.correctIndex,
                    explanation: l.quiz.explanation,
                    points: 50,
                  },
                ]
              : [];

          items.push({
            id: l.id,
            title: l.title,
            moduleId: mod.id,
            moduleTitle: mod.title,
            type:
              l.type === "code"
                ? "lab"
                : l.type === "quiz"
                ? "quiz"
                : l.type === "reading"
                ? "reading"
                : "video",
            duration: l.duration,
            summary: l.summary,
            notes: l.notes,
            videoUrl: l.videoUrl || "https://www.youtube-nocookie.com/embed/aircAruvnKk",
            transcript:
              l.transcript ||
              "Welcome to this lesson. We explore core engineering patterns and practical implementations.",
            timestamps: l.timestamps || [
              { time: "00:00", seconds: 0, label: "Lesson Introduction" },
              { time: "04:15", seconds: 255, label: "Core Principles & Diagram" },
              { time: "11:30", seconds: 690, label: "Code Walkthrough" },
              { time: "18:00", seconds: 1080, label: "Summary & Review" },
            ],
            codeSnippet: l.codeSnippet,
            labObjective:
              l.labObjective ||
              "Complete the implementation and run sandbox tests to verify execution correctness.",
            expectedOutput: l.expectedOutput || "Output verified successfully.",
            quizzes: lQuizzes,
            resources: l.resources || [
              { id: "res-1", name: `${l.title} - Reference Note`, type: "pdf", size: "1.4 MB" },
              { id: "res-2", name: "Source Code Snippets", type: "code", size: "28 KB" },
            ],
            flashcards: l.flashcards || [
              {
                front: "Key Concept",
                back: "Fundamental pattern required for resilient high-scale deployment.",
              },
            ],
          });
        });
      }
    });

    return items;
  }, [course]);
}
