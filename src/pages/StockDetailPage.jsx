import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import finnHub from "../apis/finnHub";
import { StockChart } from "../components/StockChart";
import { StockInfo } from "../components/StockInfo";

const StockDetailPage = () => {
    const { symbol } = useParams(); // get params in the url
    const [chartData, setChartData] = useState();

    const formateData = (data) => {
        return data.t.map((el, index) => {
            return {
                x: el * 1000,
                y: data.c[index]
            }
        })
    }

    useEffect(() => {
        const fetchData = async () => {
            const date = new Date();
            const currentTime = Math.floor(date.getTime() / 1000);
            const oneDay = 24 * 60 * 60;

            let oneDayAgo = currentTime - oneDay;;
            if (date.getDay() === 6) {
                oneDayAgo = currentTime - 2 * oneDay;
            } else if (date.getDay() === 0) {
                oneDayAgo = currentTime - 3 * oneDay;
            }
            const oneWeekAgo = currentTime - 7 * oneDay;
            const oneYearAgo = currentTime - 365 * oneDay;

            try {
                const responses = await Promise.all([
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneDayAgo,
                            to: currentTime,
                            resolution: 30
                        }
                    }),
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneWeekAgo,
                            to: currentTime,
                            resolution: 60
                        }
                    }),
                    finnHub.get("/stock/candle", {
                        params: {
                            symbol,
                            from: oneYearAgo,
                            to: currentTime,
                            resolution: "W"
                        }
                    })
                ]);

                setChartData({
                    day: formateData(responses[0].data),
                    week: formateData(responses[1].data),
                    year: formateData(responses[2].data)
                })
            } catch (error) {

            }
        }

        fetchData();
    }, [symbol])
    return (
        <div>
            {
                chartData && <div>
                    <StockChart chartData={chartData} symbol={symbol} />
                    <StockInfo symbol={symbol} />
                </div>
            }
        </div>
    )
}

export default StockDetailPage;