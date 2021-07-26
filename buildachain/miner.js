const process = require("process");
const { startMining, stopMining, listenToNetwork } = require("./mine");
const { PORT, PUBLIC_KEY, DEFAULT_NETWORK_LOCATION } = require("./config");
const { utxos, blockchain } = require("./db");
const express = require("express");
const app = express();
const cors = require("cors");

var args = process.argv.slice(2);

let COINBASE = PUBLIC_KEY;
if (args.length === 1) {
  COINBASE = args[0].trim();
  console.log("Using custom coinbase:", COINBASE);
} else {
  console.log("Using default coinbase:", COINBASE);
}

let NETWORK_LOCATION = DEFAULT_NETWORK_LOCATION;

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.post("/", (req, res) => {
  const { method, params } = req.body;
  if (method === "startMining") {
    startMining(COINBASE, NETWORK_LOCATION);
    res.send({ blockNumber: blockchain.blockHeight() });
    return;
  }
  if (method === "stopMining") {
    stopMining();
    res.send({ blockNumber: blockchain.blockHeight() });
    return;
  }
  if (method === "getBalance") {
    const [address] = params;
    const ourUTXOs = utxos.filter((x) => {
      return x.owner === address && !x.spent;
    });
    const sum = ourUTXOs.reduce((p, c) => p + c.amount, 0);
    res.send({ balance: sum.toString() });
  }
  if (method === "disconnect") {
    stopMining();
    startMining(COINBASE, null);
    console.log("Disconnecting from network");
  }
  if (method === "connect") {
    if (params.NETWORK_LOCATION) {
      NETWORK_LOCATION = params.NETWORK_LOCATION;
    }
    stopMining();
    listenToNetwork(NETWORK_LOCATION);
    startMining(COINBASE, NETWORK_LOCATION);
    console.log("Disconnecting from network");
  }
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}!`);
});
