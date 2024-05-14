import {DestroyRef, Injectable} from '@angular/core';
import {LoginService} from "./login.service";
import {BehaviorSubject, Observable, of} from "rxjs";
import {
  ConfigResponseInterface,
  FrequencyRule,
  Matcher,
  ResponseTypes,
  SummaryResponse
} from "../models/config-response.interface";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {catchError} from "rxjs/operators";

@Injectable({
  providedIn: 'root'
})
export class ConfigsService {

  config$: BehaviorSubject<ConfigResponseInterface | null> = new BehaviorSubject<ConfigResponseInterface | null>(null);
  summary$: BehaviorSubject<SummaryResponse | null> = new BehaviorSubject<SummaryResponse | null>(null);
  sourceConfig?: ConfigResponseInterface | null;

   summary: SummaryResponse = {
    uri: {
      "/wafservice/index.html": {
        time: 0,
        size: 2792145,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/js/matcher_editor.js": {
        time: 0,
        size: 251066,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/js/util.js": {
        time: 0,
        size: 23256,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/login": {
        time: 0,
        size: 1000,
        status: {
          "200": 8
        },
        count: 8
      },
      "/wafservice/summary": {
        time: 0,
        size: 4966,
        status: {
          "200": 2,
          "400": 29
        },
        count: 31
      },
      "/wafservice/config": {
        time: 0,
        size: 42773,
        status: {
          "200": 20,
          "400": 5
        },
        count: 25
      },
      // Add other paths similarly...
      "/wafservice/status": {
        time: 0,
        size: 2993239,
        status: {
          "200": 6209,
          "400": 21734
        },
        count: 27943
      },
      "/wafservice/js/config.js": {
        time: 0,
        size: 222984,
        status: {
          "200": 19
        },
        count: 19
      },
    },
    collect: {
      "/wafservice/index.html": {
        time: 0,
        size: 2792145,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/js/matcher_editor.js": {
        time: 0,
        size: 251066,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/js/util.js": {
        time: 0,
        size: 23256,
        status: {
          "200": 19
        },
        count: 19
      },
      "/wafservice/login": {
        time: 0,
        size: 1000,
        status: {
          "200": 8
        },
        count: 8
      },
      "/wafservice/summary": {
        time: 0,
        size: 4966,
        status: {
          "200": 2,
          "400": 29
        },
        count: 31
      },
      "/wafservice/config": {
        time: 0,
        size: 42773,
        status: {
          "200": 20,
          "400": 5
        },
        count: 25
      },
      // Add other paths similarly...
      "/wafservice/status": {
        time: 0,
        size: 2993239,
        status: {
          "200": 6209,
          "400": 21734
        },
        count: 27943
      },
      "/wafservice/js/config.js": {
        time: 0,
        size: 222984,
        status: {
          "200": 19
        },
        count: 19
      },
    }
  };


