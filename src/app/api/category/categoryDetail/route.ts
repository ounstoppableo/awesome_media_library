import useAuth from "@/hooks/useAuth";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { thumbnailPath } from "@/utils/fileOperate";
import { NextRequest } from "next/server";

export async function POST(_req: NextRequest) {
  let body;
  try {
    body = await _req.json();
  } catch (e) {
    body = {};
  }
  if (!body.id)
    return Response.json({
      code: codeMap.paramsIllegal,
      message: codeMapMsg[codeMap.paramsIllegal],
    });
  return Response.json({
    code: codeMap.success,
    data: {
      id: 1,
      mediaId: 126,
      type: "image",
      sourcePath: "/img21.jpg",
      thumbnail: "",
      category: "scene",
      englishTitle: "Blench Bankai Mashup1",
      chineseTitle: "死神千年血战宣传片1",
      date: "2026.1.9",
      introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
          quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
          eius quae off测试arum animi. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
          suscipit fugiat d测试istinctio officia 测试earum eius quae officiis quis harum
          animi.`,
      location: "TEL AVIV",
      tag: "scene",
      children: [
        {
          id: 1,
          mediaId: 126,
          type: "image",
          sourcePath: "/img21.jpg",
          englishTitle: "Blench Bankai Mashup1",
          chineseTitle: "死神千年血战宣传片1",
          date: "2026.1.9",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
          quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
          eius quae off测试arum animi. Lorem, ipsum dolor sit amet
          consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
          suscipit fugiat d测试istinctio officia 测试earum eius quae officiis quis harum
          animi.`,
          location: "TEL AVIV",
          tag: "scene",
        },
        {
          id: 2,
          mediaId: 127,
          type: "image",
          sourcePath: "/img33.jpg",

          englishTitle: "Best Huangshan scene",
          chineseTitle: "最佳黄山美景",
          date: "2026.1.3",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "Huang Shan",
          tag: "scene",
        },
        {
          id: 3,
          mediaId: 128,
          type: "image",
          sourcePath: "/Magic.jpg",

          englishTitle: "Best bench scene",
          chineseTitle: "最佳海岸美景",
          date: "2026.1.5",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "San Ya",
          tag: "scene",
        },
        {
          id: 4,
          mediaId: 129,
          type: "image",
          sourcePath: "/img21.jpg",
          englishTitle: "Best Snow scene",
          chineseTitle: "最佳雪景",
          date: "2026.1.6",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "Japan",
          tag: "scene",
        },
        {
          id: 5,
          mediaId: 130,
          type: "image",
          sourcePath: "/img21.jpg",
          category: "scene",
          englishTitle: "Best strait scene",
          chineseTitle: "最佳海峡风景",
          date: "2026.1.7",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "TEL AVIV",
          tag: "scene",
        },
        {
          id: 6,
          mediaId: 131,
          type: "image",
          sourcePath:
            "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
          englishTitle: "Best strait scene",
          chineseTitle: "最佳电影",
          date: "2026.1.7",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "TEL AVIV",
          tag: "scene",
        },
        {
          id: 7,
          mediaId: 132,
          type: "image",
          sourcePath:
            "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
          englishTitle: "Best strait scene",
          chineseTitle: "测试测试测试",
          date: "2026.1.7",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "TEL AVIV",
          tag: "scene",
        },
        {
          id: 8,
          mediaId: 133,
          type: "image",
          sourcePath:
            "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
          englishTitle: "Best strait scene",
          chineseTitle: "测试测试测试222",
          date: "2026.1.7",
          introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
              quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
              eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
              consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
              suscipit fugiat distinctio officia earum eius quae officiis quis harum
              animi.`,
          location: "TEL AVIV",
          tag: "scene",
        },
      ],
    } as CategoryDetail,
  } as CommonResponse);
}
