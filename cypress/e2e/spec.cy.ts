const BASE_URL = Cypress.config('baseUrl');
const ASSET_CODE = 'testAsset';
const STATUS_SELECTOR = '#status';
const TIMEOUT = { timeout: 30000 };

const visitAssetIssuancePage = (): void => {
  cy.visit(`${BASE_URL}/recipe/asset-issuance`);
};

const createAsset = (assetCode: string): void => {
  cy.get('#asset-code').as('assetCodeInput').type(assetCode);
  cy.get('#prepare-button').click();
};

const checkPublicKeyAndSecretKey = (publicKeyElement: string, secretKeyElement: string): void => {
  cy.get(publicKeyElement).should('not.be.empty').invoke('text').should('match', /^G/).and('have.length', 56);
  cy.get(secretKeyElement).should('not.be.empty').invoke('text').should('match', /^S/).and('have.length', 56);
};

const checkCoinInfoLink = (assetCode: string): void => {
  let issuerPublicKey: string;

  cy.get('#issuerPublicKey')
    .invoke('text')
    .then((text) => {
      issuerPublicKey = text;
    })
    .then(() => {
      cy.get('#coinInfo')
        .find('a')
        .should('have.attr', 'href')
        .and('equal', `https://stellar.expert/explorer/testnet/asset/${assetCode}-${issuerPublicKey}`);
    });
};

const checkAccountInfoLink = (accountForCheckDivId: string, linkDetailsId: string): void => {
  cy.get(`#${accountForCheckDivId}`)
    .invoke('text')
    .then((accountId) => {
      cy.get(`#${linkDetailsId}`)
        .should('have.attr', 'href')
        .and('equal', `https://stellar.expert/explorer/testnet/account/${accountId}`);
    });
};
describe('Asset Creation', () => {
  beforeEach(visitAssetIssuancePage);

  it('Creates a new asset and verifies the details links, public and secret keys for the issuer and distributor, and the coin info link', () => {
    createAsset(ASSET_CODE);

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      `Transaction successful. Distributor account balance: 1000000.0000000 ${ASSET_CODE}`
    );

    checkCoinInfoLink(ASSET_CODE);
    checkPublicKeyAndSecretKey('#issuerPublicKey', '#issuerSecretKey');
    checkPublicKeyAndSecretKey('#distributorPublicKey', '#distributorSecretKey');
    checkAccountInfoLink('issuerPublicKey', 'issuerDetailsLink');
  });

  it('creates a new asset with "frozen" and "clawback" options enabled, verifies the keys, and the coin info link.', () => {
    cy.get('#frozen-asset').check();
    cy.get('#clawback-enabled').check();
    createAsset(ASSET_CODE);

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      `Transaction successful. Distributor account balance: 1000000.0000000 ${ASSET_CODE}`
    );

    checkPublicKeyAndSecretKey('#issuerPublicKey', '#issuerSecretKey');
    checkPublicKeyAndSecretKey('#distributorPublicKey', '#distributorSecretKey');
    checkCoinInfoLink(ASSET_CODE);
  });

  it('creates a new asset with frozen and clawback options and 1 holder. Checks the details, keys and links, including holder', () => {
    cy.get('#frozen-asset').check();
    cy.get('#clawback-enabled').check();
    cy.get('#create-holders').check();
    createAsset(ASSET_CODE);

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      `Transaction successful. Distributor account balance: 999900.0000000 ${ASSET_CODE}`
    );

    checkPublicKeyAndSecretKey('#issuerPublicKey', '#issuerSecretKey');
    checkPublicKeyAndSecretKey('#distributorPublicKey', '#distributorSecretKey');
    checkCoinInfoLink(ASSET_CODE);

    cy.get('#toggle-holders-button').click();

    checkPublicKeyAndSecretKey('#holder1PublicKey', '#holder1SecretKey');
    checkAccountInfoLink('holder1PublicKey', 'holder1DetailsLink');
  });

  it('handles asset creation failure with blank asset name', () => {
    cy.get('#prepare-button').click();

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      'Error: Error: Asset code is invalid (maximum alphanumeric, 12 characters at max)'
    );
  });

  it('handles asset creation failure with zero balance for holder', () => {
    cy.get('#create-holders').check();
    cy.get('#balance-value').clear().type('0');
    createAsset('testAsset');

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      'Error: TypeError: amount argument must be of type String, represent a positive number and have at most 7 digits after the decimal'
    );
  });

  it('handles asset dsitribution failure with not enough funds for the holders', () => {
    cy.get('#create-holders').check();
    cy.get('#number-of-holders').clear().type('4');
    cy.get('#payment-amount').clear().type('100');
    createAsset(ASSET_CODE);

    cy.get(STATUS_SELECTOR, TIMEOUT).should(
      'contain',
      'Error: Not enough funds for distributor account to create holders.'
    );
  });
});
