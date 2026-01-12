import {
  TextField,
  useTable,
  EditButton,
  ShowButton,
  DeleteButton,
  CreateButton,
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
import type { ICinema } from "../../interfaces";
import {
  SearchOutlined,
} from "@ant-design/icons";
import { CrudFilters } from "@refinedev/core";

const Actions = ({
  record,
  refetch,
}: {
  record: ICinema;
  refetch: () => void;
}) => (
  <Space>
    <ShowButton hideText size="small" recordItemId={record.id} />
    <EditButton hideText size="small" recordItemId={record.id} />
    <DeleteButton 
      hideText 
      size="small" 
      recordItemId={record.id}
      confirmTitle="Xác nhận xóa rạp"
      confirmOkText="Xóa"
      confirmCancelText="Hủy"
    />
  </Space>
);

export const CinemaList = () => {
  const { tableProps, tableQuery, searchFormProps } = useTable<ICinema>({
    pagination: { pageSize: 50 },
    resource: "cinemas",
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { q } = params;
      if (q) {
        filters.push({
          field: "name",
          operator: "contains",
          value: q,
        });
      }
      return filters;
    },
  });

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
      <Card>
        <Flex justify="space-between" align="center" wrap="wrap" gap={16}>
          <Form layout="inline" {...searchFormProps} style={{ flex: 1 }}>
            <Form.Item label="Tìm kiếm" name="q" style={{ flex: 1, minWidth: 200 }}>
              <Input
                placeholder="Tên rạp, thành phố, etc."
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button htmlType="submit" type="primary">
                Tìm kiếm
              </Button>
            </Form.Item>
          </Form>
          <CreateButton>Thêm rạp mới</CreateButton>
        </Flex>
      </Card>
      <Card>
        <ProTable
          {...tableProps}
          rowKey="id"
          loading={tableProps.loading}
          headerTitle="Danh sách rạp chiếu phim"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          search={false}
          columns={[
            {
              title: "Tên rạp",
              dataIndex: "name",
              filterSearch: true,
              sorter: (a, b) => a.name?.localeCompare(b.name || "") || 0,
              showSorterTooltip: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
              width: 200,
            },
            {
              title: "Địa chỉ",
              dataIndex: "address",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Thành phố",
              dataIndex: "city",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Số điện thoại",
              dataIndex: "phone",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Số phòng",
              dataIndex: "totalRooms",
              search: false,
              render: (value) => <TextField value={value} />,
            },
            {
              title: "Trạng Thái",
              dataIndex: "isActive",
              key: "isActive",
              render: (_, record) => {
                return record.isActive ? (
                  <Tag color="blue">Đang hoạt động</Tag>
                ) : (
                  <Tag color="gray">Không hoạt động</Tag>
                );
              },
              valueType: "select",
              filters: [
                { text: "Đang hoạt động", value: true },
                { text: "Không hoạt động", value: false },
              ],
              onFilter: (value, record) => {
                return record.isActive === value;
              },
              ellipsis: true,
            },
            {
              title: "Actions",
              fixed: "right",
              width: 100,
              render: (_, record: any) => (
                <Actions record={record} refetch={tableQuery.refetch} />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
};

