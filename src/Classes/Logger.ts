import * as chalk from "chalk";
import * as moment from "moment";

export default class Logger {
	static getDate() {
		return `${chalk.gray("[" + moment().format("DD MMM HH:mm:ss") + "]")}`;
	}

	static startup(...message: any) {
		console.log(`${Logger.getDate()} ${chalk.bold.green("STARTUP")} ${" ".repeat(2)}`, ...message);
	}

	static log(...message: any) {
		console.log(`${Logger.getDate()} ${chalk.bold.white("LOG")}  ${" ".repeat(5)}`, ...message);
	}

	static info(...message: any) {
		console.log(`${Logger.getDate()} ${chalk.bold.blueBright("INFO")} ${" ".repeat(5)}`, ...message);
	}

	static warn(...message: any) {
		console.log(`${Logger.getDate()} ${chalk.bold.yellowBright("WARN")} ${" ".repeat(5)}`, ...message);
	}

	static error(...message: any) {
		console.log(`${Logger.getDate()} ${chalk.bold.red("ERROR")}${" ".repeat(5)}`, ...message);
	}
}
