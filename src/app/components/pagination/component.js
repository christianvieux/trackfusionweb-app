"use client";

import { Pagination } from "@heroui/react";

/* -------------------- */
/* HELPERS */
/* -------------------- */

function getVisiblePages(page, total, siblings = 1) {
  const pages = [];

  const start = Math.max(1, page - siblings);
  const end = Math.min(total, page + siblings);

  if (start > 1) {
    pages.push(1);
    if (start > 2) pages.push("start-dots");
  }

  for (let currentPage = start; currentPage <= end; currentPage++) {
    pages.push(currentPage);
  }

  if (end < total) {
    if (end < total - 1) pages.push("end-dots");
    pages.push(total);
  }

  return pages;
}

/* -------------------- */
/* PAGINATION */
/* -------------------- */

export default function AppPagination({
  page = 1,
  total = 1,
  onChange,
  siblings = 1,
  className = "",
  ...props
}) {
  const visiblePages = getVisiblePages(page, total, siblings);

  function goToPage(nextPage) {
    if (nextPage < 1 || nextPage > total || nextPage === page) return;
    onChange?.(nextPage);
  }

  return (
    <Pagination id="Track_List_Table_Pagination" className={`flex justify-center overflow-x-auto ${className}`} {...props}>
      <Pagination.Content className="flex flex-wrap justify-center gap-2 self-center!">
        <Pagination.Item>
          <Pagination.Previous
            isDisabled={page === 1}
            onPress={() => goToPage(page - 1)}
            className="size-8 min-w-8 rounded-full text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Pagination.PreviousIcon />
          </Pagination.Previous>
        </Pagination.Item>

        {visiblePages.map((item) => (
          <Pagination.Item key={item}>
            {typeof item === "string" ? (
              <span className="flex size-8 items-center justify-center text-muted-foreground">
                ...
              </span>
            ) : (
              <Pagination.Link
                isActive={item === page}
                onPress={() => goToPage(item)}
                className={`size-8 min-w-8 rounded-full border bg-transparent text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                  item === page
                    ? "border-success text-success"
                    : "border-transparent"
                }`}
              >
                {item}
              </Pagination.Link>
            )}
          </Pagination.Item>
        ))}

        <Pagination.Item>
          <Pagination.Next
            isDisabled={page === total}
            onPress={() => goToPage(page + 1)}
            className="size-8 min-w-8 rounded-full text-foreground focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
          >
            <Pagination.NextIcon />
          </Pagination.Next>
        </Pagination.Item>
      </Pagination.Content>
    </Pagination>
  );
}
