import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { LoginServices } from './services/login.service';
// import { LoginService } from './login.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor(private loginService: LoginServices, private router: Router) {}

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Verifica si el usuario está autenticado usando el servicio LoginService
    // if (this.loginService.getIsLoggedIn()) {
      console.log('Guard canActivate() activated');
      const isLoggedIn = localStorage.getItem('myStoredUserisLogged');
      if (isLoggedIn === 'true') {
      return true; // El usuario está autenticado y puede acceder a la ruta protegida
    } else {
      // El usuario no está autenticado, redirige a la página de inicio de sesión
      this.router.navigate(['/login']);
      return false;
    }
  }
}
