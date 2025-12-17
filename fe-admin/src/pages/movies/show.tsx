import { useShow, useApiUrl } from "@refinedev/core";
import { Show, TextField, DateField } from "@refinedev/antd";
import {
  Typography,
  Row,
  Col,
  Image,
  Tag,
  Descriptions,
} from "antd";
import type { IMovie } from "../../interfaces";

const { Title, Text } = Typography;

export const MovieShow = () => {
  const { query: queryResult } = useShow<IMovie>();
  const { data, isLoading } = queryResult;
  const record = data?.data;
  const apiUrl = useApiUrl();

  return (
    <Show isLoading={isLoading}>
      <Row gutter={16}>
        <Col span={8}>
          {record?.image && (
            <Image
              src={record.image.startsWith("http") ? record.image : apiUrl + record.image}
              width="100%"
              style={{ borderRadius: 8 }}
            />
          )}
        </Col>
        <Col span={16}>
          <Title level={3}>{record?.title}</Title>
          <Descriptions column={1} bordered>
            <Descriptions.Item label="Slug">
              <Text copyable>{record?.slug}</Text>
            </Descriptions.Item>
            <Descriptions.Item label="Trạng thái">
              {record?.isActive ? (
                <Tag color="blue">Đang hoạt động</Tag>
              ) : (
                <Tag color="gray">Không hoạt động</Tag>
              )}
            </Descriptions.Item>
            {record?.duration && (
              <Descriptions.Item label="Thời lượng">
                <Text>{record.duration}</Text>
              </Descriptions.Item>
            )}
            {record?.rating && (
              <Descriptions.Item label="Đánh giá">
                <Text>{record.rating}</Text>
              </Descriptions.Item>
            )}
            {record?.releaseDate && (
              <Descriptions.Item label="Ngày phát hành">
                <DateField value={record.releaseDate} format="DD/MM/YYYY" />
              </Descriptions.Item>
            )}
            {record?.country && (
              <Descriptions.Item label="Quốc gia">
                <Text>{record.country}</Text>
              </Descriptions.Item>
            )}
            {record?.director && (
              <Descriptions.Item label="Đạo diễn">
                <Text>{record.director}</Text>
              </Descriptions.Item>
            )}
            {record?.producer && (
              <Descriptions.Item label="Nhà sản xuất">
                <Text>{record.producer}</Text>
              </Descriptions.Item>
            )}
            {record?.genre && (
              <Descriptions.Item label="Thể loại">
                <Text>{record.genre}</Text>
              </Descriptions.Item>
            )}
            {record?.cast && (
              <Descriptions.Item label="Diễn viên">
                <Text>{record.cast}</Text>
              </Descriptions.Item>
            )}
            {record?.tagline && (
              <Descriptions.Item label="Tagline">
                <Text>{record.tagline}</Text>
              </Descriptions.Item>
            )}
            {record?.subtitle && (
              <Descriptions.Item label="Phụ đề">
                <Text>{record.subtitle}</Text>
              </Descriptions.Item>
            )}
            {record?.trailerUrl && (
              <Descriptions.Item label="Trailer URL">
                <Text>
                  <a href={record.trailerUrl} target="_blank" rel="noopener noreferrer">
                    {record.trailerUrl}
                  </a>
                </Text>
              </Descriptions.Item>
            )}
            {record?.description && (
              <Descriptions.Item label="Mô tả">
                <Text>{record.description}</Text>
              </Descriptions.Item>
            )}
            {record?.createdAt && (
              <Descriptions.Item label="Ngày tạo">
                <DateField value={record.createdAt} format="DD/MM/YYYY HH:mm" />
              </Descriptions.Item>
            )}
            {record?.updatedAt && (
              <Descriptions.Item label="Ngày cập nhật">
                <DateField value={record.updatedAt} format="DD/MM/YYYY HH:mm" />
              </Descriptions.Item>
            )}
          </Descriptions>
        </Col>
      </Row>
      {record?.content && (
        <Row style={{ marginTop: 24 }}>
          <Col span={24}>
            <Title level={4}>Nội dung chi tiết</Title>
            <div dangerouslySetInnerHTML={{ __html: record.content }} />
          </Col>
        </Row>
      )}
    </Show>
  );
};

