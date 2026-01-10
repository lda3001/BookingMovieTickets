import {
  TextField,
  useTable,
  EditButton,
  DeleteButton,
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
import type { IRoom } from "../../interfaces";
import {
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { CrudFilters } from "@refinedev/core";

const Actions = ({
  record,
  refetch,
}: {
  record: IRoom;
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

export const RoomList = () => {
  const navigate = useNavigate();

  const { tableProps, tableQuery, searchFormProps } = useTable<IRoom>({
    pagination: { pageSize: 50 },
    resource: "rooms",
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
        <Form layout="vertical" {...searchFormProps}>
          <Form.Item label="Tìm kiếm" name="q">
            <Input
              placeholder="Tên phòng, rạp, etc."
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
              navigate("/rooms/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm phòng mới
          </Button>
        </Flex>
        <ProTable
          {...tableProps}
          rowKey="id"
          loading={tableProps.loading}
          headerTitle="Danh sách phòng chiếu phim"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          search={false}
          columns={[
            {
              title: "Tên phòng",
              dataIndex: "name",
              filterSearch: true,
              sorter: (a, b) => a.name?.localeCompare(b.name || "") || 0,
              showSorterTooltip: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
              width: 150,
            },
            {
              title: "Rạp",
              dataIndex: "cinemaName",
              render: (_, record) => (
                <TextField value={record.cinemaName || "-"} />
              ),
              width: 200,
            },
            {
              title: "Số hàng ghế",
              dataIndex: "totalRows",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Ghế mỗi hàng",
              dataIndex: "seatsPerRow",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Tổng số ghế",
              search: false,
              render: (_, record) => {
                const total = record.totalRows && record.seatsPerRow
                  ? record.totalRows * record.seatsPerRow
                  : null;
                return <TextField value={total ? total.toString() : "-"} />;
              },
            },
            {
              title: "Hàng VIP",
              dataIndex: "vipRows",
              search: false,
              render: (value) => {
                if (!value) return "-";
                try {
                  const vipRows = JSON.parse(value);
                  return Array.isArray(vipRows) ? vipRows.join(", ") : value;
                } catch {
                  return value;
                }
              },
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
              width: 120,
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

