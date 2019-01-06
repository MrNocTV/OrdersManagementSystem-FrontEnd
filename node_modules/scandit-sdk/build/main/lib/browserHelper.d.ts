import { UAParser } from "ua-parser-js";
export { UAParser };
import { BrowserCompatibility } from "./browserCompatibility";
/**
 * @hidden
 */
export declare namespace BrowserHelper {
    interface Browser {
        name: string | undefined;
        version: string | undefined;
    }
    interface CPU {
        architecture: string | undefined;
    }
    interface Device {
        model: string | undefined;
        vendor: string | undefined;
        type: string | undefined;
    }
    interface Engine {
        name: string | undefined;
        version: string | undefined;
    }
    interface OS {
        name: string | undefined;
        version: string | undefined;
    }
    const userAgentInfo: {
        getBrowser(): Browser;
        getOS(): OS;
        getEngine(): Engine;
        getDevice(): Device;
        getCPU(): CPU;
        getUA(): string;
        setUA(uastring: string): void;
    };
    /**
     * @returns The first matching error indicating a missing browser feature, or undefined.
     */
    function checkBrowserCompatibility(): BrowserCompatibility;
    /**
     * Get a device id for the current browser, when available it's retrieved from a cookie,
     * when not it's randomly generated and stored in a cookie to be retrieved by later calls.
     *
     * @returns The device id for the current browser.
     */
    function getDeviceId(): string;
}
