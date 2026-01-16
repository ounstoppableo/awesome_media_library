import { PackageX } from "lucide-react";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./empty";

export default function ContentInsufficient(props: any) {
  const { count } = props;
  return (
    <Empty>
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <PackageX />
        </EmptyMedia>
        <EmptyTitle className="text-white">内容数不足</EmptyTitle>
        <EmptyDescription>
          您至少需要长度为{count}的数组作为数据源，此模块才能生效
        </EmptyDescription>
      </EmptyHeader>
    </Empty>
  );
}
