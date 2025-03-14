import { memo } from 'react';

import { Avatar, EthBalance, Name } from '@coinbase/onchainkit/identity';
import { Address, Identity } from '@coinbase/onchainkit/identity';
import { color } from '@coinbase/onchainkit/theme';
import { ConnectWallet, ConnectWalletText } from '@coinbase/onchainkit/wallet';
import {
  Wallet,
  WalletDropdown,
  WalletDropdownDisconnect,
  WalletDropdownLink,
} from '@coinbase/onchainkit/wallet';

const WalletButton = () => {
  return (
    <Wallet>
      <ConnectWallet>
        <ConnectWalletText>Connect Wallet</ConnectWalletText>
        <Avatar className='h-6 w-6' />
        <Name />
      </ConnectWallet>
      <WalletDropdown>
        <Identity className='px-4 pb-2 pt-3'>
          <Avatar />
          <Name />
          <Address className={color.foregroundMuted} />
          <EthBalance />
        </Identity>
        <WalletDropdownLink
          icon='wallet'
          href='https://keys.coinbase.com'
          target='_blank'
        >
          Wallet
        </WalletDropdownLink>
        <WalletDropdownDisconnect />
      </WalletDropdown>
    </Wallet>
  );
};

export default memo(WalletButton);
