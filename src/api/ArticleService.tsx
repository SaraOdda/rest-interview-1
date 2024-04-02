import Axios from "axios";
import { setupCache } from "axios-cache-interceptor";

const ttl = process.env.REACT_APP_AXIOS_CACHE_TTL
  ? Number(process.env.REACT_APP_AXIOS_CACHE_TTL)
  : 60; // Se non esiste default a 60 minuti

const instance = Axios.create();
const axios = setupCache(instance, {
  headerInterpreter: undefined,
  ttl: ttl * 60 * 1000
}); 

class ArticleService {
  static getArticles = async (authorName: string, page: number) => {
    const params = {
      author: authorName,
      page: page,
    };

    const result = await axios.get(
      `${process.env.REACT_APP_HACKER_RANK_BASE_URL}/api/articles`,
      { params }
    );

    return result.data;
  };
}

export { ArticleService };
