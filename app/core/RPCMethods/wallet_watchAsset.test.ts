import Engine from '../Engine';
import wallet_watchAsset from './wallet_watchAsset';
// eslint-disable-next-line import/no-namespace
import * as transactionsUtils from '../../util/transactions';
import {
  TOKEN_NOT_SUPPORTED_FOR_NETWORK,
  TOKEN_NOT_VALID,
} from '../../constants/error';

const mockEngine = Engine;
jest.mock('../Engine', () => ({
  init: () => mockEngine.init({}),
  context: {
    AssetsContractController: {
      getERC20TokenDecimals: jest.fn(),
      getERC721AssetSymbol: jest.fn().mockResolvedValue('WBTC'),
    },
    NetworkController: {
      state: {
        networkConfigurations: {},
        providerConfig: {
          chainId: '0x1',
        },
      },
    },
    TokensController: {
      watchAsset: jest.fn(),
    },
    TokenListController: {
      state: {
        tokenList: {
          '0x1': [],
        },
      },
    },
    PermissionController: {
      requestPermissions: jest.fn(),
      getPermissions: jest.fn(),
    },
    PreferencesController: {
      state: {
        selectedAddress: '0x123',
      },
    },
  },
}));
const MockEngine = jest.mocked(Engine);

jest.mock('../Permissions', () => ({
  getPermittedAccounts: jest.fn(),
}));

jest.mock('../../store', () => ({
  store: {
    getState: jest.fn(() => ({
      engine: {
        backgroundState: {
          NetworkController: {
            networkConfigurations: {},
            providerConfig: {
              chainId: '0x1',
            },
          },
        },
      },
    })),
  },
}));

describe('wallet_watchAsset', () => {
  const ERC20 = 'ERC20';
  const correctWBTC = {
    address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    symbol: 'WBTC',
    decimals: '8',
    image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
  };
  it('should throw an error if the token address is not valid', async () => {
    await expect(
      wallet_watchAsset({
        req: {
          params: {
            options: {
              address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c59',
              symbol: '',
              decimals: '',
              image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
            },
            type: '',
          },
          jsonrpc: '2.0',
          method: '',
          id: '',
        },
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res: {} as any,
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        checkTabActive: () => null as any,
        hostname: '',
      }),
    ).rejects.toThrow(TOKEN_NOT_VALID);
  });
  it('should throw an error if the token address is not a smart contract address', async () => {
    jest
      .spyOn(transactionsUtils, 'isSmartContractAddress')
      .mockResolvedValue(false);
    await expect(
      wallet_watchAsset({
        req: {
          params: {
            options: {
              address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
              symbol: '',
              decimals: '',
              image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
            },
            type: '',
          },
          jsonrpc: '2.0',
          method: '',
          id: '',
        },
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        res: {} as any,
        // TODO: Replace "any" with type
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        checkTabActive: () => null as any,
        hostname: '',
      }),
    ).rejects.toThrow(TOKEN_NOT_SUPPORTED_FOR_NETWORK);
  });

  it('should call watchAsset with legit WBTC decimals and symbol', async () => {
    jest
      .spyOn(transactionsUtils, 'isSmartContractAddress')
      .mockResolvedValue(true);
    MockEngine.context.AssetsContractController.getERC20TokenDecimals.mockResolvedValue(
      correctWBTC.decimals,
    );
    MockEngine.context.AssetsContractController.getERC721AssetSymbol.mockResolvedValue(
      correctWBTC.symbol,
    );
    const spyOnWatchAsset = jest.spyOn(
      Engine.context.TokensController,
      'watchAsset',
    );
    await wallet_watchAsset({
      req: {
        params: {
          options: correctWBTC,
          type: ERC20,
        },
        jsonrpc: '2.0',
        method: '',
        id: '',
      },
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      checkTabActive: () => null as any,
      hostname: '',
    });
    expect(spyOnWatchAsset).toHaveBeenCalledWith({
      asset: correctWBTC,
      type: ERC20,
      interactingAddress: '0x123',
    });
  });
  it('should call watchAsset with fake WBTC decimals and symbol', async () => {
    const fakeWBTC = {
      address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
      symbol: 'WBTCFake',
      decimals: '16',
      image: 'https://metamask.github.io/test-dapp/metamask-fox.svg',
    };

    jest
      .spyOn(transactionsUtils, 'isSmartContractAddress')
      .mockResolvedValue(true);
    MockEngine.context.AssetsContractController.getERC20TokenDecimals.mockResolvedValue(
      correctWBTC.decimals,
    );
    MockEngine.context.AssetsContractController.getERC721AssetSymbol.mockResolvedValue(
      correctWBTC.symbol,
    );
    const spyOnWatchAsset = jest.spyOn(
      Engine.context.TokensController,
      'watchAsset',
    );
    await wallet_watchAsset({
      req: {
        params: {
          options: fakeWBTC,
          type: ERC20,
        },
        jsonrpc: '2.0',
        method: '',
        id: '',
      },
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      res: {} as any,
      // TODO: Replace "any" with type
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      checkTabActive: () => null as any,
      hostname: '',
    });
    expect(spyOnWatchAsset).toHaveBeenCalledWith({
      asset: correctWBTC,
      type: ERC20,
      interactingAddress: '0x123',
    });
  });
});
