import mysql from 'mysql2/promise';
import { ENVIRONMENT } from '../common/config/environment';

export const connectDatabase = () => {
    const connection = mysql.createPool({
        // host: 'junior-dev-test-db.cncuppvyjyoj.us-east-1.rds.amazonaws.com',
        host: ENVIRONMENT.DB.URL,
        // user: 'junior_dev',
        user: ENVIRONMENT.DB.USER,
        // password: '123456789',
        password: ENVIRONMENT.DB.PASSWORD,
        // database: 'your_database',
        database: ENVIRONMENT.DB.DATABASE_NAME,
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0,
    });

    return connection;
};