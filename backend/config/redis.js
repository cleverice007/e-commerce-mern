import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`,
    password: process.env.REDIS_PW
});

redisClient.on('error', (err) => console.log('Redis Client Error', err));
redisClient.connect();

export default redisClient;
