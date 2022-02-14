import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DefaultComponent } from './default.component';

const routes: Routes = [
  {
    path: '',
    component: DefaultComponent,
    children: [
      {
        path: 'highlights',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../../pages/highlights/highlights.module').then(m => m.HighlightsPageModule)
          }
        ]
      },
      {
        path: '',
        redirectTo: 'likes',
        pathMatch: 'full'
      }
    ]
  },
  {
    path: 'user',
    redirectTo: '/user/highlights',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DefaultRoutingModule {}
