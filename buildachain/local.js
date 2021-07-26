const process = require("process");
const { startMining, stopMining, listenToNetwork } = require("./mine");
const { PORT, PUBLIC_KEY, DEFAULT_NETWORK_LOCATION } = require("./config");
const { utxos, blockchain } = require("./db");

var args = process.argv.slice(2);

let COINBASE = PUBLIC_KEY;
if (args.length === 1) {
  COINBASE = args[0].trim();
  console.log("Using custom coinbase:", COINBASE);
} else {
  console.log("Using default coinbase:", COINBASE);
}

let NETWORK_LOCATION = DEFAULT_NETWORK_LOCATION;

console.log("Starting local miner");
listenToNetwork(NETWORK_LOCATION);
startMining(COINBASE, NETWORK_LOCATION);
