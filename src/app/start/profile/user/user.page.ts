import { CommonModule } from "@angular/common";
import { Component, inject, EnvironmentInjector } from "@angular/core";
import { FormsModule, ReactiveFormsModule, FormGroup, FormBuilder, FormControl, Validators } from "@angular/forms";
import { IonicModule, ModalController } from "@ionic/angular";
import { TranslateModule } from "@ngx-translate/core";
import { NgxsFormPluginModule } from "@ngxs/form-plugin";
import { NgxsStoragePluginModule } from "@ngxs/storage-plugin";
import { NgxsModule } from "@ngxs/store";
import { Observable, Subject } from "rxjs";
import { CustomComponentsModule } from "src/app/components/components.module";
import { scaleHeight } from "src/app/shared/animations/animations";
import { KeypadModule } from "src/app/shared/services/native/keyboard/keypad.module";
import { ThemeComponent } from "./theme/theme.component";
import { StartFacade } from "../../start-facade";
import { ChangePasswordModalComponent } from "./change-password-modal/change-password-modal.component";
import { ImagePickerComponent } from "./image-picker/image-picker.component";
import { LanguageComponent } from "../../../components/components/language-component/language.component";

@Component({
  selector: 'app-user',
  templateUrl: './user.page.html',
  styleUrls: ['./user.page.scss'],
  standalone: true,
  animations: [
    scaleHeight()
  ],
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
    ReactiveFormsModule,
    ImagePickerComponent,
    KeypadModule,
    ChangePasswordModalComponent,
    ThemeComponent,
    CustomComponentsModule
  ],
})
export class UserPage {
  public environmentInjector = inject(EnvironmentInjector);

  formData = new FormData();
  avatar: string;
  pushAccepted = false;
  isDarkMode = false;

  isButtonActive: any = null;

  userForm: FormGroup;
  uploadForm: FormGroup;

  validation_messages: any = {
    username: [
      { type: 'required', message: 'Username is required.' },
      { type: 'minlength', message: 'Username must be at least 5 characters long.' },
      { type: 'maxlength', message: 'Username cannot be more than 25 characters long.' },
      { type: 'pattern', message: 'Your username must contain only numbers and letters.' },
      { type: 'validUsername', message: 'Your username has already been taken.' }
    ],
    first_name: [
      { type: 'required', message: 'Name is required.' }
    ],
    last_name: [
      { type: 'required', message: 'Last name is required.' }
    ],
    email: [
      { type: 'required', message: 'Email is required.' },
      { type: 'pattern', message: 'Please enter a valid email.' }
    ],
  };

  viewState$: Observable<any>;

  private readonly ngUnsubscribe = new Subject();

  private facade = inject(StartFacade);
  private formBuilder = inject(FormBuilder);

  private modalCtrl = inject(ModalController);

  constructor() {
    this.viewState$ = this.facade.viewState$;
    this.userForm = this.formBuilder.group({
      username: new FormControl('', Validators.compose([
        Validators.required
      ])),
      email: new FormControl('', Validators.compose([
        Validators.required,
      ])),
      first_name: new FormControl('', Validators.required),
      last_name: new FormControl('', Validators.required),
    });
    this.viewState$
      .subscribe((vs) => {
        if (vs?.user != null) {
          this.userForm.get('username').setValue(vs.user.username);
          this.userForm.get('email').setValue(vs.user.email);
          this.userForm.get('first_name').setValue(vs.user.first_name);
          this.userForm.get('last_name').setValue(vs.user.last_name);
        }
      });
  }
  async changePassrwordModal() {
    const modal = await this.modalCtrl.create({
      component: ChangePasswordModalComponent,
      componentProps: {
        incomingMessage: 'test string'
      }
    });
    await modal.present();
  }
  async presentLanguagePopover(e: Event) {
    const modal = await this.modalCtrl.create({
      component: LanguageComponent,
    });
    await modal.present();
  }
  onFCMChange($event: any) {
    this.pushAccepted = $event.detail.checked;
    // this.facade.setFCMStatus(this.pushAccepted);
  }

  onDarkModeChange($event: any) {
    this.isDarkMode = $event.detail.checked;
    // this.facade.setDarkMode(this.isDarkMode);
  }
  updateUser() {
    console.log(this.userForm.value);
  }
  uploadProfilePicture(formData: FormData) {
    // this.facade.appUploadProfileImage(formData);
  }
  async onImagePicked(file: any) {
    const response = await fetch(file);
    const blob = await response.blob();
    const blobs = new Blob([blob], { type: "text/xml" });
    const formData = new FormData();
    formData.append('files', blob, file.name);
    this.formData.append('files', blob, file.name);
    this.uploadProfilePicture(formData);
    return this.formData;
  }
  changePasswordPage() {
    // this.navigation.navigateForward('/home', 'back');
  }
  ngOnDestroy(): void {
    this.ngUnsubscribe.next(null);
    this.ngUnsubscribe.complete();
  }
}
