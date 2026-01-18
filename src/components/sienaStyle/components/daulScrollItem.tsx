export default function DaulScrollItem(props: any) {
  const {
    info,
    currentReadPhotoId,
    scrollContainerItems,
    imageContainerItems,
    index,
  } = props;
  return (
    <div
      ref={(el: any) => {
        currentReadPhotoId && (scrollContainerItems.current[index] = el);
      }}
      className="h-full aspect-1/1 overflow-hidden relative after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[radial-gradient(transparent_0%,#000_90%)]"
    >
      <img
        src={info.img}
        draggable={false}
        className={`w-full h-full object-cover select-none rounded-lg`}
        ref={(el) => {
          currentReadPhotoId && (imageContainerItems.current[index] = el);
        }}
      ></img>
    </div>
  );
}
