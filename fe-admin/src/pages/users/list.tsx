import { TextField, useTable, DeleteButton, ShowButton,  } from "@refinedev/antd";
import {
    Space,
    Button,
    Form,
    Input,
    Card,
    Tag,
    Select,
} from "antd";
import type { IUser } from "../../interfaces";
import { SearchOutlined } from "@ant-design/icons";
import { CrudFilters, useApiUrl } from "@refinedev/core";
import { ProTable } from "@ant-design/pro-components";
import { axiosInstance } from "../../utils/axios";


const Actions = ({
    record,
    refetch,
}: {
    record: IUser;
    refetch: () => void;
}) => (
    <Space>
        <ShowButton hideText size="small" recordItemId={record.id} />
        <DeleteButton
            hideText
            size="small"
            recordItemId={record.id}
            onSuccess={() => refetch()} // Gọi refetch sau khi xóa thành công
        />
    </Space>
);

export const UserList = () => {
   

    const { tableProps, tableQuery, searchFormProps } = useTable<IUser>({
        pagination: { pageSize: 5 },
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
                    data: data?.data.data, // Lấy mảng sản phẩm từ API
                    total: data?.data.totalPage * data?.data.size, // Tính tổng số bản ghi từ totalPage và size
                };
            },
            onSuccess: (data: any) => {
                const totalPages = data?.totalPage || 0;
                const pageSize = data?.size || 0;
                return {
                    total: totalPages * pageSize, // Tính tổng số kết quả từ totalPage và size
                };
            },
            onError: (error: any) => {
                console.error("Error fetching users:", error);
            },
        },
        // Tùy chỉnh gửi các tham số phân trang (page và size)

    });
    const apiUrl = useApiUrl();

    const handleStatusChange = async (value: string, id: string) => {
        try {
            const response = await axiosInstance.patch(
              `${apiUrl}/users/${id}`,
              value,
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
            // Xử lý lỗi ở đây
            console.error("Error updating status:", error);
          }
    }

    return (
        <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
            <Card>
                <Form layout="vertical" {...searchFormProps}>
                    <Form.Item label="Search" name="q">
                        <Input
                            placeholder="ID, Tên, Mô tả, etc."
                            prefix={<SearchOutlined />}
                        />
                    </Form.Item>
                    {/* <Form.Item label="Created At" name="createdAt">
            <RangePicker />
          </Form.Item> */}
                    <Form.Item>
                        <Button htmlType="submit" type="primary">
                            Tìm kiếm
                        </Button>
                    </Form.Item>
                </Form>
            </Card>
            <Card>

                <ProTable
                    
                    {...tableProps}
                    rowKey="id"
                    search={false}
                    loading={tableProps.loading}
                    locale={{ emptyText: "No orders found" }}
                    columns={[
                      
                        {
                            title: "Tên Khách Hàng",
                            dataIndex: "username",
                            filterSearch: true,
                            showSorterTooltip: true,
                            render: (value) => <TextField value={value} />,
                        },
                        {
                            title: "Email",
                            dataIndex: "email",
                            filterSearch: true,
                            render: (value) => <TextField value={value} />,
                        },
                        {
                            title: "Vai Trò",
                            dataIndex: "role",
                            key: "role",
                            render: (_,record) => {
                               
                                return <Select
                                value={record?.role}
                               style={{width: 140, marginLeft: "8px"}}
                                onChange={(e) => handleStatusChange(e, record?.id)}
                                options={[
                                  {
                                    value: "ADMIN",
                                    label: <Tag color="red">Quản Trị Viên</Tag>,
                                  },
                                  {
                                    value: "CTV",
                                    label: <Tag color="gold">Công Tác Viên</Tag>,
                                  },
                                  {
                                    value: "USER",
                                    label: <Tag color="green">Khách Hàng</Tag>,
                                  },
                                ]}
                              />;
                            },
                            filters: [
                                { text: "Quản Trị Viên", value: "ADMIN" },
                                { text: "Công Tác Viên", value: "CTV" },
                                { text: "Khách Hàng", value: "USER" },
                            ],
                              onFilter: (value, record) => {
                                return record.role === value},
                        },
                        {
                            title: "Loại Tài Khoản",
                            dataIndex: "typeAccount",
                            filters: [
                                { text: "Google", value: "GOOGLE" },
                                { text: "Normal", value: "NORMAL" },
                            ],
                              onFilter: (value, record) => {
                                return record.typeAccount === value},
                        },
                   
                        {
                            title: "Actions",
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
