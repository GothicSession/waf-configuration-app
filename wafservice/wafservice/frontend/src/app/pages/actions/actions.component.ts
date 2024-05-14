import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule,
  TuiDialogService, TuiDropdownModule,
  TuiErrorModule, TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiCheckboxModule,
  TuiDataListWrapperModule,
  TuiFieldErrorPipeModule, TuiInputModule,
  TuiPushService, TuiSelectModule,
  TuiTabsModule
} from "@taiga-ui/kit";
import {
  ArgRule, BrowserRule,
  ConfigResponseInterface, FrequencyRule,
  Matcher,
  MatcherLabel,
  Operator, ResponseTypes, SchemeLockRule
} from "../../models/config-response.interface";
import {Observable, tap} from "rxjs";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {ConfigsService} from "../../services/configs.service";
import {TuiAutoFocusModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-actions',
  standalone: true,
  imports: [
    AsyncPipe,
    KeyValuePipe,
    NgForOf,
    NgIf,
    NgTemplateOutlet,
    TuiButtonModule,
    TuiTabsModule,
    TuiCheckboxModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiDataListWrapperModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiDropdownModule,
    NgSwitch,
    NgSwitchCase,
    TuiSvgModule
  ],
  templateUrl: './actions.component.html',
  styleUrl: './actions.component.scss'
})
export class ActionsComponent implements OnInit {
  activeTab: string = 'scheme';

  @ViewChild('dialogSchemeTpl')
  dialogSchemeTpl!: TemplateRef<void>;

  @ViewChild('dialogRedirectTpl')
  dialogRedirectTpl!: TemplateRef<void>;

  @ViewChild('dialogRewriteTpl')
  dialogRewriteTpl!: TemplateRef<void>;

  @ViewChild('dialogBrowserTpl')
  dialogBrowserTpl!: TemplateRef<void>;

  @ViewChild('dialogFrequencyTpl')
  dialogFrequencyTpl!: TemplateRef<void>;

  @ViewChild('dialogFilterTpl')
  dialogFilterTpl!: TemplateRef<void>;

  requested: string = 'add';
  open = false;
  matcherModel = '';
  schemeModel = '';
  codeModel = '';
  customResponseModel = '';
  actionModel = '';

  isChangedFirstConfig = false;
  config$: Observable<ConfigResponseInterface | null>;

  schemeList = ['http', 'https', 'none'];
  codeList = ['200', '400', '401', '402', '403', '404', '405', '406', '408', '409', '410', '426', '429', '444', '451', '500', '501', '502', '503', '504', '505', '507'];
  actionList = ['accept', 'block'];
  matcherNamesList = [''];
  customResponsesNamesList = [''];

  isSchemeLockEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isRedirectEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isRewriteEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isBrowserEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isFrequencyEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true})
  isFilterEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  isSchemeLockRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isRedirectRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isBrowserRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isFrequencyRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isFilterRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  isCookieEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isJavaScriptEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isCustomResponseEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isClientIpEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isUriEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});

  regExControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  redirectToControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});

  onClick(label: string): void {
    this.activeTab = label;
  }

  constructor(
    private readonly _configsService: ConfigsService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiPushService) protected readonly push: TuiPushService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService
  ) {
    this.config$ = this._configsService.getConfig$().pipe(tap(
      response => {
        if (response) {
          this.isChangedFirstConfig = JSON.stringify(response) !== JSON.stringify(this._configsService.sourceConfig);
          this.isSchemeLockEnabled.setValue(!!response?.scheme_lock_enable, {emitEvent: false});
          this.isRedirectEnabled.setValue(!!response?.redirect_enable, {emitEvent: false});
          this.isRewriteEnabled.setValue(response.uri_rewrite_enable, {emitEvent: false});
          this.isBrowserEnabled.setValue(response.browser_verify_enable, {emitEvent: false});
          this.isFrequencyEnabled.setValue(response.frequency_limit_enable, {emitEvent: false});
          this.isFilterEnabled.setValue(response.filter_enable, {emitEvent: false})
          this.matcherNamesList = this.getMatcherNames(response);
          this.customResponsesNamesList = this.getResponseNames(response);
        }
      }
    ));
  }

  ngOnInit(): void {
    this.isSchemeLockEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.scheme_lock_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isRedirectEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.redirect_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isRewriteEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.uri_rewrite_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isBrowserEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.browser_verify_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isFrequencyEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.frequency_limit_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isFilterEnabled.valueChanges.subscribe(value => {
      const config = this._configsService.getConfig();
      if (config) {
        config.filter_enable = value;

        this._configsService.setConfig({...config});
      }
    })
  }

  getIsRedirectRuleIncludeType(type: string, rule: BrowserRule): boolean {
    return rule.type.some((ruleItem: string): boolean => ruleItem === type);
  }

  getIsFrequencyRuleIncludeType(type: string, rule: FrequencyRule): boolean {
    return rule.separate.some((ruleItem: string): boolean => ruleItem === type);
  }

  resetConfig(): void {
    if (this._configsService.sourceConfig) {
      this._configsService.setConfig(JSON.parse(JSON.stringify(this._configsService.sourceConfig)));
    }
  }

  addSchemeLockRule(matcher: string, scheme: string, enabled: boolean, observer: any): void {
    this._configsService.addSchemeLockRule(matcher, scheme, enabled);
    observer.complete();
  }

  addFilterRule(
    matcherName?: string,
    action?: string,
    returnCode?: string,
    customerResponseEnable?: boolean,
    customerResponse?: string,
    enabled?: boolean,
    observer?: any
  ): void {
    this._configsService.addFilterRule(
      matcherName,
      action,
      returnCode,
      customerResponseEnable,
      customerResponse,
      enabled
    );
    observer.complete();
  }

  addRedirectRule(matcher: string, regEx: string, redirectTo: string, enabled: boolean, observer: any): void {
    this._configsService.addRedirectRule(matcher, regEx, redirectTo, enabled);
    observer.complete();
  }

  addRewriteRule(matcher: string, regEx: string, redirectTo: string, enabled: boolean, observer: any): void {
    this._configsService.addRewriteRule(matcher, regEx, redirectTo, enabled);
    observer.complete();
  }

  addFrequencyRule(
    matcherName?: string,
    requestCount?: string,
    time?: string,
    enabled?: boolean,
    code?: string,
    customResponseEnable?: boolean,
    customResponse?: string,
    isClientIp?: boolean,
    isUri?: boolean,
    observer?: any
  ): void {
    this._configsService.addFrequencyRule(matcherName, requestCount, time, enabled, code, customResponseEnable, customResponse, isClientIp, isUri);
    observer.complete();
  }

  addBrowserRule(matcherName: string, isJsEnabled: boolean, isCookieEnabled: boolean, enabled: boolean, observer: any): void {
    this._configsService.addBrowserRule(matcherName, isJsEnabled, isCookieEnabled, enabled);
    observer.complete();
  }

  getResponseNames(config: ConfigResponseInterface): string[] {
    if (!config) {
      console.error('Config is not set');
      return [];
    }

    return Object.keys(config.response);
  }

  getMatcherNames(config: ConfigResponseInterface): string[] {
    if (!config) {
      console.error('Config is not set');
      return [];
    }

    return Object.keys(config.matcher);
  }

  openPopupFilter(
    requested: string,
    matcherName?: string,
    action?: string,
    returnCode?: string,
    customerResponseEnable?: boolean,
    customerResponse?: string
  ): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.actionModel = action || '';
      this.codeModel = returnCode || '';
      this.isCustomResponseEnabled.setValue(!!customerResponseEnable);
      this.customResponseModel = customerResponse || '';
    }

    this.dialogs.open(this.dialogFilterTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.actionModel = '';
        this.codeModel = '';
        this.isCustomResponseEnabled.setValue(false);
        this.customResponseModel = '';
      }
    );
  }

  openPopupFrequency(
    requested: string,
    matcherName?: string,
    requestCount?: string,
    time?: string,
    enabled?: boolean,
    code?: string,
    customResponseEnable?: boolean,
    customerResponse?: string,
    isClientIp?: boolean,
    isUri?: boolean
  ): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.regExControl.setValue(requestCount || '');
      this.redirectToControl.setValue(time || '');
      this.isFrequencyRuleEnabled.setValue(enabled || false);
      this.codeModel = code || '';
      this.customResponseModel = customerResponse || '';
      this.isCustomResponseEnabled.setValue(!!customResponseEnable);
      this.isClientIpEnabled.setValue(!!isClientIp);
      this.isUriEnabled.setValue(!!isUri);
    }

    this.dialogs.open(this.dialogFrequencyTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.regExControl.setValue('');
        this.redirectToControl.setValue('');
        this.isFrequencyRuleEnabled.setValue(false);
        this.codeModel = '';
        this.customResponseModel = '';
        this.isCustomResponseEnabled.setValue(false);
        this.isClientIpEnabled.setValue(false);
        this.isUriEnabled.setValue(false);
      }
    );
  }

  openPopupRewrite(requested: string, matcherName?: string, regEx?: string, redirectTo?: string, enabled?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.regExControl.setValue(regEx || '');
      this.redirectToControl.setValue(redirectTo || '');
      this.isRedirectRuleEnabled.setValue(enabled || false);
    }

    this.dialogs.open(this.dialogRewriteTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.regExControl.setValue('');
        this.redirectToControl.setValue('');
        this.isRedirectRuleEnabled.setValue(false);
      }
    );
  }

  openPopupBrowser(requested: string, matcherName?: string, isJsEnabled?: boolean, isCookieEnabled?: boolean, enabled?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.isJavaScriptEnabled.setValue(!!isJsEnabled);
      this.isCookieEnabled.setValue(!!isCookieEnabled);
      this.isBrowserRuleEnabled.setValue(!!enabled);
    }

    this.dialogs.open(this.dialogBrowserTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.isJavaScriptEnabled.setValue(false);
        this.isCookieEnabled.setValue(false);
        this.isBrowserRuleEnabled.setValue(false);
      }
    );
  }

  openPopupRedirect(requested: string, matcherName?: string, regEx?: string, redirectTo?: string, enabled?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.regExControl.setValue(regEx || '');
      this.redirectToControl.setValue(redirectTo || '');
      this.isRedirectRuleEnabled.setValue(enabled || false);
    }

    this.dialogs.open(this.dialogRedirectTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.regExControl.setValue('');
        this.redirectToControl.setValue('');
        this.isRedirectRuleEnabled.setValue(false);
      }
    );
  }

  saveConfig(): void {
    this._configsService.saveConfig$().subscribe({
      next: (response) => {
        if (response.ret === 'failed') {
          this.alert
          .open(`Не удалось сохранить изменения!`, {status: 'error'})
          .subscribe();
          return;
        }

        this.alert
        .open('Изменения успешно сохранены!', {status: "success"})
        .subscribe();
        this._configsService.sourceConfig = this._configsService.getConfig();
        this.isChangedFirstConfig = false;
      },
      error: (error) => {
        this.alert
        .open(`Не удалось сохранить изменения! Код ошибки ${error.status}`, {status: 'error'})
        .subscribe();
      }
    });
  }

  deleteSchemeLockRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.scheme_lock_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.scheme_lock_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  deleteFilterRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.filter_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.filter_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  deleteFrequencyRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.frequency_limit_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.frequency_limit_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  deleteRewriteRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.uri_rewrite_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.uri_rewrite_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  deleteBrowserRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.browser_verify_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.browser_verify_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  deleteRedirectRule(ruleName: string): void {
    const config = this._configsService.getConfig();
    if (!config) {
      console.error('Config is not set');
      return;
    }

    const index = config.redirect_rule.findIndex((rule) => rule.matcher === ruleName);

    if (index !== -1) {
      // Удаляем элемент из массива с помощью splice
      config.redirect_rule.splice(index, 1);

      // Обновляем состояние конфигурации
      this._configsService.setConfig(config);
    } else {
      console.warn(`Scheme lock rule with matcher "${ruleName}" not found`);
    }
  }

  openPopupRule(requested: string, matcherName?: string, scheme?: string, enable?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.schemeModel = scheme || '';
      this.matcherModel = matcherName || '';
      this.isSchemeLockRuleEnabled.setValue(enable || false);
    }

    this.dialogs.open(this.dialogSchemeTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.schemeModel = '';
        this.matcherModel = '';
        this.isSchemeLockEnabled.setValue(false);
      }
    );
  }

}
