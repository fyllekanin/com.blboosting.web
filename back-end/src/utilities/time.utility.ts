export class TimeUtility {

    static getCurrentTime (): number {
        return Math.floor(new Date().getTime() / 1000);
    }

    static getCurrentDay (): number {
        const day = new Date().getUTCDay();
        return day === 0 ? 7 : day;
    }

    static getCurrentHour (): number {
        return new Date().getUTCHours();
    }
}
