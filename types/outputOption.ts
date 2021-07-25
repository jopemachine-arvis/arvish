export { };

declare global {

    export interface OutputOptions {
        /**
        A script can be set to re-run automatically after some interval.
        The script will only be re-run if the script filter is still active and the user hasn't changed the state of the filter by typing and triggering a re-run.
        For example, it could be used to update the progress of a particular task:
        */
        readonly rerunInterval?: number;

        readonly variables?: Record<string, string>;
    }
}