import axios from "axios";
const baseURL = "http://192.168.90.82:3333";

const checkUser = async (username, password, odometer) => {
  let data = { username, password, odometer };
  return new Promise((resolve, reject) => {
    try {
      axios({
        baseURL,
        method: "post",
        url: "/login",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000,
        data: JSON.stringify(data),
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(1);
        });
    } catch (err) {
      reject(2);
    }
  });
};

const getOrders = async (token) => {
  return new Promise((resolve, reject) => {
    try {
      axios({
        baseURL,
        method: "get",
        url: `/orders-info`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        timeout: 30000,
      })
        .then((response) => {
          resolve(response.data);
        })
        .catch((error) => {
          reject(1);
        });
    } catch (err) {
      reject(2);
    }
  });
};

export default {
  checkUser,
  getOrders,
};
