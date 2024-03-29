import {
  type Account,
  TransactionBuilder,
  BASE_FEE,
  type xdr,
  type Transaction,
  Horizon,
  Operation,
  Asset
} from 'stellar-sdk';

import { PUBLIC_STELLAR_NETWORK_URL, PUBLIC_STELLAR_NETWORK_PASSPHRASE } from '$env/static/public';
import type IAsset from '../asset/IAsset';
import type { AccountResponse } from 'stellar-sdk/lib/horizon';

const server = new Horizon.Server(PUBLIC_STELLAR_NETWORK_URL);

function buildTransaction(sourceAccount: Account, operations: xdr.Operation[]): Transaction {
  const transaction = new TransactionBuilder(sourceAccount, {
    fee: BASE_FEE,
    networkPassphrase: PUBLIC_STELLAR_NETWORK_PASSPHRASE
  });

  try {
    for (const operation of operations) {
      transaction.addOperation(operation);
    }

    return transaction.setTimeout(30).build();
  } catch (error) {
    console.error(error);
    throw error;
  }
}

async function submitTransaction(transaction: Transaction): Promise<Horizon.HorizonApi.SubmitTransactionResponse> {
  try {
    return await server.submitTransaction(transaction);
  } catch (e: any) {
    const stellarErrorCode = e.response.data.extras.result_codes;

    if (stellarErrorCode === undefined) {
      throw new Error(JSON.stringify(e));
    }
    throw new Error(JSON.stringify(e.response.data.extras.result_codes));
  }
}

async function checkClawbackStatus(issuerAccountId: string): Promise<boolean> {
  const issuerAccount = await server.loadAccount(issuerAccountId);

  return issuerAccount.flags.auth_clawback_enabled && issuerAccount.flags.auth_revocable;
}

async function checkAssetFrozen(
  distributorPublicKey: string,
  frozenAssetCode: string,
  issuerPublicKey: string
): Promise<boolean> {
  const distributorAccountWithFrozenAsset = await server.loadAccount(distributorPublicKey);

  const trustline = distributorAccountWithFrozenAsset.balances.find(
    (balance) =>
      'asset_issuer' in balance && balance.asset_code === frozenAssetCode && balance.asset_issuer === issuerPublicKey
  );

  if (trustline !== null && trustline !== undefined && 'is_authorized' in trustline && !trustline.is_authorized) {
    return true;
  } else {
    return false;
  }
}

async function findClaimableBalance(claimant: string): Promise<Horizon.ServerApi.ClaimableBalanceRecord[]> {
  const claimableBalances = await server.claimableBalances().claimant(claimant).call();
  return claimableBalances.records;
}

function getSponsorWrapperOperations(operation: xdr.Operation, sponsoredId: string, source: string): xdr.Operation[] {
  return [
    Operation.beginSponsoringFutureReserves({
      sponsoredId,
      source
    }),
    operation,
    Operation.endSponsoringFutureReserves({
      source: sponsoredId
    })
  ];
}

async function getAccountBalances(
  account: AccountResponse,
  asset?: Asset
): Promise<
  | Horizon.HorizonApi.BalanceLineNative
  | Horizon.HorizonApi.BalanceLineAsset<'credit_alphanum4'>
  | Horizon.HorizonApi.BalanceLineAsset<'credit_alphanum12'>
  | Horizon.HorizonApi.BalanceLineLiquidityPool
  | Array<
  | Horizon.HorizonApi.BalanceLineNative
  | Horizon.HorizonApi.BalanceLineAsset<'credit_alphanum4'>
  | Horizon.HorizonApi.BalanceLineAsset<'credit_alphanum12'>
  | Horizon.HorizonApi.BalanceLineLiquidityPool
  >
  > {
  const balances = account.balances;

  if (asset instanceof Asset) {
    for (const balance of balances) {
      if (
        'asset_code' in balance &&
        'asset_issuer' in balance &&
        balance.asset_code === asset.code &&
        balance.asset_issuer === asset.issuer
      ) {
        return balance;
      }
    }

    throw new Error('Asset not found');
  }

  return balances;
}

function getAssetFromUser(
  isNative: boolean,
  assets: IAsset[],
  selectedAsset: number | null,
  data: Record<string, string>
): Asset {
  if (isNative) {
    return Asset.native();
  }

  if (typeof selectedAsset === 'number') {
    const { code, issuer } = assets[selectedAsset];
    return new Asset(code, issuer);
  }

  if ('code' in data && 'issuer' in data) {
    return new Asset(data.code, data.issuer);
  }

  throw new Error('Asset not found');
}

export {
  server,
  buildTransaction,
  getAssetFromUser,
  submitTransaction,
  checkClawbackStatus,
  checkAssetFrozen,
  findClaimableBalance,
  getSponsorWrapperOperations,
  getAccountBalances
};
