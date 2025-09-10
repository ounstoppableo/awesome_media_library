const smoothDisposeArrayUnitFactory = <T extends any[]>(
  getter: () => T,
  judgeCond: (currentItem: T[number], index: number) => boolean,
  cb: (resultItem: T[number], index: number) => any
) => {
  let singletonController: any = null;
  const clearController = () => {
    clearTimeout(singletonController);
    singletonController = null;
  };
  const binaryFind = (startIndex = 0, endIndex: number) => {
    if (startIndex >= endIndex) return;
    if (!singletonController) return;
    const midIndex = Math.floor((startIndex + endIndex) / 2);
    if (judgeCond(getter()[midIndex], midIndex)) {
      clearController();
      cb(getter()[midIndex], midIndex);
      return;
    }

    requestAnimationFrame(() => {
      binaryFind(startIndex, midIndex);
      binaryFind(midIndex + 1, endIndex);
    });
  };
  return {
    execute: () => {
      if (singletonController) {
        clearController();
      }
      singletonController = setTimeout(() => {
        binaryFind(0, getter().length);
      }, 16);
    },
    clear: clearController,
  };
};
export default smoothDisposeArrayUnitFactory;
