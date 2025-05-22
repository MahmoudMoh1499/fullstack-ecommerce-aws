import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../../core/auth.service';
import { Router } from '@angular/router';
import { CartService } from '../../cart/cart.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent implements OnInit, OnDestroy {
  isCollapsed = true;
  isLoggedIn = false;
  isAdmin = false;
  userName = '';
  profilePictureUrl: string | null = null;
  cartItemsCount = 0;
  showNavbar = true;

  private userSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) {
    this.router.events.subscribe(() => {
      this.showNavbar = !this.router.url.includes('/login') &&
        !this.router.url.includes('/register');
    });
  }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        console.log(user);

        this.userName = user.email || '';
        this.profilePictureUrl = this.authService.getProfilePicture();
        this.isAdmin = this.authService.isAdmin();
      } else {
        this.userName = '';
        this.profilePictureUrl = null;
        this.isAdmin = false;
      }
    });

    this.cartSub = this.cartService.cart$.subscribe(cart => {
      this.cartItemsCount = cart?.items?.length || 0;
    });
  }

  ngOnDestroy(): void {
    this.userSub?.unsubscribe();
    this.cartSub?.unsubscribe();
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
