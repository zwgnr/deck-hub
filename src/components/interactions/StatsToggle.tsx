import { useAtom } from 'jotai';
import { showStatsAtom } from '~/lib/atoms';
import { Switch } from '../base/switch';

export const StatsToggle = () => {
  const [statsEnabled, setStatsEnabled] = useAtom(showStatsAtom);
  return (
    <Switch isSelected={statsEnabled} onChange={setStatsEnabled}>
      Quick Stats
    </Switch>
  );
};
