ssgit const Redis = require('ioredis');

const redisClient = new Redis({
    host: process.env.REDIS_HOST,  
    port: process.env.REDIS_PORT || 6379,        
    password: process.env.REDIS_PASSWORD,   
    tls: {
    rejectUnauthorized: false, 
  }           
});


redisClient.on('connect', () => {
  console.log('Connected to Redis Cloud');
});

// const {keys, err} = redisClient.Keys(ctx, "*").Result()
// if (err != nil ){
//     log.Fatal(err)
// }
// fmt.Println(keys)


redisClient.on('error', (err) => {
  console.error('Redis error:', err);
});






module.exports = redisClient;