  config: ConfigResponseInterface = {
    base_uri: "/wafservice",
    static_file_rule: [
      {
        enable: true,
        matcher: "attack_code_0",
        root: "/asdas/wafs",
        expires: "1s"
      },
      {
        enable: true,
        matcher: "all_request",
        root: "/asdfag/wgfasd",
        expires: "1h"
      }
    ],
    filter_enable: true,
    summary_temporary_period: 60,
    frequency_limit_enable: true,
    static_file_enable: true,
    summary_with_host: false,
    summary_group_persistent_enable: true,
    summary_group_temporary_enable: true,
    admin: [
      {
        user: "wafservice",
        password: "wafservice",
        enable: true
      }
    ],
    uri_rewrite_rule: [
      {
        enable: true,
        replace_re: "^/vn/(.*)",
        to_uri: "/wafservice/$1",
        matcher: "demo_wafservice_short_uri"
      }
    ],
    redirect_enable: true,
    proxy_pass_enable: true,
    cookie_prefix: "wafservice",
    filter_rule: [
      {
        matcher: "localhost",
        enable: false,
        action: "accept"
      },
      {
        enable: true,
        matcher: "attack_sql_0",
        code: "403",
        action: "block"
      },
      {
        enable: true,
        matcher: "attack_backup_0",
        code: "403",
        action: "block"
      },
      {
        enable: true,
        matcher: "attack_scan_0",
        code: "403",
        action: "block"
      },
      {
        enable: true,
        matcher: "attack_code_0",
        code: "403",
        action: "block"
      }
    ],
    summary_request_enable: true,
    scheme_lock_enable: false,
    frequency_limit_rule: [],
    backend_upstream: {
      asdasdas: {
        method: 'random',
        node: {}
      },
      werffas: {
        method: "random",
        node: {}
      },
      test: {
        method: "random",
        node: {
          elena: {
            scheme: "http",
            host: "127.0.0.1",
            port: "8080",
            weight: "10"
          }
        }
      }
    },
    redirect_rule: [
      {
        matcher: "demo_other_wafservice_uri",
        to_uri: "/wafservice/index.html",
        enable: true
      }
    ],
    config_version: "0.36",
    browser_verify_rule: [],
    browser_verify_enable: true,
    proxy_pass_rule: [
      {
        enable: true,
        matcher: "all_request",
        upstream: "asdasdas",
        proxy_host: "asdasdasd"
      }
    ],
    response: {
      demo_response_html: {
        content_type: "text/html",
        body: "This is a html demo response"
      },
      demo_response_json: {
        content_type: "application/json",
        body: "{\"msg\":\"soms text\",\"status\":\"success\"}"
      }
    },
    scheme_lock_rule: [
      {
        scheme: "https",
        enable: false,
        matcher: "wafservice"
      }
    ],
    matcher: {
      attack_sql_0: {
        Args: {
          value: "select.*from",
          operator: "≈",
          name_operator: "*"
        }
      },
      wafservice: {
        URI: {
          value: "^/wafservice/",
          operator: "≈"
        }
      },
      all_request: {},
      demo_wafservice_short_uri: {
        URI: {
          value: "^/vn",
          operator: "≈"
        }
      },
      attack_code_0: {
        URI: {
          value: "\\.(git|svn|\\.)",
          operator: "≈"
        }
      },
      attack_backup_0: {
        URI: {
          value: "\\.(htaccess|bash_history|ssh|sql)$",
          operator: "≈"
        }
      },
      localhost: {
        IP: {
          value: "127.0.0.1",
          operator: "="
        }
      },
      demo_other_wafservice_uri: {
        URI: {
          value: "/redirect_to_wafservice",
          operator: "="
        }
      },
      attack_scan_0: {
        UserAgent: {
          value: "(nmap|w3af|netsparker|nikto|fimap|wget)",
          operator: "≈"
        }
      }
    },
    dashboard_host: "",
    uri_rewrite_enable: true,
    readonly: false,
    summary_collect_rule: [
      {
        enable: true,
        matcher: "all_request",
        collect_name: "фывфывф"
      },
      {
        enable: true,
        matcher: "wafservice",
        collect_name: "aDsa"
      }
    ]
  };

  constructor(
    private readonly _loginService: LoginService,
    private readonly _destroyRef: DestroyRef
  ) {
  }

