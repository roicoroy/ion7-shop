import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { Device } from '@capacitor/device';
import { LanguageModel } from './language.model';
import { TokenService } from '../token/token.service';

export const SAVED_LANGUAGE = 'saved_language';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  languages: Array<LanguageModel> = new Array<LanguageModel>();

  constructor(
    public translate: TranslateService,
    private storageService: TokenService
  ) { }

  getLanguages(): any {
    this.languages = [];
    this.languages.push(
      { name: 'English', code: 'en' },
      { name: 'Portuguese', code: 'pt' },
    );
    return this.languages;
  }

  async initTranslate() {
    const language = await Device.getLanguageCode();
    const deviceLanguage = this.shortLanguage(language);
    const useLang = deviceLanguage.match(/en|pt/) ? deviceLanguage : 'en';
    if (useLang) {
      this.storageService.getKeyAsObservable(SAVED_LANGUAGE).subscribe((lang) => {
        if (lang && lang !== undefined) {
          this.translate.use(lang);
        } else {
          this.translate.use(useLang);
          this.storageService.storageSet(SAVED_LANGUAGE, useLang);
        }
      });
    }
  }
  shortLanguage(language: any) {
    if (language) {
      const short = language.value.split('-');
      return short[0];
    }
  }
}
