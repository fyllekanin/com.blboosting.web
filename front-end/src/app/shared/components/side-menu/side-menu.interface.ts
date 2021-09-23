export interface ISideMenuItem {
    label: string;
    url: string;
    icon: string;
    isApplicable: boolean;
}

export interface ISideMenu {
    title: string;
    items: Array<ISideMenuItem>;
}
