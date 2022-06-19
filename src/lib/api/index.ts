import axios from "axios";
import qs from "qs";
import protectedRoutes from "./protected-routes";

interface IHeaders {
  Authorization?: string;
}

interface IParams {
  query?: Record<string, any>;
  data?: Data;
}

type Data = JSON | FormData | null;

const EmptyParams = {
  query: {},
  data: null,
};

const getHeaders = (url: string, data: Data) => {
  const headers: IHeaders = {};

  const isProtectedUrl = !!protectedRoutes.find(protectedUrl => protectedUrl.test(url));

  if (isProtectedUrl) {
    headers.Authorization = `Bearer ${localStorage.getItem("Authorization")}`;
  }

  if (data instanceof FormData) {
    headers["Content-Type"] = "multipart/form-data";
  }

  return headers;
};

interface IRequestProps {
  method: "get" | "post" | "put" | "patch" | "delete";
  query: Record<string, any>;
  url: string;
  data: any;
}

const request = ({ method, url, query, data }: IRequestProps) =>
  axios({
    method,
    url: `${process.env.API_URL}/${url}?${qs.stringify(query)}`,
    data,
    headers: getHeaders(url, data),
  })
    .then(({ data }) => data)
    .catch(err => new Promise((resolve, reject) => reject(err.response.data)));

const api = {
  get: (url: string, params: IParams = EmptyParams) =>
    request({
      method: "get",
      url,
      query: params.query || {},
      data: null,
    }),
  post: (url: string, params: IParams = EmptyParams) =>
    request({
      method: "post",
      url,
      query: params.query || {},
      data: params.data || null,
    }),
  put: (url: string, params: IParams = EmptyParams) =>
    request({
      method: "put",
      url,
      query: params.query || {},
      data: params.data || null,
    }),
  patch: (url: string, params: IParams = EmptyParams) =>
    request({
      method: "patch",
      url,
      query: params.query || {},
      data: params.data || null,
    }),
  delete: (url: string, params: IParams = EmptyParams) =>
    request({
      method: "delete",
      url,
      query: params.query || {},
      data: params.data || null,
    }),
};

export default api;
