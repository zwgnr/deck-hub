import { Icon } from '@iconify/react';

import package_json from '../../package.json';

const twitter = <Icon icon="mdi:twitter" className="h-6 w-6" />;

export const Footer = () => (
  <div className="flex h-16 w-full flex-row items-center justify-between divide-neutral-500  px-8  text-neutral-400">
    <div className="flex h-full flex-row items-center divide-x-2 p-2">
      <a
        title="https://twitter.com/zwagnr"
        href="https://twitter.com/zwagnr"
        target="_blank"
        rel="noopener noreferrer"
        className="text-lime-400"
      >
        {twitter}
      </a>
      <a
        href="https://etherscan.io/address/0x5e19dafC53f8C6Be0797Ed6c252A92E53cb75860"
        target="_blank"
        rel="noopener noreferrer"
        className="ml-1"
      >
        <p className="ml-2">Donate</p>
      </a>
    </div>
    <p>{`v${package_json.version}`}</p>
    <div className="flex">
      <p className="text-xs">*Not affiliated with Parallel Studios or EchelonFND</p>
    </div>
  </div>
);
