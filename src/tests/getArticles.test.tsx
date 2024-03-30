import { getArticles } from "../api/ArticleService";

describe("getArticles", () => {
  it("should fetch articles by author name and return titles array", async () => {
    const axiosMock = jest.fn().mockResolvedValue({
      articles: {
        page: 1,
        per_page: 10,
        total: 4,
        total_pages: 1,
        data: [
          {
            title: "Steve Jobs e il suo patrimonio",
            story_title: "Il guadagno di Steve Jobs",
          },
          { title: null, story_title: "Annunci su Google" },
          { title: null, story_title: null },
          { title: "Tesla allarme rosso", story_title: null },
        ],
      },
    });

    jest.mock("axios", () => ({
      create: () => ({ get: axiosMock }),
    }));

    const titles = await getArticles("authorName");

    // Verifica che la chiamata API sia stata fatta con i parametri corretti
    expect(axiosMock).toHaveBeenCalledWith(
      "https://jsonmock.hackerrank.com/api/articles",
      {
        params: { author: "authorName", page: 1 },
      }
    );

    // Verifica che i titoli siano stati elaborati correttamente
    expect(titles).toEqual([
      "Steve Jobs e il suo patrimonio",
      "Annunci su Google",
      "Tesla allarme rosso",
    ]);
  });
});
