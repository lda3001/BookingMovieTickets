import {
  TextField,
  ShowButton,
} from "@refinedev/antd";
import { ProTable } from "@ant-design/pro-components";
import {
  Space,
  Card,
  Tag,
  Form,
  Input,
  Button,
  Flex,
} from "antd";
import type { IBooking } from "../../interfaces";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "../../utils/axios";
import { useEffect, useState } from "react";
import { formatPrice } from "../../utils/helper";

const Actions = ({
  record,
  refetch,
}: {
  record: IBooking;
  refetch: () => void;
}) => (
  <Space>
    <ShowButton hideText size="small" recordItemId={record.id} />
  </Space>
);

export const BookingList = () => {
  const apiUrl = useApiUrl();
  const [bookings, setBookings] = useState<IBooking[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const allBookings = await axiosInstance.get(`${apiUrl}/bookings/all`);
      setBookings(allBookings.data);
    } catch (error) {
      console.error("Error fetching bookings:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const statusMap = {
    PENDING: { color: "gold", text: "Chờ xử lý" },
    CONFIRMED: { color: "green", text: "Đã xác nhận" },
    CANCELLED: { color: "red", text: "Đã hủy" },
    COMPLETED: { color: "blue", text: "Hoàn thành" },
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
      <Card>
        <Flex justify="space-between" align="center">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Tìm kiếm đặt vé..."
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={fetchBookings}>
                Làm mới
              </Button>
            </Form.Item>
          </Form>
        </Flex>
      </Card>
      <Card>
        <ProTable
          dataSource={bookings}
          loading={loading}
          rowKey="id"
          headerTitle="Danh sách đặt vé"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
          }}
          search={false}
          columns={[
            {
              title: "Mã đặt vé",
              dataIndex: "bookingCode",
              render: (value) => <TextField value={value} copyable />,
              width: 150,
            },
            {
              title: "Khách hàng",
              dataIndex: "userId",
              render: (_, record) => (
                <TextField value={record.userId || "-"} />
              ),
            },
            {
              title: "Phim",
              dataIndex: ["showtime", "movie", "title"],
              render: (_, record) => (
                <TextField value={record.movieTitle || "-"} />
              ),
              width: 200,
            },
            {
              title: "Rạp",
              dataIndex: ["showtime", "cinema", "name"],
              render: (_, record) => (
                <TextField value={record.cinemaName || "-"} />
              ),
            },
            {
              title: "Thời gian chiếu",
              dataIndex: "showTime",
              render: (_, record) =>
                record.showTime ? (
                  <TextField
                    value={new Date(record.showTime).toLocaleString("vi-VN")}
                  />
                ) : (
                  "-"
                ),
            },
            {
              title: "Số ghế",
              dataIndex: "bookedSeats",
              render: (_, record) => (
                <TextField
                  value={
                    record.seatCodes?.length
                      ? record.seatCodes.join(", ")
                      : "-"
                  }
                />
              ),
            },
            {
              title: "Tổng tiền",
              dataIndex: "totalPrice",
              render: (value) =>
                value ? (
                  <TextField value={formatPrice(value)} />
                ) : (
                  "-"
                ),
            },
            {
              title: "Trạng thái",
              dataIndex: "status",
              render: (_, record) => {
                const status = statusMap[record.status as keyof typeof statusMap];
                return status ? (
                  <Tag color={status.color}>{status.text}</Tag>
                ) : (
                  <Tag>{record.status}</Tag>
                );
              },
            },
            {
              title: "Ngày đặt",
              dataIndex: "createdAt",
              render: (value) =>
                value ? (
                  <TextField
                    value={new Date(value).toLocaleString("vi-VN")}
                  />
                ) : (
                  "-"
                ),
            },
            {
              title: "Actions",
              fixed: "right",
              width: 80,
              render: (_, record: any) => (
                <Actions record={record} refetch={fetchBookings} />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
};

