// ============================================================
// API INSTANCE
//
// Uses the single shared Axios instance (src/services/api.js)
// instead of creating a second, independently-configured
// instance, so all services stay in sync with VITE_API_URL
// and the auth-token interceptor.
// ============================================================

import API from "./api";


// ===============================
// GET CUSTOMERS
// ===============================

export const getCustomers = async () => {

  const response = await API.get("/customers");

  return response.data;
};


// ===============================
// GET SINGLE CUSTOMER
// ===============================

export const getCustomer = async (id) => {

  const response = await API.get(`/customers/${id}`);

  return response.data;
};


// ===============================
// CREATE CUSTOMER
// ===============================

export const createCustomer = async (customerData) => {

  const response = await API.post(
    "/customers",
    customerData
  );

  return response.data;
};


// ===============================
// UPDATE CUSTOMER
// ===============================

export const updateCustomer = async (
  id,
  customerData
) => {

  const response = await API.put(
    `/customers/${id}`,
    customerData
  );

  return response.data;
};


// ===============================
// DELETE CUSTOMER
// ===============================

export const deleteCustomer = async (id) => {

  const response = await API.delete(
    `/customers/${id}`
  );

  return response.data;
};


export default API;