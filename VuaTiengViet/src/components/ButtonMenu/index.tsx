import { IconMenu } from '../Icons';
interface IProp {
  onOpenMenu: () => void;
}
const ButtonMenu = ({ onOpenMenu }: IProp) => {
  return (
    <div className="absolute bottom-0 right-0 flex hover:bg-orange-400 p-4 rounded-3xl ">
      <button onClick={onOpenMenu}>
        <IconMenu className=" h-[30px] w-[30px] md:h-[44px] md:w-[50px]" />
      </button>
    </div>
  );
};

export default ButtonMenu;
