const express = require('express');
const app = express();
const cors = require('cors');
const port = 3042;

const elliptic = require('elliptic');
const {SHA256} = require('crypto-js');
const EC = new elliptic.ec('secp256k1');

const BALANCES = {}

function pubToAddr(publicKey) {
	const lastIndex = publicKey.length - 1;
	const startingIndex = lastIndex - 40;
	return publicKey.slice(startingIndex);
}

function padSecret(secret) {
	let buf = Buffer.alloc(192);
	buf.fill(secret);
	return buf;
}

function genKeyPair(secret = null) {
	let key;
	if (secret) {
		secret = padSecret(secret)
		key = EC.genKeyPair({entropy: secret});
	} else {
		key = EC.getKeyPair();
	}
	const pub = key.getPublic().encode('hex');
	const addr = pubToAddr(pub)
	return {
		publicKey:pub,
		addr: addr,
		privateKey: key.getPrivate().toString(16)
	}
}

function initToBal(kp, bal) {
	console.log("Addr:", kp.addr, "| Bal:", bal);
	console.log("PrivKey:", kp.privateKey);
	BALANCES[kp.addr] = bal;
}

function initData() {
	let set1= genKeyPair('123');
	initToBal(set1, 100);
	let set2 = genKeyPair('456');
	initToBal(set2, 200);
	let set3 = genKeyPair('789');
	initToBal(set3, 300);
}

// localhost can have cross origin errors
// depending on the browser you use!
app.use(cors());
app.use(express.json());

app.get('/balance/:address', (req, res) => {
  const {address} = req.params;
  const balance = BALANCES[address] || 0;
  res.send({ balance });
});


function verify(message, publicKey, r, s) {
	var key = EC.keyFromPublic(publicKey, 'hex');
	const msgHash = SHA256(message).toString();
	return key.verify(msgHash, {r: r, s: s});
}

app.post('/send', (req, res) => {

  let transaction = req.body.transaction;
  let signer = transaction.signer;
  let message = JSON.parse(Buffer.from(transaction.message, 'base64'));
  let sender = message.sender;
  let amount = message.amount;
  let recipient = message.recipient;
  console.log('Verifying:', message);
	console.log("Raw messge", transaction.message);
  console.log("PubKey:", signer) 
	console.log("Sig R:", transaction.r);
	console.log("Sig S:", transaction.s);
  let verdict = verify(transaction.message, signer, transaction.r, transaction.s)
	console.log("Status:", verdict);
  if (verdict) {
	  console.log('Verify success');
	  BALANCES[sender] -= amount;
	  BALANCES[recipient] = (BALANCES[recipient] || 0) + +amount;
	  res.send({ balance: BALANCES[sender] });
  } else {
	  res.send({message: "Verification failed"});
  }
});


initData();
app.listen(port, () => {
  console.log(`Listening on port ${port}!`);
})
