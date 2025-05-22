// src/app/app.animations.ts
import {
  trigger,
  transition,
  style,
  query,
  animate,
  animateChild  // Add this import
} from '@angular/animations';

export const routeAnimations = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ], { optional: true }),
    query(':enter', [
      style({ opacity: 0 })
    ], { optional: true }),
    query(':leave', animateChild(), { optional: true }),
    query(':leave', [
      animate('200ms ease-out', style({ opacity: 0 }))
    ], { optional: true }),
    query(':enter', [
      animate('300ms ease-in', style({ opacity: 1 }))
    ], { optional: true }),
    query(':enter', animateChild(), { optional: true })
  ])
]);
