import { ReactNode } from 'react';

interface Props {
  texto?: string;
  children?: React.ReactNode;
  bgColor?: string;
}

const CornerTab = ({
  texto = 'cuadro de animacion',
  children,
  bgColor = '#0d152b',
}: Props) => {
  return (
    <div className="absolute top-0 right-0 z-10">
      <div className="relative bg-white pt-3 pb-5 pl-6 pr-5 rounded-bl-[2.5rem]">
        <div
          className="absolute top-0 -left-6 w-6 h-6 overflow-hidden pointer-events-none"
          style={{ backgroundColor: 'white' }}
        >
          <div
            className="w-full h-full rounded-tr-[1.5rem]"
            style={{ backgroundColor: bgColor }}
          ></div>
        </div>

        <div
          className="absolute -bottom-6 right-0 w-6 h-6 overflow-hidden pointer-events-none"
          style={{ backgroundColor: 'white' }}
        >
          <div
            className="w-full h-full rounded-tr-[1.5rem]"
            style={{ backgroundColor: bgColor }}
          ></div>
        </div>

        {children ?? texto}
      </div>
    </div>
  );
};

export default CornerTab;
