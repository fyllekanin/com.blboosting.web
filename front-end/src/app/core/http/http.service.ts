import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

interface Options {
    params?: { [key: string]: string };
    headers?: { [key: string]: string };
    queryParameters?: { [key: string]: string };
}

@Injectable()
export class HttpService {
    private static readonly API = '/api';

    constructor(private httpClient: HttpClient) {

    }

    get<T>(url: string, options?: Options): Observable<T> {
        const completeUrl: string = this.getUrlWithQueryParameters(HttpService.API + url, options?.queryParameters);
        return this.httpClient.get<T>(completeUrl);
    }

    post<B, T>(url: string, body: B, options?: Options): Observable<T> {
        const completeUrl: string = this.getUrlWithQueryParameters(HttpService.API + url, options?.queryParameters);
        return this.httpClient.post<T>(completeUrl, body, options);
    }

    put<T, B>(url: string, body: B, options?: Options): Observable<T> {
        const completeUrl: string = this.getUrlWithQueryParameters(HttpService.API + url, options?.queryParameters);
        return this.httpClient.put<T>(completeUrl, body, options);
    }

    delete<T>(url: string, options?: Options): Observable<T> {
        const completeUrl: string = this.getUrlWithQueryParameters(HttpService.API + url, options?.queryParameters);
        return this.httpClient.delete<T>(completeUrl, options);
    }

    private getUrlWithQueryParameters(url: string, queryParams: { [key: string]: string }): string {
        return `${url}?${new URLSearchParams(queryParams)}`;
    }
}
