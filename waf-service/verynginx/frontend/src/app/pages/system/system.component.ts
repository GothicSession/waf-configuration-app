import {Component, Inject, TemplateRef, ViewChild} from '@angular/core';
import {AsyncPipe, NgForOf, NgIf, NgSwitch, NgSwitchCase, NgTemplateOutlet} from "@angular/common";
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
  TuiTabsModule, TuiTextareaModule
} from "@taiga-ui/kit";
import {FormControl, FormsModule, ReactiveFormsModule} from "@angular/forms";
import {ConfigsService} from "../../services/configs.service";
import {Observable, tap} from "rxjs";
import {Admin, ConfigResponseInterface} from "../../models/config-response.interface";

@Component({
  selector: 'app-system',
  standalone: true,
  imports: [
    AsyncPipe,
    NgIf,
    TuiButtonModule,
    TuiCheckboxModule,
    TuiInputModule,
    TuiTabsModule,
    ReactiveFormsModule,
    NgForOf,
    TuiDataListWrapperModule,
    TuiDialogModule,
    TuiSelectModule,
    TuiTextfieldControllerModule,
    TuiDropdownModule,
    FormsModule,
    NgSwitchCase,
    NgTemplateOutlet,
    NgSwitch,
    TuiTextareaModule
  ],
  templateUrl: './system.component.html',
  styleUrl: './system.component.scss'
})
export class SystemComponent {

  @ViewChild('dialogUserTpl')
  dialogUserTpl!: TemplateRef<void>;

  activeTab = 'general';
  isChangedFirstConfig = false;
  config$: Observable<ConfigResponseInterface | null>;
  open = false;

  baseUri: FormControl<string> = new FormControl<string>('',{nonNullable: true});
  hostLimit: FormControl<string> = new FormControl<string>('',{nonNullable: true});
  cookiePrefix: FormControl<string> = new FormControl<string>('',{nonNullable: true});

  userControl: FormControl<string> = new FormControl<string>('',{nonNullable: true});
  passwordControl: FormControl<string> = new FormControl<string>('',{nonNullable: true});
  isEnableUser: FormControl<boolean> = new FormControl<boolean>(false,{nonNullable: true});

  allConfigurationControl: FormControl<string> = new FormControl<string>('',{nonNullable: true});

  constructor(
    private readonly _configsService: ConfigsService,
    @Inject(TuiDialogService) private readonly dialogs: TuiDialogService,
    @Inject(TuiPushService) protected readonly push: TuiPushService,
    @Inject(TuiAlertService) protected readonly alert: TuiAlertService
  ) {
    this.config$ = _configsService.getConfig$().pipe(
      tap(config => {
        if (!config) {
          return;
        }

        this.isChangedFirstConfig = JSON.stringify(config) !== JSON.stringify(this._configsService.sourceConfig);
        this.baseUri.setValue(config.base_uri);
        this.hostLimit.setValue(config.dashboard_host);
        this.cookiePrefix.setValue(config.cookie_prefix);
        this.allConfigurationControl.setValue(JSON.stringify(config, null, 2));
      })
    );
  }

  saveControl(): void {
    const config = this._configsService.getConfig();

    if (!config) {
      return;
    }

    config.dashboard_host = this.hostLimit.value;
    config.cookie_prefix = this.cookiePrefix.value;
    config.base_uri = this.baseUri.value;

    this._configsService.setConfig({...config});
    this.isChangedFirstConfig = JSON.stringify(config) !== JSON.stringify(this._configsService.sourceConfig);
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

  deleteUser(index: number): void {
    const config = this._configsService.getConfig();

    // Проверяем, есть ли конфигурация и правила proxy pass
    if (config && config.admin) {
      // Проверяем, существует ли правило с таким индексом
      if (index >= 0 && index < config.admin.length) {
        // Удаляем правило из массива
        config.admin.splice(index, 1);

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

  addUser(user: string, password: string, enable: boolean, observer: any): void {
    const config = this._configsService.getConfig();

    if (!config) {
      return;
    }

    const userInterface: Admin = {
      user,
      password,
      enable
    }

    config.admin.push(userInterface);

    this._configsService.setConfig({...config});
    observer.complete();
  }

  openUserPopup(requested?: string, user?: string, password?: string, enabled?: boolean): void {
      if (requested === 'edit') {
      this.userControl.setValue(user || '');
      this.passwordControl.setValue(password || '');
      this.isEnableUser.setValue(!!enabled);
    }

    this.dialogs.open(this.dialogUserTpl, {
      label: requested === 'add' ? 'Добавить пользователя' : 'Редактировать пользователя',
      size: 'm'
    }).subscribe(() => {
      }, () => {
      },
      () => {
        this.userControl.setValue('');
        this.passwordControl.setValue('');
        this.isEnableUser.setValue(false);
      }
    );
  }

}
