import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import { IRegisterAddress } from 'src/app/shared/types/types.interfaces';

@Component({
  selector: 'lib-address-card',
  templateUrl: './address-card.component.html',
  styleUrls: ['./address-card.component.scss'],
})
export class AddressCardComponent implements OnInit, AfterViewInit {

  @Input() address: IRegisterAddress;

  constructor() { }

  ngOnInit() { }

  ngAfterViewInit(): void {
    // console.log(this.address);
  }

}
