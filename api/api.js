import axios from "axios";
const baseURL = "http://localhost:3333";

const checkUser = async (username, password) => {
  let data = { username, password };
  return new Promise((resolve, reject) => {
    try {
      axios({
        baseURL,
        method: "post",
        url: "/check-supervisor-user",
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
  ////////////////////////// for testing only //////////////////////////
  // return new Promise((resolve,reject) => {
  //     let response;
  //     switch(username){
  //         case "hisham":
  //             response = {
  //                 status: 'success',
  //                 data : {
  //                     username : "hisham",
  //                     cardcode : "C0000075"
  //                 }
  //             }
  //             setTimeout(() => {
  //                 resolve(response)
  //             }, 1000);
  //             break;
  //         case "ramzi":
  //             response = {
  //                 status: 'faild',
  //             }
  //             setTimeout(() => {
  //                 resolve(response)
  //             }, 1000);
  //             break;
  //         case "mamoun":
  //             setTimeout(() => {
  //                 reject(1)
  //             }, 1000);
  //             break;
  //         default:
  //             setTimeout(() => {
  //                 reject(2)
  //             }, 1000);
  //             break;
  //     }
  // })
};

const registerUser = async (username, password, cardcode, confirmPass) => {
  let data = { username, password, cardcode, confirmPass };
  return new Promise((resolve, reject) => {
    try {
      axios({
        baseURL,
        method: "post",
        url: "/register-supervisor-user",
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
  ////////////////////////// for testing only //////////////////////////
  //   return new Promise((resolve, reject) => {
  //     let response;
  //     switch (username) {
  //       case "hisham":
  //         response = {
  //           status: "success",
  //           data: {
  //             username: "hisham",
  //             cardcode: "C0000075",
  //           },
  //           msg: "nothing",
  //         };
  //         setTimeout(() => {
  //           resolve(response);
  //         }, 1000);
  //         break;
  //       case "ramzi":
  //         response = {
  //           status: "failed",
  //           msg: "username exists",
  //         };
  //         setTimeout(() => {
  //           resolve(response);
  //         }, 1000);
  //         break;
  //       case "mamoun":
  //         response = {
  //           status: "failed",
  //           msg: "confirmation password is wrong",
  //         };
  //         setTimeout(() => {
  //           resolve(response);
  //         }, 1000);
  //         break;
  //       case "abdallah":
  //         setTimeout(() => {
  //           reject(1);
  //         }, 1000);
  //         break;
  //       default:
  //         setTimeout(() => {
  //           reject(2);
  //         }, 1000);
  //         break;
  //     }
  //   });
};

const getOrders = async (cardcode) => {
  return new Promise((resolve, reject) => {
    try {
      axios({
        baseURL,
        method: "get",
        url: `/supervisor-orders/${cardcode}`,
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 30000,
      })
        .then((response) => {
          if (response.data.msg == "success") {
            const mappedResults = response.data.orders.map((rec) => {
              const arr = rec.Comments.split(",");
              return {
                APPNO: rec.APPNO,
                CardName: rec.CardName,
                DocTotal: rec.DocTotal,
                City: arr[0].split(":-")[1].split(":")[1],
                Phone: arr[1].split(":")[1],
                Name: arr[2].split(":")[1],
              };
            });
            const result = {
              status:"success",
              orders:mappedResults
            }
            resolve(result);
          } else {
            const result = {
              status:"failed",
            }
            resolve(result);
          }
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
  registerUser,
  getOrders,
};
