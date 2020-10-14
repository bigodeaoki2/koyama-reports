import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  { path: '', loadChildren: () => import('./modules/home/home.module').then(m => m.HomeModule) },
  { path: 'reports', loadChildren: () => import('./modules/report/report.module').then(m => m.ReportModule) },
  { path: 'join', loadChildren: () => import('./modules/join/join.module').then(m => m.JoinModule) }
];

@NgModule({
  declarations: [],
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
