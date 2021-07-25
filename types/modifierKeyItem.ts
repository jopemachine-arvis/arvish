export {};

declare global {
    /**
        Defines what to change when the modifier key is pressed.
        When you release the modifier key, it returns to the original item.
        @interface ModifierKeyItem
    */
    export interface ModifierKeyItem {
        readonly valid?: boolean;
        readonly title?: string;
        readonly subtitle?: string;
        readonly arg?: string;
        readonly icon?: string;
        readonly variables?: Record<string, string>;
    }
}
