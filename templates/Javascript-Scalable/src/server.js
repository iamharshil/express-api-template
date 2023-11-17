const http = require("http");
const app = require("./app");
const { PORT } = require("./config/server.config");
const Database = require("./utils/Database");

const server = http.createServer(app);
server.listen(PORT, async () => {
	await Database();
	console.log(`Server running on port http://localhost:${PORT}`);
});
