import dayjs from "dayjs";
import Info from "./Info";

export default function PhotoItem(props: any) {
  const { info, currentDirection, type, init, index, ref } = props;

  return info ? (
    <>
      <div
        className={` overflow-hidden relative select-none ${
          type === "small"
            ? "h-3/4 aspect-4/5 bottom-[-3vmin] transition-all after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_50%,#000_100%)]"
            : currentDirection === "x"
            ? "h-full w-full rounded-4xl after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(transparent_0%,transparent_40%,#000_100%)]"
            : "h-full w-full rounded-4xl after:absolute after:inset-0 after:pointer-events-none after:z-10 after:bg-[linear-gradient(rgba(0,0,0,0.6)_0%,transparent_20%,transparent_80%,rgba(0,0,0,0.6)_100%)]"
        }`}
      >
        <img
          src={info.type === "video" ? info.thumbnail : info.sourcePath}
          draggable={false}
          className={`${
            type === "small"
              ? "w-[8vmin] h-[10vmin] rounded-lg transition-all"
              : currentDirection === "y"
              ? "w-[100dvw] h-[100dvh] top-1/2 left-1/2 -translate-1/2"
              : "w-fit h-[100vh] top-1/2 left-1/2 -translate-1/2"
          } object-cover absolute  select-none`}
          ref={(el) => {
            type === "default" && (ref.current[index] = el);
          }}
        ></img>
      </div>
      <Info
        type={type}
        info={info}
        init={init}
        currentDirection={currentDirection}
      ></Info>
    </>
  ) : (
    <></>
  );
}
