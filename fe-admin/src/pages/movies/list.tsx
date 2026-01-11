import {
  TextField,
  useTable,
  EditButton,
  DeleteButton,
  ShowButton,
  RefreshButton,
} from "@refinedev/antd";
import { ProTable } from "@ant-design/pro-components";
import {
  Table,
  Space,
  Button,
  Flex,
  Card,
  Tag,
  Image,
  Form,
  Input,
} from "antd";
import type { IMovie } from "../../interfaces";
import {
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useRef } from "react";
import { useNavigate } from "react-router";
import { CrudFilters, useApiUrl } from "@refinedev/core";
import { getUrlImage } from "../../utils/helper";

const Actions = ({
  record,
  refetch,
}: {
  record: IMovie;
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

export const MovieList = () => {
  const apiUrl = useApiUrl();
  const navigate = useNavigate();
  const tableRef = useRef<any>(null);

  const { tableProps, tableQuery, searchFormProps } = useTable<IMovie>({
    pagination: { pageSize: 50 },
    resource: "movies",
    syncWithLocation: true,
    onSearch: (params: any) => {
      const filters: CrudFilters = [];
      const { q } = params;
      if (q) {
        filters.push({
          field: "title",
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
              placeholder="Tên phim, slug, etc."
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
              navigate("/movies/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm phim mới
          </Button>
        </Flex>
        <ProTable
          {...tableProps}
          rowKey="id"
          loading={tableProps.loading}
          headerTitle="Danh sách phim"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
          }}
          search={false}
          columns={[
            {
              title: "Ảnh",
              dataIndex: "image",
              render: (value) =>
                value ? (
                  <Image src={getUrlImage(value)} width={80} height={120} style={{ objectFit: "cover" }} />
                ) : (
                  "-"
                ),
              search: false,
            },
            {
              title: "Tiêu đề",
              dataIndex: "title",
              filterSearch: true,
              sorter: (a, b) => a.title?.localeCompare(b.title || "") || 0,
              showSorterTooltip: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
              width: 200,
            },
            {
              title: "Slug",
              dataIndex: "slug",
              search: false,
              render: (value) => <TextField value={value} />,
            },
            {
              title: "Thời lượng",
              dataIndex: "duration",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Đánh giá",
              dataIndex: "rating",
              search: false,
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Ngày phát hành",
              dataIndex: "releaseDate",
              search: false,
              render: (value) =>
                value ? (
                  <TextField value={new Date(value).toLocaleDateString("vi-VN")} />
                ) : (
                  "-"
                ),
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

