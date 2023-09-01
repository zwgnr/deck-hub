import { useAtom } from 'jotai';
import { showDetailsAtom } from '~/lib/atoms';
import { Switch } from '../base/switch';

export const HoverToggle = () => {
  const [hoverEnabled, setHoverEnabled] = useAtom(showDetailsAtom);
  return (
    <Switch isSelected={hoverEnabled} onChange={setHoverEnabled}>
      Details
    </Switch>
  );
};
