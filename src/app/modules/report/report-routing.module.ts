import { DetailsComponent } from './pages/details/details.component';
import { ListComponent } from './pages/list/list.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ErrorComponent } from './pages/error/error.component';
import { AddComponent } from './pages/add/add.component';

const routes: Routes = [
  { path: '', component: ListComponent },
  { path: 'detalhes/:id', component: DetailsComponent },
  { path: 'error/:id', component: ErrorComponent },
  { path: 'add', component: AddComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportRoutingModule { }
