import { Injectable } from '@angular/core';
import { AuthUser } from './auth.model';
import { LocalStorageKeys } from '../../shared/constants/local-storage.constants';
import { NEVER, Observable } from 'rxjs';

@Injectable()
export class AuthService {
    private authUser: AuthUser;

    getRefreshToken(): string {
        return this.authUser?.refreshToken;
    }

    getAccessToken(): string {
        return this.authUser?.accessToken;
    }

    setAuthUser(payload: AuthUser): void {
        this.authUser = payload;
        this.updateAuthUser();
    }

    refreshToken(): Observable<string> {
        return NEVER;
    }

    private updateAuthUser(): void {
        localStorage.setItem(LocalStorageKeys.AUTH_USER, JSON.stringify(this.authUser));
    }

    private getAuthUser(): AuthUser {
        try {
            return JSON.parse(localStorage.getItem(LocalStorageKeys.AUTH_USER));
        } catch (_e) {
            return null;
        }
    }
}
