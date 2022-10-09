import AutoComplete from "../components/AutoComplete";
import StockList from "../components/StockList";
import stockKing from "../images/StockKing.png"
const StockOverviewPage = () => {
    return (
        <div>
            <div className="text-center">
                <img src={stockKing} style={{ width: "10rem" }} className="mt-5" alt="Stock King" />
            </div>
            <AutoComplete />
            <StockList />
        </div>
    )
}

export default StockOverviewPage;