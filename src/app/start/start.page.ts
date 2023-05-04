import { Component, EnvironmentInjector, inject } from '@angular/core';
import { IonicModule } from '@ionic/angular';

@Component({
  selector: 'app-start',
  templateUrl: 'start.page.html',
  styleUrls: ['start.page.scss'],
  standalone: true,
  imports: [
    IonicModule,
  ],
})
export class StartPage {
  public environmentInjector = inject(EnvironmentInjector);

  constructor() { }
}
