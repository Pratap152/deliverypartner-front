import axios from "axios";
import WEBSITE_URL from "../utils/host";
const uploadMultipart = axios.create({
  baseURL: WEBSITE_URL,
  timeout: 60000, 
});
export default uploadMultipart;
