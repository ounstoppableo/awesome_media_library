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
import dayjs from "dayjs";
import { NextRequest } from "next/server";
import z from "zod";

export async function POST(_req: NextRequest) {
  const token = _req.headers.get("Authorization");
  if (!token || !(await useAuth(token)))
    return Response.json({
      code: codeMap.limitsOfAuthority,
      msg: codeMapMsg[codeMap.limitsOfAuthority],
    } as CommonResponse);
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
         tag = ?,
         updateTime = ?
       WHERE id = ?;`,
      [
        body.mediaId,
        body.englishTitle,
        body.chineseTitle,
        body.introduce,
        body.location,
        body.tag,
        dayjs().format("YYYY-MM-DD hh:mm:ss"),
        body.id,
      ]
    );

    const [originalChildren]: any = await conn.query(
      "select mediaId from subCategory where categoryId = ?",
      [body.id]
    );

    await Promise.all(
      originalChildren.map((item: any) => {
        const flag = body.children.findIndex(
          (subCategory) => subCategory.mediaId === item.mediaId
        );
        if (flag === -1) {
          return conn.query(
            "delete from subCategory where mediaId=? and categoryId=?",
            [item.mediaId, body.id]
          );
        } else {
          return Promise.resolve();
        }
      })
    );

    const promises = body.children.map((subCategory) => {
      const flag = originalChildren?.findIndex(
        (item: any) => subCategory.mediaId === item.mediaId
      );
      if (flag === -1) {
        return conn.query(
          "INSERT INTO subCategory (categoryId,mediaId,englishTitle,chineseTitle,introduce,location,tag) VALUES (?,?,?,?,?,?,?)",
          [
            body.id,
            subCategory.mediaId,
            subCategory.englishTitle,
            subCategory.chineseTitle,
            subCategory.introduce,
            subCategory.location,
            subCategory.tag,
          ]
        );
      } else {
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
      }
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
