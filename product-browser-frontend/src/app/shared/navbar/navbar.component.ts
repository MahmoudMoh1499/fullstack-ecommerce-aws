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

  private userSub!: Subscription;
  private cartSub!: Subscription;

  constructor(
    private authService: AuthService,
    private cartService: CartService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.userSub = this.authService.currentUser.subscribe(user => {
      this.isLoggedIn = !!user;
      if (user) {
        this.userName = user.name || '';
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
