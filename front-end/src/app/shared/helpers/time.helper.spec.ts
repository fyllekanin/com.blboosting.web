import { TimeHelper } from './time.helper';

describe('TimeHelper', () => {

    it('getDay should return the day for given number', () => {
        // When
        const day = TimeHelper.getDay(1);

        // Then
        expect(day.abbr).toEqual('Mon');
    });

    describe('getDayWithSuffix', () => {
        it('should reutrn "st" for correct day', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(1);

            // Then
            expect(result).toEqual('1st');
        });
        it('should reutrn "nd" for correct day', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(2);

            // Then
            expect(result).toEqual('2nd');
        });
        it('should reutrn "rd" for correct day', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(3);

            // Then
            expect(result).toEqual('3rd');
        });
        it('should reutrn "th" for correct day', () => {
            // When
            const result = TimeHelper.getDayWithSuffix(4);

            // Then
            expect(result).toEqual('4th');
        });
    });

    describe('getConvertedDay', () => {
        it('should return the original day if converted hour is 1 to 23', () => {
            for (let i = 1; i < 23; i++) {
                expect(TimeHelper.getConvertedDay(i, 1)).toEqual(1);
            }
        });
        it('should return day + 1 if converted hours is more then 23', () => {
            // Given
            const day = 2;
            const convertedHour = 24;

            // When
            const result = TimeHelper.getConvertedDay(convertedHour, day);

            // Then
            expect(result).toEqual(day + 1);
        });
        it('should return 1 if converted hours is more then 23 and current day is 7', () => {
            // Given
            const day = 7;
            const convertedHour = 24;

            // When
            const result = TimeHelper.getConvertedDay(convertedHour, day);

            // Then
            expect(result).toEqual(1);
        });
        it('should return 7 if converted hours is less then 0 and current day is 1', () => {
            // Given
            const day = 1;
            const convertedHour = -1;

            // When
            const result = TimeHelper.getConvertedDay(convertedHour, day);

            // Then
            expect(result).toEqual(7);
        });
        it('should return day - 1 if converted hours is less then 0', () => {
            // Given
            const day = 2;
            const convertedHour = -1;

            // When
            const result = TimeHelper.getConvertedDay(convertedHour, day);

            // Then
            expect(result).toEqual(day - 1);
        });
    });

    describe('getConvertedHour', () => {
        it('should return argument if it is 1 to 23', () => {
            // Then
            expect(TimeHelper.getConvertedHour(5)).toEqual(5);
        });
        it('should return value - 24 if bigger then 23', () => {
            // Then
            expect(TimeHelper.getConvertedHour(24)).toEqual(24 - 24);
        });
        it('should return value + 24 if lesser then 0', () => {
            // Then
            expect(TimeHelper.getConvertedHour(-5)).toEqual(-5 + 24);
        });
    });

    it('getHours should return all hours of the day', () => {
        // Then
        expect(TimeHelper.getHours().length).toEqual(24);
    });
});
