import { IconExit } from '../Icons';
import { useNavigate } from 'react-router-dom';

interface Prop {
  classButton?: string;
  endpointRoute: string;
  classIcon?: string;
}
const ButtonExit = ({ classButton, classIcon, endpointRoute }: Prop) => {
  const navigate = useNavigate();
  const handleNavigateHome = () => {
    navigate(endpointRoute);
  };
  return (
    <button className={classButton} onClick={handleNavigateHome}>
      <IconExit className={classIcon} />
    </button>
  );
};

export default ButtonExit;
