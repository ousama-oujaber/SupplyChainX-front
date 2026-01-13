import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { User } from '../../models/user.model';
import { UserService } from '../../services/user.service';

@Component({
    selector: 'app-user-list',
    standalone: true,
    imports: [CommonModule, TableModule, ButtonModule, TagModule, ToastModule, ConfirmDialogModule],
    providers: [ConfirmationService, MessageService],
    templateUrl: './user-list.component.html',
    styles: [`
    :host { display: block; }
  `]
})
export class UserListComponent implements OnInit {
    users: User[] = [];

    constructor(
        private userService: UserService,
        private router: Router,
        private confirmationService: ConfirmationService,
        private messageService: MessageService
    ) { }

    ngOnInit(): void {
        this.loadUsers();
    }

    loadUsers(): void {
        this.userService.getAllUsers().subscribe({
            next: (data) => this.users = data,
            error: (e) => {
                console.error(e);
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load users' });
            }
        });
    }

    addUser(): void {
        this.router.navigate(['/users/new']);
    }

    editUser(id: number): void {
        this.router.navigate(['/users/edit', id]);
    }

    deleteUser(id: number): void {
        this.confirmationService.confirm({
            message: 'Are you sure you want to delete this user?',
            header: 'Confirm Deletion',
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                this.userService.deleteUser(id).subscribe({
                    next: () => {
                        this.loadUsers();
                        this.messageService.add({ severity: 'success', summary: 'Success', detail: 'User deleted successfully' });
                    },
                    error: (e) => {
                        console.error(e);
                        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete user' });
                    }
                });
            }
        });
    }

    formatRole(role?: string): string {
        if (!role) return '';
        const roles: { [key: string]: string } = {
            'ADMIN': 'Admin',
            'GESTIONNAIRE_APPROVISIONNEMENT': 'Gestionnaire Approvisionnement',
            'RESPONSABLE_ACHATS': 'Responsable Achats',
            'SUPERVISEUR_LOGISTIQUE': 'Superviseur Logistique',
            'CHEF_PRODUCTION': 'Chef de Production',
            'PLANIFICATEUR': 'Planificateur',
            'SUPERVISEUR_PRODUCTION': 'Superviseur Production',
            'GESTIONNAIRE_COMMERCIAL': 'Gestionnaire Commercial',
            'RESPONSABLE_LOGISTIQUE': 'Responsable Logistique',
            'SUPERVISEUR_LIVRAISONS': 'Superviseur Livraisons'
        };
        return roles[role] || role;
    }

    getSeverity(role?: string): 'success' | 'secondary' | 'info' | 'warning' | 'danger' | 'contrast' | undefined {
        switch (role?.toUpperCase()) {
            case 'ADMIN':
                return 'success'; // Green
            case 'MANAGER':
            case 'RESPONSABLE_ACHATS':
            case 'RESPONSABLE_LOGISTIQUE':
                return 'warning'; // Orange
            case 'USER':
            case 'PLANIFICATEUR':
            case 'GESTIONNAIRE_COMMERCIAL':
                return 'info'; // Blue
            default:
                return 'secondary'; // Gray
        }
    }
}
