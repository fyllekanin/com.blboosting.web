import { SlimUserView } from '../../../src/rest-service-views/two-way/slim-user.view';

describe('SlimUserView', () => {
    it('should be possible to build', () => {
        // When
        const view = SlimUserView.newBuilder()
            .withUserId(0)
            .withUsername('username')
            .withHabbo('habbo')
            .withUpdatedAt(1)
            .build();

        // Then
        expect(view.getUserId()).toEqual(0);
        expect(view.getUsername()).toEqual('username');
        expect(view.getHabbo()).toEqual('habbo');
        expect(view.getUpdatedAt()).toEqual(1);
    });

    it('should set correct data in of', () => {
        // Given
        const user = SlimUserView.newBuilder()
            .withUsername('username')
            .withHabbo('habbo')
            .withUserId(0)
            .build();

        // When
        const result = SlimUserView.of(user);

        // Then
        expect(result.getUserId()).toEqual(user.getUserId());
        expect(result.getUsername()).toEqual(user.getUsername());
        expect(result.getHabbo()).toEqual(user.getHabbo());
    });
});
