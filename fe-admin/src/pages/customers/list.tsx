import {
  TextField,
  useTable,
  DeleteButton,
  ShowButton,
  EditButton,
  CreateButton,
} from "@refinedev/antd";
import { Space, Button, Form, Input, Card, Tag, Select, Flex } from "antd";
import type { IUser } from "../../interfaces";
import { SearchOutlined, PlusOutlined } from "@ant-design/icons";
import { CrudFilters, useApiUrl } from "@refinedev/core";
import { ProTable } from "@ant-design/pro-components";
import { axiosInstance } from "../../utils/axios";
import { useNavigate } from "react-router";

const Actions = ({
  record,
  refetch,
}: {
  record: IUser;
  refetch: () => void;
}) => (
  <Space>
    <ShowButton hideText size="small" recordItemId={record.id} />
    <EditButton hideText size="small" recordItemId={record.id} />
    <DeleteButton
      hideText
      size="small"
      recordItemId={record.id}
      onSuccess={() => refetch()}
    />
  </Space>
);

export const CustomerList = () => {
  const navigate = useNavigate();
  const { tableProps, tableQuery, searchFormProps } = useTable<IUser>({
    pagination: { pageSize: 10 },
    resource: "users/search",
    syncWithLocation: true,
    onSearch: (params: any) => {
      console.log("search>>>", params);
      const filters: CrudFilters = [];
      const { q } = params;
      filters.push({
        field: "keyword",
        operator: "eq",
        value: q,
      });
      return filters;
    },
    queryOptions: {
      select: (data: any) => {
        return {
          data: data?.data.data,
          total: data?.data.totalPage * data?.data.size,
        };
      },
      onSuccess: (data: any) => {
        const totalPages = data?.totalPage || 0;
        const pageSize = data?.size || 0;
        return {
          total: totalPages * pageSize,
        };
      },
      onError: (error: any) => {
        console.error("Error fetching users:", error);
      },
    },
  });
  const apiUrl = useApiUrl();

  const handleStatusChange = async (value: string, id: string) => {
    try {
      const response = await axiosInstance.patch(
        `${apiUrl}/users/${id}`,
        { role: value },
        {
          headers: {
            Accept: "*/*",
            "Content-Type": "application/json",
          },
        }
      );
      tableQuery.refetch();
      console.log("Role updated successfully", response.data);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
      <Card>
        <Form layout="vertical" {...searchFormProps}>
          <Form.Item label="Tìm kiếm" name="q">
            <Input
              placeholder="Tên, Email, etc."
              prefix={<SearchOutlined />}
            />
          </Form.Item>
          <Form.Item>
            <Button htmlType="submit" type="primary">
              Tìm kiếm
            </Button>
          </Form.Item>
        </Form>
      </Card>
      <Card>
        <Flex justify="end" style={{ marginBottom: 16 }} gap={10}>
          <Button
            type="primary"
            onClick={() => {
              navigate("/customers/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm khách hàng mới
          </Button>
        </Flex>
        <ProTable
          {...tableProps}
          rowKey="id"
          search={false}
          loading={tableProps.loading}
          headerTitle="Danh sách khách hàng"
          locale={{ emptyText: "Không có khách hàng nào" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          columns={[
            {
              title: "Tên Khách Hàng",
              dataIndex: "fullName",
              filterSearch: true,
              showSorterTooltip: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
            },
            {
              title: "Email",
              dataIndex: "email",
              filterSearch: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
            },
            {
              title: "Vai Trò",
              dataIndex: "role",
              key: "role",
              render: (_, record) => {
                return (
                  <Select
                    value={record?.role}
                    style={{ width: 140, marginLeft: "8px" }}
                    onChange={(e) => handleStatusChange(e, record?.id)}
                    options={[
                      {
                        value: "ADMIN",
                        label: <Tag color="red">Quản Trị Viên</Tag>,
                      },
                      {
                        value: "USER",
                        label: <Tag color="green">Khách Hàng</Tag>,
                      },
                    ]}
                  />
                );
              },
              filters: [
                { text: "Quản Trị Viên", value: "ADMIN" },
                { text: "Khách Hàng", value: "USER" },
              ],
              onFilter: (value, record) => {
                return record.role === value;
              },
            },
            {
              title: "Ngày Tạo",
              dataIndex: "createdAt",
              sorter: (a, b) =>
                new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime(),
              render: (value) => (
                <TextField
                  value={new Date(value).toLocaleDateString("vi-VN")}
                />
              ),
            },
            {
              title: "Hành Động",
              fixed: "right",
              width: 120,
              render: (_, record: IUser) => (
                <Actions record={record} refetch={tableQuery.refetch} />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
};
