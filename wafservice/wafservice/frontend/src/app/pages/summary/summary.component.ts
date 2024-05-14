import {Component, DestroyRef, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule,
  TuiDialogService, TuiDropdownModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {
  TuiCheckboxModule,
  TuiDataListWrapperModule,
  TuiInputModule,
  TuiPushService, TuiSelectModule,
  TuiTabsModule
} from "@taiga-ui/kit";
import {Observable, tap} from "rxjs";
import {ConfigResponseInterface, SummaryCollectRule} from "../../models/config-response.interface";
import {ConfigsService} from "../../services/configs.service";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";

@Component({
  selector: 'app-summary',
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
    TuiInputModule,
    TuiDataListWrapperModule,
    TuiDialogModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDropdownModule,
    FormsModule
  ],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {

  @ViewChild('dialogCollectTpl')
  dialogCollectTpl!: TemplateRef<void>;

  activeTab = 'general';
  open = false;
  isChangedFirstConfig = false;
  config$: Observable<ConfigResponseInterface | null>;
  matcherList = [''];

  isEnableSummary: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isEnableLogRequest: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isEnablePersistent: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isEnableTemporary: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  temporaryPeriod: FormControl<string> = new FormControl<string>('', { nonNullable: true});

  isEnabledCollect: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  isEnableCollectRule: FormControl<boolean> = new FormControl<boolean>(false, {nonNullable: true});
  matcherModel = '';
  collectNameControl: FormControl<string> = new FormControl<string>('', {nonNullable: true})

  constructor(
    private readonly _configsService: ConfigsService,
    private readonly _destroyRef: DestroyRef,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiPushService) protected readonly push: TuiPushService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService
  ) {
    this.config$ = this._configsService.getConfig$().pipe(
      tap((config) => {
        if (!config) {
          return;
        }

        this.isChangedFirstConfig = JSON.stringify(config) !== JSON.stringify(this._configsService.sourceConfig);
        this.isEnableSummary.setValue(!!config?.summary_request_enable, {emitEvent: false});
        this.isEnableLogRequest.setValue(!!config?.summary_with_host, {emitEvent: false});
        this.isEnableTemporary.setValue(!!config?.summary_group_temporary_enable, {emitEvent: false});
        this.isEnablePersistent.setValue(!!config?.summary_group_persistent_enable, {emitEvent: false});
        this.temporaryPeriod.setValue(config?.summary_temporary_period.toString() || '', {emitEvent: false});
        this.matcherList = this.getMatcherNames(config);
        this.isEnabledCollect.setValue(!!config?.summary_collect_enable, {emitEvent: false});
      })
    );
  }

  ngOnInit(): void {
    this.isEnabledCollect.valueChanges.subscribe((value) => {
      const config = this._configsService.getConfig();
      if (config) {
        config.summary_collect_enable = value;

        this._configsService.setConfig({...config});
      }
    })
  }

  saveChanges(): void {
    const config = this._configsService.getConfig();

    if (!config) {
      return;
    }

    config.summary_request_enable = this.isEnableSummary.value;
    config.summary_with_host = this.isEnableLogRequest.value;
    config.summary_group_temporary_enable = this.isEnableTemporary.value;
    config.summary_group_persistent_enable =  this.isEnablePersistent.value;
    config.summary_temporary_period = Number(this.temporaryPeriod.value);

    this._configsService.setConfig({...config});
    this.isChangedFirstConfig = JSON.stringify(config) !== JSON.stringify(this._configsService.sourceConfig);
  }

  openCollectPopup(requested: string, matcherName?: string, enabled?: boolean, collectName?: string): void {
    if (requested === 'edit') {
      this.matcherModel = matcherName || '';
      this.isEnableCollectRule.setValue(!!enabled);
      this.collectNameControl.setValue(collectName || '');
    }

    this.dialogs.open(this.dialogCollectTpl, {
      label: requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.matcherModel = '';
        this.isEnableCollectRule.setValue(false);
        this.collectNameControl.setValue('');
      }
    );
  }

  addRule(enable?: boolean, matcher?: string, collectName?: string ,observer?: any): void {
    const config = this._configsService.getConfig();
    const nodeDetails: SummaryCollectRule = {
      enable,
      matcher,
      collect_name: collectName
    }

    if (!config) {
      return;
    }

    config.summary_collect_rule.push(nodeDetails);

    this._configsService.setConfig({...config});

    observer.complete()
  }

  deleteSummaryCollectRule(index: number): void {
    const config = this._configsService.getConfig();

    // Проверяем, есть ли конфигурация и правила proxy pass
    if (config && config.summary_collect_rule) {
      // Проверяем, существует ли правило с таким индексом
      if (index >= 0 && index < config.summary_collect_rule.length) {
        // Удаляем правило из массива
        config.summary_collect_rule.splice(index, 1);

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

  getMatcherNames(config: ConfigResponseInterface): string[] {
    if (!config) {
      console.error('Config is not set');
      return [];
    }

    return Object.keys(config.matcher);
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
      this.isChangedFirstConfig = false;
    }
  }


  onClick(label: string): void {
    this.activeTab = label;
  }

}
