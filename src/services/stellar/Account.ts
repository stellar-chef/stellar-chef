import { Keypair } from 'stellar-sdk';
import { server } from './utils';

class Account {
  public publicKey: string;
  public secretKey: string;

  constructor(keypair: Keypair) {
    this.publicKey = keypair.publicKey();
    this.secretKey = keypair.secret();
  }

  async fundWithFriendBot(): Promise<Account> {
    await server.friendbot(this.publicKey).call();
    return this;
  }

  static create(): Account {
    const keypair = Keypair.random();
    return new Account(keypair);
  }
}

export { Account };
