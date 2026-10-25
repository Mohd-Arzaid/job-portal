import axios from "axios";
import { companyEndpoints } from "./api";

const { REGISTER_COMPANY_API, GET_COMPANY_API } = companyEndpoints;

export const registerCompany = async (formData) => {
  const response = await axios.post(REGISTER_COMPANY_API, formData, {
    withCredentials: true,
  });

  console.log("REGISTER COMPANY API RESPONSE............", response);

  console.log(
    "REGISTER COMPANY API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Company registration failed");
  }

  return response.data;
};

export const getCompany = async () => {
  const response = await axios.get(GET_COMPANY_API, {
    withCredentials: true,
  });

  console.log("GET COMPANY API RESPONSE............", response);

  console.log(
    "GET COMPANY API SUCCESS RESPONSE............",
    response?.data?.success,
  );

  if (!response?.data?.success) {
    throw new Error(response?.data?.message || "Failed to fetch company");
  }

  return response.data;
};
