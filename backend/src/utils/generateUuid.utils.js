import { v4 as uuidv4 } from "uuid";

const generateUuid = () => {
  return uuidv4().replace(/-/g, "");
};

export default generateUuid;
