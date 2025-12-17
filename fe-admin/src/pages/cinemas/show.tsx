import { useShow } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Tag,
  Descriptions,
} from "antd";
import type { ICinema } from "../../interfaces";

const { Title } = Typography;

export const CinemaShow = () => {
  const { query: queryResult } = useShow<ICinema>();
  const { data, isLoading } = queryResult;
  const record = data?.data;

  return (
    <Show isLoading={isLoading}>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="ID">
          <TextField value={record?.id} />
        </Descriptions.Item>
        <Descriptions.Item label="Tên rạp">
          <TextField value={record?.name} />
        </Descriptions.Item>
        <Descriptions.Item label="Địa chỉ">
          <TextField value={record?.address || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Thành phố">
          <TextField value={record?.city || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Số điện thoại">
          <TextField value={record?.phone || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Số phòng">
          <TextField value={record?.totalRooms || "-"} />
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

