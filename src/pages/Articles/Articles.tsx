import React, { useState } from "react";
import { ArticleService } from "../../api/ArticleService";

export const Articles = () => {
  const [authorName, setAuthorName] = useState("");
  const [titles, setTitles] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [noResult, setNoResult] = useState(false);
  const [serverError, setServerError] = useState(false);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTitles([]);
    setAuthorName(event.target.value);
    initStates();
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    // utile per inizializzare gli stati quando si ha gia la stringa nell'input a seguito di un errore di rete e ritenti senza riscrivere
    initStates();
    setIsLoading(true);
    event.preventDefault();
    try {
      const titlesResponse: string[] = await getArticles(authorName);
      setTitles(titlesResponse);
      if (titlesResponse.length === 0) {
        setNoResult(true);
      }
      setIsLoading(false);
    } catch (error) {
      console.error("Si è verificato un errore: ", error);
      setServerError(true);
    }
  };

  const initStates = () => {
    setServerError(false);
    setNoResult(false);
  };

  const getArticles = async (authorName: string) => {
    const titles: string[] = [];
    let currentPage = 1;
    let totalPages = 1; // Inizializzato a 1 per il controllo iniziale
  
    // Funzione per ottenere i titoli dall'API
    const fetchTitles = async (pageNumber: number) => {
      try {
        const response = await ArticleService.getArticles(authorName, pageNumber);
        const { data, total_pages } = response;
        totalPages = total_pages; // Aggiorna il numero totale di pagine
  
        data.forEach((article: { title: string; story_title: string }) => {

          const title = article.title || article.story_title;
          if (title) {
            titles.push(title);
          }
        });
  
        // Se ci sono più pagine, richiama fetchTitles in modo ricorsivo per recuperare i dati delle pagine successive
        if (pageNumber < total_pages) {
          await fetchTitles(pageNumber + 1);
        }
      } catch (error) {
        console.error("Errore durante il recupero degli articoli: ", error);
        setServerError(true);
      }
    };
  
    // Avvia il recupero dei titoli dalla prima pagina
    await fetchTitles(currentPage);
  
    // Una volta completato il recupero dei titoli, restituisci l'array completo
    return titles;
  };
  

  return (
    <div className="p-4">
      <form onSubmit={handleSubmit}>
        <label>
          Inserisci il nome dell'autore degli articoli:
          <input
            className="ml-2"
            type="text"
            value={authorName}
            onChange={handleChange}
          />
        </label>
        <button type="submit" className="ml-4">
          Cerca
        </button>
      </form>
      {isLoading && <div className="mt-8 font-semibold">Caricamento ...</div>}
      {titles.length > 0 && <div className="font-bold mt-4">Articoli:</div>}
      <ul>
        {titles.map((title, index) => (
          <li className="text-left" key={index}>
            {title}
          </li>
        ))}
      </ul>
      {noResult && !serverError && (
        <div className="font-bold text-red-500">
          Non sono stati trovati articoli con autore:{" "}
          <span className="uppercase">{authorName}</span>
        </div>
      )}
      {serverError && (
        <div className="font-bold text-red-500">
          Si è verificato un errore, riprova più tardi
        </div>
      )}
    </div>
  );
};
