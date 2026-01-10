import { Create, useForm, useSelect } from "@refinedev/antd";
import { Flex, Form, Input, Switch, DatePicker, InputNumber, Select } from "antd";
import type { IShowtime, IMovie, ICinema, IRoom } from "../../interfaces";
import dayjs from "../../utils/dayjs";

export const ShowtimeCreate = () => {
  const { formProps, formLoading, saveButtonProps, onFinish } = useForm<IShowtime>({
    action: "create",
  });

  const handleFinish = async (values: any) => {
    const transformedValues = {
      movieId: values.movieId,
      cinemaId: values.cinemaId,
      roomId: values.roomId,
      showTime: values.showTime ? dayjs(values.showTime).format("DD/MM/YYYY HH:mm") : undefined,
      endTime: values.endTime ? dayjs(values.endTime).format("DD/MM/YYYY HH:mm") : undefined,
      format: values.format,
      price: values.price,
      isActive: values.isActive,
    };
    await onFinish(transformedValues);
  };

  const { selectProps: movieSelectProps } = useSelect<IMovie>({
    resource: "movies",
    optionLabel: "title",
    optionValue: "id",
  });

  const { selectProps: cinemaSelectProps } = useSelect<ICinema>({
    resource: "cinemas",
    optionLabel: "name",
    optionValue: "id",
  });

  // For rooms, fetch based on selected cinema
  // if selectedCinemaId is not null, fetch rooms by cinemaId
  const selectedCinemaId = Form.useWatch("cinemaId", formProps.form);
  const { selectProps: roomSelectProps } = useSelect<IRoom>({
    resource: selectedCinemaId ? "rooms/cinema/" + selectedCinemaId : "rooms",
    optionLabel: "name",
    optionValue: "id",
    queryOptions: {
      enabled: !!selectedCinemaId,
    },
  });

  return (
    <Create isLoading={formLoading} saveButtonProps={saveButtonProps}>
      <Form
        {...formProps}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{
          isActive: true,
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
          name="movieId"
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
          name="cinemaId"
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
          name="roomId"
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
          <Input placeholder="VD: 2D Phụ đề, 2D Lồng tiếng, IMAX" />
        </Form.Item>

        <Form.Item label="Giá vé" name="price">
          <InputNumber
            min={0}
            style={{ width: "100%" }}
            placeholder="Nhập giá vé"
          />
        </Form.Item>
      </Form>
    </Create>
  );
};
