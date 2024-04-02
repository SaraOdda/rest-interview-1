import Axios from "axios";
import { constants } from "../constants";
import { setupCache } from "axios-cache-interceptor";

const instance = Axios.create();
const axios = setupCache(instance);

class ArticleService {
  static getArticles = async (authorName: string, page: number) => {
    const params = {
      author: authorName,
      page: page,
    };
    const result = await axios.get(`${constants.api.getArticles}`, {params} );

    return result.data;
  };
}

export { ArticleService };
