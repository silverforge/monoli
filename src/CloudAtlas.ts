import fetch from "node-fetch";

import * as appConfig from '../config/app_config.json';

export default class CloudAtlas implements ICloudAtlas {
    private _motionDetectedUrl = (<any>appConfig).baseUrl 
        + "/" 
        + (<any>appConfig).endpointPath 
        + "/" 
        + (<any>appConfig).function;

    public async pingMotionDetected(): Promise<boolean> {
        let response = await fetch(this._motionDetectedUrl, { method: "GET" });
        // let json = await response.json();
    
        return response.ok;
    }
}