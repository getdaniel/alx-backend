function createPushNotificationsJobs(jobs, queue) {
  if (!Array.isArray(jobs)) {
    throw new Error('Jobs is not an array');
  }

  jobs.forEach(job => {
    const jobObject = queue.create('push_notification_code_3', job);

    jobObject.save((err) => {
      if (err) {
        console.log(`Notification job ${jobObject.id} failed: ${err}`);
      } else {
        console.log(`Notification job created: ${jobObject.id}`);
      }
    });

    jobObject.on('progress', (progress) => {
      console.log(`Notification job ${jobObject.id} ${progress}% complete`);
    });

    jobObject.on('complete', () => {
      console.log(`Notification job ${jobObject.id} completed`);
    });

    jobObject.on('failed', (err) => {
      console.log(`Notification job ${jobObject.id} failed: ${err}`);
    });
  });
}

export default createPushNotificationsJobs;
