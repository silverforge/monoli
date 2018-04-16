import DefaultMessage from "./model/DefaultMessage";
import CloudAtlas from "./CloudAtlas";
import MotionDetectedMessage from "./model/MotionDetectedMessage";
import * as redis from 'redis';

import * as appConfig from '../config/app_config.json';
import IAmHomeMessage from "./model/IAmHomeMessage";
import AmIHomeMessage from "./model/AmIHomeMessage";

export default class Facade {

    private static I_AM_HOME: string = "I_AM_HOME";
    private static I_AM_HOME_TTL: number = 3 * 60 * 60;

    private _cloudAtlas = new CloudAtlas();
    private _redisClient = redis.createClient((<any>appConfig).redis.port, (<any>appConfig).redis.host);

    defaultService(): DefaultMessage {
        return <DefaultMessage> {
            version: 'v1.0',
            name: 'monoli'
        }
    }

    public async motionDetected(): Promise<MotionDetectedMessage> {

        let responseMessage: boolean = false;
        try {
            let result: AmIHomeMessage = await this.amIHome();
            if (!result.answer)
                responseMessage = await this._cloudAtlas.pingMotionDetected();
        } catch (error) {
            console.log(`::: ERROR ::: ${JSON.stringify(error)}`);
        }

        return <MotionDetectedMessage> {
            response: responseMessage
        };
    }

    public async iAmHome(toggle: boolean): Promise<IAmHomeMessage> {
        try {
            let result = await this._redisSetterExpire(Facade.I_AM_HOME, toggle.toString(), Facade.I_AM_HOME_TTL);
            // console.log(`::: RESULT ::: ${JSON.stringify(result)}`);
        } catch(error) {
            console.log(`::: ERROR ::: ${JSON.stringify(error)}`);
        }

        return <IAmHomeMessage> {
            set: toggle
        };
    }

    public async amIHome(): Promise<AmIHomeMessage> {
        let result: boolean = (await this._redisGetter(Facade.I_AM_HOME) == 'true');
        return <AmIHomeMessage> {
            answer: result
        };
    }

    private _redisGetter(key: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._redisClient.get(key, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }

    private _redisSetter(key: string, value: string): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._redisClient.set(key, value, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }

    private _redisSetterExpire(key: string, value: string, seconds: number): Promise<string> {
        return new Promise<string>((resolve, reject) => {
            this._redisClient.setex(key, seconds, value, (error, result) => {
                if (error)
                    reject(error);
                else
                    resolve(result);
            });
        });
    }
}
