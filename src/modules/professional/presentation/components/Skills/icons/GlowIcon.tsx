import React, { ReactElement, SVGProps } from 'react';

interface GlowIconProps {
  children: ReactElement<SVGProps<SVGSVGElement>>;
  className?: string;
  iconColor?: string;
  bgColor?: string;
  size?: string;
  iconSize?: string;
  blurAmount?: string;
  strokeWidth?: number | string; // NUEVO: Para controlar el grosor (ej: 1, 1.5, 2.5)
}

const GlowIcon: React.FC<GlowIconProps> = ({
  children,
  className = '',
  iconColor = '#ffb954',
  bgColor = '#433724',
  size = 'w-8 h-8',
  iconSize = 'w-[75%]',
  //blurAmount = '0.5px',
  strokeWidth = 1, // Valor por defecto estándar
}) => {
  return (
    <div
      className={`flex items-center justify-center rounded-full shrink-0 ${size} ${className}`}
      style={{ backgroundColor: bgColor }}
    >
      <div
        className={`flex items-center justify-center ${iconSize} h-auto aspect-square`}
      >
        {React.cloneElement(children, {
          width: '100%',
          height: '100%',
          // Inyectamos el grosor de línea aquí
          strokeWidth: strokeWidth,
          style: {
            //filter: `blur(${blurAmount})`,
            color: iconColor,
            ...children.props.style,
          },
          stroke: children.props.stroke !== 'none' ? 'currentColor' : 'none',
          fill:
            children.props.fill !== 'none' &&
            children.props.fill !== 'transparent'
              ? 'currentColor'
              : 'none',
          className: `${children.props.className || ''}`,
        })}
      </div>
    </div>
  );
};

export default GlowIcon;
