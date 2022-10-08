import axios from "axios";

const TOKEN = "cd0g11qad3i3uigma8c0cd0g11qad3i3uigma8cg";

export default axios.create({
    baseURL: "https://finnhub.io/api/v1/",
    params: {
        token: TOKEN
    }
})