export { };

declare global {
    /**
        The text element defines the text the user will get when copying the selected result row with ⌘C or displaying large type with ⌘L.
        If these are not defined, you will inherit Alfred's standard behaviour where the arg is copied to the Clipboard or used for Large Type.
        @interface TextElement
    */
    export interface TextElement {
        /**
        User will get when copying the selected result row with ⌘C
        */
        readonly copy?: string;

        /**
        User will get displaying large type with ⌘L.
        */
        readonly largetype?: string;
    }
}
