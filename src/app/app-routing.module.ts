import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';
import { DeviceGuard } from './guard/device/device.guard';
import { AuthGuard } from './guard/auth/auth.guard';


// Send unauthorized  users to login
const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['/']);
// Automatically log in users

const redirectLoggedInToResults = () => redirectLoggedInTo(['/user/highlights'])



const routes: Routes = [
    /*{
      path: 'passions',
      loadChildren: './pages/passions/passions.module#PassionsPageModule'
    },*/
    // {
    //     path: '',
    //     redirectTo: 'landing',
    //     pathMatch: 'full'
    // },
    {
        path: '',
        loadChildren: () => import('./pages/landing/landing.module').then(m => m.LandingPageModule),
        ...canActivate(redirectLoggedInToResults),

    },
    {
        path: 'register-steps',
        loadChildren: () =>
            import('./pages/register-steps/register-steps.module').then(
                (m) => m.RegisterStepsPageModule
            ),
    },
    {
        path: 'page/:slug',
        loadChildren: () => 
            import('./pages/page/page.module').then(
                m => m.PagePageModule
            ),
    },
    {
        path: 'chat',
        loadChildren: () => import('./pages/chat/chat.module').then(m => m.ChatPageModule)
    },
   
    {
        path: 'profile',
        loadChildren: () => import('./pages/profile/profile.module').then(m => m.ProfilePageModule)

    },
    {
        path: 'user',
        canActivate: [AuthGuard, DeviceGuard],
        //...canActivate(redirectUnauthorizedToLogin),
        loadChildren: () => import('./layouts/default/default.module').then(m => m.DefaultModule)
    },
    {
        path: 'tabs',
        loadChildren: () => import('./components/tabs/tabs.module').then(m => m.TabsPageModule),
        canActivate: [AuthGuard],
        //...canActivate(redirectUnauthorizedToLogin),
    },
    {
        path: 'favorites/:segment',
        loadChildren: () => import('./pages/likes/likes.module').then(m => m.LikesPageModule)
    },
    // {
    //     path: 'likes',
    //     loadChildren: () => import('./pages/likes/likes.module').then(m => m.LikesPageModule)
    // },
    {
        path: 'report',
        loadChildren: () => import('./pages/report/report.module').then(m => m.ReportPageModule)
    },
    {
        path: 'filter',
        loadChildren: () => import('./pages/filter/filter.module').then(m => m.FilterPageModule)
    },
    {
        path: 'list-options',
        loadChildren: () => import('./pages/list-options/list-options.module').then(m => m.ListOptionsPageModule)
    },
    {
        path: 'photos',
        // component: PhotosPage
        loadChildren: () => import('./pages/photos/photos.module').then(m => m.PhotosPageModule)
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
