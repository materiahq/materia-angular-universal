import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class QueryService {

  constructor(private http: HttpClient) { }

  runQuery(baseUrl, entity: string, query: string, params?: any) {
    return this.http
      .post(`${baseUrl}/entities/${entity}/queries/${query}`, params)
      .toPromise();
  }

  launchClientBuild(baseUrl, prod?) {
    return this.http
      .post(`${baseUrl}/client/build`, {prod: prod})
      .toPromise();
  }
}
