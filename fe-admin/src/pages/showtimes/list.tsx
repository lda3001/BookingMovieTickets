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
import type { IShowtime } from "../../interfaces";
import {
  PlusOutlined,
  SearchOutlined,
} from "@ant-design/icons";
import { useNavigate } from "react-router";
import { CrudFilters, useCustom } from "@refinedev/core";
import { useApiUrl } from "@refinedev/core";
import { axiosInstance } from "../../utils/axios";
import { useEffect, useState } from "react";

const Actions = ({
  record,
  refetch,
}: {
  record: IShowtime;
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

export const ShowtimeList = () => {
  const navigate = useNavigate();
  const apiUrl = useApiUrl();
  const [showtimes, setShowtimes] = useState<IShowtime[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchShowtimes = async () => {
    setLoading(true);
    try {
      // Since there's no GET all endpoint, we'll need to fetch from movies or use a custom endpoint
      // For now, let's fetch all movies and their showtimes
      const moviesResponse = await axiosInstance.get(`${apiUrl}/movies`);
      const movies = moviesResponse.data;
      
      const allShowtimes: IShowtime[] = [];
      for (const movie of movies) {
        try {
          const showtimesResponse = await axiosInstance.get(
            `${apiUrl}/showtimes/movie/${movie.id}`
          );
          if (showtimesResponse.data && Array.isArray(showtimesResponse.data)) {
            allShowtimes.push(...showtimesResponse.data);
          }
        } catch (error) {
          console.error(`Error fetching showtimes for movie ${movie.id}:`, error);
        }
      }
      setShowtimes(allShowtimes);
    } catch (error) {
      console.error("Error fetching showtimes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchShowtimes();
  }, []);

  return (
    <Space direction="vertical" style={{ width: "100%" }} size={"middle"}>
      <Card>
        <Flex justify="space-between" align="center">
          <Form layout="inline">
            <Form.Item>
              <Input
                placeholder="Tìm kiếm lịch chiếu..."
                prefix={<SearchOutlined />}
              />
            </Form.Item>
            <Form.Item>
              <Button type="primary" onClick={fetchShowtimes}>
                Làm mới
              </Button>
            </Form.Item>
          </Form>
          <Button
            type="primary"
            onClick={() => {
              navigate("/showtimes/create");
            }}
            icon={<PlusOutlined />}
          >
            Thêm lịch chiếu mới
          </Button>
        </Flex>
      </Card>
      <Card>
        <ProTable
          dataSource={showtimes}
          loading={loading}
          rowKey="id"
          headerTitle="Danh sách lịch chiếu"
          locale={{ emptyText: "Không có bản ghi" }}
          pagination={{
            pageSize: 50,
            showSizeChanger: true,
          }}
          search={false}
          columns={[
            {
              title: "Phim",
              dataIndex: ["movie", "title"],
              render: (_, record) => (
                <TextField value={record.movie?.title || "-"} />
              ),
              width: 200,
            },
            {
              title: "Rạp",
              dataIndex: ["cinema", "name"],
              render: (_, record) => (
                <TextField value={record.cinema?.name || "-"} />
              ),
            },
            {
              title: "Phòng",
              dataIndex: ["room", "name"],
              render: (_, record) => (
                <TextField value={record.room?.name || "-"} />
              ),
            },
            {
              title: "Thời gian chiếu",
              dataIndex: "showTime",
              render: (value) =>
                value ? (
                  <TextField
                    value={new Date(value).toLocaleString("vi-VN")}
                  />
                ) : (
                  "-"
                ),
            },
            {
              title: "Thời gian kết thúc",
              dataIndex: "endTime",
              render: (value) =>
                value ? (
                  <TextField
                    value={new Date(value).toLocaleString("vi-VN")}
                  />
                ) : (
                  "-"
                ),
            },
            {
              title: "Định dạng",
              dataIndex: "format",
              render: (value) => <TextField value={value || "-"} />,
            },
            {
              title: "Giá vé",
              dataIndex: "price",
              render: (value) =>
                value ? (
                  <TextField value={`${value.toLocaleString("vi-VN")} VND`} />
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
            },
            {
              title: "Actions",
              fixed: "right",
              width: 120,
              render: (_, record: any) => (
                <Actions record={record} refetch={fetchShowtimes} />
              ),
            },
          ]}
        />
      </Card>
    </Space>
  );
};

