const { RtmClient, CLIENT_EVENTS, WebClient } = require('@slack/client');

const token = 'xoxb-309998092262-sNUs8PQVpegr6LhYduexLk7t';

const rtm = new RtmClient(token, {
  dataStore: false,
  useRtmConnect: true,
  logLevel: 'debug',
});
// Need a web client to find a channel where the app can post a message
const web = new WebClient(token);

console.log(`Loading Channels`);
// Load the current channels list asynchrously
let channelListPromise = web.channels.list();
console.log(`Go On Async Loading`);

rtm.on(CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, () => {
  console.log(`Ready`);
  // Wait for the channels list response
  channelListPromise.then((res) => {

    // Take any channel for which the bot is a member
    const channel = res.channels.find(c => c.is_member);

    if (channel) {
      // We now have a channel ID to post a message in!
      // use the `sendMessage()` method to send a simple string to a channel using the channel ID
      rtm.sendMessage('Hello, world!', channel.id)
        // Returns a promise that resolves when the message is sent
        .then(() => console.log(`Message sent to channel ${channel.name}`))
        .catch(console.error);
    } else {
      console.log('This bot does not belong to any channels, invite it to at least one and try again');
    }
  });
});

// Start the connecting process
rtm.start(no_latest=1);

setTimeout(function() {
    console.log('auto shutdown');
	process.exit();
}, 8000);