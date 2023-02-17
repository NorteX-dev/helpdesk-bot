const fs = require("fs");

if (fs.existsSync("dist")) {
	fs.rmSync("dist", { recursive: true });
	console.log("dist folder cleaned");
}
