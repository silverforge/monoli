declare namespace Models {
    export interface IAppConfig {
        authHeaderValue: string;
        greenhouseBaseUrl: string;
        elasticBaseUrl: string;
    }

    export interface IServices {
        departments: string;
        jobStages: string;
    }
}

declare module "*.json" {
    const value: any;
    export default value;
}

// declare module "*/app_config.json" {
//     const value: any;
//     export default <Models.IAppConfig>value;
// }

// declare module "*/greenhouse_services.json" {
//     const value: any;
//     export default <Models.IServices>value;    
// }