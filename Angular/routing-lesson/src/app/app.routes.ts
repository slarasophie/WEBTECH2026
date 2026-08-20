/*import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {First} from './first/first';
import {Second} from './second/second';
import { Home } from './home/home';

export const routes: Routes = [
    { path: '', component: Home},
    { path: 'first', component: First},
    { path: 'second', component: Second },
    { path: '**', redirectTo: '', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { } */

import { Routes, RouterModule } from '@angular/router';
import {First} from './first/first';
import {Second} from './second/second';
import {One} from './first/one/one';
import {Two} from './first/two/two';
import { Home } from './home/home';

const routes: Routes = [
  { path: 'first', component: First, children: [
      { path: 'one', component: One },
      { path: 'two', component: Two },
      { path: 'mypath/:id', component: Home }
    ]},
  { path: 'first/:id', component: First },
  { path: 'second', component: Second }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }