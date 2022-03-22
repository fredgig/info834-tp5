export default function realtime(io) {
    io.on('connection', (socket) => {
        socket.on('chat', async ({ username, otherUsername, text }) => {
			io.emit(`${username}_${otherUsername}`, text);
        });

        socket.on('online', async ({ username, online }) => {
			io.emit(`${username}_online`, online);
        });
    });
}
