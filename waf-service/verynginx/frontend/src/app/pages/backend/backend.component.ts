import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule, TuiDialogService,
  TuiDropdownModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiCheckboxModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiPushService,
  TuiSelectModule, TuiTabsModule
} from "@taiga-ui/kit";
import {ConfigsService} from "../../services/configs.service";
import {Observable, tap} from "rxjs";
import {
  BackendNodeDetails,
  ConfigResponseInterface,
  ProxyPassRule,
  StaticFileRule
} from "../../models/config-response.interface";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-backend',
  standalone: true,
  imports: [
    AsyncPipe,
    NgForOf,
    NgIf,
    TuiButtonModule,
    TuiCheckboxModule,
    KeyValuePipe,
    TuiSvgModule,
    NgTemplateOutlet,
    ReactiveFormsModule,
    TuiDataListWrapperModule,
    TuiDialogModule,
    TuiSelectModule,
    TuiInputModule,
    TuiTextfieldControllerModule,
    FormsModule,
    TuiDropdownModule,
    TuiTabsModule
  ],
  templateUrl: './backend.component.html',
  styleUrl: './backend.component.scss'
})
export class BackendComponent implements OnInit {

  @ViewChild('dialogBackendUpstreamTpl')
  dialogBackendUpstreamTpl!: TemplateRef<void>;

  @ViewChild('dialogProxyPassTpl')
  dialogProxyPassTpl!: TemplateRef<void>;

  @ViewChild('dialogStaticFileTpl')
  dialogStaticFileTpl!: TemplateRef<void>;

  config$: Observable<ConfigResponseInterface | null>;
  upStreamValues: { key: string, value: any }[] | undefined;
  requested: string = 'add';
  activeTab = 'proxy';
  open = false;
  methodModel = '';
  schemeModel = '';
  isChangedFirstConfig = false;

  isProxyPassEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isProxyPassRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isStaticFileEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isStaticFileRuleEnabled: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  upstreamName: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  nodeNameControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  ipControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  proxyHostControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  portControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  weightControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  rootControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  expiresControl: FormControl<string> = new FormControl<string>('', {nonNullable: true});
  methodList = ['random', 'ip_hash'];
  schemesList = ['https', 'http'];
  upStreamList = [''];
  matcherNamesList = [''];
  matcherModel: string = '';
  upStreamModel = '';
  nodeList: any;

