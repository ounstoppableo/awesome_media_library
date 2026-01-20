import useAuth from "@/hooks/useAuth";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import errorStringify from "@/utils/errorStringify";
import { NextRequest } from "next/server";

export async function GET(_req: NextRequest) {
  return Response.json({
    code: codeMap.success,
    data: [
      {
        id: 1,
        mediaId: 126,
        type: "image",
        sourcePath: "/img21.jpg",
        tag: "scene",
        englishTitle: "Blench Bankai Mashup1",
        chineseTitle: "死神千年血战宣传片1",
        date: "2026.1.9",
        introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
        quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
        eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
        consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
        suscipit fugiat distinctio officia earum eius quae officiis quis harum
        animi.`,
        location: "TEL AVIV",

        children: [
          {
            id: 1,
            type: "image",
            sourcePath: "/img21.jpg",
            tag: "scene",
            englishTitle: "Blench Bankai Mashup1",
            chineseTitle: "死神千年血战宣传片1",
            date: "2026.1.9",
            introduce: ` Lorem, ipsum dolor sit amet consectetur adipisicing elit. Dolor iusto
            quaerat qui, illo incidunt suscipit fugiat distinctio officia earum
            eius quae officiis quis harum animi. Lorem, ipsum dolor sit amet
            consectetur adipisicing elit. Dolor iusto quaerat qui, illo incidunt
            suscipit fugiat distinctio officia earum eius quae officiis quis harum
            animi.`,
            location: "TEL AVIV",
          },
          {
            id: 2,
            type: "image",
            sourcePath: "/img33.jpg",
            tag: "scene",
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
          },
          {
            id: 3,
            type: "image",
            sourcePath: "/Magic.jpg",
            tag: "scene",
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
          },
          {
            id: 4,
            type: "image",
            sourcePath: "/img21.jpg",
            tag: "scene",
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
          },
          {
            id: 5,
            type: "image",
            sourcePath: "/img21.jpg",
            tag: "scene",
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
          },
        ],
      },
      {
        id: 2,
        mediaId: 127,
        type: "image",
        sourcePath: "/img33.jpg",
        tag: "scene",
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
      },
      {
        id: 3,
        mediaId: 128,
        type: "image",
        sourcePath: "/Magic.jpg",
        tag: "scene",
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
      },
      {
        id: 4,
        mediaId: 129,
        type: "image",
        sourcePath: "/img21.jpg",
        tag: "scene",
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
      },
      {
        id: 5,
        mediaId: 130,
        type: "image",
        sourcePath: "/img21.jpg",
        tag: "scene",
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
      },
      {
        id: 6,
        mediaId: 131,
        type: "image",
        sourcePath:
          "https://cdn.prod.website-files.com/673306db3b111afa559bc378/675eb903f604a7a856c87467_taboo.webp",
        tag: "scene",
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
      },
      {
        id: 7,
        mediaId: 132,
        type: "image",
        sourcePath:
          "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c551123732db723b050_ana.jpg",
        tag: "scene",
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
      },
      {
        id: 8,
        mediaId: 133,
        type: "image",
        sourcePath:
          "https://cdn.prod.website-files.com/673306db3b111afa559bc378/67923c37a45465ae82ee3f8b_kafka.jpg",
        tag: "scene",
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
      },
    ] as CategoryDetail[],
  } as CommonResponse);
}
