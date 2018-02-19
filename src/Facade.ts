import DefaultMessage from "./model/DefaultMessage";
import CloudAtlas from "./CloudAtlas";
import MotionDetectedMessage from "./model/MotionDetectedMessage";

export default class Facade {

    private _cloudAtlas = new CloudAtlas();

    defaultService(): DefaultMessage {
        return <DefaultMessage> {
            version: 'v1.0',
            name: 'monoli'
        }
    }

    async motionDetected(): Promise<MotionDetectedMessage> {
        let success = await this._cloudAtlas.pingMotionDetected();

        return <MotionDetectedMessage> {
            response: success
        };
    }
}