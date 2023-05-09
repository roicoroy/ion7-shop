import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { NgxsFormPluginModule } from '@ngxs/form-plugin';
import { NgxsStoragePluginModule } from '@ngxs/storage-plugin';
import { NgxsModule } from '@ngxs/store';
import { Observable } from 'rxjs';
import { ThemeService } from 'src/app/shared/services/theme/theme-generation.service';

@Component({
  selector: 'app-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
  standalone: true,
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    TranslateModule,
    NgxsModule,
    NgxsFormPluginModule,
    NgxsStoragePluginModule,
  ],
})
export class ThemeComponent implements OnInit {
  appDarkMode$: Observable<any>;
  appDarkModeIcon$: Observable<any>;

  constructor(
    private theme: ThemeService
  ) { }

  ngOnInit() {
    // this.theme.themeInit();
    // this.appDarkMode$ = this.theme.darkMode;
    // this.appDarkModeIcon$ = this.theme.darkModeIcon;
  }
  onChangeTheme(theme: any) {
    // this.theme.changeTheme(theme);
  }
}
