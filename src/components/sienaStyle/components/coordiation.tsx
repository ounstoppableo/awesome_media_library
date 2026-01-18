export default function Coordiation(props: any) {
  const { odometer } = props;
  return (
    <>
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-full w-[1px] scale-x-20 bg-white z-10"></div>
      <div className="w-full px-16 flex justify-between items-center relative">
        <div className="flex:1"></div>
        <div className=" gap-2 items-end h-fit absolute bottom-0 left-1/2 -translate-x-1/2 z-20 hidden [@media(min-aspect-ratio:2/1)]:flex">
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-1.5 bg-gray-200"></div>
          <div className="w-[1px] h-3 bg-white"></div>
          <div
            className="absolute top-1/2 left-1/2 w-5 h-3 rounded-[4px] bg-black border border-white -translate-1/2"
            ref={odometer}
          ></div>
        </div>
      </div>
    </>
  );
}
