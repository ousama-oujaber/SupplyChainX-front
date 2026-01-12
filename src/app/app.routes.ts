import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'users',
        loadComponent: () => import('./components/user-list/user-list.component').then(m => m.UserListComponent)
    },
    {
        path: 'users/new',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
    },
    {
        path: 'users/edit/:id',
        loadComponent: () => import('./components/user-form/user-form.component').then(m => m.UserFormComponent)
    },
    { path: '', redirectTo: 'users', pathMatch: 'full' }
];
