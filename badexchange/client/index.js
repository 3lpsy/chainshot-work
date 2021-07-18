import "./index.scss";

import EC from "elliptic";

const ec = new EC.ec('secp256k1');
import { SHA256 } from "crypto-js";

const server = "http://localhost:3042";

function sign(privKey, msg) {
	let key = ec.keyFromPrivate(privKey);
	let msgHash = SHA256(msg); 
	let signature = key.sign(msgHash.toString());
	console.log("Signing:", msg);
	console.log("Priv Key", privKey);
	let result = {
		message: msg,
		r: signature.r.toString(16),
		s: signature.s.toString(16)
	};
	return result;
}

function pubToAddr(publicKey) {
	const lastIndex = publicKey.length - 1;
	const startingIndex = lastIndex - 40;
	return publicKey.slice(startingIndex);
}

function privKeyToPub(privKey) {
		let key = ec.keyFromPrivate(privKey);
		return key.getPublic().encode('hex');
}

function handlePrivKey() {
	let privKey = document.getElementById("private-key").value;
	privKey = privKey.trim();
	if (privKey.length == 64) {
		let key = ec.keyFromPrivate(privKey);
		let pub = key.getPublic().encode('hex');
		let addr = pubToAddr(pub);
		document.getElementById("exchange-address").value = addr; 
		document.getElementById("exchange-publickey").value = pub; 
		updateAddr(addr);
		document.getElementById("signature").innerHTML = "";
	} else {
		document.getElementById("signature").innerHTML = "Invalid PrivKey length";
	}
}

handlePrivKey();

document.getElementById("private-key").addEventListener('input', () => {
	handlePrivKey();
});

function updateAddr(value) {
  if(value === "") {
    document.getElementById("balance").innerHTML = 0;
    return;
  }

  fetch(`${server}/balance/${value}`).then((response) => {
    return response.json();
  }).then(({ balance }) => {
    document.getElementById("balance").innerHTML = balance;
  });
}

document.getElementById("exchange-address").addEventListener('input', ({ target: {value} }) => {
	updateAddr(value);
});

function handleTransferRequest() {
	const sender = document.getElementById("exchange-address").value;
	const amount = document.getElementById("send-amount").value;
	const recipient = document.getElementById("recipient").value;
	if (! sender || ! amount || ! recipient) {
		document.getElementById("send-error").innerHTML = "Errors: Missing either sender, signer (publicKey), amount, or recipient";
	  return;
	}
	document.getElementById("send-error").innerHTML = "Errors: None"
	let privKey = document.getElementById("private-key").value;
	privKey = privKey.trim();
	if (privKey.length == 64) {
	  const msg = JSON.stringify({
		sender, amount, recipient 
	  });
	  let sig = sign(privKey, window.btoa(msg));
	  sig.signer = privKeyToPub(privKey);
	  console.log("Pub Key:", privKeyToPub(privKey));
	  console.log ("Sign R", sig.r);
	  console.log("Sign S:", sig.s);
	  let body = JSON.stringify({transaction: sig});

	  const request = new Request(`${server}/send`, { method: 'POST', body });

	  fetch(request, { headers: { 'Content-Type': 'application/json' }}).then(response => {
		return response.json();
	  }).then(({ balance }) => {
		document.getElementById("balance").innerHTML = balance;
	  });
	} else {
		document.getElementById("send-error").innerHTML = "Errors: Invalid Privkey"
		document.getElementById("signature").innerHTML = "Invalid PrivKey length";
		document.getElementById("encoded-signature").value = "";
	}
}

document.getElementById("transfer-amount").addEventListener('click', () => {
	handleTransferRequest();
});
