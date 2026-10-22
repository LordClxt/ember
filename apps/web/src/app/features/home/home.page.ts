import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <h1>Welcome to Ember</h1>
    <p>Angular · NestJS · Kotlin Multiplatform boilerplate.</p>
    <a routerLink="/items" class="button">See the Items example →</a>
  `,
})
export default class HomePage {}
