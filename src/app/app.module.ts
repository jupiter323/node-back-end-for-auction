import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

import { AppComponent } from './app.component';
import { HomeComponent } from './modules/homeModule/homeComponent/home.component';
import { ShareModule } from './share/share.module';

const appRoutes = [
  {
    path: 'home',
    loadChildren: './modules/homeModule/home.module#HomeModule'
  },
  {
    path: '',
    component: HomeComponent
  }
]
@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    

  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(appRoutes),
    ShareModule,
    HttpClientModule
  ],
  exports: [ShareModule],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
