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
import type { ICategory, IProduct } from "../../interfaces";
import {
  PlusOutlined,
  SearchOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import { useRef, useState } from "react";
import { Link, useNavigate } from "react-router";
import { CrudFilters, useApiUrl, useUpdate } from "@refinedev/core";

const Actions = ({
  record,
  refetch,
}: {
  record: ICategory;
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

export const ProductList = () => {
  const apiUrl = useApiUrl();

  const navigate = useNavigate();
  const tableRef = useRef<any>(null);

  const { tableProps, tableQuery, searchFormProps, tableQueryResult } =
    useTable<IProduct>({
      pagination: { pageSize: 50 },
      resource: "products/search",
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
            data: data?.data.products, // Lấy mảng sản phẩm từ API
            total: data?.data.totalPages * data?.data.size, // Tính tổng số bản ghi từ totalPage và size
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
          console.error("Error fetching categories:", error);
        },
      },
      // Tùy chỉnh gửi các tham số phân trang (page và size)
    });

  const { selectProps: categorySelectProps } = useSelect<ICategory>({
    resource: "categories", // Chỉ định resource là categories
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
              navigate("/products/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm mới sản phẩm
          </Button>
        </Flex>
        <ProTable
          // ref={tableRef}
          {...tableProps}
          rowKey="id"
          loading={tableProps.loading && categorySelectProps.loading}
          headerTitle="Danh sách sản phẩm"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            ...tableProps.pagination,
            showSizeChanger: true,
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
              title: "Tên",
              dataIndex: "name",
              filterSearch: true,
              sorter: (a, b) => a.name.localeCompare(b.name),
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
              dataIndex: "categories",
              key: "id",
              render: (_, record) =>
                Array.isArray(record.categories)
                  ? record.categories.map((item) => (
                    <Tag key={item.id}>{item.name}</Tag>
                  ))
                  : "-",
              valueType: "select",
              filters: Object.entries(categoryEnum).map(([key, value]) => ({
                text: value.text, // Tên danh mục hiển thị
                value: key,       // ID danh mục
              })),
              onFilter: (value, record) => {
                return Array.isArray(record.categories)
                  ? record.categories.some((item) => item.id === value)
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
        // defaultPageSize={50}
        
        >
        </ProTable>
      </Card>
      {/* <Card>
        <TopsSellingProductList/>
      </Card> */}
    </Space>
  );
};
