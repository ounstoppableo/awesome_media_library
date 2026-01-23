import useAuth from "@/hooks/useAuth";
import { getPool } from "@/lib/db";
import log from "@/logs/setting";
import { CategoryDetail } from "@/types/media";
import { CommonResponse } from "@/types/response";
import { codeMap, codeMapMsg } from "@/utils/backendStatus";
import categoryFormSchema from "@/utils/dataStruct";
import errorStringify from "@/utils/errorStringify";
import { thumbnailPath } from "@/utils/fileOperate";
import { zodResolver } from "@hookform/resolvers/zod";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(_req: NextRequest) {
  let body: z.infer<typeof categoryFormSchema>;
  try {
    body = await _req.json();
  } catch (e) {
    body = {} as any;
  }

  const result = categoryFormSchema.safeParse(body);
  if (!result.success || !body.id)
    return Response.json({
      code: codeMap.paramsIllegal,
      message: codeMapMsg[codeMap.paramsIllegal],
    });

  const conn = await getPool().getConnection();
  try {
    await conn.beginTransaction();

    await conn.query(
      `UPDATE category
       SET
         mediaId = ?,
         englishTitle = ?,
         chineseTitle = ?,
         introduce = ?,
         location = ?,
         tag = ?
       WHERE id = ?;`,
      [
        body.mediaId,
        body.englishTitle,
        body.chineseTitle,
        body.introduce,
        body.location,
        body.tag,
        body.id,
      ]
    );

    const promises = body.children.map((subCategory) => {
      return conn.query(
        `UPDATE subCategory
         SET
           englishTitle = ?,
           chineseTitle = ?,
           introduce = ?,
           location = ?,
           tag = ?
         WHERE categoryId = ?
           AND mediaId = ?;`,
        [
          subCategory.englishTitle,
          subCategory.chineseTitle,
          subCategory.introduce,
          subCategory.location,
          subCategory.tag,
          body.id,
          subCategory.mediaId,
        ]
      );
    });
    await Promise.all(promises);
    await conn.commit();
    return Response.json({
      code: codeMap.success,
      msg: codeMapMsg[codeMap.success],
    } as CommonResponse);
  } catch (err: any) {
    await conn.rollback();
    log(err);
    return Response.json({
      code: codeMap.serverError,
      msg: codeMapMsg[codeMap.serverError],
    } as CommonResponse);
  } finally {
    conn.release();
  }
}
