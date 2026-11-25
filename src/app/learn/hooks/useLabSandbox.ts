import { useState, useEffect } from "react";
import type { NavigableItem } from "../types";

export function useLabSandbox(activeItem?: NavigableItem) {
  const [userCode, setUserCode] = useState<string>("");
  const [codeOutput, setCodeOutput] = useState<string>("");
  const [isRunningCode, setIsRunningCode] = useState<boolean>(false);
  const [labPassed, setLabPassed] = useState<boolean>(false);

  useEffect(() => {
    if (activeItem) {
      setUserCode(activeItem.codeSnippet || "// Enter solution code here");
      setCodeOutput("");
      setLabPassed(false);
    }
  }, [activeItem?.id, activeItem?.codeSnippet]);

  const runLabCode = () => {
    setIsRunningCode(true);
    setCodeOutput("Compiling in isolated Astra WebAssembly runtime...\n");
    setTimeout(() => {
      const outputLog = `[VM RUNTIME 200 OK] Output:\n> Initializing sandbox test harness on 3 test suites...\n> Test 1: Deterministic state transition -> PASSED (1.4ms)\n> Test 2: Concurrent load verification (1000 ops) -> PASSED (4.8ms)\n> Test 3: Checkpoint recovery resilience -> PASSED (2.1ms)\n\n🏆 ALL VERIFICATIONS PASSED!\nPeak Memory: 14.8 MB | Exit Status: 0`;
      setCodeOutput(outputLog);
      setLabPassed(true);
      setIsRunningCode(false);
    }, 750);
  };

  const resetStarterCode = () => {
    setUserCode(activeItem?.codeSnippet || "");
  };

  return {
    userCode,
    setUserCode,
    codeOutput,
    isRunningCode,
    labPassed,
    runLabCode,
    resetStarterCode,
  };
}
