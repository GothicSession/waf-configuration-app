import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  TUI_VALIDATION_ERRORS, TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule, TuiPushService,
  TuiSelectModule,
  TuiTabsModule
} from "@taiga-ui/kit";
import {
  TuiAlertService,
  TuiButtonModule,
  TuiDialogModule, TuiDialogService,
  TuiDropdownModule,
  TuiErrorModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {AsyncPipe, KeyValue, KeyValuePipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {LoginService} from "../../services/login.service";
import {map, take} from "rxjs/operators";
import {ConfigsService} from "../../services/configs.service";
import {Observable, switchMap, tap} from "rxjs";
import {
  ArgRule,
  ConfigResponseInterface,
  Matcher,
  MatcherLabel,
  Operator
} from "../../models/config-response.interface";
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {TuiActiveZoneModule, TuiAutoFocusModule, TuiObscuredModule} from "@taiga-ui/cdk";

@Component({
  selector: 'app-basics',
  standalone: true,
  imports: [
    TuiTabsModule,
    TuiSvgModule,
    NgIf,
    AsyncPipe,
    NgForOf,
    KeyValuePipe,
    NgTemplateOutlet,
    TuiButtonModule,
    ReactiveFormsModule,
    TuiAutoFocusModule,
    TuiDialogModule,
    TuiErrorModule,
    TuiFieldErrorPipeModule,
    TuiInputModule,
    TuiDropdownModule,
    TuiActiveZoneModule,
    TuiObscuredModule,
    TuiSelectModule,
    TuiDataListWrapperModule,
    TuiTextfieldControllerModule,
    FormsModule
  ],
  providers: [{
    provide: TUI_VALIDATION_ERRORS,
    useValue: {
      required: 'Введите корректное правило',
      minLength: 'Введите корректное правило',
    },
  }],
  templateUrl: './basics.component.html',
  styleUrl: './basics.component.scss'
})
export class BasicsComponent {

  @ViewChild('dialogTpl')
  dialogTpl!: TemplateRef<void>;

  activeTab: string = 'matcher';
  requested: string = 'add';
  open = false;

  isChangedFirstConfig = false;

  readonly conditionTypes: MatcherLabel[] = [
    'Args', 'URI', 'IP', 'UserAgent', 'Header', 'Host', 'Referer', 'Method', 'Cookie'
  ];
  matcherKeyValues: { key: string, value: any }[] | undefined;
  conditionType = '';
  nameOperator = '';
  operator = '';
  method = '';

  readonly extendedOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]', 'Существует', 'Не существует'];
  readonly baseOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]', 'Любой [*]'];
  readonly partOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]'];
  readonly equalOperatorList = ['Равен [=]', 'Не равен [!=]'];
  readonly methodsList = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'MKCOL', 'COPY', 'MOVE', 'PROPFIND', 'PROPPATCH', 'LOCK', 'UNLOCK', 'PATCH', 'TRACE'];

  config$: Observable<ConfigResponseInterface | null>;

  editRuleGroup: FormGroup<{
    nameControl: FormControl<string>,
    nameValueControl: FormControl<string>,
    valueControl: FormControl<string>
  }> = new FormGroup<any>(
    {
      nameControl: new FormControl('', [Validators.required, Validators.minLength(3)]),
      nameValueControl: new FormControl(''),
      valueControl: new FormControl('')
    }
  );

  getRequiredValueOperatorList(): string[] {
    switch (this.conditionType) {
      case 'Header':
      case 'Args':
      case 'Cookie':
        return this.extendedOperatorList;
      case 'URI':
      case 'Host':
        return this.partOperatorList;
      case 'UserAgent':
      case 'Referer':
        return this.extendedOperatorList;
      case 'IP':
      case 'Method':
        return this.equalOperatorList;
      default:
        return this.conditionTypes;
    }
  }

  getRequiredValueNameOperatorList(): string[] {
    switch (this.conditionType) {
      case 'Header':
      case 'Args':
      case 'Cookie':
        return this.baseOperatorList;
      default:
        return [];
    }
  }

  getIsRequiredTwoOperators(): boolean {
    switch (this.conditionType) {
      case 'Header':
      case 'Args':
      case 'Cookie':
        return true;
      default:
        return false;
    }
  }

  constructor(
    private readonly _configsService: ConfigsService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiPushService) protected readonly push: TuiPushService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService
  ) {
    this.config$ = this._configsService.getConfig$().pipe(tap(
      response => {
        this.isChangedFirstConfig = JSON.stringify(response) !== JSON.stringify(this._configsService.sourceConfig);
      }
    ));
  }

  resetConfig(): void {
    if (this._configsService.sourceConfig) {
      this._configsService.setConfig(JSON.parse(JSON.stringify(this._configsService.sourceConfig)));
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

  onClick(label: string): void {
    this.activeTab = label;
  }

  openPopupRule(requested: string, matcherRuleKey?: string, matcherRuleValue?: any): void {
    this.requested = requested;

    if (requested === 'edit') {
      this.matcherKeyValues = this.objectToKeyValuePairs(matcherRuleValue);
      this.editRuleGroup.controls.nameControl.setValue(matcherRuleKey || '');
      this.editRuleGroup.controls.nameControl.disable();
    }

    this.dialogs.open(this.dialogTpl, {
      label: this.requested === 'add' ? 'Добавить правило' : 'Редактировать правило',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.conditionType = '';
        this.nameOperator = '';
        this.operator = '';
        this.method = '';
        this.editRuleGroup.controls.valueControl.setValue('');
        this.editRuleGroup.controls.nameValueControl.setValue('');
        this.editRuleGroup.controls.nameControl.setValue('');
        this.editRuleGroup.controls.nameControl.enable();
        this.matcherKeyValues = undefined;
      }
    );
  }

  addRule(observer: any, name: string, value?: string, nameValue?: string): void {
    const matcher = this.conditionType as MatcherLabel;

    if (this.isMatcherLabel(matcher)) {
      let argRule: ArgRule = {};

      if (value !== undefined && value !== null) {
        argRule.value = value;
      }

      const operator = this.getOperatorFromLabel(this.operator) as Operator;

      if (operator) {
        argRule.operator = operator;
      }

      if (this.conditionType === 'Method') {
        argRule.value = this.method;
      }

      const nameOperator = this.getOperatorFromLabel(this.nameOperator);
      if (nameOperator) {
        argRule.name_operator = nameOperator;
      }

      if (nameValue) {
        argRule.name_value = nameValue;
      }

      const newRule: { [key: string]: Matcher } = {
        [name]: {
          [matcher]: argRule
        }
      };

      this._configsService.setMatcherConfig(newRule);
      observer.complete();
    }
  }

  deleteMatcher(name: string): void {
    const config = this._configsService.getConfig();

    if (config && config.matcher) {
      if (config.matcher[name]) {
        delete config.matcher[name];

        this._configsService.setConfig(config);
      } else {
        console.error('No rule found with the name:', name);
      }
    } else {
      console.error('Invalid configuration or matcher does not exist.');
    }
  }

  deleteRule(matcherRuleKey: string, matcherRuleValue: any, matcher: string): void {
    const config = this._configsService.getConfig();

    if (config && config.matcher) {
      const rule = config.matcher[matcher];

      if (rule && matcherRuleValue) {
        Object.keys(rule).forEach(key => {
          // @ts-ignore
          if (rule[key] === matcherRuleValue) {
            // @ts-ignore
            delete rule[key];
          }
        });

        const index = this.matcherKeyValues?.findIndex(matcherKey => matcherKey.key === matcherRuleKey);
        if (typeof index === 'number') {
          this.matcherKeyValues?.splice(index, 1);
        }
        this._configsService.setConfig(config);
      }
    }
  }


  getOperatorFromLabel(label: string): string | undefined {
    if (!label) return undefined;

    switch (label) {
      case 'Подходит под RegEx [≈]':
        return '≈';
      case 'Не подходит RegEx [!≈]':
        return '!≈';
      case 'Равен [=]':
        return '=';
      case 'Не равен [!=]':
        return '!=';
      case 'Существует':
        return 'Exist'
      case 'Не существует':
        return '!Exist';
      case 'Любой [*]':
        return '*';
      default:
        return '';
    }
  }

  isMatcherLabel(key: any): key is MatcherLabel {
    return ['Args', 'URI', 'IP', 'UserAgent', 'Header', 'Host', 'Referer', 'Method', 'Cookie'].includes(key);
  }

  objectToKeyValuePairs(obj: Record<string, any>): { key: string, value: any }[] {
    return Object.entries(obj).map(([key, value]) => ({key, value}));
  }

}
