export interface ConfigResponseInterface {
  base_uri: string;
  static_file_rule: StaticFileRule[]; // Дополнительно следует уточнить структуру
  filter_enable: boolean;
  summary_temporary_period: number;
  frequency_limit_enable: boolean;
  static_file_enable: boolean;
  summary_with_host: boolean;
  summary_group_persistent_enable: boolean;
  summary_group_temporary_enable: boolean;
  admin: Admin[];
  uri_rewrite_rule: RewriteRule[];
  redirect_enable: boolean;
  proxy_pass_enable: boolean;
  cookie_prefix: string;
  filter_rule: FilterRule[];
  summary_request_enable: boolean;
  scheme_lock_enable: boolean;
  frequency_limit_rule: FrequencyRule[]; // Дополнительно следует уточнить структуру
  backend_upstream: BackendUpstreamType; // Дополнительно следует уточнить структуру
  redirect_rule: RedirectRule[];
  config_version: string;
  browser_verify_rule: BrowserRule[]; // Дополнительно следует уточнить структуру
  browser_verify_enable: boolean;
  proxy_pass_rule: ProxyPassRule[]; // Дополнительно следует уточнить структуру
  response: ResponseTypes;
  scheme_lock_rule: SchemeLockRule[];
  matcher: { [key: string]: Matcher };
  dashboard_host: string;
  uri_rewrite_enable: boolean;
  readonly: boolean;
  summary_collect_rule: SummaryCollectRule[]; // Дополнительно следует уточнить структуру
  summary_collect_enable?: boolean;
}

export interface Admin {
  user: string;
  password: string;
  enable: boolean;
}

interface RewriteRule {
  enable: boolean;
  replace_re?: string;
  to_uri?: string;
  matcher?: string;
}

export interface BrowserRule {
  enable: boolean;
  matcher: string,
  type: string[]
}

export interface SummaryCollectRule {
  enable?: boolean,
  matcher?: string,
  collect_name?: string
}

export interface FrequencyRule {
  code?: string,
  count?: string,
  custom_response?: boolean,
  enable?: boolean,
  matcher?: string,
  response?: string,
  time?: string,
  separate: string[]
}

export interface StaticFileRule {
  enable?: boolean,
  matcher?: string,
  root?: string,
  expires?: string
}

interface FilterRule {
  matcher?: string;
  enable?: boolean;
  action?: 'accept' | 'block' | string;
  code?: string;
  customer_response?: boolean;
  response?: string;
}

interface RedirectRule {
  matcher: string;
  to_uri: string;
  replace_re?: string;
  enable: boolean;
}

export type ResponseTypes = { [key: string]: ResponseDetail };

export type BackendUpstreamType = { [key: string]: BackendUpstreamDetails}

export interface BackendUpstreamDetails {
  method: string,
  node: BackendNodeType
}

export type BackendNodeType = { [key: string]: BackendNodeDetails}

export interface BackendNodeDetails {
  scheme?: string,
  host?: string,
  port?: string,
  weight?: string
}

export interface ProxyPassRule {
  enable?: boolean;       // Показывает, активно ли правило
  matcher?: string;       // Условие, по которому применяется правило
  upstream?: string;      // Направление запроса
  proxy_host?: string;    // Хост, на который перенаправляется запрос
}

interface ResponseDetail {
  content_type: string;
  body: string;
}

export interface SchemeLockRule {
  scheme: string;
  enable: boolean;
  matcher: string;
}

export type MatcherLabel = 'Args' | 'URI' | 'IP' | 'UserAgent' | 'Header' | 'Host' | 'Referer' | 'Method' | 'Cookie';

export type Matcher = {
  [key in MatcherLabel]?: ArgRule;
};

export type Operator = '≈' | '=' | '!=' | '!≈' | '*' | 'Exist' | '!Exist';

export interface ArgRule {
  value?: string;
  operator?: Operator | string;
  name_operator?: string;
  name_value?: string;
}

export interface SummaryResponse {
  collect: string,
  uri: { [key: string]: SummaryDetails };
}

export interface SummaryDetails {
  count: number,
  size: number,
  time: number,
  status: {
    200: number,
    400: number
  }
}
