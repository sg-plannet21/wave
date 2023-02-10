import { AxiosRequestConfig } from 'axios';
import jwt_decode from 'jwt-decode';
import _, { Dictionary } from 'lodash';
import { User as LoginResponse } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import { User } from 'state/auth/types';
import { BareFetcher } from 'swr';
import { axios } from './axios';
import storage from './storage';
import { ApiCollectionResponse } from './types';

const baseUrl = process.env.NEXT_PUBLIC_API_URL;

// const defaultFetchOptions: Omit<RequestInit, 'body'> = {
//   headers: { 'Content-Type': 'application/json; charset=utf-8' },
// };

export function login(
  credentials: Record<'username' | 'password', string>
): Promise<LoginResponse> {
  return fetch(baseUrl + '/token/', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(credentials),
  }).then((res) => {
    if (res.ok) return res.json();
    throw new Error('A Network Error has occured');
  });
}

export async function refreshAccessToken(token: JWT): Promise<JWT> {
  try {
    console.log('making token request');
    const response = await fetch(baseUrl + '/token/refresh/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh: token.refreshToken }),
    });

    console.log('response.ok :>> ', response.ok);
    const refreshedTokens = (await response.json()) as {
      access: string;
      refresh?: string;
    };
    if (!response.ok) {
      console.log('Network issue');
      return {
        ...token,
        error: 'RefreshAccessTokenError',
      };
      // throw new Error(response.statusText);
    }

    console.log('successfull retrieved toekn');

    const decodedUser = jwt_decode(refreshedTokens.access) as User;
    return {
      user: decodedUser,
      accessTokenExpiresAt: decodedUser.exp,
      accessToken: refreshedTokens.access,
      refreshToken: refreshedTokens.refresh ?? token.refreshToken, // Fall back to old refresh token
    };
  } catch (error) {
    console.log(error);
    console.log('eror refreshing token');
    return {
      ...token,
      error: 'RefreshAccessTokenError',
    };
  }
}

function addBaseUrl(url: string) {
  return url.startsWith('/') ? baseUrl + url : url;
}

export function fetcherInit(accessToken: string) {
  return function fetcher<JSON>(
    input: RequestInfo,
    init?: RequestInit
  ): Promise<JSON> {
    const requestInfo =
      typeof input === 'string'
        ? addBaseUrl(input)
        : new Request({ ...input, url: addBaseUrl(input.url) });
    const headers = {
      'Content-Type': 'application/json; charset=utf-8',
      Authorization: 'Bearer ' + accessToken,
      businessunit: storage.getBusinessUnit(),
    };
    return fetch(requestInfo, {
      ...init,
      headers,
    }).then((res) => res.json());
  };
}

type GetRequest = AxiosRequestConfig | null;

export function fetcher<JSON>(request: GetRequest): Promise<JSON> | null {
  console.log('Not making req yet', request);
  if (request === null) return null;
  console.log('making req');
  return axios.request(request).then((response) => response.data);
}

export async function continousFetcher<DATA = unknown>(request: GetRequest) {
  // if (!request?.url) return null;
  const results: DATA[] = [];
  let page = 1;
  let hasNext = true;
  while (hasNext) {
    const { data } = await axios.request<ApiCollectionResponse<DATA>>({
      ...request,
      url: `${request?.url}?page=${page++}`,
    });
    results.push(...data.results);
    if (!data.next) hasNext = false;
  }
  return results;
}

export function entityFetcher<Data>(
  entityId: keyof Data,
  orderBy: keyof Data
): BareFetcher<Dictionary<Data>> {
  return async (
    ...args: [url: string, businessUnit: string]
  ): Promise<Dictionary<Data>> => {
    const [url] = args;

    const results: Data[] = [];
    let hasNext = true;
    const page = 1;
    let reqUrl = `${url}?page=${page}`;
    do {
      const { data } = await axios.get<ApiCollectionResponse<Data>>(reqUrl);
      results.push(...data.results);
      // `${url}?page=${++page}`
      if (data.next) {
        reqUrl =
          process.env.NODE_ENV === 'development'
            ? data.next.replace(/^https:\/\//i, 'http://')
            : data.next;
      } else {
        hasNext = false;
      }
    } while (hasNext);

    return _.chain(results).sortBy(orderBy).keyBy(entityId).value();
  };
}
