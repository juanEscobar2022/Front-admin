export interface NavItem {
    name: string;
    url: string;
    title?: boolean;
    icon?: string;
    children?: NavItem[];
}