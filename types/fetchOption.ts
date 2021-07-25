export {};

import { GotOptions } from 'got';

declare global {
    export interface FetchOptions extends GotOptions<string> {
        /**
        Parse response body with JSON.parse and set accept header to application/json.
        @default true
        */
        readonly json?: boolean;

        /**
        Number of milliseconds this request should be cached.
        */
        readonly maxAge?: number;

        /**
        Transform the response before it gets cached.
        */
        readonly transform?: (body: unknown) => unknown;
    }
}