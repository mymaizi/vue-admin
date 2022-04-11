window.test = {
  instance: () => axios.create({
    baseURL: '',
    timeout: 1000
  }),
  get: () => {
    console.log("get请求", instance);
  }
}