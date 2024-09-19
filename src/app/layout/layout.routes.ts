// import { Routes } from "@angular/router";
// import { LayoutComponent } from "./layout.component";

// export const LAYOUT_ROUTES: Routes = [
//     {
//         path: '',
//         component: LayoutComponent,
//         // loadChildren: () => import('../container/container.routes').then((r) => r.CONTAINER_ROUTES),
//         children: [
//             {
//                 path: '',
//                 loadComponent: () =>
//                     import('../container/pages/home/home.component').then((c) => c.HomeComponent),
//             },
//             {
//                 path: 'wishlist',
//                 loadComponent: () =>
//                     import('../container/pages/wishlist/wishlist.component').then((c) => c.WishlistComponent),
//             },
//             {
//                 path: 'cart',
//                 loadComponent: () =>
//                     import('../container/pages/cart/cart.component').then((c) => c.CartComponent),
//             },
//             {
//                 path: 'categories',
//                 loadComponent: () =>
//                     import('../container/pages/categories/categories.component').then((c) => c.CategoriesComponent),
//             },
//             {
//                 path: 'customer-service',
//                 loadComponent: () =>
//                     import('../container/pages/customer-service/customer-service.component').then((c) => c.CustomerServiceComponent),
//             },
//             {
//                 path: '404',
//                 loadComponent: () =>
//                     import('../container/pages/error404/error404.component').then((c) => c.Error404Component),
//             },
//             {
//                 path: '**',
//                 redirectTo: '404',
//             }
//         ]

//         // children: [
//         //     {path: '', component: HomeComponent},
//         //     {path: 'wishlist', component: WishlistComponent},
//         //     {path: 'cart', component: CartComponent},
//         //     {path: 'categories', component: CategoriesComponent},
//         //     {path: 'customer-service', component: CustomerServiceComponent},
//         //     {path: '404', component: Error404Component},
//         //     {
//         //         path: '**',
//         //         redirectTo: '404',
//         //     }
//         // ]
//     },
//     // { path: '', redirectTo: 'home', pathMatch: 'full' },
//     // { path: '**', redirectTo: 'error/404' },
// ]