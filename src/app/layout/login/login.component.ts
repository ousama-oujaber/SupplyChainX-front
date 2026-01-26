import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../core/auth/auth.service';

@Component({
    selector: 'app-login',
    standalone: true,
    imports: [CommonModule, RouterModule, ReactiveFormsModule],
    templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit {
    private authService = inject(AuthService);
    private router = inject(Router);
    private fb = inject(FormBuilder);

    loginForm!: FormGroup;
    isLoading = false;
    errorMessage = '';
    showPassword = false;

    ngOnInit(): void {
        // Initialize form
        this.loginForm = this.fb.group({
            username: ['', [Validators.required]],
            password: ['', [Validators.required]],
            rememberMe: [false]
        });

        // Check if user is already authenticated
        this.checkAuthentication();
    }

    private async checkAuthentication(): Promise<void> {
        try {
            const isAuthenticated = await this.authService.isAuthenticated();
            if (isAuthenticated) {
                this.router.navigate(['/dashboard']);
            }
        } catch (error) {
            // Not authenticated or Keycloak not available, stay on login page
            console.debug('User not authenticated');
        }
    }

    async onSubmit(): Promise<void> {
        if (this.loginForm.invalid || this.isLoading) {
            return;
        }

        this.isLoading = true;
        this.errorMessage = '';

        const { username, password } = this.loginForm.value;

        try {
            await this.authService.loginWithCredentials(username, password);
            // Success - auth service will update state and we'll navigate
            this.router.navigate(['/dashboard']);
        } catch (error: any) {
            this.isLoading = false;

            // Handle different error types
            if (error.status === 401) {
                this.errorMessage = 'Invalid username or password';
            } else if (error.status === 403) {
                this.errorMessage = 'Account is locked. Please contact support.';
            } else if (error.status === 0) {
                this.errorMessage = 'Unable to connect to authentication server';
            } else {
                this.errorMessage = 'An unexpected error occurred. Please try again.';
            }

            // Clear password field on error
            this.loginForm.patchValue({ password: '' });
        }
    }

    togglePasswordVisibility(): void {
        this.showPassword = !this.showPassword;
    }

    clearError(): void {
        this.errorMessage = '';
    }
}
