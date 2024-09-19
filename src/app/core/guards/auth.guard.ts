import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { ModalService } from '../services/modal.service';

export const authGuard: CanActivateFn = (route, state) => {

  const authSrv = inject(AuthService);
  const router = inject(Router);
  const modalSrv = inject(ModalService);

  if(authSrv.isAuth()){
    return true;
  }else{
    // router.navigateByUrl('/');
    // return false;

    modalSrv.showModal();

    // return router.createUrlTree(['/']);
    return false;
  }
};