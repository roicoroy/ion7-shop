
import { Component } from '@angular/core';
import { AlertController, ModalController, PopoverController } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { LanguageService, SAVED_LANGUAGE } from 'src/app/shared/services/language/language.service';
import { StorageService } from 'src/app/shared/services/storage/ionstorage.service';

@Component({
  selector: 'ng-ion-workspace-language',
  templateUrl: './language.component.html',
  styleUrls: ['./language.component.scss'],
})
export class LanguageComponent {
  profile: any;
  availableLanguages: any = [];
  translations: any;
  translateSub: Subscription;
  selectedLanguage: any;
  constructor(
    public translate: TranslateService,
    public languageService: LanguageService,
    public alertController: AlertController,
    private storageService: StorageService,
    private modalCtrl: ModalController,
    public popoverController: PopoverController,
  ) {
    this.availableLanguages = this.languageService.getLanguages();
  }

  ionViewWillEnter() {
    this.storageService.storageGet(SAVED_LANGUAGE).then((language) => {
      this.selectedLanguage = language;
    });
  }
  selectLanguage(item: any) {
    this.selectedLanguage = item?.code;
    this.translate.use(this.selectedLanguage);
    this.storageService.storageSet(SAVED_LANGUAGE, this.selectedLanguage);
    this.popoverController.dismiss();
    this.getTranslations();
  }
  getTranslations() {
    this.translate.getTranslation(this.translate.currentLang)
      .subscribe((translations) => {
        this.translations = translations;
      });
  }
  async submitForm() {
    await this.modalCtrl.dismiss();
  }
  async closeModal() {
    await this.modalCtrl.dismiss();
  }
}
