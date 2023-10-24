const logger = (action, message) => console.log(`[${ new Date().getFullYear() + "-" + (new Date().getMonth() + 1) + "-" + new Date().getDate() + " " + new Date().getHours() + ":" + new Date().getMinutes() + ":" + new Date().getSeconds()}]` + ' [' + action + '] ' + message)

export default logger;