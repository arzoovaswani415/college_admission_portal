import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of, tap, catchError } from 'rxjs';
import { Router } from '@angular/router';

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: 'admin' | 'student';
  profilePicture?: string;
}

export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: User;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();

  // Only admin user is hardcoded
  private adminUser: User = {
    id: 'admin',
    email: 'admin@verdia.edu',
    firstName: 'Admin',
    lastName: 'User',
    role: 'admin',
    profilePicture: 'assets/admin-avatar.png'
  };

  constructor(private http: HttpClient, private router: Router) {
    this.loadUserFromStorage();
  }

  private loadUserFromStorage(): void {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    if (token && user) {
      this.currentUserSubject.next(JSON.parse(user));
    }
  }

  // Admin authentication (hardcoded)
  private adminAuthenticate(email: string, password: string): Observable<AuthResponse> {
    if (email === 'admin@verdia.edu' && password === 'admin123') {
      const token = this.generateMockToken(this.adminUser);
      return of({
        success: true,
        message: 'Admin login successful',
        token,
        user: this.adminUser
      });
    }
    
    return of({
      success: false,
      message: 'Invalid admin credentials'
    });
  }

  private generateMockToken(user: User): string {
    // Simple mock token generation
    return btoa(JSON.stringify({ userId: user.id, role: user.role, exp: Date.now() + 86400000 }));
  }

  register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }): Observable<AuthResponse> {
    // Use backend registration
    return this.http.post<AuthResponse>(`${this.apiUrl}/register`, userData).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      }),
      catchError(error => {
        console.error('Registration error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Registration failed'
        });
      })
    );
  }

  login(email: string, password: string): Observable<AuthResponse> {
    // Check if it's admin login first
    if (email === 'admin@verdia.edu') {
      return this.adminAuthenticate(email, password).pipe(
        tap(response => {
          if (response.success && response.token && response.user) {
            this.setAuthData(response.token, response.user);
          }
        })
      );
    }

    // For regular users, use backend
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, { email, password }).pipe(
      tap(response => {
        if (response.success && response.token && response.user) {
          this.setAuthData(response.token, response.user);
        }
      }),
      catchError(error => {
        console.error('Login error:', error);
        return of({
          success: false,
          message: error.error?.message || 'Login failed'
        });
      })
    );
  }

  logout(): void {
    console.log('AuthService logout called');
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    this.currentUserSubject.next(null);
    console.log('User state cleared, navigating to home');
    this.router.navigate(['/']);
  }

  getToken(): string | null {
    return localStorage.getItem('token');
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  }

  isAdmin(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'admin';
  }

  isStudent(): boolean {
    const user = this.getCurrentUser();
    return user?.role === 'student';
  }

  hasRole(role: 'admin' | 'student'): boolean {
    const user = this.getCurrentUser();
    return user?.role === role;
  }

  getUserInitials(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`.toUpperCase();
  }

  getUserDisplayName(): string {
    const user = this.getCurrentUser();
    if (!user) return '';
    return `${user.firstName} ${user.lastName}`;
  }

  private setAuthData(token: string, user: User): void {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    this.currentUserSubject.next(user);
  }
}
