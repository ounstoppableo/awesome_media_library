import dayjs from "dayjs";

export default function Info(props: any) {
  const { info, init, type, currentDirection } = props;
  return (
    init && (
      <div
        className={`absolute z-10 w-fit flex text-white gap-[2vmin]   ${
          type === "small"
            ? "bottom-0 transition-all relative items-end"
            : currentDirection === "y"
            ? "h-fit left-[8vmin] flex-col justify-center items-center bottom-[6vmin]"
            : "h-fit flex-col justify-center items-center bottom-[4vmin]"
        }`}
      >
        <div
          className={`flex flex-col justify-center items-center  ${
            type === "small"
              ? "whitespace-nowrap transition-all"
              : currentDirection === "y"
              ? "gap-[2vmin]"
              : "gap-[.5vmin]"
          }`}
        >
          <div
            className={`${
              type === "small" ? "text-[1.5vmin] " : "text-[2vmin] "
            } tracking-[.5vmin]`}
          >
            {info.category.toUpperCase()}
          </div>
          <div
            className={`photoTitle ${
              type === "small"
                ? "text-[3vmin] leading-[3vmin]"
                : currentDirection === "y"
                ? "text-[8vmin] leading-[8vmin]"
                : "text-[4vmin] leading-[4vmin]"
            }`}
          >
            {(info.chineseTitle || info.englishTitle).toUpperCase()}
          </div>
        </div>
        <div
          className={`${
            type === "small" ? "hidden [@media(min-aspect-ratio:2/1)]:flex" : ""
          } ${
            currentDirection === "y" ? "text-[2.5vmin]" : "text-[2vmin]"
          } flex-col w-full justify-center items-center`}
          style={{
            lineHeight:
              currentDirection === "y"
                ? "calc(2.5vmin - 4px)"
                : "calc(2vmin - 4px)",
            verticalAlign: "center",
          }}
        >
          <div className="flex border-t border-white items-center justify-center gap-[8vmin] px-[2vmin] w-full">
            <div>YEAR</div>
            <div>{dayjs(info.date).year()}</div>
          </div>
          <div className="flex border-t border-white items-center justify-center  gap-[4vmin] px-[3vmin] w-full">
            <div>LOCATION</div>
            <div>{info.location.toUpperCase()}</div>
          </div>
          <div className="flex border-t border-white border-b items-center justify-center gap-[6vmin] px-[1vmin] w-full">
            <div>CATEGORY</div>
            <div>{info.category.toUpperCase()}</div>
          </div>
        </div>
      </div>
    )
  );
}
