import { useState } from "react";
import type { NavigableItem } from "../../types";

interface FlashcardsTabProps {
  item: NavigableItem;
}

export default function FlashcardsTab({ item }: FlashcardsTabProps) {
  const [currentCardIndex, setCurrentCardIndex] = useState<number>(0);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [masteredCards, setMasteredCards] = useState<Set<number>>(new Set());

  const flashcards = item.flashcards || [];
  const totalCards = flashcards.length || 1;
  const currentCard = flashcards[currentCardIndex];

  const handlePrevCard = () => {
    setCurrentCardIndex((prev) => Math.max(prev - 1, 0));
    setIsCardFlipped(false);
  };

  const handleNextCard = () => {
    setCurrentCardIndex((prev) => Math.min(prev + 1, totalCards - 1));
    setIsCardFlipped(false);
  };

  const handleToggleMastered = () => {
    setMasteredCards((prev) => {
      const next = new Set(prev);
      if (next.has(currentCardIndex)) {
        next.delete(currentCardIndex);
      } else {
        next.add(currentCardIndex);
      }
      return next;
    });
  };

  return (
    <div className="p-6 sm:p-8 space-y-6 max-w-xl mx-auto text-center">
      <div className="space-y-1">
        <h3 className="text-base font-black text-[var(--text)]">Concept Flashcards</h3>
        <p className="text-xs text-[var(--muted)]">
          Active recall card {currentCardIndex + 1} of {totalCards}
        </p>
      </div>

      {/* Flip Card Container */}
      {currentCard && (
        <div
          onClick={() => setIsCardFlipped(!isCardFlipped)}
          className="min-h-[220px] p-8 rounded-2xl bg-[var(--surface-soft)] border border-[var(--border)] hover:border-blue-500/50 shadow-xs flex flex-col items-center justify-center cursor-pointer transition-all hover:-translate-y-0.5"
        >
          <span className="text-[10px] font-bold uppercase text-blue-600 dark:text-blue-400 tracking-wider mb-3">
            {isCardFlipped
              ? "Answer / Explanation (Click to flip)"
              : "Concept Term (Click to reveal)"}
          </span>
          <h4 className="text-base sm:text-lg font-black text-[var(--text)] leading-relaxed">
            {isCardFlipped ? currentCard.back : currentCard.front}
          </h4>
        </div>
      )}

      {/* Flashcard Controls */}
      <div className="flex items-center justify-between pt-2">
        <button
          disabled={currentCardIndex <= 0}
          onClick={handlePrevCard}
          className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold disabled:opacity-30 cursor-pointer"
        >
          ◀ Prev Card
        </button>

        <button
          onClick={handleToggleMastered}
          className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
            masteredCards.has(currentCardIndex)
              ? "bg-emerald-500/20 text-emerald-400 border-emerald-500/40"
              : "bg-[var(--surface-soft)] border-[var(--border)] text-[var(--muted)]"
          }`}
        >
          {masteredCards.has(currentCardIndex) ? "✓ Mastered" : "Mark as Mastered"}
        </button>

        <button
          disabled={currentCardIndex >= totalCards - 1}
          onClick={handleNextCard}
          className="px-3.5 py-1.5 rounded-xl bg-[var(--surface-soft)] border border-[var(--border)] text-xs font-bold disabled:opacity-30 cursor-pointer"
        >
          Next Card ▶
        </button>
      </div>
    </div>
  );
}
