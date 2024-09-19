import { Routes } from "@angular/router";
import { LoginComponent } from "./pages/login/login.component";
import { RegisterComponent } from "./pages/register/register.component";
import { ForgetPasswordComponent } from "./pages/forget-password/forget-password.component";
import { NewPasswordComponent } from "./pages/new-password/new-password.component";

export const AUTH_ROUTES: Routes = [
    {
        path: 'login',
        component: LoginComponent
    },
    {
        path: 'register',
        component: RegisterComponent
    },
    {
        path: 'forget-password',
        component: ForgetPasswordComponent
    },
    {
        path: 'new-password',
        component: NewPasswordComponent
    },
    // {
    //     path: '**', 
    //     redirectTo: 'login',
    //     pathMatch: 'full'
    // }
];