import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule],
    templateUrl: './user-list.component.html',
    styles: [`
    :host { display: block; }
    .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 1rem; }
  `]
})
export class UserListComponent implements OnInit {
    users: User[] = [];

    constructor(private userService: UserService, private router: Router) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getAllUsers().subscribe({
            next: (data) => this.users = data,
            error: (e) => console.error(e)
        });
    }

    addUser(): void {
        this.router.navigate(['/users/new']);
    }

    editUser(id: number): void {
        this.router.navigate(['/users/edit', id]);
    }

    deleteUser(id: number): void {
        if (confirm('Are you sure you want to delete this user?')) {
            this.userService.deleteUser(id).subscribe({
                next: () => this.loadUsers(),
                error: (e) => console.error(e)
            });
        }
    }
}