  loadRequestSummary(): void {
    this._loginService.getSummary().pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError(() => {
        return of(this.summary)
      })
    ).subscribe((response) => {
      this.summary$.next(response);
    })
  }

  getSummary$(): Observable<SummaryResponse | null> {
    return this.summary$.asObservable();
  }

  loadConfig(): void {
    this._loginService.getConfig().pipe(
      takeUntilDestroyed(this._destroyRef),
      catchError(() => {
        return of(this.config)
      })
    ).subscribe((response) => {
      this.sourceConfig = JSON.parse(JSON.stringify(response));
      this.config$.next(response);
    });
  }

  // @ts-ignore
  saveConfig$(): Observable<any> {
    if (this.getConfig()) {
      // @ts-ignore
      return this._loginService.saveConfig(this.getConfig())
    }
  }

  setConfig(config: ConfigResponseInterface): void {
    this.config$.next(config);
  }

  addBrowserRule(matcher: string, isJsEnabled: boolean, isCookieEnabled: boolean, enabled: boolean): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    const browserRule = {
      matcher,
      enable: enabled,
      type: []
    }

    if (isJsEnabled) {
      // @ts-ignore
      browserRule.type = [...browserRule.type, 'javascript'];
    }

    if (isCookieEnabled) {
      // @ts-ignore
      browserRule.type = [...browserRule.type, 'cookie'];
    }

    config.browser_verify_rule.push(browserRule);

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  addFrequencyRule(
    matcher?: string,
    requestCount?: string,
    time?: string,
    enabled?: boolean,
    code?: string,
    customResponseEnable?: boolean,
    customResponse?: string,
    isClientIp?: boolean,
    isUri?: boolean,
  ): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    const frequencyRule: FrequencyRule = {
      matcher,
      enable: enabled,
      code,
      count: requestCount,
      time: time,
      custom_response: customResponseEnable,
      response: customResponse,
      separate: []
    }

    if (isClientIp) {
      // @ts-ignore
      frequencyRule.separate = [...frequencyRule.separate, 'ip'];
    }

    if (isUri) {
      // @ts-ignore
      frequencyRule.separate = [...frequencyRule.separate, 'uri'];
    }

    config.frequency_limit_rule.push(frequencyRule);

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  addRewriteRule(matcher: string, regEx: string, rewriteTo: string, enabled: boolean): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    // Создаем новое правило или обновляем существующее
    const existingRuleIndex = config.uri_rewrite_rule.findIndex(rule => rule.matcher === matcher);

    if (existingRuleIndex !== -1) {
      // Обновляем существующее правило
      config.uri_rewrite_rule[existingRuleIndex] = {matcher, replace_re: regEx, to_uri: rewriteTo, enable: enabled};
    } else {
      // Добавляем новое правило
      config.uri_rewrite_rule.push({matcher, replace_re: regEx, to_uri: rewriteTo, enable: enabled});
    }

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  addRedirectRule(matcher: string, regEx: string, redirectTo: string, enabled: boolean): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    // Создаем новое правило или обновляем существующее
    const existingRuleIndex = config.redirect_rule.findIndex(rule => rule.matcher === matcher);

    if (existingRuleIndex !== -1) {
      // Обновляем существующее правило
      config.redirect_rule[existingRuleIndex] = {matcher, replace_re: regEx, to_uri: redirectTo, enable: enabled};
    } else {
      // Добавляем новое правило
      config.redirect_rule.push({matcher, replace_re: regEx, to_uri: redirectTo, enable: enabled});
    }

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  addFilterRule(
    matcherName?: string,
    action?: string,
    returnCode?: string,
    customerResponseEnable?: boolean,
    customerResponse?: string,
    enabled?: boolean
  ): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    config.filter_rule.push({matcher: matcherName || '', action, enable: enabled, code: returnCode, response: customerResponse, customer_response: customerResponseEnable});

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  addSchemeLockRule(matcher: string, scheme: string, enabled: boolean): void {
    const config = this.getConfig();

    if (!config) {
      return;
    }

    // Создаем новое правило или обновляем существующее
    const existingRuleIndex = config.scheme_lock_rule.findIndex(rule => rule.matcher === matcher);

    if (existingRuleIndex !== -1) {
      // Обновляем существующее правило
      config.scheme_lock_rule[existingRuleIndex] = {matcher, scheme, enable: enabled};
    } else {
      // Добавляем новое правило
      config.scheme_lock_rule.push({matcher, scheme, enable: enabled});
    }

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  setResponseConfig(newResponseRule: ResponseTypes): void {
    const config = this.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    // Создаем копию конфигурации для изменения
    const updatedConfig = {...config};

    // Обновляем или добавляем правила ответа
    updatedConfig.response = {
      ...updatedConfig.response,
      ...newResponseRule,
    };

    // Обновляем состояние конфигурации
    this.config$.next(updatedConfig);
  }

  setMatcherConfig(newMatcherObj: { [key: string]: Matcher }): void {
    const config = this.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    if (!config.matcher) {
      config.matcher = {}; // Инициализация matcher, если он еще не инициализирован
    }

    Object.entries(newMatcherObj).forEach(([key, newMatcher]) => {
      if (config.matcher[key]) {
        // Если ключ уже существует в matcher, дополняем существующий объект
        Object.entries(newMatcher).forEach(([label, argRule]) => {
          // @ts-ignore
          if (config.matcher[key][label]) {
            // Дополняем существующие правила
            // @ts-ignore
            Object.assign(config.matcher[key][label], argRule);
          } else {
            // Если такой label нет, добавляем его
            // @ts-ignore
            config.matcher[key][label] = argRule;
          }
        });
      } else {
        // Если ключа нет, добавляем его в matcher
        config.matcher[key] = newMatcher;
      }
    });

    // Обновляем состояние конфигурации
    this.config$.next(config);
  }

  getConfig(): ConfigResponseInterface | null {
    return this.config$.value;
  }

  getConfig$(): Observable<ConfigResponseInterface | null> {
    return this.config$.asObservable();
  }
}
