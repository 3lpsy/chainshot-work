const Block = require("./models/Block");
const Transaction = require("./models/Transaction");
const UTXO = require("./models/UTXO");
const db = require("./db");
const { PUBLIC_KEY } = require("./config");
const TARGET_DIFFICULTY = BigInt("0x0" + "F".repeat(63));
const BLOCK_REWARD = 10;
const zmq = require("zeromq");

function validateBlock(blockData) {
  return true;
}

function propagateBlock(block, netLocation) {
  let msg = block.toJson();
  let sock = zmq.socket("pub");
  console.log("Propagating block", msg);
  sock.bindSync(netLocation);
  sock.send(msg);
}

function networkHandler(msg) {
  console.log("Received block");
  let message = msg.toString();
  let data = JSON.parse(message);
  let otherBlock = data;
  if (validateBlock(otherBlock)) {
    stopMining();
    const block = new Block();
    // TODO: add transactions from the mempool
    const coinbaseUTXO = new UTXO(otherBlock.coinbase, BLOCK_REWARD);
    const coinbaseTX = new Transaction([], [coinbaseUTXO]);
    block.addTransaction(coinbaseTX);
    block.execute();

    db.blockchain.addBlock(block);

    console.log(
      `Imported block #${db.blockchain.blockHeight()} with a hash of ${block.hash()}`
    );
  }
}

function listenToNetwork(netLocation) {
  setTimeout(function () {
    let sock = zmq.socket("sub");
    console.log("Binding listener to", netLocation);
    sock.connect(netLocation);
    sock.on("message", networkHandler);
  }, 1);
}

let mining = false;

function startMining(coinbase, netLocation) {
  mining = true;
  mine(coinbase, netLocation);
}

function stopMining() {
  mining = false;
}

function mine(coinbase, netLocation) {
  if (!mining) return;

  const block = new Block();

  // TODO: add transactions from the mempool

  const coinbaseUTXO = new UTXO(PUBLIC_KEY, BLOCK_REWARD);
  const coinbaseTX = new Transaction([], [coinbaseUTXO]);
  block.addTransaction(coinbaseTX);

  while (BigInt("0x" + block.hash()) >= TARGET_DIFFICULTY) {
    block.nonce++;
  }
  block.execute();
  db.blockchain.addBlock(block);
  if (netLocation) {
    console.log("Propagating block");
    propagateBlock(block, netLocation);
  }

  console.log(
    `Mined block #${db.blockchain.blockHeight()} with a hash of ${block.hash()} at nonce ${
      block.nonce
    }`
  );

  setTimeout(function () {
    mine(coinbase, netLocation);
  }, 2500);
}

module.exports = {
  startMining,
  stopMining,
  listenToNetwork,
};
