export { };

type PossibleModifiers = 'fn' | 'ctrl' | 'opt' | 'cmd' | 'shift';

declare global {
    /**
        Each item describes a result row displayed in Arvis.
        @interface ScriptFilterItem
    */
    export interface ScriptFilterItem {
        /**
        This is a unique identifier for the item which allows help Arvis to learn about this item for subsequent sorting and ordering of the user's actioned results.
        It is important that you use the same UID throughout subsequent executions of your script to take advantage of Arvis's knowledge and sorting.
        If you would like Arvis to always show the results in the order you return them from your script, exclude the UID field.
        */
        readonly uid?: string;

        /**
        The title displayed in the result row. There are no options for this element and it is essential that this element is populated.

        @example
        ```
        "title": "Desktop"
        ```
        */
        readonly title: string;

        /**
        The subtitle displayed in the result row. This element is optional.

        @example
        ```
        "subtitle": "~/Desktop"
        ```
        */
        readonly subtitle?: string;

        /**
        The argument which is passed through the workflow to the connected output action.
        While the arg attribute is optional, it's highly recommended that you populate this as it's the string which is passed to your connected output actions.
        If excluded, you won't know which result item the user has selected.

        @example
        ```
        "arg": "~/Desktop"
        ```
        */
        readonly arg?: string;

        /**
        The icon displayed in the result row. Workflows are run from their workflow folder, so you can reference icons stored in your workflow relatively.
        By omitting the "type", Arvis will load the file path itself, for example a png.
        By using "type": "fileicon", Arvis will get the icon for the specified path. Finally, by using "type": "filetype", you can get the icon of a specific file, for example "path": "public.png"

        @example
        ```
        "icon": {
            "type": "fileicon",
            "path": "~/Desktop"
        }
        ```
        */
        readonly icon?: IconElement | string;

        /**
        If this item is valid or not. If an item is valid then Arvis will action this item when the user presses return.
        @default true
        */
        readonly valid?: boolean;

        /**
        From Arvis 3.5, the match field enables you to define what Arvis matches against when the workflow is set to "Arvis Filters Results".
        If match is present, it fully replaces matching on the title property.
        */
        readonly match?: string;

        /**
        An optional but recommended string you can provide which is populated into Arvis's search field if the user auto-complete's the selected result (⇥ by default).
        */
        readonly autocomplete?: string;

        /**
        By specifying "type": "file", this makes Arvis treat your result as a file on your system.
        This allows the user to perform actions on the file like they can with Arvis's standard file filters.
        When returning files, Arvis will check if the file exists before presenting that result to the user.
        This has a very small performance implication but makes the results as predictable as possible.
        If you would like Arvis to skip this check as you are certain that the files you are returning exist, you can use "type": "file:skipcheck".
        @default "default"
        */
        readonly type?: 'default' | 'file' | 'file:skipcheck';

        /**
        The mod element gives you control over how the modifier keys react.
        You can now define the valid attribute to mark if the result is valid based on the modifier selection and set a different arg to be passed out if actioned with the modifier.
        */
        readonly mods?: Record<PossibleModifiers, ModifierKeyItem>;

        /**
        This element defines the Universal Action items used when actioning the result, and overrides arg being used for actioning.
        The action key can take a string or array for simple types', and the content type will automatically be derived by Arvis to file, url or text.

        @example
        ```
        Single Item:
        "action": "Arvis is Great"

        Multiple Items:
        "action": ["Arvis is Great", "I use him all day long"]

        For control over the content type of the action, you can use an object with typed keys as follows:
        "action": {
            "text": ["one", "two", "three"],
            "url": "https://www.Arvisapp.com",
            "file": "~/Desktop",
            "auto": "~/Pictures"
        }
        ```
        */
        // To do (jopemachine): Activate attribute below after 'action' is implemented in Arvis.
        // readonly action?: string | string[] | ActionElement;

        /**
        The text element defines the text the user will get when copying the selected result row with ⌘C or displaying large type with ⌘L.

        @example
        ```
        "text": {
            "copy": "https://www.Arvisapp.com/ (text here to copy)",
            "largetype": "https://www.Arvisapp.com/ (text here for large type)"
        }
        ```
        */
        readonly text?: TextElement;

        /**
        A Quick Look URL which will be visible if the user uses the Quick Look feature within Arvis (tapping shift, or ⌘Y).
        Note that quicklookurl will also accept a file path, both absolute and relative to home using ~/.

        @example
        ```
        "quicklookurl": "https://www.Arvisapp.com/"
        ```
        */
        readonly quicklookurl?: string;

        /**
        Variables can be passed out of the script filter within a variables object.
        */
        readonly variables?: Record<string, string>;
    }
}