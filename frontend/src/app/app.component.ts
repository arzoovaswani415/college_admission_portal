import { Component, OnInit, AfterViewInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router, NavigationEnd } from '@angular/router';
import { AuthService, User } from './services/auth.service';
import { LoginDialogComponent } from './components/login-dialog/login-dialog.component';
import { SignupDialogComponent } from './components/signup-dialog/signup-dialog.component';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  title = 'college_admission';
  isMobileMenuOpen = false;
  currentUser: User | null = null;
  isAuthenticated = false;

  constructor(
    private authService: AuthService,
    private dialog: MatDialog,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.isAuthenticated = !!user;
    });

    // Listen for route changes and re-apply click fixes
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        setTimeout(() => {
          this.enableMenuClicks();
        }, 500);
      });
  }

  ngAfterViewInit(): void {
    // Force enable click events on menu elements
    setTimeout(() => {
      this.enableMenuClicks();
    }, 100);

    // Set up a periodic check to ensure menu clicks work across navigation
    setInterval(() => {
      this.enableMenuClicks();
    }, 1000);
  }

  private enableMenuClicks(): void {
    // Fix user menu button
    const menuButtons = document.querySelectorAll('.user-menu-btn');
    menuButtons.forEach(button => {
      const element = button as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });

    // Fix menu items
    const menuItems = document.querySelectorAll('mat-menu-item');
    menuItems.forEach(item => {
      const element = item as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });

    // Fix all mat-select elements globally
    const selectElements = document.querySelectorAll('mat-select');
    selectElements.forEach(select => {
      const element = select as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
      
      const trigger = element.querySelector('.mat-select-trigger') as HTMLElement;
      if (trigger) {
        trigger.style.pointerEvents = 'auto';
        trigger.style.cursor = 'pointer';
      }
    });

    // Fix mat-option elements globally
    const optionElements = document.querySelectorAll('.mat-option');
    optionElements.forEach(option => {
      const element = option as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
      element.style.userSelect = 'none';
      
      // Fix all children elements
      const allChildren = element.querySelectorAll('*');
      allChildren.forEach(child => {
        const childElement = child as HTMLElement;
        childElement.style.cursor = 'pointer';
        childElement.style.pointerEvents = 'auto';
      });
      
      const optionText = element.querySelector('.mat-option-text') as HTMLElement;
      if (optionText) {
        optionText.style.pointerEvents = 'auto';
        optionText.style.cursor = 'pointer';
      }
    });

    // Fix date picker toggles globally
    const datePickerToggles = document.querySelectorAll('mat-datepicker-toggle');
    datePickerToggles.forEach(toggle => {
      const element = toggle as HTMLElement;
      element.style.pointerEvents = 'auto';
      element.style.cursor = 'pointer';
    });
  }

  toggleMobileMenu(): void {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  closeMobileMenu(): void {
    this.isMobileMenuOpen = false;
  }

  openLoginDialog(): void {
    console.log('Opening login dialog...');
    const dialogRef = this.dialog.open(LoginDialogComponent, {
      width: '450px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Login dialog closed with result:', result);
      if (result && result.success) {
        // Login successful, user state will be updated automatically
        console.log('Login successful, user:', result.user);
        // The AuthService should have already updated the user state
        // Force a check to ensure the UI updates
        setTimeout(() => {
          this.currentUser = this.authService.getCurrentUser();
          this.isAuthenticated = this.authService.isAuthenticated();
        }, 100);
      }
    });
  }

  openSignupDialog(): void {
    console.log('Opening signup dialog...');
    const dialogRef = this.dialog.open(SignupDialogComponent, {
      width: '500px',
      disableClose: false
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('Signup dialog closed with result:', result);
      if (result && result.success) {
        // Signup successful, user state will be updated automatically
        console.log('Signup successful, user:', result.user);
        // The AuthService should have already updated the user state
        // Force a check to ensure the UI updates
        setTimeout(() => {
          this.currentUser = this.authService.getCurrentUser();
          this.isAuthenticated = this.authService.isAuthenticated();
        }, 100);
      }
    });
  }

  logout(event?: Event): void {
    console.log('Logout clicked');
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }
    
    // Use setTimeout to ensure the menu closes before navigation
    setTimeout(() => {
      this.authService.logout();
      this.closeMobileMenu();
      console.log('Logout completed');
    }, 100);
  }

  isAdmin(): boolean {
    return this.authService.isAdmin();
  }

  getUserInitials(): string {
    return this.authService.getUserInitials();
  }

  getUserDisplayName(): string {
    return this.authService.getUserDisplayName();
  }
}
