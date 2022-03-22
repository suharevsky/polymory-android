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
        path: 'list/favorites',
        loadChildren: () => import('../../pages/likes/likes.module').then(m => m.LikesPageModule)
      },
      {
        path: 'list/views',
        loadChildren: () => import('../../pages/likes/likes.module').then(m => m.LikesPageModule)
      },
      {
        path: 'chat/:chatId/:chatExists/:profileId',
        loadChildren: () => import('../../pages/chat/chat.module').then(m => m.ChatPageModule)
      },
      {
        path: 'photos',
        loadChildren: () => import('../../pages/photos/photos.module').then(m => m.PhotosPageModule)
      },
      {
        path: 'edit',
        loadChildren: () => import('../../pages/profile-edit/profile-edit.module').then(m => m.ProfileEditPageModule)
      },
      {
        path: 'settings',
        children: [
          {
            path: '',
            loadChildren: () => import('../../pages/settings/settings.module').then(m => m.SettingsPageModule)
          }
        ]
      },
      {
        path: 'me',
        children: [
          {
            path: '',
            loadChildren: () => import('../../pages/me/me.module').then(m => m.MePageModule)
          } 
        ]
    },
      {
        path: 'profile/:id',
        loadChildren: () => import('../../pages/profile/profile.module').then(m => m.ProfilePageModule)
    },
    // {
    //   path: '',
    //   redirectTo: 'highlights',
    //   pathMatch: 'full'
    // }
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
