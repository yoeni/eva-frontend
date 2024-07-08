import { useEffect, useState } from "react";
import { IPortfolio, IPortfolioShare, IState } from "../../reducer";
import { getCookie } from "../../utils/cookies";
import { getUserPortfolio } from "../../services/portfolioServices";
import {  useSelector } from "react-redux";
import { Card, Divider, List } from "antd";
import './Dashboard.css';
import PortfolioShare from "./components/PortfolioShares";
import Search from "antd/es/input/Search";

const Dashboard: React.FC = () => {
    const user = useSelector((state: IState) => state.user);
    const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
    const [value, setValue] = useState(0);
    const [filter, setFilter] = useState('');
    useEffect(() => {
        async function getPortfolio() {
            const token = getCookie('token')
            if (token && user) {
              const response = await getUserPortfolio(user.id, token);
              if (response.status === 200 && response.data?.result){
                setPortfolio(response.data.result[0]);
              }
            }
        }
        getPortfolio();
        
        
    }, [user]);

    useEffect(() => {
        let total = 0;
        portfolio?.portfolioShares.forEach(pShare => {
            total += pShare.quantity * pShare.share.price;
        })
        setValue(total);
    }, [portfolio])

    if (!user)
        return <>Cant get portfolio!</>
    else
        return(
            <>
                <Card title={user.username + "'s Portfolio"} extra={<>Total Value: {value.toFixed(2)}$ <Divider type="vertical" /><a href="/Trades">Trades</a></>} style={{ minHeight:'93vh', textTransform:'capitalize' }} >
                <Search placeholder="input search text" allowClear onChange={(event) => {setFilter(event.target.value)}}  />
                <List
                    className="demo-loadmore-list"
                    itemLayout="horizontal"
                    loading={!portfolio}
                    dataSource={portfolio?.portfolioShares.filter(pShare => pShare.share.symbol.toLowerCase().includes(filter.toLocaleLowerCase()))}
                    renderItem={(item: IPortfolioShare) => (<PortfolioShare portfolioShare={item}/> )}
                />
                </Card>
            </>
        );
}
export default Dashboard;