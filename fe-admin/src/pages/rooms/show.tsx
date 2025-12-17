import { useShow } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Tag,
  Descriptions,
} from "antd";
import type { IRoom } from "../../interfaces";

export const RoomShow = () => {
  const { query: queryResult } = useShow<IRoom>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const totalSeats = record?.totalRows && record?.seatsPerRow
    ? record.totalRows * record.seatsPerRow
    : null;

  return (
    <Show isLoading={isLoading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">
          <TextField value={record?.id} />
        </Descriptions.Item>
        <Descriptions.Item label="Tên phòng">
          <TextField value={record?.name} />
        </Descriptions.Item>
        <Descriptions.Item label="Rạp">
          <TextField value={record?.cinema?.name || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Số hàng ghế">
          <TextField value={record?.totalRows?.toString() || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Ghế mỗi hàng">
          <TextField value={record?.seatsPerRow?.toString() || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Tổng số ghế">
          <TextField value={totalSeats ? totalSeats.toString() : "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Hàng VIP">
          {record?.vipRows ? (
            <TextField
              value={
                (() => {
                  try {
                    const vipRows = JSON.parse(record.vipRows);
                    return Array.isArray(vipRows) ? vipRows.join(", ") : record.vipRows;
                  } catch {
                    return record.vipRows;
                  }
                })()
              }
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

