export interface IDashboard {
    characters: Array<{
        name: string,
        class: string,
        faction: string,
        inset: string,
        hcRaidParse: number,
        mythicPlus: {
            score: number,
            role: string
        },
        raiding: {
            bestAverage: number
        }
    }>
}
