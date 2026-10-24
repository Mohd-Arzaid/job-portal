import { cn } from "@/lib/utils";
import { ChevronLeft, ChevronRight } from "lucide-react";
import React from "react";

// Helper to generate pagination numbers with ellipsis (e.g. [1, 2, "...", 10])
function getPageNumbers(currentPage, totalPages) {
  // Total pages 5 ya usse kam hain toh saare page numbers dikha do
  // Example: totalPages = 5 -> [1, 2, 3, 4, 5]
  // Is case mein dots ki zaroorat nahi hai kyunki saare pages easily dikh sakte hain
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, pageIndex) => pageIndex + 1);
  }

  const visiblePageNumbers = [];

  // Hamesha first page ko visible rakhna hai
  // Example: totalPages = 10 -> pagination mein Page 1 hamesha dikhega
  visiblePageNumbers.push(1);

  // Current page 3 se aage hai toh beech ke hidden pages ko represent karne ke liye dots dikhao
  // Example: currentPage = 5 -> [1, "...", ...]
  if (currentPage > 3) {
    visiblePageNumbers.push("...");
  }

  // Current page ke ek pehle aur ek baad wale page ko calculate karna
  // Math.max(2, currentPage - 1) isliye use kiya taaki Page 1 dobara add na ho
  // Example: currentPage = 5 -> startPage = 4
  const startPage = Math.max(2, currentPage - 1);

  // Last page se pehle wale pages mein se current page ke ek baad tak numbers dikhana
  // Math.min(totalPages - 1, currentPage + 1) isliye use kiya taaki last page dobara add na ho
  // Example: currentPage = 5, totalPages = 10 -> endPage = 6
  const endPage = Math.min(totalPages - 1, currentPage + 1);

  // Calculated startPage se endPage tak ke page numbers array mein add karna
  // Example: startPage = 4, endPage = 6 -> [4, 5, 6]
  for (let pageNumber = startPage; pageNumber <= endPage; pageNumber++) {
    visiblePageNumbers.push(pageNumber);
  }

  // Current page last page se 2 se zyada pages pehle hai toh aage ke hidden pages ke liye dots dikhao
  // Example: currentPage = 5, totalPages = 10 -> [1, "...", 4, 5, 6, "..."]
  if (currentPage < totalPages - 2) {
    visiblePageNumbers.push("...");
  }

  // Hamesha last page ko visible rakhna hai
  // Example: totalPages = 10 -> Page 10 hamesha dikhega
  visiblePageNumbers.push(totalPages);

  return visiblePageNumbers;
}

