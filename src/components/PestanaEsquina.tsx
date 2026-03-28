interface Props {
    texto?: string;
}

const PestanaEsquina = ({ texto = "cuadro de animacion" }:Props) => {
    return (
    <div className="absolute top-0 right-0 z-10  bg-white text-black px-6 py-3 sm:px-8 sm:py-4 md:px-10 md:py-5 lg:px-12 lg:py-6 text-[14px] sm:text-[16px] md:text-[18px] lg:text-[20px] rounded-bl-[40px] sm:rounded-bl-[2rem] max-w-[80%]">
        {texto}
    </div>
    );
};

export default PestanaEsquina;