import {Component, Inject, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  TUI_VALIDATION_ERRORS, TuiDataListWrapperModule,
  TuiFieldErrorPipeModule,
  TuiInputModule,
  TuiSelectModule,
  TuiTabsModule
} from "@taiga-ui/kit";
import {
  TuiButtonModule,
  TuiDialogModule, TuiDialogService,
  TuiDropdownModule,
  TuiErrorModule,
  TuiSvgModule,
  TuiTextfieldControllerModule
} from "@taiga-ui/core";
import {AsyncPipe, KeyValuePipe, NgForOf, NgIf, NgTemplateOutlet} from "@angular/common";
import {LoginService} from "../../services/login.service";
import {map} from "rxjs/operators";
import {ConfigsService} from "../../services/configs.service";
import {Observable} from "rxjs";
import {ConfigResponseInterface, Matcher, MatcherLabel} from "../../models/config-response.interface";
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

  readonly conditionTypes: MatcherLabel[] = [
    'Args', 'URI', 'IP', 'UserAgent', 'Header', 'Host', 'Referer', 'Method', 'Cookie'
  ];
  conditionType = '';
  valueOperator = '';
  value = '';
  method = '';

  readonly extendedOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]', 'Существует', 'Не существует'];
  readonly baseOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]', 'Любой [*]'];
  readonly partOperatorList = ['Подходит под RegEx [≈]', 'Не подходит RegEx [!≈]', 'Равен [=]', 'Не равен [!=]'];
  readonly equalOperatorList = ['Равен [=]', 'Не равен [!=]'];
  readonly methodsList = ['GET', 'POST', 'PUT', 'DELETE', 'HEAD', 'OPTIONS', 'MKCOL', 'COPY', 'MOVE', 'PROPFIND', 'PROPPATCH', 'LOCK', 'UNLOCK', 'PATCH', 'TRACE'];

  config$: Observable<ConfigResponseInterface | null>;

  editRuleGroup: FormGroup<{
    nameControl: FormControl<string>,
    valueControl: FormControl<string>,
    valueOperatorControl: FormControl<string>
  }> = new FormGroup<any>(
    {
      nameControl: new FormControl('', [Validators.required, Validators.minLength(3)]),
      valueControl: new FormControl(''),
      valueOperatorControl: new FormControl('')
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

  saveConfig(): void {

  }

  log(): void {

  }

  constructor(
    private readonly _configsService: ConfigsService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService
  ) {
    this.config$ = this._configsService.getConfig$();
  }


  onClick(label: string): void {
    this.activeTab = label;
  }

  openPopupAddRule(): void {
    this.requested = 'add';
    this.dialogs.open(this.dialogTpl).subscribe(() => {
      }, () => {
      },
      () => {
      this.conditionType = '';
      this.editRuleGroup.controls.valueOperatorControl.setValue('');
      this.editRuleGroup.controls.valueControl.setValue('');
      this.editRuleGroup.controls.nameControl.setValue('');
      }
    );
  }

  addRule(nameValue: string, valueOperator: string): void {
    const matcher = this.conditionType as MatcherLabel;

    if (this.isMatcherLabel(matcher)) {
      const newRule: { [key: string]: Matcher } = {
        nameValue: {
          [matcher]: {
            value: valueOperator,
            operator: "="
          }
        }
      }
    }
  }

  getOperatorFromLabel(label: string): void {
    return
  }

  isMatcherLabel(key: any): key is MatcherLabel {
    return ['Args', 'URI', 'IP', 'UserAgent', 'Header', 'Host', 'Referer', 'Method', 'Cookie'].includes(key);
  }

}
