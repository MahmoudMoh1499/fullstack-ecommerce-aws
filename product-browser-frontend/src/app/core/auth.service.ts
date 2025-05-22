import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { API_CONFIG } from './config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();
  private apiUrl = API_CONFIG;

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router,
  ) {
    // Initialize user state if token exists
    const token = this.getToken();
    if (token) {
      this.setCurrentUser(token);
    }
  }

  register(userData: any, profilePicture: File): Observable<any> {
    const formData = new FormData();
    formData.append('name', userData.name);
    formData.append('email', userData.email);
    formData.append('password', userData.password);
    formData.append('profilePicture', profilePicture);

    return this.http.post(`${this.apiUrl.baseUrl}${this.apiUrl.endpoints.auth.register}`, formData).pipe(
      tap((res: any) => {
        this.toastr.success('Registration successful!');
        // this.setCurrentUser(res.token, res.profilePicUrl);
      }),
      catchError(error => {
        this.toastr.error(error.error?.message || 'Registration failed');
        return throwError(error);
      })
    );
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl.baseUrl}${this.apiUrl.endpoints.auth.login}`, credentials).pipe(
      tap((res: any) => {
        this.toastr.success('Login successful!');
        this.setCurrentUser(res.token, res.profilePicUrl);
        this.router.navigate(['/products']);
      }),
      catchError(error => {
        this.toastr.error(error.error?.message || 'Login failed');
        return throwError(error);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('access_token');
    localStorage.removeItem('profile_picture');
    this.currentUserSubject.next(null);
    this.router.navigate(['/login']);
    this.toastr.info('Logged out successfully');
  }

  isLoggedIn(): boolean {
    return !!this.getToken();
  }

  getProfilePicture(): string | null {
    return localStorage.getItem('profile_picture') || this.currentUserSubject.value?.profilePicUrl;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setCurrentUser(token: string, profilePicUrl?: string): void {
    localStorage.setItem('access_token', token);
    const user = this.decodeToken(token);

    // Add profilePicUrl to user object if provided
    if (profilePicUrl) {
      user.profilePicUrl = profilePicUrl;
      localStorage.setItem('profile_picture', profilePicUrl);
    }

    this.currentUserSubject.next(user);
  }

  private decodeToken(token: string): any {
    try {
      const payload = token.split('.')[1];
      const decoded = atob(payload);
      return JSON.parse(decoded);
    } catch (e) {
      console.error('Error decoding token', e);
      return null;
    }
  }
}
