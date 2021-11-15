import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { TabsPage } from './tabs.page';

const routes: Routes = [
  {
    path: '',
    component: TabsPage,
    children: [
      {
        path: 'likes',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/likes/likes.module').then(m => m.LikesPageModule)
          }
        ]
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/me/me.module').then(m => m.MePageModule)
          }
        ]
      },
      {
        path: 'highlights',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/highlights/highlights.module').then(m => m.HighlightsPageModule)
          }
        ]
      },
      {
        path: 'matches',
        children: [
          {
            path: '',
            loadChildren: () =>
              import('../pages/matches/matches.module').then(m => m.MatchesPageModule)
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
    path: '',
    redirectTo: '/tabs/likes',
    pathMatch: 'full'
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TabsPageRoutingModule {}
