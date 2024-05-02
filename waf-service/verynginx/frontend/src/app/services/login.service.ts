/**
 * Open API
 * # Описание методов для взаимодействия между: Front-end и Back-end. ## Версионность запросов Версионность запросов поддерживается по средствам добавления в URL запроса части, отвечающей за версию.    ### Параметры подключения : * Протокол: HTTPS c поддержкой TLS v.1.2, TLS v.1.3 * Тестовый сервер: - * Боевой сервер: -   ### Дата создания: 2024-04-18
 *
 * OpenAPI spec version: 0.0.1
 *
 *
 * NOTE: This class is auto generated by the swagger code generator program.
 * https://github.com/swagger-api/swagger-codegen.git
 * Do not edit the class manually.
 */ /* tslint:disable:no-unused-variable member-ordering */

import {Inject, Injectable, OnInit, Optional} from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams, HttpResponse, HttpEvent } from '@angular/common/http';
import {Observable, tap} from "rxjs";
import {CookieService} from "ngx-cookie-service";
import {LoginResponseInterface} from "../models/login-response.interface";
import {StatusResponseInterface} from "../models/status-response.interface";
// import { CustomHttpUrlEncodingCodec } from '../encoder';
//
// import { Observable } from 'rxjs';
//
// import { GetBalanceRs } from '../model/getBalanceRs';
// import { GetBalancesRs } from '../model/getBalancesRs';
//
// import { BASE_PATH, COLLECTION_FORMATS } from '../variables';
// import { Configuration } from '../configuration';

@Injectable({
  providedIn: 'root'
})
export class LoginService {
  protected basePath = '/wafservice';
  public defaultHeaders = new HttpHeaders();
  // public configuration = new Configuration();

  constructor(
    protected httpClient: HttpClient,
    private readonly _cookieService: CookieService
    // @Optional() @Inject(BASE_PATH) basePath: string,
    // @Optional() configuration: Configuration,
  ) {
    // if (basePath) {
    //   this.basePath = '';
    // }
    // if (configuration) {
    //   this.configuration = configuration;
    //   this.basePath = basePath || configuration.basePath || this.basePath;
    // }
  }

  /**
   * @param consumes string[] mime-types
   * @return true: consumes contains 'multipart/form-data', false: otherwise
   */
  private canConsumeForm(consumes: string[]): boolean {
    const form = 'multipart/form-data';
    for (const consume of consumes) {
      if (form === consume) {
        return true;
      }
    }
    return false;
  }

  user: any;

  /**
   * Получение баланса пользователя
   * Получение баланса пользователя.
   * @param login
   * @param password
   * @param Authorization wasd-access-token
   * @param Cookie wasd-access-token
   * @param observe set whether or not to return the data Observable as the body, response or events. defaults to returning the body.
   * @param reportProgress flag to report request and response progress.
   */
  public login(
    login: string,
    password: string,
    Authorization?: string,
    Cookie?: string,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<LoginResponseInterface> {
    if (login === null || password === undefined) {
      throw new Error(
        'Required parameter login or password was null or undefined when calling getBalance.',
      );
    }

    let headers = new HttpHeaders({
      'Content-Type': 'application/x-www-form-urlencoded', // Установка заголовка Content-Type для URL-encoded формы
    });
    if (Authorization !== undefined && Authorization !== null) {
      headers = headers.set('Authorization', String(Authorization));
    }
    if (Cookie !== undefined && Cookie !== null) {
      headers = headers.set('Cookie', String(Cookie));
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    // const httpHeaderAcceptSelected: string | undefined =
    //   this.configuration.selectHeaderAccept(httpHeaderAccepts);
    // if (httpHeaderAcceptSelected != undefined) {
    //   headers = headers.set('Accept', httpHeaderAcceptSelected);
    // }

    // to determine the Content-Type header
    const consumes: string[] = [];

    // Создание HttpParams для отправки данных
    let body = new HttpParams()
    .set('user', login)
    .set('password', password);

    return this.httpClient.post<any>(
      `${this.basePath}/login`,
      body.toString(),
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    ).pipe(
      tap((response: LoginResponseInterface) => {
        if (response?.cookies) {
          if (response.cookies.verynginx_session) {
            this._cookieService.set('verynginx_session', response.cookies.verynginx_session);
          }
          if (response.cookies.verynginx_user) {
            this._cookieService.set('verynginx_user', response.cookies.verynginx_user);
          }
        }
      })
    );
  }

  public getStatus(
    Authorization?: string,
    Cookie?: string,
    observe?: 'body',
    reportProgress?: boolean,
  ): Observable<StatusResponseInterface> {
    let headers = this.defaultHeaders;
    if (Authorization !== undefined && Authorization !== null) {
      headers = headers.set('Authorization', String(Authorization));
    }
    if (Cookie !== undefined && Cookie !== null) {
      headers = headers.set('Cookie', String(Cookie));
    }

    // to determine the Accept header
    let httpHeaderAccepts: string[] = ['application/json'];
    // const httpHeaderAcceptSelected: string | undefined =
    //   this.configuration.selectHeaderAccept(httpHeaderAccepts);
    // if (httpHeaderAcceptSelected != undefined) {
    //   headers = headers.set('Accept', httpHeaderAcceptSelected);
    // }

    // to determine the Content-Type header
    const consumes: string[] = [];

    return this.httpClient.request<StatusResponseInterface>(
      'get',
      `${this.basePath}/status`,
      {
        headers: headers,
        observe: observe,
        reportProgress: reportProgress,
      },
    )
  }
}
