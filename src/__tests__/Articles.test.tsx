import React from "react";
import { render, fireEvent, waitFor, screen } from "@testing-library/react";
import { Articles } from "../pages/Articles/Articles";
import { ArticleService } from "../api/ArticleService";

describe("Articles component", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  //controlla se gli elementi esistono nel DOM
  it("renders a form with an input field and a button", () => {
    const { getByLabelText, getByText } = render(<Articles />);
    const inputElement = getByLabelText(
      /Inserisci il nome dell'autore degli articoli/i
    );
    expect(inputElement).toBeInTheDocument();

    const buttonElement = getByText(/Cerca/i);
    expect(buttonElement).toBeInTheDocument();
  });

  it("fetches articles when form is submitted", async () => {
    //creazione oggetto e monitoraggio della funzione getArticles
    const mockGetArticles = jest.spyOn(ArticleService, "getArticles");

    //prendo le funzioni che interagiscono con il componente e selezionare gli elementi al suo interno
    const { getByText, getByLabelText } = render(<Articles />);
    const inputElement = getByLabelText(
      /Inserisci il nome dell'autore degli articoli/i
    );
    const buttonElement = getByText(/Cerca/i);

    //mock dell'oggetto che il servizio dovrebbe ritornare dopo l'eleborazione dei dati
    const articlesData = {
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
    };

    mockGetArticles.mockResolvedValue(articlesData);

    //simulazione dell'input e del click
    fireEvent.change(inputElement, { target: { value: "epaga" } });
    fireEvent.click(buttonElement);

    //funzione che controlla se la chiamata è stata effettuata una sola volta
    //e se che alla chiamata venga passato i parametri corretti
    await waitFor(() => {
      expect(mockGetArticles).toHaveBeenCalledTimes(1);
      expect(mockGetArticles).toHaveBeenCalledWith("epaga", 1);
    });

    // Attendi che i dati vengano caricati
    await screen.findByText("Steve Jobs e il suo patrimonio");
    await screen.findByText("Annunci su Google");
    await screen.findByText("Tesla allarme rosso");

    // Verifica che gli articoli siano presenti negli elementi <li>
    expect(
      screen.getByText("Steve Jobs e il suo patrimonio")
    ).toBeInTheDocument();
    expect(screen.getByText("Annunci su Google")).toBeInTheDocument();
    expect(screen.getByText("Tesla allarme rosso")).toBeInTheDocument();
  });

  //test di GetArticles con paginazione per controllare se la funzione viene chiamata tante volte quante sono le pagine
  it("fetches articles for multiple pages when form is submitted", async () => {
    // Creazione oggetto e monitoraggio della funzione getArticles
    const mockGetArticles = jest.spyOn(ArticleService, "getArticles");
  
    // Prendo le funzioni che interagiscono con il componente e seleziono gli elementi al suo interno
    const { getByText, getByLabelText } = render(<Articles />);
    const inputElement = getByLabelText(
      /Inserisci il nome dell'autore degli articoli/i
    );
    const buttonElement = getByText(/Cerca/i);
  
    // Mock dell'oggetto che il servizio dovrebbe ritornare dopo l'eleborazione dei dati
    const articlesDataPage1 = {
      page: 1,
      per_page: 2,
      total: 4,
      total_pages: 2,
      data: [
        { title: "Steve Jobs e il suo patrimonio", story_title: null },
        { title: null, story_title: "Annunci su Google" },
      ],
    };
  
    const articlesDataPage2 = {
      page: 2,
      per_page: 2,
      total: 4,
      total_pages: 2,
      data: [
        { title: null, story_title: null },
        { title: "Tesla allarme rosso", story_title: null },
      ],
    };
  
    // Prima chiamata del form
    mockGetArticles.mockResolvedValueOnce(articlesDataPage1);

    // Seconda chiamata del form
    mockGetArticles.mockResolvedValueOnce(articlesDataPage2);
  
    fireEvent.change(inputElement, { target: { value: "epaga" } });
    fireEvent.click(buttonElement);
  
    // Verifica che la chiamata sia stata effettuata due volte con i paramentri corretti
    await waitFor(() => {
      expect(mockGetArticles).toHaveBeenCalledTimes(2);
      expect(mockGetArticles).toHaveBeenCalledWith("epaga", 1); // Verifica per la prima chiamata
      expect(mockGetArticles).toHaveBeenCalledWith("epaga", 2); // Verifica per la seconda chiamata
    });
  
    // Attendi che i dati vengano caricati per entrambe le pagine
    await screen.findByText("Steve Jobs e il suo patrimonio");
    await screen.findByText("Annunci su Google");
    await screen.findByText("Tesla allarme rosso");
  
    // Verifica che gli articoli siano presenti negli elementi <li>
    expect(
      screen.getByText("Steve Jobs e il suo patrimonio")
    ).toBeInTheDocument();
    expect(screen.getByText("Annunci su Google")).toBeInTheDocument();
    expect(screen.getByText("Tesla allarme rosso")).toBeInTheDocument();
  });
});
