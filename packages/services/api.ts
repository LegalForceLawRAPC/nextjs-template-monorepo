/* eslint-disable turbo/no-undeclared-env-vars */
import axios, { AxiosRequestConfig } from "axios";
import { ifSpreadObject } from "utils";

export const API_HOST = process.env.NEXT_PUBLIC_API_HOST;
export const UPLOADER_HOST = process.env.NEXT_PUBLIC_UPLOADER_HOST;
export const TMO_HOST = process.env.NEXT_PUBLIC_TMO_HOST;

export const STATIC_HOST = "https://static.trademarkia.com";

export interface Options<Req>
  extends Omit<AxiosRequestConfig<Req>, "url" | "headers"> {
  url?: string;
  headers?: any;
}

export type Fetcher<Res, Req = any, Query = any> = (
  body?: Req,
  options?: Options<Req>,
  urlParams?: Query
) => Promise<ResWrapper<Res>>;

export interface DefaultOptions<Query = {}>
  extends Omit<AxiosRequestConfig, "url" | "headers"> {
  url: string | ((param: Query) => string);
  headers?: any;

  getTokens?: boolean;
  withTokens?: boolean;

  getPeTokens?: boolean;
  withPeTokens?: boolean;

  isFormData?: boolean;
}

export interface ResWrapper<T> {
  body?: T;
  msg?: string;
  error?: any;
}

const localStorage = typeof window === "undefined" ? null : window.localStorage;

export const createFetcher =
  <Res = any, Req = any, Query = any>({
    url,
    getTokens,
    withTokens,
    isFormData,
    getPeTokens,
    withPeTokens,
    ...defaultOptions
  }: DefaultOptions<Query>): Fetcher<Res, Req, Query> =>
  async (
    body?: Req,
    options: Options<Req> = {},
    urlParams?: Query
  ): Promise<ResWrapper<Res>> => {
    const formData = isFormData ? new FormData() : undefined;
    if (isFormData) {
      Object.keys(body as any).forEach((key) => {
        formData?.append(key, (body as any)[key]);
      });
    }
    try {
      const res = await axios({
        headers: {
          "Content-Type": isFormData
            ? "multipart/form-data"
            : "application/json",
          ...ifSpreadObject(!!withTokens, {
            Authorization: `Bearer ${localStorage?.getItem("token")}`,
          }),
          ...ifSpreadObject(!!withPeTokens, {
            Authorization: `Bearer ${localStorage?.getItem("peToken")}`,
          }),
        },
        url:
          typeof url === "function"
            ? url(urlParams || ({} as Query))
            : url || "",
        ...defaultOptions,
        ...options,
        data: isFormData
          ? formData
          : {
              ...defaultOptions.data,
              ...options.data,
              ...body,
            },
        params: {
          ...defaultOptions.params,
          ...options.params,
        },
      });
      if (getTokens) localStorage?.setItem("token", res.data.body.token);
      if (getPeTokens) localStorage?.setItem("peToken", res.data.body.peToken); // TODO : change target
      return { ...res.data };
    } catch (error: any) {
      return { error: error.response ? error.response : error };
    }
  };

export const apiRoute = (path: string) => `${API_HOST}${path}`;
export const uploaderRoute = (path: string) => `${UPLOADER_HOST}${path}`;
export const tmoRoute = (path: string) => `${TMO_HOST}${path}`;

export const mediaRoute = (path: string) => `${API_HOST}/media/${path}`;
