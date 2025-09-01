import { Component } from '@angular/core';

@Component({
  selector: 'app-shell',
  templateUrl: './shell.component.html',
  styleUrls: ['./shell.component.scss']
})
export class ShellComponent {
  // Branding configuration from Kids Gaming Fun theme
  siteName = 'Kids Gaming Fun - Participant Admin';
  tagline = 'Play, Learn, and Grow!';
  footerText = '© 2024 Kids Gaming Fun. All rights reserved.';
}