  constructor(
    private readonly _configsService: ConfigsService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiPushService) protected readonly push: TuiPushService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService
  ) {
    this.config$ = this._configsService.getConfig$().pipe(
      tap((config) => {
        if (config) {
          this.isChangedFirstConfig = JSON.stringify(config) !== JSON.stringify(this._configsService.sourceConfig);
          this.isProxyPassEnabled.setValue(!!config?.proxy_pass_enable, {emitEvent: false});
          this.isStaticFileEnabled.setValue(!!config?.static_file_enable, {emitEvent: false});
          this.matcherNamesList = this.getMatcherNames(config);
          this.upStreamList = this.getUpstreamNames(config);
        }
      })
    );
  }

  ngOnInit(): void {
    this.isProxyPassEnabled.valueChanges.subscribe((value) => {
      const config = this._configsService.getConfig();
      if (config) {
        config.proxy_pass_enable = value;

        this._configsService.setConfig({...config});
      }
    })

    this.isStaticFileEnabled.valueChanges.subscribe((value) => {
      const config = this._configsService.getConfig();
      if (config) {
        config.static_file_enable = value;

        this._configsService.setConfig({...config});
      }
    })
  }

  openStaticFilePopup(requested: string, matcherName?: string, root?: string, expires?: string, enabled?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.rootControl.setValue(root || '');
      this.expiresControl.setValue(expires || '')
      this.isStaticFileRuleEnabled.setValue(!!enabled);
    }

    this.dialogs.open(this.dialogStaticFileTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.rootControl.setValue('');
        this.expiresControl.setValue('')
        this.isStaticFileRuleEnabled.setValue(false);
      }
    );
  }

  openProxyPassRulePopup(requested: string, matcherName?: string, upStreamName?: string, proxyHost?: string, enabled?: boolean): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.upStreamModel = upStreamName || '';
      this.proxyHostControl.setValue(proxyHost || '');
      this.isProxyPassRuleEnabled.setValue(!!enabled);
    }

    this.dialogs.open(this.dialogProxyPassTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.upStreamModel = '';
        this.proxyHostControl.setValue('');
        this.isProxyPassRuleEnabled.setValue(false);
      }
    );
  }

  openBackendUpstreamPopupRule(requested: string, nodeList?: any, key?: string, method?: string): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.nodeList = nodeList;
      this.upstreamName.setValue(key || '');
      this.methodModel = method || '';
    }

    this.dialogs.open(this.dialogBackendUpstreamTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.nodeList = undefined;
        this.upstreamName.setValue( '');
        this.methodModel = '';
      }
    );
  }

  getMatcherNames(config: ConfigResponseInterface): string[] {
    if (!config) {
      console.error('Config is not set');
      return [];
    }

    return Object.keys(config.matcher);
  }

  getUpstreamNames(config: ConfigResponseInterface): string[] {
    if (!config) {
      console.error('Config is not set');
      return [];
    }

    return Object.keys(config.backend_upstream);
  }

  deleteProxyPassStream(index: number): void {
    const config = this._configsService.getConfig();

    // Проверяем, есть ли конфигурация и правила proxy pass
    if (config && config.proxy_pass_rule) {
      // Проверяем, существует ли правило с таким индексом
      if (index >= 0 && index < config.proxy_pass_rule.length) {
        // Удаляем правило из массива
        config.proxy_pass_rule.splice(index, 1);

        // Сохраняем обновлённую конфигурацию
        this._configsService.setConfig(config);
        console.log('Rule successfully deleted');
      } else {
        console.error('No rule found at index:', index);
      }
    } else {
      console.error('Invalid configuration or proxy_pass_rule does not exist.');
    }
  }

  deleteStaticFileStream(index: number): void {
    const config = this._configsService.getConfig();

    // Проверяем, есть ли конфигурация и правила proxy pass
    if (config && config.static_file_rule) {
      // Проверяем, существует ли правило с таким индексом
      if (index >= 0 && index < config.static_file_rule.length) {
        // Удаляем правило из массива
        config.static_file_rule.splice(index, 1);

        // Сохраняем обновлённую конфигурацию
        this._configsService.setConfig(config);
        console.log('Rule successfully deleted');
      } else {
        console.error('No rule found at index:', index);
      }
    } else {
      console.error('Invalid configuration or proxy_pass_rule does not exist.');
    }
  }

  deleteBackendUpstream(name?: string): void {
    const config = this._configsService.getConfig();

    if (!name) {
      return;
    }

    if (config && config.backend_upstream) {
      if (config.backend_upstream[name]) {
        delete config.backend_upstream[name];

        this._configsService.setConfig(config);
      } else {
        console.error('No rule found with the name:', name);
      }
    } else {
      console.error('Invalid configuration or matcher does not exist.');
    }
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

  resetConfig(): void {
    if (this._configsService.sourceConfig) {
      this._configsService.setConfig(JSON.parse(JSON.stringify(this._configsService.sourceConfig)));
    }
  }

  addStaticFileRule(matcherName?: string, documentRoot?: string, expires?: string, enabled?: boolean, observer?: any): void {
    const config = this._configsService.getConfig();

    if (!config) {
      return;
    }

    const staticFileRule: StaticFileRule = {
      matcher: matcherName,
      root: documentRoot,
      enable: enabled,
      expires
    }

    config.static_file_rule.push(staticFileRule);

    this._configsService.setConfig({...config});

    observer.complete()
  }

  addProxyPassRule(matcherName?: string, upStreamName?: string, proxyHost?: string, enableProxyPassRule?: boolean, observer?: any): void {
    const config = this._configsService.getConfig();

    if (!config) {
      return;
    }

    const proxyRule: ProxyPassRule = {
      matcher: matcherName,
      upstream: upStreamName,
      proxy_host: proxyHost,
      enable: enableProxyPassRule
    }

    config.proxy_pass_rule.push(proxyRule);

    this._configsService.setConfig({...config});

    observer.complete()
  }

  addRule(key: string, method: string, nodeKey?: string, schemeModel?: string, ip?: string, port?: string, weight?: string, observer?: any): void {
    const config = this._configsService.getConfig();
    const nodeDetails: BackendNodeDetails = {
      scheme: schemeModel,
      weight,
      port,
      host: ip
    }

    if (!config || !nodeKey) {
      return;
    }

    // Проверяем, существует ли уже backend_upstream
    if (!config.backend_upstream) {
      config.backend_upstream = {};
    }

    // Проверяем, существует ли уже запись для данного ключа
    if (!config.backend_upstream[key]) {
      config.backend_upstream[key] = {method, node: {}};
    }

    // Добавляем или обновляем детали ноды
    config.backend_upstream[key].node[nodeKey] = nodeDetails;

    this._configsService.setConfig({...config});

    observer.complete()
  }

  deleteBackendUpStreamRule(matcherRuleKey: string, matcherRuleValue: any, matcher: string): void {
    const config = this._configsService.getConfig();

    if (config && config.backend_upstream) {
      const rule = config.backend_upstream[matcher];

      if (rule && matcherRuleValue) {
        Object.keys(rule).forEach(key => {
          // @ts-ignore
          if (rule[key] === matcherRuleValue) {
            // @ts-ignore
            delete rule[key];
          }
        });

        const index = this.upStreamValues?.findIndex(matcherKey => matcherKey.key === matcherRuleKey);
        if (typeof index === 'number') {
          this.upStreamValues?.splice(index, 1);
        }
        this._configsService.setConfig(config);
      }
    }
  }

  objectToKeyValuePairs(obj: Record<string, any>): { key: string, value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({key, value}));
  }

}
