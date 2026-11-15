import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

describe("ContactPage", () => {
  it("keeps long contact details inside narrow viewports", () => {
    const contactPage = readFileSync(new URL("./page.js", import.meta.url), "utf8");
    const shell = readFileSync(
      new URL("../components/StaticPage/StaticPageShell.js", import.meta.url),
      "utf8",
    );
    const contactItem = readFileSync(
      new URL("../components/StaticPage/ContactItem.js", import.meta.url),
      "utf8",
    );
    const button = readFileSync(
      new URL("../components/StaticPage/StaticPageButton.js", import.meta.url),
      "utf8",
    );

    expect(shell).toContain("overflow-x-hidden");
    expect(contactItem).toContain("[overflow-wrap:anywhere]");
    expect(contactItem).toContain("min-w-0 flex-1");
    expect(contactPage).toContain("grid-cols-1");
    expect(contactPage).toContain("sm:grid-cols-2");
    expect(button).toContain("w-full");
    expect(button).toContain("sm:w-auto");
    expect(contactPage).toContain("christianvieux.dev@gmail.com");
  });
});
