export { };

declare global {
    /**
        The icon displayed in the result row. Workflows are run from their workflow folder, so you can reference icons stored in your workflow relatively.
        By omitting the "type", Alfred will load the file path itself, for example a png.
        By using "type": "fileicon", Alfred will get the icon for the specified path.
        Finally, by using "type": "filetype", you can get the icon of a specific file, for example "path": "public.png"
        @interface IconElement
    */
    export interface IconElement {
        readonly path?: string;
        readonly type?: 'fileicon' | 'filetype';
    }
}