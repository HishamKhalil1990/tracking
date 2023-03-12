import axios from "axios";
const baseURL = "http://192.168.90.140:3333";

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

const send = async (token,status,tripName,orderNo,location) => {
  return new Promise((resolve, reject) => {
    const data = {
      tripName,
      orderNo,
      location
    }
    try {
      axios({
        baseURL,
        method: "post",
        url: `/status/${status}`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:JSON.stringify(data),
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

const sendLocation = async(token,location,tripName,orderNo) => {
  return new Promise((resolve, reject) => {
    const data = {
      tripName,
      location,
      orderNo
    }
    try {
      axios({
        baseURL,
        method: "post",
        url: `/location`,
        headers: {
          "Authorization": `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        data:JSON.stringify(data),
        timeout: 5000,
      })
        .then((response) => {
          resolve();
        })
        .catch((error) => {
          reject();
        });
    } catch (err) {
      reject();
    }
  });
}

export default {
  checkUser,
  getOrders,
  send,
  sendLocation
};
