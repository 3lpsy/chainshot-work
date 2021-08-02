import type { Provider as EthersProvider } from "@ethersproject/providers";
import type { Signer as EthersSigner } from "ethers";
import { utils } from "ethers";
import { Web3Provider } from "@ethersproject/providers";
import Chain from "$classes/Chain";

import { derived, writable, Writable, Readable, Unsubscriber } from "svelte/store";

const METAMASK_KEY = "metamask";

class ApiSet<ItemType> {
  private _current: string;
  private _providers: { [key: string]: ItemType };
  constructor() {
    this._providers = {};
    this._current = "";
  }

  get current(): ItemType {
    if (!this._current || !this.has(this._current)) {
      throw Error("No current provider");
    }
    return this.grab(this._current);
  }

  public has(name: string): Boolean {
    return Object.keys(this._providers).includes(name);
  }

  public grab(name: string): ItemType {
    if (this.has(name)) {
      return this._providers[name];
    } else {
      throw new Error("No provider for name " + name);
    }
  }

  public add(name: string, provider: ItemType) {
    if (Object.keys(this._providers).length < 1) {
      this._current = name;
    }
    this._providers[name] = provider;
  }

  public remove(name: string) {
    if (!this.has(name)) {
      throw new Error("No provider for name to remove: " + name);
    }
    delete this._providers[name];
    if (Object.keys(this._providers).length < 1) {
      this._current = "";
    }
  }
}

export default class Account {
  public subscribe: Function;
  private _store: Writable<Account>;
  private _set: Function;
  private _update: Function;

  private _providers: ApiSet<EthersProvider>;
  private _signers: ApiSet<EthersSigner>;

  private metamaskAddress: string;
  private metamaskBalance: string;

  public chain: Chain;

  // public isMetamasked: Readable<Boolean>;

  constructor() {
    this._providers = new ApiSet<EthersProvider>();
    this._signers = new ApiSet<EthersSigner>();
    this._store = writable(this);
    this.subscribe = this._store.subscribe;
    this._set = this._store.set;
    this._update = this._store.update;

    this.metamaskAddress = "";
    this.metamaskBalance = "";

    this.chain = new Chain();
  }

  private prov(name: string) {
    return this._providers.grab(name);
  }

  private sig(name: string) {
    return this._signers.grab(name);
  }

  get isMetamasked() {
    return this._providers.has(METAMASK_KEY);
  }

  public async removeMetamaskConnection() {
    if (this._providers.has(METAMASK_KEY)) {
      this._update(o => {
        o._providers.remove(METAMASK_KEY);
        return o;
      });
    }
  }

  public async addMetamaskConnection() {
    if (!window.hasOwnProperty("ethereum")) {
      throw new Error("No Ethereum provider found on window");
    }
    const provider = new Web3Provider(window["ethereum"]);
    let selectedAddresses = [];
    try {
      selectedAddresses = await provider.provider.request({ method: "eth_requestAccounts" });
    } catch (e: any) {
      console.log(e);
      return false;
    }

    if (selectedAddresses.length === 0) {
      return false;
    }
    const signer = await provider.getSigner();
    this._update(o => {
      o._providers.add(METAMASK_KEY, provider);
      o._signers.add(METAMASK_KEY, signer);
      o.metamaskAddress = selectedAddresses[0];
      return o;
    });

    await this.updateMetamaskBalance();
    await this.updateMetamaskChain();
  }
  public async updateMetamaskBalance() {
    if (!this.metamaskAddress) {
      return false;
    }
    let balance = await this._providers.grab(METAMASK_KEY).getBalance(this.metamaskAddress);
    this._update(o => {
      o.metamaskBalance = utils.formatEther(balance);
      return o;
    });
  }
  public async updateMetamaskChain() {
    let latest = await this.prov(METAMASK_KEY).getBlockNumber();
    let block = await this.prov(METAMASK_KEY).getBlock(latest);
    this._update(o => {
      o.chain.height = latest;
      o.chain.lastTxCount = block.transactions.length;
      o.chain.lastBlock = block;
      return o;
    });

    let prom = block.transactions.map(t => this.prov(METAMASK_KEY).getTransaction(t));
    Promise.all(prom).then(txRecpts => {
      let txs = block.transactions.map(txName => {
        return txRecpts.find(r => r.hash === txName);
      });
      this._update(o => {
        o.chain.blockTxs = txs;
        return o;
      });
    });
  }
}
