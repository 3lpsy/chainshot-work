# Project

The idea is to take a pre-existing blockchain prototype and improve it in some way. I attempted to add a decentralized (sort of) networking layer via IPC (this is the sort of part) and IPC. The IPC stands in for standard mechanisms of node discovery such as DNS.

Currently, without block syncing, it is very difficult to get itto work properly. However, when mining, if a miner (one miner.js process) receives a message from another miner (for example local.js), the miner will validate the solved block (shimmed), and add it to its database fore moving on to the next block.

### Improvements

Unfortunately, this setup is extremely clunky without other syncing mechanisms and miner communication for realigning the chain head. Instead of using a pub/sub model, opting to simply run a centralized registry service would have made making other features easier. Then, the centralization of the registry service could be mitigated afterwards.
