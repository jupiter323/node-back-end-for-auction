import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeheaderComponent } from './components/homeheader/homeheader.component';
import { HomefilterComponent } from './components/homefilter/homefilter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [HomeheaderComponent, HomefilterComponent],
  exports: [HomeheaderComponent, HomefilterComponent]
})
export class ShareModule { }
