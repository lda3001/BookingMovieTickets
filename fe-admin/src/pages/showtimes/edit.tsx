import React from "react";
import { Edit, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Switch, DatePicker, InputNumber, Select } from "antd";
import type { IShowtime, IMovie, ICinema, IRoom } from "../../interfaces";
import dayjs from "dayjs";

export const ShowtimeEdit = () => {
  const {
    formProps,
    formLoading,
    saveButtonProps,
    query: queryResult,
  } = useForm<IShowtime>({
    action: "edit",
  });

  const postData = queryResult?.data?.data;

  const { selectProps: movieSelectProps } = useSelect<IMovie>({
    resource: "movies",
    optionLabel: "title",
    optionValue: "id",
    defaultValue: postData?.movie?.id,
  });

  const { selectProps: cinemaSelectProps } = useSelect<ICinema>({
    resource: "cinemas",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: postData?.cinema?.id,
  });

  const selectedCinemaId = Form.useWatch(["cinema", "id"], formProps.form) || postData?.cinema?.id;
  const { selectProps: roomSelectProps } = useSelect<IRoom>({
    resource: "rooms",
    optionLabel: "name",
    optionValue: "id",
    defaultValue: postData?.room?.id,
    filters: selectedCinemaId
      ? [
          {
            field: "cinema.id",
            operator: "eq",
            value: selectedCinemaId,
          },
        ]
      : [],
    queryOptions: {
      enabled: !!selectedCinemaId,
    },
  });

  return (
    <Edit isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        initialValues={{
          ...postData,
          showTime: postData?.showTime ? dayjs(postData.showTime) : undefined,
          endTime: postData?.endTime ? dayjs(postData.endTime) : undefined,
          movie: postData?.movie?.id,
          cinema: postData?.cinema?.id,
          room: postData?.room?.id,
        }}
      >
        <Flex gap={20} justify="right">
          <Form.Item
            label="Trạng thái"
            name="isActive"
            initialValue={true}
            layout="horizontal"
          >
            <Switch checkedChildren="Hoạt động" unCheckedChildren="Không hoạt động" />
          </Form.Item>
        </Flex>

        <Form.Item
          label="Phim"
          name={["movie", "id"]}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phim",
            },
          ]}
        >
          <Select {...movieSelectProps} placeholder="Chọn phim" />
        </Form.Item>

        <Form.Item
          label="Rạp"
          name={["cinema", "id"]}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn rạp",
            },
          ]}
        >
          <Select {...cinemaSelectProps} placeholder="Chọn rạp" />
        </Form.Item>

        <Form.Item
          label="Phòng"
          name={["room", "id"]}
          rules={[
            {
              required: true,
              message: "Vui lòng chọn phòng",
            },
          ]}
        >
          <Select
            {...roomSelectProps}
            placeholder={selectedCinemaId ? "Chọn phòng" : "Vui lòng chọn rạp trước"}
            disabled={!selectedCinemaId}
            loading={roomSelectProps.loading}
          />
        </Form.Item>

        <Form.Item
          label="Thời gian chiếu"
          name="showTime"
          rules={[
            {
              required: true,
              message: "Vui lòng chọn thời gian chiếu",
            },
          ]}
        >
          <DatePicker
            showTime
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn thời gian chiếu"
          />
        </Form.Item>

        <Form.Item label="Thời gian kết thúc" name="endTime">
          <DatePicker
            showTime
            style={{ width: "100%" }}
            format="DD/MM/YYYY HH:mm"
            placeholder="Chọn thời gian kết thúc"
          />
        </Form.Item>

        <Form.Item label="Định dạng" name="format">
          <Input />
        </Form.Item>

        <Form.Item label="Giá vé" name="price">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            formatter={(value) => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
            parser={(value) => value!.replace(/\$\s?|(,*)/g, "")}
          />
        </Form.Item>
      </Form>
    </Edit>
  );
};

