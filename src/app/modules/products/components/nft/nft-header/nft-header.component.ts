import { Component, OnInit } from '@angular/core';
import { DrawerModule } from 'primeng/drawer';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'app-nft-header',
  templateUrl: './nft-header.component.html',
  standalone: true,
  imports: [
    DrawerModule,
    ButtonModule
  ]
})
export class NftHeaderComponent implements OnInit {
  visible: boolean = false;
  constructor() {}

  ngOnInit(): void {}
}
