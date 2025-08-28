// api-client.js
import { HOST } from "@/utils/constants";
import axios from "axios";

export const apiClient = axios.create({
    baseURL: HOST, // This should be http://localhost:8747
});
