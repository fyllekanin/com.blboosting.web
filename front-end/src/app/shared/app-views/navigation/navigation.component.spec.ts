import { NavigationComponent } from './navigation.component';
import { AuthService } from '../../../core/auth/auth.service';
import { AuthUser } from '../../../core/auth/auth-user.model';

describe('NavigationComponent', () => {

    let component: NavigationComponent;
    let authService;

    beforeEach(() => {
        authService = {
            onAuthChangeCallback: null,
            onAuthChange: {
                subscribe: callback => authService.onAuthChangeCallback = callback
            },
            logout: () => null,
            getAuthUser: () => null,
            isLoggedIn: () => false
        };
        component = new NavigationComponent(<AuthService><unknown>authService);
    });

    it('onLogout should trigger authService logout', () => {
        // Given
        spyOn(authService, 'logout');

        // When
        component.onLogout();

        // Then
        expect(authService.logout).toHaveBeenCalled();
    });

    it('constructor should sync user and avatar on authChange', () => {
        // Given
        const user = new AuthUser(null);
        spyOn(authService, 'isLoggedIn').and.returnValue(true);
        spyOn(authService, 'getAuthUser').and.returnValue(user);

        // When
        authService.onAuthChangeCallback();

        // Then
        expect(component.user).toEqual(user);
    });
});
