import React from "react";
import type { Course } from "../../context/CourseContext";

interface CertificateModalProps {
  course: Course;
  userName?: string;
  onClaim: () => void;
  onClose: () => void;
}

export default function CertificateModal({
  course,
  userName,
  onClaim,
  onClose,
}: CertificateModalProps) {
  const credentialId = `ASTRA-CERT-2027-${Math.floor(1000 + Math.random() * 9000)}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md animate-fade-in">
      <div className="max-w-lg w-full p-6 sm:p-8 rounded-2xl bg-[var(--surface)] border border-[var(--border)] shadow-xl text-center space-y-5">
        <div className="w-16 h-16 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 text-black border border-amber-300 flex items-center justify-center mx-auto text-3xl shadow-lg">
          🏆
        </div>
        <div className="space-y-1">
          <h2 className="text-xl sm:text-2xl font-black text-[var(--text)]">Course 100% Completed!</h2>
          <p className="text-xs text-[var(--muted)]">
            Congratulations, <strong>{userName || "Student"}</strong>! You have mastered all
            modules in <strong>{course.title}</strong>.
          </p>
        </div>

        <div className="p-4 rounded-xl bg-[var(--surface-soft)] border border-[var(--border-soft)] text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Graduate:</span>
            <span className="font-bold">{userName || "Alex Morgan"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Credential ID:</span>
            <span className="font-mono text-blue-600 dark:text-blue-400 font-bold">{credentialId}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[var(--muted)]">Issued By:</span>
            <span className="font-bold">
              {course.instructor.name} ({course.instructor.company})
            </span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <button
            onClick={onClaim}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-black text-xs shadow-lg shadow-purple-600/30 cursor-pointer"
          >
            Claim Verified Certificate & Return to Dashboard
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
