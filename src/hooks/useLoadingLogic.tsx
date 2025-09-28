export default function useLoadingLogic(props: { loading: boolean }) {
  const { loading } = props;
  const loadingJsx = loading ? (
    <div className="absolute inset-0 bg-black/30 flex justify-center items-center z-10">
      <div className="flex items-center justify-center w-full p-1">
        <div className="border-primary ml-3 h-10 w-10 animate-spin rounded-full border-t-2 border-b-2 ease-linear"></div>
      </div>
    </div>
  ) : (
    <></>
  );
  return {
    loadingJsx,
  };
}
