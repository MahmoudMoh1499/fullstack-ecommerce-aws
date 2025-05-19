import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { tap } from 'rxjs/operators';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = 'YOUR_API_BASE_URL';
  private currentUserSubject = new BehaviorSubject<any>(null);
  public currentUser = this.currentUserSubject.asObservable();

  constructor(
    private http: HttpClient,
    private toastr: ToastrService,
    private router: Router
  ) {
    // Initialize user state if token exists
    const token = localStorage.getItem('access_token');
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

    return this.http.post(`${this.apiUrl}/auth/register`, formData).pipe(
      tap((res: any) => {
        this.toastr.success('Registration successful!');
        this.setCurrentUser(res.token);
      })
    );
  }

  login(credentials: { email: string, password: string }): Observable<any> {
    return this.http.post(`${this.apiUrl}/auth/login`, credentials).pipe(
      tap((res: any) => {
        this.toastr.success('Login successful!');
        this.setCurrentUser(res.token);
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
    return !!localStorage.getItem('access_token');
  }

  getProfilePicture(): string | null {
    return localStorage.getItem('profile_picture') || this.currentUserSubject.value?.profilePicture;
  }

  isAdmin(): boolean {
    return this.currentUserSubject.value?.role === 'admin';
  }

  getToken(): string | null {
    return localStorage.getItem('access_token');
  }

  private setCurrentUser(token: string): void {
    localStorage.setItem('access_token', token);
    const user = this.decodeToken(token);
    this.currentUserSubject.next(user);

    // Store profile picture separately as it might not be in the token
    if (user.profilePicture) {
      localStorage.setItem('profile_picture', user.profilePicture);
    }
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
