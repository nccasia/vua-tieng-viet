import { PlayIconProps } from '../Icons';

interface MenuButtonProps {
  IconComponent: React.FC<PlayIconProps>;
  label: string;
  onClick?: () => void;
  className?: string;
  classNameIcon?: string;
}

const HomeButton: React.FC<MenuButtonProps> = ({
  IconComponent,
  label,
  onClick,
  className = '',
  classNameIcon = '',
}) => (
  <div className="relative group perspective-1000 w-full ">
    <button
      onClick={onClick}
      className={`
          w-[80%] h-28
          rounded-2xl border-8 border-white
          bg-gradient-to-b from-lime-400 to-lime-500
          shadow-xl hover:shadow-2xl
          transform hover:scale-105 hover:-translate-y-1
          transition-all duration-300 ease-in-out
          flex items-center justify-center
          group-hover:from-orange-400 group-hover:to-orange-500
          ${className}
        `}
    >
      <IconComponent
        width="56px"
        height="56px"
        className={`drop-shadow-lg transform group-hover:scale-110 transition-transform duration-300  ${classNameIcon}`}
      />
      <div className="absolute -bottom-12 left-1/2 -translate-x-1/2 w-max">
        <span
          className="
            text-2xl font-bold text-white opacity-0 group-hover:opacity-100
            transform group-hover:-translate-y-2
            transition-all duration-300 ease-out
            drop-shadow-lg
          "
        >
          {label}
        </span>
      </div>
    </button>
  </div>
);
export default HomeButton;
