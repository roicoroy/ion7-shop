import { Component, Input, OnInit } from '@angular/core';

export interface IItemsData {
}

@Component({
  selector: 'lib-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.scss'],
})
export class ItemsComponent implements OnInit {

  @Input() set itemsData(value: IItemsData) {
    console.log(value);
    // this._isLoggedIn = value.isCustomerLoggedIn != null ? value?.isCustomerLoggedIn : false;
  };

  constructor() { }

  ngOnInit() { }

  ionViewDidEnter() {
    console.log(this.itemsData);
  }

}
