import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'login',
        loadComponent: () => import('./feature/login/login').then(m => m.Login)
    },
    {
        path: 'dashboard',
        loadComponent: () => import('./feature/board/board').then(m => m.Board)

    },
    { path: '**', redirectTo: 'login' }
];
