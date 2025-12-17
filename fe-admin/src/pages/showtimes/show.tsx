import { useShow } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Tag,
  Descriptions,
} from "antd";
import type { IShowtime } from "../../interfaces";

export const ShowtimeShow = () => {
  const { query: queryResult } = useShow<IShowtime>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">
          <TextField value={record?.id} />
        </Descriptions.Item>
        <Descriptions.Item label="Phim">
          <TextField value={record?.movie?.title || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Rạp">
          <TextField value={record?.cinema?.name || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Phòng">
          <TextField value={record?.room?.name || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian chiếu">
          {record?.showTime ? (
            <DateField value={record.showTime} format="DD/MM/YYYY HH:mm" />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian kết thúc">
          {record?.endTime ? (
            <DateField value={record.endTime} format="DD/MM/YYYY HH:mm" />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Định dạng">
          <TextField value={record?.format || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Giá vé">
          {record?.price ? (
            <TextField
              value={`${record.price.toLocaleString("vi-VN")} VND`}
            />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {record?.isActive ? (
            <Tag color="blue">Đang hoạt động</Tag>
          ) : (
            <Tag color="gray">Không hoạt động</Tag>
          )}
        </Descriptions.Item>
        {record?.createdAt && (
          <Descriptions.Item label="Ngày tạo">
            <DateField value={record.createdAt} format="DD/MM/YYYY HH:mm" />
          </Descriptions.Item>
        )}
        {record?.updatedAt && (
          <Descriptions.Item label="Ngày cập nhật">
            <DateField value={record.updatedAt} format="DD/MM/YYYY HH:mm" />
          </Descriptions.Item>
        )}
      </Descriptions>
    </Show>
  );
};

