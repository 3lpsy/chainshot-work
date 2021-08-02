import type { Block, TransactionResponse } from "@ethersproject/abstract-provider";

export default class Chain {
  public height: number;
  public lastTxCount: number;
  public block: Block;
  public blockTxs: TransactionResponse[];
  constructor() {
    this.height = 0;
    this.lastTxCount = 0;
  }
}
