import { memo } from 'react';

import { WalletDefault } from '@coinbase/onchainkit/wallet';

const WalletButton = () => {
  return <WalletDefault />;
};

export default memo(WalletButton);
