import type { Account } from 'stellar-sdk';
import { Operation, Keypair, Asset } from 'stellar-sdk';
import { buildTransaction, submitTransaction } from '../utils';
export async function submitDisableTrustlineTransactionForFrozenAsset(
  assetCode: string,
  distributorAccountPublicKey: string,
  issuer: Account,
  issuerAccountSecretKey: string
): Promise<void> {
  const existingAsset = new Asset(assetCode, issuer.accountId());

  const disableTrustOperation = Operation.setTrustLineFlags({
    source: issuer.accountId(),
    trustor: distributorAccountPublicKey,
    asset: existingAsset,
    flags: { authorized: false }
  });

  const trustlineDisableOperations = [disableTrustOperation];

  const transaction = buildTransaction(issuer, trustlineDisableOperations);
  transaction.sign(Keypair.fromSecret(issuerAccountSecretKey));
  await submitTransaction(transaction);
}
