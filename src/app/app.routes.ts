import { Routes } from '@angular/router';
import { LayoutComponent } from './layout/layout.component';
import { authGuard } from './core/guards/auth.guard';
import { ProductsComponent } from './container/pages/products/products.component';
import { DetailProductComponent } from './container/pages/detail-product/detail-product.component';

export const routes: Routes = [
    {
        path: '',
        component: LayoutComponent,
        // loadChildren: () => import('../container/container.routes').then((r) => r.CONTAINER_ROUTES),
       
        // inyectar proveedores para una ruta especifica
        // providers: [
        //     provideBookingDomain(config)
        // ],

        children: [
            {
                path: '',
                loadComponent: () =>
                    import('./container/pages/home/home.component').then((c) => c.HomeComponent),
            },
            {
                path: 'products',
                component: ProductsComponent
                // loadComponent: () =>
                //     import('./container/pages/products/products.component').then((c) => c.ProductsComponent),
            },
            {
                path: 'detail/:identifier',
                component: DetailProductComponent
                // loadComponent: () =>
                //     import('./container/pages/detail-product/detail-product.component').then((c) => c.DetailProductComponent),
            },
            {
                path: 'wishlist',
                loadComponent: () =>
                    import('./container/pages/wishlist/wishlist.component').then((c) => c.WishlistComponent),
            },
            {
                path: 'cart',
                loadComponent: () =>
                    import('./container/pages/cart/cart.component').then((c) => c.CartComponent),
                canActivate: [authGuard]
            },
            {
                path: 'billing',
                loadComponent: () =>
                    import('./container/pages/billing/billing.component').then((c) => c.BillingComponent),
                canActivate: [authGuard]
            },
            {
                path: 'order/:type/:identifier',
                loadComponent: () =>
                    import('./container/pages/order/order.component').then((c) => c.OrderComponent),
                canActivate: [authGuard]
            },
            {
                path: 'categories',
                loadComponent: () =>
                    import('./container/pages/categories/categories.component').then((c) => c.CategoriesComponent),
            },
            {
                path: 'customer-service',
                loadComponent: () =>
                    import('./container/pages/customer-service/customer-service.component').then((c) => c.CustomerServiceComponent),
            },
            {
                path: 'account/:option',
                loadComponent: () =>
                    import('./container/pages/account/account.component').then((c) => c.AccountComponent),
                canActivate: [authGuard]
            },
            {
                path: 'pages/:current',
                loadComponent: () =>
                    import('./container/pages/generics/generics.component').then((c) => c.GenericsComponent)
            },
            {
                path: '404',
                loadComponent: () =>
                    import('./container/pages/error404/error404.component').then((c) => c.Error404Component),
            },
            {
                path: '**',
                redirectTo: '404',
            }
        ]

        // children: [
        //     {path: '', component: HomeComponent},
        //     {path: 'wishlist', component: WishlistComponent},
        //     {path: 'cart', component: CartComponent},
        //     {path: 'categories', component: CategoriesComponent},
        //     {path: 'customer-service', component: CustomerServiceComponent},
        //     {path: '404', component: Error404Component},
        //     {
        //         path: '**',
        //         redirectTo: '404',
        //     }
        // ]
    },

    // IMPORTAR MODO LADY LOAD
    // {
    //     path: 'auth',
    //     loadChildren: () => import('./modules/auth/auth.routes')
    //         .then((r) => r.AUTH_ROUTES)
    // },
    // {
    //     path: '',
    //     loadChildren: () => import('./layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
    // },
    // {
    //     path: '',
    //     loadChildren: () => import('./modules/layout/layout.routes').then((m) => m.LAYOUT_ROUTES),
    // },

    // IMPOETAR NORMAL
    // ...AUTH_ROUTES, 

    // { path: '**', redirectTo: '' }
];