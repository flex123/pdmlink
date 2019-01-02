import { IonicModule } from '@ionic/angular';
import { RouterModule } from '@angular/router';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProductTabPage } from './productTab.page';
import { HttpSrcImg } from './httpSrcImg';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    FormsModule,
    RouterModule.forChild([{ path: '', component: ProductTabPage }])
  ],
  declarations: [ProductTabPage, HttpSrcImg]
})
export class ProductTabPageModule {}
