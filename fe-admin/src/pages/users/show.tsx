import { useShow, useUpdate, useApiUrl } from "@refinedev/core";

import { DeleteButton, Show, ShowButton } from "@refinedev/antd";

import { 
  Col,
  Row,
  Space,
  Tag,
  Typography,
} from "antd";

import type { IOrder, IUser, IUserResponse } from "../../interfaces";
import { ProTable } from "@ant-design/pro-components";
import { formatPrice } from "../../utils/helper";

const { Title, Text } = Typography;

export const OrderUserShow = () => {
 
  const { query: queryResult } = useShow<IUserResponse>();
  const { data, isLoading } = queryResult;
  const record = data?.data.data;
 

  const Actions = ({
    record,
    refetch,
}: {
    record: IOrder;
    refetch: () => void;
}) => (
    <Space>
        <ShowButton 
            hideText 
            size="small" 
            recordItemId={record.id}
            resource="orders"
        />
        <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            resource="orders"
            onSuccess={() => refetch()}
        />
    </Space>
);

  const status = {
    PENDING: {
      color: "gold",
      text: "Chờ Xử Lý",
    },
    COMPLETED: {
      color: "green",
      text: "Đã Xử Lý",
    },
    CANCELLED: {
      color: "red",
      text: "Đã Hủy",
    },
  };
  if (record) {
    

    return (
      <Show isLoading={isLoading}>
        

        <Row gutter={16} style={{ marginTop: "1.5rem" }}>
          <Col span={12}>
            <Title level={5}>Tên Khách Hàng</Title>
            <Text>{record?.username}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Vai Trò</Title>
            <Text>{record?.role}</Text>
          </Col>
        </Row>
        <Row gutter={16} style={{ marginTop: "1rem" }}>
          <Col span={12}>
            <Title level={5}>Email</Title>
            <Text>{record?.email}</Text>
          </Col>
          <Col span={12}>
            <Title level={5}>Loại Tài Khoản </Title>
            <Text>{record?.typeAccount}</Text>
          </Col>
        </Row>
        <ProTable
          ghost
          title={() => <Title level={5}>Danh Sách Đơn Hàng</Title>}
          rowKey="id"
          dataSource={record?.orders} // Lấy dữ liệu từ orders
          loading={isLoading}
          search={false}
          pagination={false}
          locale={{ emptyText: "Không có đơn hàng nào" }}
          columns={[
            
            {
              title: "Mã Đơn Hàng",
              dataIndex: "id",
              filterSearch: true,
              sorter: (a, b) => a.id.localeCompare(b.id),
              showSorterTooltip: true,
              render: (_, record) => <Text>{record.id}</Text>,
              copyable: true,
              width: 400,
            },
            {
                title: "Tên Khách Hàng",
                dataIndex: "customerName",
                filterSearch: true,
                showSorterTooltip: true,
                render: (_, record) => <Text>{record.customerEmail}</Text>,
            },
            {
                title: "Email",
                dataIndex: "customerEmail",
                filterSearch: true,
                showSorterTooltip: true,
                render: (_, record) => <Text>{record.customerEmail}</Text>,
            },
            {
                title: "Số Điện Thoại",
                dataIndex: "customerPhone",
                filterSearch: true,
                showSorterTooltip: true,
                render: (_, record) => <Text>{record.customerPhone}</Text>,
            },
            {
                title: "Zalo",
                dataIndex: "zaloName",
                filterSearch: true,
                showSorterTooltip: true,
                render: (_, record) => <Text>{record.zaloName}</Text>,
            },
            {
                title: "Ngày Đặt Đơn",
                dataIndex: "createdAt",
                sorter: (a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
                render: (_, record) => <Text>{new Date(record.createdAt).toLocaleString()}</Text>,
            },
            {
                title:"Tổng Tiền",
                dataIndex: "totalAmount",
                sorter: (a, b) => a.totalAmount - b.totalAmount,
                render: (_,record) => <Text>{formatPrice(record.totalAmount as number)}</Text>,
            },
            {
                title: "Trạng Thái",
                dataIndex: "status",
                key: "status",
                render: (_,record) => {
                    const statusValue = status[record.status as keyof typeof status];
                    return <Tag color={statusValue.color}>{statusValue.text}</Tag>;
                },
                filters: [
                    { text: "Chờ Xử Lý", value: "PENDING" },
                    { text: "Đã Xử Lý", value: "COMPLETED" },
                    { text: "Đã Hủy", value: "CANCELLED" },
                ],
                onFilter: (value, record) => {
                    return record.status === value},
            },
            {
                title: "Actions",
                render: (_, record: any) => (
                    <Actions record={record as IOrder} refetch={queryResult.refetch} />
                ),  
            }

            

            
           
            
          ]}
        />
    
      </Show>
    );
  }
};
