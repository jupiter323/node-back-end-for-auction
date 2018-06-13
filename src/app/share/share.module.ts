import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeheaderComponent } from './components/homeheader/homeheader.component';
import { HomefilterComponent } from './components/homefilter/homefilter.component';

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [ HomefilterComponent],
  exports: [ HomefilterComponent]
})
export class ShareModule { }
