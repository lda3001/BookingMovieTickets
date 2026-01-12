import { useShow, useApiUrl } from "@refinedev/core";
import { DeleteButton, Show, ShowButton, EditButton } from "@refinedev/antd";
import { Col, Row, Space, Tag, Typography, Card, Descriptions } from "antd";
import type { IBooking, IUser, IUserResponse } from "../../interfaces";
import { ProTable } from "@ant-design/pro-components";
import { formatPrice } from "../../utils/helper";

const { Title, Text } = Typography;

export const CustomerShow = () => {
  const { query: queryResult } = useShow<IUserResponse>({
    queryOptions: {
      select: (data: any) => {
        // Backend trả về: { status: "success", data: UserResponse }
        return {
          data: data?.data?.data || data?.data,
        };
      },
    },
  });
  const { data, isLoading } = queryResult;
  const record = data?.data;

  const Actions = ({
    record,
    refetch,
  }: {
    record: IBooking;
    refetch: () => void;
  }) => (
    <Space>
      <ShowButton
        hideText
        size="small"
        recordItemId={record.id}
        resource="bookings"
      />
      <DeleteButton
        hideText
        size="small"
        recordItemId={record.id}
        resource="bookings"
        onSuccess={() => refetch()}
      />
    </Space>
  );

  const roleColors = {
    ADMIN: { color: "red", text: "Quản Trị Viên" },
    USER: { color: "green", text: "Khách Hàng" },
  };

  if (record) {
    return (
      <Show
        isLoading={isLoading}
        headerButtons={({ editButtonProps }) => (
          <>
            <EditButton {...editButtonProps} />
          </>
        )}
      >
        <Card title="Thông tin khách hàng" style={{ marginBottom: 24 }}>
          <Descriptions column={2} bordered>
            <Descriptions.Item label="Tên khách hàng" span={2}>
              <Text strong>{record?.fullName}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Email">
              <Text copyable>{record?.email}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Vai trò">
              <Tag color={roleColors[record?.role as keyof typeof roleColors]?.color}>
                {roleColors[record?.role as keyof typeof roleColors]?.text}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              <Tag color={record?.isActive ? "green" : "red"}>
                {record?.isActive ? "Hoạt động" : "Không hoạt động"}
              </Tag>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày tạo">
              <Text>{new Date(record?.createdAt).toLocaleString("vi-VN")}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Ngày cập nhật" span={2}>
              <Text>{new Date(record?.updatedAt).toLocaleString("vi-VN")}</Text>
            </Descriptions.Item>
          </Descriptions>
        </Card>

        <ProTable
          ghost
          title={() => <Title level={5}>Danh Sách Đặt Vé</Title>}
          rowKey="id"
          dataSource={record?.bookings}
          loading={isLoading}
          search={false}
          pagination={{
            defaultPageSize: 10,
            showSizeChanger: true,
          }}
          locale={{ emptyText: "Chưa có đặt vé nào" }}
          columns={[
            {
              title: "Mã Đặt Vé",
              dataIndex: "bookingCode",
              filterSearch: true,
              showSorterTooltip: true,
              render: (_, record) => <Text>{record.bookingCode}</Text>,
              copyable: true,
              width: 200,
            },
            {
              title: "Phim",
              dataIndex: "movieTitle",
              filterSearch: true,
              render: (_, record) => <Text>{record.movieTitle || "-"}</Text>,
            },
            {
              title: "Suất Chiếu",
              dataIndex: "showTime",
              sorter: (a, b) =>
                new Date(a.showTime || "").getTime() - new Date(b.showTime || "").getTime(),
              render: (_, record) => (
                <Text>{record.showTime ? new Date(record.showTime).toLocaleString("vi-VN") : "-"}</Text>
              ),
            },
            {
              title: "Ghế",
              dataIndex: "seatCodes",
              render: (_, record) => (
                <Text>{record.seatCodes?.join(", ") || "-"}</Text>
              ),
            },
            {
              title: "Tổng Tiền",
              dataIndex: "totalPrice",
              sorter: (a, b) => (a.totalPrice || 0) - (b.totalPrice || 0),
              render: (_, record) => (
                <Text strong>{formatPrice(record.totalPrice as number)}</Text>
              ),
            },
            {
              title: "Trạng Thái",
              dataIndex: "status",
              key: "status",
              render: (_, record) => {
                const statusMap: Record<string, { color: string; text: string }> = {
                  PENDING: { color: "gold", text: "Chờ Xử Lý" },
                  CONFIRMED: { color: "blue", text: "Đã Xác Nhận" },
                  COMPLETED: { color: "green", text: "Hoàn Thành" },
                  CANCELLED: { color: "red", text: "Đã Hủy" },
                };
                const statusValue = statusMap[record.status];
                return <Tag color={statusValue?.color}>{statusValue?.text}</Tag>;
              },
              filters: [
                { text: "Chờ Xử Lý", value: "PENDING" },
                { text: "Đã Xác Nhận", value: "CONFIRMED" },
                { text: "Hoàn Thành", value: "COMPLETED" },
                { text: "Đã Hủy", value: "CANCELLED" },
              ],
              onFilter: (value, record) => {
                return record.status === value;
              },
            },
            {
              title: "Hành Động",
              fixed: "right",
              width: 100,
              render: (_, record: any) => (
                <Actions record={record as IBooking} refetch={queryResult.refetch} />
              ),
            },
          ]}
        />
      </Show>
    );
  }
};
