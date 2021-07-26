const SHA256 = require("crypto-js/sha256");

class Block {
  constructor() {
    this.timestamp = Date.now();
    this.nonce = 0;
    this.transactions = [];
  }
  addTransaction(tx) {
    this.transactions.push(tx);
  }
  hash() {
    return SHA256(
      this.timestamp + "" + this.nonce + "" + JSON.stringify(this.transactions)
    ).toString();
  }
  execute() {
    this.transactions.forEach((x) => x.execute());
  }
  toJson() {
    let transactions = this.transactions.map((t) => {
      let txInputs = t.inputs.map((utxo) => {
        return {
          owner: utxo.owner,
          amount: utxo.amount,
          spent: utxo.spent,
        };
      });
      let txOutputs = t.outputs.map((utxo) => {
        return {
          owner: utxo.owner,
          amount: utxo.amount,
          spent: utxo.spent,
        };
      });
      return {
        inputs: txInputs,
        outputs: txOutputs,
      };
    });
    return JSON.stringify({
      timestamp: this.timestamp,
      nonce: this.nonce,
      transactions: transactions,
    });
  }
}

module.exports = Block;
