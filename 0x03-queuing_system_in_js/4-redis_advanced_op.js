import redis from 'redis';
const client = redis.createClient();

// Create hash
client.hset('HolbertonSchools', 'Portland', '50', redis.print);
client.hset('HolbertonSchools', 'Seattle', '80', redis.print);
client.hset('HolbertonSchools', 'New York', '20', redis.print);
client.hset('HolbertonSchools', 'Bogota', '20', redis.print);
client.hset('HolbertonSchools', 'Cali', '40', redis.print);
client.hset('HolbertonSchools', 'Paris', '2', redis.print);

// Display hash
client.hgetall('HolbertonSchools', (err, result) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(result);
});

client.on('connect', () => {
  console.log('Redis client connected to the server');
});

client.on('error', (error) => {
  console.error(error);
});
