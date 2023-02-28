const express = require('express');
const kue = require('kue');
const Redis = require('redis');
const { promisify } = require('util');

const redisClient = Redis.createClient();
const app = express();
const port = 1245;
const queue = kue.createQueue();

const reserveSeatAsync = promisify(redisClient.set).bind(redisClient);
const getCurrentAvailableSeatsAsync = promisify(redisClient.get).bind(redisClient);

const MAX_SEATS = 50;
let reservationEnabled = true;

app.get('/available_seats', async (_, res) => {
  const numberOfAvailableSeats = await getCurrentAvailableSeatsAsync('available_seats');
  res.setHeader('Content-Type', 'application/json');
  res.send({ numberOfAvailableSeats });
});

app.get('/reserve_seat', async (_, res) => {
  if (!reservationEnabled) {
    res.setHeader('Content-Type', 'application/json');
    res.send({ status: 'Reservation are blocked' });
    return;
  }

  queue.create('reserve_seat', {}).save(err => {
    if (err) {
      res.setHeader('Content-Type', 'application/json');
      res.send({ status: 'Reservation failed' });
    } else {
      res.setHeader('Content-Type', 'application/json');
      res.send({ status: 'Reservation in process' });
    }
  });
});

app.get('/process', async (_, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send({ status: 'Queue processing' });

  queue.process('reserve_seat', async (job, done) => {
    const currentSeats = parseInt(await getCurrentAvailableSeatsAsync('available_seats'), 10);

    if (currentSeats > 0) {
      const newSeats = currentSeats - 1;
      await reserveSeatAsync('available_seats', newSeats);

      if (newSeats === 0) {
        reservationEnabled = false;
      }

      console.log(`Seat reservation job ${job.id} completed`);
      done();
    } else {
      console.log(`Seat reservation job ${job.id} failed: Not enough seats available`);
      done(Error('Not enough seats available'));
    }
  });
});

reserveSeatAsync('available_seats', MAX_SEATS).then(() => {
  app.listen(port, () => console.log(`App listening on port ${port}`));
}).catch((err) => {
  console.error(err);
});
