import { useState, useEffect, useContext } from "react";
import finnHub from "../apis/finnHub";
import { BsFillCaretDownFill, BsFillCaretUpFill } from "react-icons/bs";
import { WatchListContext } from "../context/watchListContext";
import { useNavigate } from "react-router-dom";

const StockList = () => {
    const [stock, setStock] = useState([]);
    const { watchList, deleteStock } = useContext(WatchListContext);
    const navigate = useNavigate();

    const changeColor = (change) => {
        return change > 0 ? "success" : "danger";
    }

    const renderIcon = (change) => {
        return change > 0 ? <BsFillCaretUpFill /> : <BsFillCaretDownFill />;
    }

    const handleStockSelect = (symbol) => {
        navigate(`detail/${symbol}`);
    }

    useEffect(() => {
        let isMounted = true;
        const fetchData = async () => {
            try {
                const responses = await Promise.all(watchList.map((company) => {
                    return finnHub.get("/quote", {
                        params: {
                            symbol: company
                        }
                    })
                }))

                const data = responses.map((response) => {
                    return {
                        data: response.data,
                        symbol: response.config.params.symbol
                    }
                })

                if (isMounted) {
                    setStock(data);
                }
            } catch (error) {

            }
        }
        fetchData();

        return () => (isMounted = false);
    }, [watchList])

    return (
        <div>
            <table className="table hover mt-5">
                <thead style={{ color: "rgb(79, 89, 102)" }}>
                    <tr>
                        <th scope="col">Name</th>
                        <th scope="col">Last</th>
                        <th scope="col">Chg</th>
                        <th scope="col">Chg%</th>
                        <th scope="col">High</th>
                        <th scope="col">Low</th>
                        <th scope="col">Open</th>
                        <th scope="col">Pclose</th>
                        <th scope="col">Operation</th>
                    </tr>
                </thead>
                <tbody>
                    {
                        stock.map((stockData) => {
                            return (
                                <tr
                                    key={stockData.symbol}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => handleStockSelect(stockData.symbol)}
                                >
                                    <th scope="row">{stockData.symbol}</th>
                                    <td>{stockData.data.c}</td>
                                    <td className={`text-${changeColor(stockData.data.d)}`}>{stockData.data.d} {renderIcon(stockData.data.d)}</td>
                                    <td className={`text-${changeColor(stockData.data.dp)}`}>{stockData.data.dp} {renderIcon(stockData.data.dp)}</td>
                                    <td>{stockData.data.h}</td>
                                    <td>{stockData.data.l}</td>
                                    <td>{stockData.data.o}</td>
                                    <td>{stockData.data.pc}</td>
                                    <td>
                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                deleteStock(stockData.symbol)
                                            }}
                                        >
                                            Remove
                                        </button>
                                    </td>
                                </tr>
                            )
                        })
                    }
                </tbody>
            </table>
        </div>
    )
}

export default StockList;