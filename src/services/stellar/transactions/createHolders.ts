import type { Asset } from 'stellar-sdk';
import { Operation, Keypair } from 'stellar-sdk';
import { Account } from '../Account';
import { server, buildTransaction } from '../utils';

export async function createHolders(
  distributorAccount: Account,
  holdersQuantity: number,
  equalBalance: string,
  asset: Asset
): Promise<Account[]> {
  const holders: Account[] = [];

  for (let i = 0; i < holdersQuantity; i++) {
    const holderAccount = Account.create();

    await holderAccount.fundWithFriendBot();

    const holder = await server.loadAccount(holderAccount.publicKey);

    const changeTrustOp = Operation.changeTrust({
      asset
    });

    const paymentOp = Operation.payment({
      source: distributorAccount.publicKey,
      destination: holderAccount.publicKey,
      asset,
      amount: equalBalance
    });

    const transaction = buildTransaction(holder, [changeTrustOp, paymentOp]);
    transaction.sign(Keypair.fromSecret(holderAccount.secretKey), Keypair.fromSecret(distributorAccount.secretKey));
    await server.submitTransaction(transaction);

    holders.push(holderAccount);
  }

  return holders;
}