export default function Pagination({
  currentPage = 1,
  totalPages = 1,
  totalJobs = 0,
  limit = 6,
  onPageChange,
  isLoading = false,
  className,
}) {
  // 1 ya usse kam pages hain toh pagination dikhane ki zaroorat nahi
  // Example: totalPages = 1 -> sirf ek page hai, isliye Previous/Next buttons ki zaroorat nahi
  if (!totalPages || totalPages <= 1) {
    return null;
  }

  // Current page par pehli job ka serial number calculate karna
  // Example: currentPage = 2, limit = 6 -> firstVisibleJob = 7
  const firstVisibleJob = (currentPage - 1) * limit + 1;

  // Current page par aakhri job ka serial number calculate karna
  // Math.min() isliye use kiya taaki last page par totalJobs se zyada number na dikhe
  // Example: totalJobs = 14, currentPage = 3, limit = 6 -> lastVisibleJob = 14
  const lastVisibleJob = Math.min(currentPage * limit, totalJobs);

  // Check karna ki current page se pehle koi page available hai ya nahi
  // Page 1 par Previous button disabled rahega
  const hasPreviousPage = currentPage > 1;

  // Check karna ki current page ke baad koi page available hai ya nahi
  // Last page par Next button disabled rahega
  const hasNextPage = currentPage < totalPages;

  // Previous button click hone par ek page peeche jaana
  // hasPreviousPage check karta hai ki Page 1 se peeche na jaayein
  // isLoading check karta hai ki loading ke time page change na ho
  // onPageChange check karta hai ki parent component ne page change ka function pass kiya hai ya nahi
  const handlePreviousPage = () => {
    if (hasPreviousPage && !isLoading && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  // Next button click hone par ek page aage jaana
  // hasNextPage check karta hai ki totalPages se aage na jaayein
  // Example: currentPage = 2 -> Next click karne par Page 3 par jayenge
  const handleNextPage = () => {
    if (hasNextPage && !isLoading && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // Numbered page button click hone par selected page par jaana
  // Agar current page dobara click kiya toh unnecessary state update nahi hoga
  // isLoading aur onPageChange ki conditions bhi page change ko valid hone par hi allow karti hain
  const handlePageClick = (selectedPage) => {
    if (selectedPage !== currentPage && !isLoading && onPageChange) {
      onPageChange(selectedPage);
    }
  };

  return (
    <nav
      aria-label="Pagination Navigation"
      className={cn(
        "mt-8 flex flex-col items-center justify-between gap-4 border-t border-neutral-100 pt-6 sm:flex-row",
        className,
      )}
    >
      {/* Items Range Summary */}
      <p className="text-sm text-neutral-500">
        Showing{" "}
        <span className="font-medium text-neutral-900">
          {firstVisibleJob} to {lastVisibleJob}
        </span>{" "}
        of <span className="font-medium text-neutral-900">{totalJobs}</span>{" "}
        available jobs
      </p>

      {/* Pagination Controls */}
      <div className="flex items-center gap-1.5">
        {/* Previous Button */}
        <button
          type="button"
          onClick={handlePreviousPage}
          disabled={!hasPreviousPage || isLoading}
          aria-label="Previous page"
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50 hover:text-neutral-950 cursor-pointer disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <ChevronLeft size={14} />
          <span>Previous</span>
        </button>

        {/* Numbered Page Buttons with Ellipsis */}
        <div className="flex items-center gap-1">
          {/* getPageNumbers() current page aur total pages ke basis par visible page numbers return karta hai
              Example: currentPage = 5, totalPages = 10 -> [1, "...", 4, 5, 6, "...", 10] */}
          {getPageNumbers(currentPage, totalPages).map((pageNumber, index) => {
            // Page number ki jagah "..." mila toh usse non-clickable text ki tarah dikhana
            // Kyunki dots kisi actual page ko represent nahi karte, sirf hidden pages ko indicate karte hain
            if (pageNumber === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="inline-flex size-9 items-center justify-center text-xs text-neutral-400 select-none"
                >
                  ...
                </span>
              );
            }

            // Check karna ki current numbered button active page hai ya nahi
            // Active page ko dark background denge taaki user ko apni current position pata rahe
            const isActivePage = pageNumber === currentPage;

            return (
              <button
                key={pageNumber}
                type="button"
                onClick={() => handlePageClick(pageNumber)}
                disabled={isLoading}
                aria-current={isActivePage ? "page" : undefined}
                className={cn(
                  "inline-flex size-9 items-center justify-center rounded-lg text-xs font-medium transition cursor-pointer",
                  isActivePage
                    ? "bg-neutral-900 text-white shadow-2xs"
                    : "border border-neutral-200 bg-white text-neutral-700 hover:bg-neutral-50 hover:text-neutral-950",
                )}
              >
                {pageNumber}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={handleNextPage}
          disabled={!hasNextPage || isLoading}
          aria-label="Next page"
          className={cn(
            "inline-flex h-9 items-center gap-1 rounded-lg border border-neutral-200 bg-white px-3 text-xs font-medium text-neutral-700 shadow-2xs transition hover:bg-neutral-50 hover:text-neutral-950 cursor-pointer disabled:pointer-events-none disabled:opacity-40",
          )}
        >
          <span>Next</span>
          <ChevronRight size={14} />
        </button>
      </div>
    </nav>
  );
}
