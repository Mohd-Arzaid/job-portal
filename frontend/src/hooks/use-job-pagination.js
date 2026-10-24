"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

export default function useJobPagination({
  filteredJobs = [],
  limit = 6,
  searchQuery,
  selectedJobTypes,
  selectedLocations,
  selectedExperience,
  selectedSalary,
  sortBy,
} = {}) {
  const searchParams = useSearchParams();
  const pathName = usePathname();

  // 1. Initial Page from URL searchParams (?page=2)
  // Agar user URL mein directly /jobs?page=2 open kare, toh pagination Page 2 se start ho, Page 1 se nahi
  const pageParam = parseInt(searchParams?.get("page") || "1", 10);

  // pageParam valid number nahi hai ya 1 se chhota hai toh 1 rakho
  // example: ?page=abc ya ?page=0 -> initialPage = 1
  const initialPage = isNaN(pageParam) || pageParam < 1 ? 1 : pageParam;

  // 2. Pagination State
  // currentPage mai track karte hain ki user abhi kis page par hai
  const [currentPage, setCurrentPage] = useState(initialPage);

  // 3. Total counts and pages calculations
  // Total jobs aur unhe dikhane ke liye kitne pages chahiye, ye calculate karna ke liye
  // Example: 14 jobs aur limit 6 -> totalPages = Math.ceil(14 / 6) = 3
  const totalJobs = filteredJobs?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalJobs / limit));

  // 4. Reset to Page 1 whenever Search, Filters or Sort change
  // kyunki Search/filter lagne ke baad current page available nhi bhi ho sakta hai
  // Example: User Page 3 par hai, filter lagane par sirf 1 page ki jobs bachti hai
  // Isliye naye search/filter/sort ke baad Page 1 se start karte hain.
  const isFirstRender = useRef(true);

  useEffect(() => {
    // Initial render par reset karne ki zaroorat nahi,
    // kyunki currentPage pehle hi URL se initialize ho chuka hai
    // isFirstRender ko false karte hain taaki next dependency change par effect chale
    if (isFirstRender.current) {
      isFirstRender.current = false;
      return;
    }

    setCurrentPage(1);

    // Agar URL mein page parameter hai toh use hata do.
    // Example: /jobs?page=3 -> /jobs
    // Kyunki search/filter/sort change hone par pagination Page 1 se shuru hogi
    if (
      typeof window !== "undefined" &&
      window.location.search.includes("page")
    ) {
      window.history.replaceState(null, "", pathName);
    }
  }, [
    searchQuery,
    selectedJobTypes,
    selectedLocations,
    selectedExperience,
    selectedSalary,
    sortBy,
    pathName,
  ]);

  // 5. Ensure currentPage doesn't exceed totalPages if filteredJobs count decreases
  // Iski vajah -> Agar jobs kam ho jaaye aur currentPage available pages se aage ho, toh user ko empty page par rehne se bachana
  // Example: currentPage = 3, lekin filter ke baad totalPages = 1 -> Page 1 par reset.
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(1);
    }
  }, [currentPage, totalPages]);

  // 6. Listen to Browser Back/Forward navigation for ?page=
  // Example: /jobs?page=3 par Back dabane se URL /jobs?page=2 ho,
  // toh currentPage ko bhi 2 karna hai, taaki URL aur UI match kare
  useEffect(() => {
    // URL ke page parameter ke saath currentPage sync karna
    const syncPageWithUrl = () => {
      // URL ke query parameters read karna, jaise ?page=3
      const currentParams = new URLSearchParams(window.location.search);

      // URL se page number lena, parameter na ho toh default "1"
      const pageNumber = parseInt(currentParams.get("page") || "1", 10);

      // Page number invalid ya 1 se chhota ho toh page 1 set karna
      setCurrentPage(isNaN(pageNumber) || pageNumber < 1 ? 1 : pageNumber);
    };

    // Browser ke Back/Forward button par URL change hone ko listen karna
    window.addEventListener("popstate", syncPageWithUrl);

    // Component unmount hone par listener remove karna,
    // taaki purana listener background mein active na rahe
    return () => window.removeEventListener("popstate", syncPageWithUrl);
  }, []);

  // 7. Page Change Handler : update state, sync URL and scroll top smoothly
  const handlePageChange = useCallback(
    (newPage) => {
      // Invalid page ya current page dobara click hone par function rok do.
      // Example: totalPages = 3 aur user Page 4 maange -> kuch update nahi hoga.
      if (newPage < 1 || newPage > totalPages || newPage === currentPage) {
        return;
      }

      // User ne jo page select kiya hai, currentPage ko us par set karna.
      // Example: Page 1 se Page 2 click kiya -> currentPage = 2.
      setCurrentPage(newPage);

      // URL ko naye page ke saath update karna, bina full page reload ke.
      // Example: /jobs -> /jobs?page=2
      // Page 1 ke liye ?page=1 ki jagah simple /jobs rakhenge.
      if (typeof window !== "undefined") {
        const newUrl = newPage > 1 ? `${pathName}?page=${newPage}` : pathName;
        window.history.pushState(null, "", newUrl);
      }

      // Page change hone par user ko smoothly top par le jaana, taaki nayi jobs dekhne ke liye manually scroll up na karna pade.
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [totalPages, currentPage, pathName],
  );

  // 8. Sliced items for current active page
  // Iski vajah: Saari jobs ek saath dikhane ke jagah sirf current page ki jobs dikhana
  // Example: 14 jobs, limit = 6, currentPage = 2 -> Job 7 se Job 12 tak.
  const paginatedJobs = useMemo(() => {
    // filtered Job array nahi hai toh slice() error se bachne ke liye empty array return karo
    if (!Array.isArray(filteredJobs)) return [];

    // Current page ke starting index ko calculate karo
    // Example: currentPage = 2, limit = 6 -> startIndex = 6
    const startIndex = (currentPage - 1) * limit;

    // startIndex se limit jitni jobs return kro
    // Example: slice(6, 12) -> index 6 se 11 tak, yaani 6 jobs
    return filteredJobs.slice(startIndex, startIndex + limit);

    // In values ke change hone par hi paginated jobs ki calculation dobara hogi, Nahi toh useMemo last result reuse karega
  }, [filteredJobs, currentPage, limit]);

  return {
    currentPage,
    totalPages,
    totalJobs,
    limit,
    paginatedJobs,
    handlePageChange,
    setCurrentPage,
  };
}
