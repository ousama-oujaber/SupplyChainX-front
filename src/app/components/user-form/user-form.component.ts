import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-form',
    standalone: true,
    imports: [CommonModule, FormsModule, ButtonModule, InputTextModule],
    templateUrl: './user-form.component.html',
    styles: [`
    :host { display: block; }
    .form-container { max-width: 600px; margin: 0 auto; padding: 2rem; }
    .field { margin-bottom: 1.5rem; }
    label { display: block; margin-bottom: 0.5rem; font-weight: bold; }
    input { width: 100%; }
    .actions { display: flex; gap: 1rem; margin-top: 2rem; }
  `]
})
export class UserFormComponent implements OnInit {
    user: User = {
        username: '',
        email: '',
        firstName: '',
        lastName: ''
    };
    isEditMode = false;

    constructor(
        private userService: UserService,
        private route: ActivatedRoute,
        private router: Router
    ) { }

    ngOnInit(): void {
        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
            this.isEditMode = true;
            this.userService.getUserById(+id).subscribe({
                next: (data) => this.user = data,
                error: (e) => console.error(e)
            });
        }
    }

    onSubmit(): void {
        if (this.isEditMode && this.user.idUser) {
            this.userService.updateUser(this.user.idUser, this.user).subscribe({
                next: () => this.router.navigate(['/users']),
                error: (e) => console.error(e)
            });
        } else {
            this.userService.createUser(this.user).subscribe({
                next: () => this.router.navigate(['/users']),
                error: (e) => console.error(e)
            });
        }
    }

    onCancel(): void {
        this.router.navigate(['/users']);
    }
}
