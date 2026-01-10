import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";

import "dayjs/locale/vi";

dayjs.extend(customParseFormat);
dayjs.locale("vi");

export default dayjs;


