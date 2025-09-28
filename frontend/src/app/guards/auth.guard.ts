import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { AuthService } from '../services/auth.service';
import { LoginDialogComponent } from '../components/login-dialog/login-dialog.component';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router,
    private dialog: MatDialog
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): boolean {
    if (this.authService.isAuthenticated()) {
      return true;
    }

    // Open login dialog
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '450px',
      disableClose: true,
      data: { redirectUrl: state.url }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result && result.success) {
        // User logged in successfully, navigate to the intended route
        this.router.navigate([state.url]);
      } else {
        // User cancelled login, redirect to home
        this.router.navigate(['/']);
      }
    });

    return false;
  }
}
