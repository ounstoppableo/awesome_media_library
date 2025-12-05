export default function useCanvasToolLogic(props: any) {
  const { canvasRectInfo } = props;
  function toggleSmoothing(canvasCtx: CanvasRenderingContext2D, flag: boolean) {
    if (!canvasCtx) return;
    canvasCtx.imageSmoothingEnabled = flag;
    (canvasCtx as any).mozImageSmoothingEnabled = flag;
    (canvasCtx as any).webkitImageSmoothingEnabled = flag;
    (canvasCtx as any).msImageSmoothingEnabled = flag;
  }
  function getMousePos(canvas: HTMLCanvasElement, event: any) {
    const scaleX = canvas.width / canvasRectInfo.current.width;
    const scaleY = canvas.height / canvasRectInfo.current.height;

    return {
      x: (event.clientX - canvasRectInfo.current.left) * scaleX,
      y: (event.clientY - canvasRectInfo.current.top) * scaleY,
    };
  }

  function updateCircleAreaImageData(
    ctx: CanvasRenderingContext2D,
    x: number, // 矩形左上角
    y: number,
    radius: number,
    circleInsideCb?: (
      rgba: number[],
      context: {
        rgbaIndex: number[];
        dataPrevSnapshoot: any;
        dataSnapshoot: any;
      }
    ) => number[],
    circleOutsideCb?: (
      rgba: number[],
      context: {
        rgbaIndex: number[];
        dataPrevSnapshoot: any;
        dataSnapshoot: any;
      }
    ) => number[]
  ) {
    // 1. 先取包含这个圆的最小矩形
    const cx = x - radius;
    const cy = y - radius;
    const rectSize = radius * 2;

    const imageData = ctx.getImageData(cx, cy, rectSize, rectSize);
    const clone = new ImageData(
      new Uint8ClampedArray(imageData.data),
      imageData.width,
      imageData.height
    );

    const data = imageData.data;

    for (let y = 0; y < rectSize; y++) {
      for (let x = 0; x < rectSize; x++) {
        const idx = (y * rectSize + x) * 4;

        // 计算这个点距离圆心的实际距离
        const dx = x - radius;
        const dy = y - radius;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance <= radius) {
          if (circleInsideCb) {
            const result = circleInsideCb(
              [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]],
              {
                rgbaIndex: [idx, idx + 1, idx + 2, idx + 3],
                dataPrevSnapshoot: imageData.data,
                dataSnapshoot: clone.data,
              }
            );
            data[idx] = result[0];
            data[idx + 1] = result[1];
            data[idx + 2] = result[2];
            data[idx + 3] = result[3];
          }
        } else {
          if (circleOutsideCb) {
            const result = circleOutsideCb(
              [data[idx], data[idx + 1], data[idx + 2], data[idx + 3]],
              {
                rgbaIndex: [idx, idx + 1, idx + 2, idx + 3],
                dataPrevSnapshoot: imageData.data,
                dataSnapshoot: clone.data,
              }
            );
            data[idx] = result[0];
            data[idx + 1] = result[1];
            data[idx + 2] = result[2];
            data[idx + 3] = result[3];
          }
        }
      }
    }

    return {
      data: imageData,
      cx,
      cy,
    };
  }

  function findPixelInMatrix(
    linearArray: any[], // 给一个线性数组
    matrixHeight: number, // 线性数组转矩阵的高
    matrixWidth: number, // 线性数组转矩阵的宽
    rgbaRIndex: number, // 原始数组中，rgba中r的index，用于计算当前像素位置
    xOffset: number = 0, // 想要计算的最终像素基于原始像素的x偏移量，负左正右
    yOffset: number = 0 // 想要计算的最终像素基于原始像素的y偏移量，负上正下
  ) {
    if (linearArray.length === 0) throw new Error("线性数组不能为空");
    if (matrixHeight * matrixWidth !== linearArray.length / 4)
      throw new Error("矩阵宽高设定错误");
    const sourcePixelIndexInPixelLinearArray = rgbaRIndex / 4;
    if (!Number.isInteger(sourcePixelIndexInPixelLinearArray))
      throw new Error("错误的r索引");

    const targetX = sourcePixelIndexInPixelLinearArray + xOffset;
    const targetY = targetX + yOffset * matrixWidth;
    // 原像素所在行
    const sourceSiteRow = Math.floor(
      sourcePixelIndexInPixelLinearArray / matrixWidth
    ); // 从0开始计数
    // 原像素所在列
    const sourceSiteCol =
      sourcePixelIndexInPixelLinearArray - sourceSiteRow * matrixWidth; // 从0开始计数

    if (xOffset + sourceSiteCol < 0 || xOffset + sourceSiteCol >= matrixWidth)
      throw new Error("x位移超出范围");
    if (yOffset + sourceSiteRow < 0 || yOffset + sourceSiteRow >= matrixHeight)
      throw new Error("y位移超出范围");

    const targetRIndex = targetY * 4;

    // 返回像素点
    return [
      linearArray[targetRIndex],
      linearArray[targetRIndex + 1],
      linearArray[targetRIndex + 2],
      linearArray[targetRIndex + 3],
    ];
  }
  return {
    toggleSmoothing,
    findPixelInMatrix,
    updateCircleAreaImageData,
    getMousePos,
  };
}
