import { useApiUrl } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Tag,
  Descriptions,
  Button,
  Space,
  Flex,
} from "antd";
import type { IBooking } from "../../interfaces";
import { axiosInstance } from "../../utils/axios";
import { formatPrice } from "../../utils/helper";
import { useNotification } from "@refinedev/core";
import { useEffect, useState } from "react";
import { useParams } from "react-router";

const { Title, Text } = Typography;

export const BookingShow = () => {
  const apiUrl = useApiUrl();
  const { open } = useNotification();
  const [record, setRecord] = useState<IBooking | undefined>();
  const [isLoading, setIsLoading] = useState(true);
  const { id } = useParams();

  useEffect(() => {
    const fetchBooking = async () => {
      if (!id) return;
      setIsLoading(true);
      try {
        // Try to fetch by ID first, if that fails, try by bookingCode
        try {
          const response = await axiosInstance.get(`${apiUrl}/bookings/${id}`);
          setRecord(response.data);
        } catch (error) {
          // If ID doesn't work, try bookingCode
          const response = await axiosInstance.get(`${apiUrl}/bookings/code/${id}`);
          setRecord(response.data);
        }
      } catch (error) {
        console.error("Error fetching booking:", error);
        open({
          type: "error",
          message: "Không tìm thấy đặt vé",
        });
      } finally {
        setIsLoading(false);
      }
    };
    fetchBooking();
  }, [id, apiUrl, open]);

  const refetchBooking = async () => {
    if (!id || !record?.bookingCode) return;
    setIsLoading(true);
    try {
      const response = await axiosInstance.get(`${apiUrl}/bookings/code/${record.bookingCode}`);
      setRecord(response.data);
    } catch (error) {
      console.error("Error refetching booking:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleConfirm = async () => {
    if (!record?.bookingCode) return;
    try {
      await axiosInstance.post(
        `${apiUrl}/bookings/${record.bookingCode}/confirm`
      );
      open({
        type: "success",
        message: "Xác nhận đặt vé thành công",
      });
      refetchBooking();
    } catch (error: any) {
      open({
        type: "error",
        message: "Lỗi khi xác nhận đặt vé",
        description: error?.response?.data?.message || error.message,
      });
    }
  };

  const handleCancel = async () => {
    if (!record?.bookingCode) return;
    try {
      await axiosInstance.post(
        `${apiUrl}/bookings/${record.bookingCode}/cancel`
      );
      open({
        type: "success",
        message: "Hủy đặt vé thành công",
      });
      refetchBooking();
    } catch (error: any) {
      open({
        type: "error",
        message: "Lỗi khi hủy đặt vé",
        description: error?.response?.data?.message || error.message,
      });
    }
  };

  const statusMap = {
    PENDING: { color: "gold", text: "Chờ xử lý" },
    CONFIRMED: { color: "green", text: "Đã xác nhận" },
    CANCELLED: { color: "red", text: "Đã hủy" },
    COMPLETED: { color: "blue", text: "Hoàn thành" },
  };

  return (
    <Show isLoading={isLoading}>
      <Row gutter={16}>
        <Col span={24}>
          <Flex justify="space-between" align="center" style={{ marginBottom: 16 }}>
            <Title level={4}>Chi tiết đặt vé</Title>
            {record?.status === "PENDING" && (
              <Space>
                <Button type="primary" onClick={handleConfirm}>
                  Xác nhận đặt vé
                </Button>
                <Button danger onClick={handleCancel}>
                  Hủy đặt vé
                </Button>
              </Space>
            )}
          </Flex>
        </Col>
      </Row>
      <Descriptions column={1} bordered>
        <Descriptions.Item label="Mã đặt vé">
          <TextField value={record?.bookingCode} copyable />
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái">
          {record?.status && statusMap[record.status as keyof typeof statusMap] ? (
            <Tag color={statusMap[record.status as keyof typeof statusMap].color}>
              {statusMap[record.status as keyof typeof statusMap].text}
            </Tag>
          ) : (
            <Tag>{record?.status}</Tag>
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Khách hàng">
          <TextField
            value={
              record?.user?.username ||
              record?.user?.email ||
              "-"
            }
          />
        </Descriptions.Item>
        <Descriptions.Item label="Phim">
          <TextField value={record?.showtime?.movie?.title || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Rạp">
          <TextField value={record?.showtime?.cinema?.name || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Phòng">
          <TextField value={record?.showtime?.room?.name || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Thời gian chiếu">
          {record?.showtime?.showTime ? (
            <DateField value={record.showtime.showTime} format="DD/MM/YYYY HH:mm" />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Định dạng">
          <TextField value={record?.showtime?.format || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Giá vé">
          {record?.showtime?.price ? (
            <TextField
              value={`${record.showtime.price.toLocaleString("vi-VN")} VND`}
            />
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Số ghế đã đặt">
          {record?.bookedSeats && record.bookedSeats.length > 0 ? (
            <Space wrap>
              {record.bookedSeats.map((seat, index) => (
                <Tag key={index}>{seat.seatCode}</Tag>
              ))}
            </Space>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Tổng tiền">
          {record?.totalPrice ? (
            <Text strong>{formatPrice(record.totalPrice)}</Text>
          ) : (
            "-"
          )}
        </Descriptions.Item>
        <Descriptions.Item label="Phương thức thanh toán">
          <TextField value={record?.paymentMethod || "-"} />
        </Descriptions.Item>
        <Descriptions.Item label="Trạng thái thanh toán">
          <TextField value={record?.paymentStatus || "-"} />
        </Descriptions.Item>
        {record?.createdAt && (
          <Descriptions.Item label="Ngày đặt">
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

