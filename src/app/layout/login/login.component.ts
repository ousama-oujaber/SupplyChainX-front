import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './login.component.html',
    styleUrl: './login.component.css'
})
export class LoginComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    isLoading = false;

    async ngOnInit(): Promise<void> {
        // Check if user is already authenticated
        try {
            const isAuthenticated = await this.authService.isAuthenticated();
            if (isAuthenticated) {
                // User is already logged in, redirect to dashboard
                this.router.navigate(['/dashboard']);
            }
        } catch (error) {
            // Keycloak not available, stay on login page
            console.warn('Could not check authentication status');
        }
    }

    login(): void {
        this.isLoading = true;
        this.authService.login();
    }
}

