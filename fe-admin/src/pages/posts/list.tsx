import {
  TextField,
  useTable,
  EditButton,
  DeleteButton,
  RefreshButton,
  TagField,
  useSelect,
} from "@refinedev/antd";
import { ProTable, TableDropdown } from "@ant-design/pro-components";
import {
  Table,
  Space,
  Button,
  Flex,
  Modal,
  Form,
  Input,
  Image,
  Card,
  Tag,
  Typography,
  Spin,
} from "antd";
import type { ICategory, ICategoryPost, IPost, IProduct } from "../../interfaces";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CrudFilters, useApiUrl, useUpdate } from "@refinedev/core";
import { TopsSellingProductList } from "../topsSellingProduct";

const Actions = ({
  record,
  refetch,
}: {
  record: IPost;
  refetch: () => void;
}) => (
  <Space>
    <EditButton hideText size="small" recordItemId={record.id} />
    <DeleteButton
      hideText
      size="small"
      recordItemId={record.id}
      onSuccess={() => refetch()} // Gọi refetch sau khi xóa thành công
    />
  </Space>
);

export const PostList = () => {
  const apiUrl = useApiUrl();

  const navigate = useNavigate();
  const tableRef = useRef<any>(null);

  const { tableProps, tableQuery, searchFormProps, tableQueryResult } =
    useTable<IPost>({
      pagination: { pageSize: 5 },
      resource: "posts/search",
      syncWithLocation: true,
      onSearch: (params: any) => {
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
            data: data?.data.posts, // Lấy mảng sản phẩm từ API
            total: data?.data.totalPage * data?.data.size, // Tính tổng số bản ghi từ totalPage và size
          };
        },
        onSuccess: (data: any) => {
          // Cập nhật thông tin phân trang nếu cần
          const totalPages = data?.totalPage || 0;
          const pageSize = data?.size || 0;
          return {
            total: totalPages * pageSize, // Tính tổng số kết quả từ totalPage và size
          };
        },
        onError: (error: any) => {
          console.error("Error fetching categorypost:", error);
        },
      },
      // Tùy chỉnh gửi các tham số phân trang (page và size)
    });

  const { selectProps: categorySelectProps } = useSelect<ICategoryPost>({
    resource: "categoryposts", // Chỉ định resource là categories
    optionLabel: "name", // Hiển thị name trong Select
    optionValue: "id",
    defaultValue: "all",
  });

  if (categorySelectProps.loading) {
    return <Spin>Loading...</Spin>;
  }

  const categoryEnum = categorySelectProps.options?.reduce(
    (acc, item) => {
      if (item.value !== null && item.value !== undefined) {
        acc[item.value] = { text: item.label };
      }
      return acc;
    },
    {}
  );




  if (!categoryEnum) {
    return <p>Loading...</p>;
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
        <Flex justify="end" style={{ marginBottom: 16 }} gap={10}>
          <Button
            type="primary"
            onClick={() => {
              navigate("/posts/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm mới bài viết
          </Button>
        </Flex>
        <ProTable
          // ref={tableRef}
          {...tableProps}
          rowKey="id"
          loading={tableProps.loading && categorySelectProps.loading}
          headerTitle="Danh sách bài viết"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
            showTotal: (total, range) =>
              `${range[0]}-${range[1]} of ${total} items`,
          }}
          search={false}
          columns={[
            {
              title: "Thumbnail",
              dataIndex: "thumbnail",
              render: (value) => <Image src={`${apiUrl}${value}`} width={80} />,
              search: false,
            },
            {
              title: "Tiêu Đề",
              dataIndex: "title",
              filterSearch: true,
              sorter: (a, b) => a.title.localeCompare(b.title),
              showSorterTooltip: true,
              render: (value) => <TextField value={value} />,
              copyable: true,
              width: 200,
            },
            {
              title: "Mô tả",
              dataIndex: "description",
              search: false,
            },
            {
              title: "Danh Mục",
              dataIndex: "categoryposts",
              key: "id",
              render: (_, record) =>
               
                 
                    <Tag key={record.categoryPosts.id}>{record.categoryPosts.name}</Tag>,
                 
              valueType: "select",
              filters: Object.entries(categoryEnum).map(([key, value]) => ({
                text: value.text, // Tên danh mục hiển thị
                value: key,       // ID danh mục
              })),
              onFilter: (value, record) => {
                return Array.isArray(record.categoryPosts)
                  ? record.categoryPosts.some((item) => item.id === value)
                  : false;
              },

              ellipsis: true,
              valueEnum: categoryEnum,
            },
            {
              title: "Trạng Thái",
              dataIndex: "isActive", // Giá trị boolean
              key: "isActive",
              render: (_, record) => {
                return (
                  record.isActive ? (
                    <Tag color="blue">Public</Tag>
                  ) : (
                    <Tag color="gray">Draft</Tag>
                  ))
              },
              valueType: "select",
              filters: [
                { text: "Public", value: true },
                { text: "Draft", value: false },
              ],
              onFilter: (value, record) => {
                return record.isActive === value
              },
              ellipsis: true,
            },
            {
              title: "Actions",
              fixed: "right",
              width: 50,
              render: (_, record: any) => (
                <Actions record={record} refetch={tableQuery.refetch} />
              ),
            },
          ]}
        >
          {/* <Table.Column
            dataIndex="thumbnail"
            title="Thumbnail"
            render={(value) => <Image src={`${apiUrl}${value}`} width={80} />}
          />
          <Table.Column
            dataIndex="name"
            title="Tên"
            filterSearch
            sorter= {(a, b) => a.name.localeCompare(b.name)}
            showSorterTooltip
            render={(value) => <TextField value={value} />}
          />
          <Table.Column dataIndex="description" title="Mô tả" />\
          <Table.Column
            dataIndex="categories"
            title="Danh Mục"
            render={(value) => value.map((item) => <Tag>{item.name}</Tag>)}
          />
          <Table.Column
            title="Actions"
            fixed="right"
            render={(_, record: ICategory) => (
              <Actions record={record} refetch={tableQuery.refetch} />
            )}
          /> */}
        </ProTable>
      </Card>
      {/* <Card>
        <TopsSellingProductList/>
      </Card> */}
    </Space>
  );
};
