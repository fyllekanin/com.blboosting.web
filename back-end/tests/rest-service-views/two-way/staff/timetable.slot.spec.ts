import { TimetableSlot } from '../../../../src/rest-service-views/two-way/staff/timetable.slot';
import { InternalRequest } from '../../../../src/utilities/internal.request';
import { SlimUserView } from '../../../../src/rest-service-views/two-way/slim-user.view';

describe('TimetableSlot', () => {

    it('should be possible to build', () => {
        // When
        const result = TimetableSlot.newBuilder()
            .withTimetableId(0)
            .withUser(SlimUserView.newBuilder().build())
            .withDay(1)
            .withHour(1)
            .withEvent(null)
            .withIsBooked(true)
            .withIsCurrentSlot(true)
            .withIsRadio(true)
            .build();

        // Then
        expect(result.getTimetableId()).toEqual(0);
        expect(result.getUser() instanceof SlimUserView).toBeTrue();
        expect(result.getDay()).toEqual(1);
        expect(result.getHour()).toEqual(1);
        expect(result.getEvent()).toBeNull();
        expect(result.getIsBooked()).toBeTrue();
        expect(result.getIsCurrentSlot()).toBeTrue();
        expect(result.getIsRadio()).toBeTrue();
    });

    it('should be possible to build', () => {
        // When
        const result = TimetableSlot.newBuilder()
            .withTimetableId(0)
            .withUser(null)
            .build();

        // Then
        expect(result.getTimetableId()).toEqual(0);
        expect(result.getUser()).toBeNull();
    });

    it('should build correctly with of', () => {
        // Given
        const req = <InternalRequest><unknown>{
            body: {
                user: {},
                day: 1,
                hour: 1,
                event: null,
                isBooked: true,
                isCurrentSlot: true
            }
        };

        // When
        const result = TimetableSlot.of(req, false, 1);

        /// Then
        expect(result.getTimetableId()).toEqual(1);
        expect(result.getUser() instanceof SlimUserView).toBeTrue();
        expect(result.getDay()).toEqual(1);
        expect(result.getHour()).toEqual(1);
        expect(result.getEvent()).toBeNull();
        expect(result.getIsBooked()).toBeTrue();
        expect(result.getIsCurrentSlot()).toBeTrue();
        expect(result.getIsRadio()).toBeFalse();
    });
});
