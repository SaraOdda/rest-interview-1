# REST API: Interview 1

Write an HTTP GET method to retrieve information from an articles database. The query response is paginated and can be further accessed by appending to the query string &page=num where num is the page number.

Given a string of author, your solution must perform the following tasks:

1. Query <https://jsonmock.hackerrank.com/api/articles?author=>authorName&page=num (replace authorName and num).
2. Initialize the titles array to store a list of string elements.
3. Store the name of each article returned in the data field to the titles array using the following logic:
    * If title is not null, use title as the name.
    * If title is null, and story title is not null, use story_title as the name.
    * If both title and story_title are null, ignore the article.
4. Based on the total_pages count, fetch all the data (pagination) and perform step 3 for each.
5. Return the array of titles.
6. Cache the results to avoid further requests being made to the API.

The query response from the website is a JSON response with the following five fields:

* page: The current page.
* per_page: The maximum number of results per page.
* total: The total number of records in the search result.
* total_pages: The total number of pages that must be queried to get all the results.
* data: An array of JSON objects containing article information

## Conditions

* Write your code following the TDD approach.
* Do not use web frameworks (e.g. Flask, Django, etc.).

## Instructions

1. Fork this repository.
2. Write your solution.
3. Commit and push your changes.

## Evaluation Criteria

* Code quality (clean, readable, maintainable).
* Test quality (coverage, assertions, etc.).
* Solution completeness.
* Performance.
* Architecture (design, separation of concerns, etc.).

## Solution

Dopo un'attenta valutazione dei requisiti, ho optato per l'utilizzo di React con TypeScript al fine di ridurre al minimo i potenziali errori di tipo. Ho iniziato l'implementazione con lo sviluppo dei test per la funzione getArticles nel caso d'uso più semplice: il recupero degli articoli cercati per autore che si trovano nella stessa pagina. Successivamente, ho proceduto con l'implementazione del servizio Articles utilizzando la libreria Axios per effettuare la chiamata e la libreria axios-cache-interceptor per memorizzare nella cache la risposta della chiamata. Durante lo sviluppo, ho migliorato ulteriormente la chiamata inserendo anche una gestione del tempo di vita della cache personalizzata (TTL).

Nel frattempo, ho sviluppato l'interfaccia utente, che è stata progettata per offrire un'esperienza fluida e intuitiva. La chiamata a getArticles avviene al momento del submit del form, all'interno del quale viene gestita tutta la logica necessaria. Infine, dopo che i primi test sono andati a buon fine ho ampliato i test per includere la chiamata a getArticles utilizzando la paginazione, e ho concluso il processo con un refactoring generale del codice per garantirne la qualità e la manutenibilità nel lungo termine.

Lo stile è definito al minimo utilizzando Tailwind, il giusto necessario per renderlo intuibile.