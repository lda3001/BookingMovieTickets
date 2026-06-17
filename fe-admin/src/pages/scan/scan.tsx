import { useEffect, useState } from "react";
import { Scanner } from '@yudiel/react-qr-scanner';
import { Card, Typography, Space, Divider, Descriptions, Button, Spin, Tag } from 'antd';
import { QrcodeOutlined, CheckCircleOutlined, ReloadOutlined, UserOutlined, MailOutlined, VideoCameraOutlined, EnvironmentOutlined, CalendarOutlined, ApartmentOutlined } from '@ant-design/icons';
import { useApiUrl, useNotification } from "@refinedev/core";
import { IBooking } from "../../interfaces";
import { axiosInstance } from "../../utils/axios";
import dayjs from "dayjs";

const { Title, Text } = Typography;

export const ScanQR = () => {
    const [result, setResult] = useState<string | null>(null);
    const apiUrl = useApiUrl();
    const { open } = useNotification();
    const [record, setRecord] = useState<IBooking | undefined>();
    const [isLoading, setIsLoading] = useState(false);
  
    useEffect(() => {
      const fetchBooking = async () => {
        console.log("result", result);
        if (!result) return;
        setIsLoading(true);
        try {
          // Try to fetch by ID first, if that fails, try by bookingCode
          try {
            const response = await axiosInstance.get(`${apiUrl}/bookings/${result}`);
            setRecord(response.data);
            open?.({
              type: "success",
              message: "Tìm thấy thông tin đặt vé",
            });
          } catch (error) {
            // If ID doesn't work, try bookingCode
            const response = await axiosInstance.get(`${apiUrl}/bookings/code/${result}`);
            setRecord(response.data);
            open?.({
              type: "success",
              message: "Tìm thấy thông tin đặt vé",
            });
          }
        } catch (error) {
          console.error("Error fetching booking:", error);
          setRecord(undefined);
          open?.({
            type: "error",
            message: "Không tìm thấy đặt vé",
            description: "Vui lòng kiểm tra lại mã QR",
          });
        } finally {
          setIsLoading(false);
        }
      };
      fetchBooking();
    }, [result, apiUrl, open]);

    const handleReset = () => {
        setResult(null);
        setRecord(undefined);
    };

    return (
        <div style={{ 
            padding: '24px',
            maxWidth: '1400px',
            margin: '0 auto'
        }}>
            <Space direction="vertical" size="large" style={{ width: '100%' }}>
                <Card bordered={false}>
                    <Space align="center" style={{ justifyContent: 'space-between', width: '100%' }}>
                        <Space align="center">
                            <QrcodeOutlined style={{ fontSize: '32px', color: '#1890ff' }} />
                            <div>
                                <Title level={2} style={{ margin: 0 }}>
                                    Quét mã QR đặt vé
                                </Title>
                                <Text type="secondary">
                                    Đưa mã QR vào khung hình để quét và xem thông tin đặt vé
                                </Text>
                            </div>
                        </Space>
                        {result && (
                            <Button 
                                icon={<ReloadOutlined />} 
                                onClick={handleReset}
                                size="large"
                            >
                                Quét lại
                            </Button>
                        )}
                    </Space>
                </Card>

                {!result && (
                    <Card 
                        bordered={false}
                        style={{ 
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center'
                        }}
                    >
                        <div style={{ 
                            width: '100%',
                            maxWidth: '600px',
                            margin: '0 auto',
                            borderRadius: '8px',
                            overflow: 'hidden',
                            border: '3px solid #1890ff',
                            boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
                        }}>
                            <Scanner
                                onScan={(detectedCodes) => {
                                    if (detectedCodes && detectedCodes.length > 0) {
                                        setResult(detectedCodes[0].rawValue);
                                    }
                                }}
                                onError={(error) => console.error(error)}
                            />
                        </div>
                    </Card>
                )}

                {result && isLoading && (
                    <Card bordered={false} style={{ textAlign: 'center', padding: '40px' }}>
                        <Spin size="large" />
                        <div style={{ marginTop: '16px' }}>
                            <Text>Đang tải thông tin đặt vé...</Text>
                        </div>
                    </Card>
                )}

                {result && !isLoading && record && (
                    <Card 
                        bordered={false}
                        title={
                            <Space>
                                <CheckCircleOutlined style={{ color: '#52c41a', fontSize: '24px' }} />
                                <Title level={3} style={{ margin: 0, color: '#52c41a' }}>
                                    Thông tin đặt vé
                                </Title>
                            </Space>
                        }
                        extra={<Tag color="success" style={{ fontSize: '14px', padding: '4px 12px' }}>Đã xác nhận</Tag>}
                        style={{ 
                            boxShadow: '0 4px 12px rgba(82, 196, 26, 0.15)',
                            border: '2px solid #52c41a'
                        }}
                    >
                        <Descriptions bordered column={2} size="middle">
                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <QrcodeOutlined />
                                        <Text strong>Mã đặt vé</Text>
                                    </Space>
                                }
                                span={2}
                            >
                                <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                    {record.bookingCode}
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <UserOutlined />
                                        <Text strong>Khách hàng</Text>
                                    </Space>
                                }
                            >
                                {record.userFullName}
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <MailOutlined />
                                        <Text strong>Email</Text>
                                    </Space>
                                }
                            >
                                {record.userEmail}
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <VideoCameraOutlined />
                                        <Text strong>Phim</Text>
                                    </Space>
                                }
                                span={2}
                            >
                                <Text strong style={{ fontSize: '15px' }}>
                                    {record.movieTitle}
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <EnvironmentOutlined />
                                        <Text strong>Rạp chiếu</Text>
                                    </Space>
                                }
                            >
                                {record.cinemaName}
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <ApartmentOutlined />
                                        <Text strong>Phòng chiếu</Text>
                                    </Space>
                                }
                            >
                                {record.roomName}
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={
                                    <Space>
                                        <CalendarOutlined />
                                        <Text strong>Thời gian chiếu</Text>
                                    </Space>
                                }
                                span={2}
                            >
                                <Text strong style={{ color: '#ff4d4f' }}>
                                    {record.showTime}
                                </Text>
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={<Text strong>Ghế ngồi</Text>}
                                span={2}
                            >
                                <Space wrap>
                                    {record.seatCodes?.map((seat, index) => (
                                        <Tag key={index} color="blue" style={{ fontSize: '14px', padding: '4px 12px' }}>
                                            {seat}
                                        </Tag>
                                    ))}
                                </Space>
                            </Descriptions.Item>

                            <Descriptions.Item 
                                label={<Text strong>Tổng tiền</Text>}
                                span={2}
                            >
                                <Text strong style={{ fontSize: '18px', color: '#ff4d4f' }}>
                                    {new Intl.NumberFormat('vi-VN', { 
                                        style: 'currency', 
                                        currency: 'VND' 
                                    }).format(record.totalPrice || 0)}
                                </Text>
                            </Descriptions.Item>
                        </Descriptions>
                    </Card>
                )}
            </Space>
        </div>
    );
};