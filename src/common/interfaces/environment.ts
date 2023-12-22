export interface IEnvironment {
    APP: {
        NAME?: string;
        PORT: number;
        ENV?: string;
        CLIENT: string;
        PASSWORD_SALT: number;
    };
    DB: {
        URL: string;
        USER: string;
        PASSWORD: string;
        DATABASE_NAME: string;
    };
    JWT: {
        ACCESS_KEY: string;
        REFRESH_KEY: string;
    };
    JWT_EXPIRES_IN: {
        ACCESS: string;
        REFRESH: string;
    };
    FRONTEND_URL: string;
    AWS: {
        ACCESS_KEY_ID: string;
        SECRET_ACCESS_KEY: string;
        REGION: string;
        BUCKET_NAME: string;
        CLOUD_FRONT_URL: string;
    };
}
