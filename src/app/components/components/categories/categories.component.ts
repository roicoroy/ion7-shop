import { AfterViewInit, Component, Input } from '@angular/core';
import { NavigationService } from 'src/app/shared/services/navigation/navigation.service';

export interface ICategoriesList {
  id?: string,
  url?: string,
  title?: string,
  image?: string,
}

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: [
    './styles/categories.page.scss',
    './styles/categories.shell.scss',
    './styles/categories.responsive.scss'
  ]
})
export class CategoriesComponent implements AfterViewInit {
  @Input() categoriesData: ICategoriesList[];

  constructor(
    private navigation: NavigationService,
  ) { }

  ngAfterViewInit(): void {
    // console.log(this.categoriesData);
  }
  navigate(url: string) {
    // console.log('navigate', url);
    this.navigation.navigateFlip(url);
  }
}
