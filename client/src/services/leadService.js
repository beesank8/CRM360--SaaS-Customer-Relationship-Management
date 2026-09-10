// ============================================================
// API INSTANCE
//
// Uses the single shared Axios instance (src/services/api.js)
// instead of creating a second, independently-configured
// instance. That instance already reads VITE_API_URL and
// attaches the auth token, so all requests stay in sync if
// the API base URL ever changes.
// ============================================================

import API from "./api";


// ============================================================
// GET ALL LEADS
// ============================================================

export const getLeads =
  async () => {

    const response =
      await API.get("/leads");

    return response.data;
  };


// ============================================================
// GET SINGLE LEAD
// ============================================================

export const getLead =
  async (id) => {

    if (!id) {
      throw new Error(
        "Lead ID is required"
      );
    }

    const response =
      await API.get(
        `/leads/${id}`
      );

    return response.data;
  };


// ============================================================
// CREATE LEAD
// ============================================================

export const createLead =
  async (leadData) => {

    const response =
      await API.post(
        "/leads",
        leadData
      );

    return response.data;
  };


// ============================================================
// UPDATE LEAD
// ============================================================

export const updateLead =
  async (
    id,
    leadData
  ) => {

    if (!id) {
      throw new Error(
        "Lead ID is required"
      );
    }

    const response =
      await API.put(
        `/leads/${id}`,
        leadData
      );

    return response.data;
  };


// ============================================================
// DELETE LEAD
// ============================================================

export const deleteLead =
  async (id) => {

    if (!id) {
      throw new Error(
        "Lead ID is required"
      );
    }

    const response =
      await API.delete(
        `/leads/${id}`
      );

    return response.data;
  };


// ============================================================
// CONVERT LEAD TO CUSTOMER
// ============================================================

export const convertLead =
  async (id) => {

    if (!id) {
      throw new Error(
        "Lead ID is required"
      );
    }

    try {

      const response =
        await API.post(
          `/leads/${id}/convert`
        );

      return response.data;

    } catch (error) {

      console.error(
        "Convert lead API error:",
        error
      );

      throw error;
    }
  };


export default API;