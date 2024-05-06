export interface ConfigResponseInterface {
  base_uri: string;
  static_file_rule: any[]; // Дополнительно следует уточнить структуру
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
  frequency_limit_rule: any[]; // Дополнительно следует уточнить структуру
  backend_upstream: any; // Дополнительно следует уточнить структуру
  redirect_rule: RedirectRule[];
  config_version: string;
  browser_verify_rule: any[]; // Дополнительно следует уточнить структуру
  browser_verify_enable: boolean;
  proxy_pass_rule: any[]; // Дополнительно следует уточнить структуру
  response: ResponseTypes;
  scheme_lock_rule: SchemeLockRule[];
  matcher: { [key: string]: Matcher };
  dashboard_host: string;
  uri_rewrite_enable: boolean;
  readonly: boolean;
  summary_collect_rule: any[]; // Дополнительно следует уточнить структуру
}

interface Admin {
  user: string;
  password: string;
  enable: boolean;
}

interface RewriteRule {
  enable: boolean;
  replace_re: string;
  to_uri: string;
  matcher: string;
}

interface FilterRule {
  matcher: string;
  enable: boolean;
  action: 'accept' | 'block';
  code?: string;
}

interface RedirectRule {
  matcher: string;
  to_uri: string;
  enable: boolean;
}

interface ResponseTypes {
  demo_response_html: ResponseDetail;
  demo_response_json: ResponseDetail;
}

interface ResponseDetail {
  content_type: string;
  body: string;
}

interface SchemeLockRule {
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
