import { getArticlesCache } from "./getArticlesCache";

describe("getArticlesCache", () => {
  it("should return an array of article objects sorted by date", async () => {
    const articles = await getArticlesCache();
    expect(Array.isArray(articles)).toBe(true);
    expect(articles.length).toBeGreaterThan(0);
    expect(articles[0].date).toBeDefined();
    const article1 = articles[0];
    const article2 = articles[articles.length - 1];
    expect(
      article1.date &&
        article2.date &&
        (article2.date as string).localeCompare(article1.date as string) < 0
    ).toBe(true);
  });
});
