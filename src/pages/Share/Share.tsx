import { useCallback, useContext, useEffect, useState } from "react";
import { IPortfolio, IShare, IState, ITrade, TradeType } from "../../reducer";
import { getCookie } from "../../utils/cookies";
import { getUserPortfolio, makeTrade } from "../../services/portfolioServices";
import { useSelector } from "react-redux";
import { Button, Card, Flex, InputNumber, Layout,  notification, Table, TableProps, Tag } from "antd";
import './Share.css';
import { getShareTrades } from "../../services/tradeServices";
import { useLocation, useSearchParams } from "react-router-dom";
import { WebsocketContext } from "../../utils/websocket-provider";
import { Header, Content, Footer } from "antd/es/layout/layout";
import { timeAgoFromString } from "../../utils/globalFuncs";
import Chart from 'react-apexcharts';
import { ApexOptions } from "apexcharts";

const chartOptions: ApexOptions = {
    chart: {
        height: 350,
        type: 'area'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth'
    },
    tooltip: {
        x: {
            format: 'dd/MM/yy HH:mm'
        },
    },
};
const tradeCols: TableProps<ITrade>['columns'] = [
    {
        title: 'Portfolio Id',
        dataIndex: 'portfolioId',
        key: 'portfolioId',
        render: (text) => <a>{text}</a>,
    },
    {
      title: 'Trade Price',
      dataIndex: 'tradePrice',
      key: 'tradePrice',
      render: (text) => <>{text}$</>,
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Type',
      key: 'tradeType',
      dataIndex: 'tradeType',
      render: (type: TradeType) => (
        type === TradeType.buy ? <Tag color={'green'} >BUY</Tag> : <Tag color={'red'} >SELL</Tag> 
      ),
    },
    {
      title: 'Time',
      dataIndex: 'tradeTime',
      key: 'tradeTime',
      render: (text) => timeAgoFromString(text),
    },
];

const Share: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = useCallback((message: string, isError?: boolean) => {
        api[isError ? 'error' : 'success']({
          message: isError ? 'Error': 'Success',
          description: message,
          placement: 'top',
          
        });
      }, [api]);
    const [searchParameters] = useSearchParams();
    const paramId = searchParameters.get('symbol');
    const user = useSelector((state: IState) => state.user);
    const { socket } = useContext(WebsocketContext);
    const [share, setShare] = useState<IShare | undefined>(undefined);
    const [portfolio, setPortfolio] = useState<IPortfolio | null>(null);
    const [prices, setPrices] = useState<number[]>([]);
    const [priceDates, setPriceDates] = useState<string[]>([]);
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const shareSymbol = queryParams.get('symbol');
    const [quantity, setQuantity] = useState(1);
    const [trades, setTrades] = useState<ITrade[]>([]);
    
    const getPortfolio = async () =>  {
        const token = getCookie('token')
        if (token && user) {
          const response = await getUserPortfolio(user.id, token);
          if (response.status === 200 && response.data?.result){
            setPortfolio(response.data.result[0]);
          }
        }
    }
    useEffect(() => {
        
        getPortfolio();
    }, []);
    useEffect(() => {
        async function getTrades(id: string) {
            const token = getCookie('token');
            if (token) {
                const response = await getShareTrades(id, token);
                if (response.data?.success && response.data.result) 
                    setTrades(response.data.result.slice(0, 10));
            }
        }
        if (share)
            getTrades(share.id);
    }, [share])

    useEffect(() => {
        if (!socket) {
            return
          }
          const startShareListener = (data: IShare[]) => {
            const newShare = data.find(share => share.symbol === paramId);
            if (newShare) {
                setShare(newShare);
                
                setPrices(prevPrices => { if (prevPrices.length >= 30) prevPrices.shift(); return  [...prevPrices, newShare.price]; });
                setPriceDates(prevDates => { if (prevDates.length >= 30) prevDates.shift(); return  [...prevDates, (new Date()).toISOString()]; });
            }
          }
          socket.on('shares', startShareListener);
          
    return () => {
        socket.off('shares');
      }
    }, [shareSymbol]);
    const tradeAction = async (type: TradeType) => {
        const token = getCookie('token');
        console.log(portfolio, quantity);
        if (token && user && portfolio && share) {
            if (type === TradeType.sell) {
                const inPortFolio = portfolio.portfolioShares.find(pShare => pShare.shareId === share.id && Number(pShare.quantity) >= quantity);
                if (!inPortFolio)
                    openNotification('Too much then your portfolio!', true);
                return;
            }
            const respone = await makeTrade(portfolio.id, share.id, type,quantity, share.price,token);
            if (respone.status === 200)
                openNotification('Successfully');
            getPortfolio();
            return;
        }
        openNotification('An error occured!', true);
    }


    if (!share)
        return <Flex justify={'center'} align={'center'} style={{ height: '93vh', fontSize:'35px', color:'blue' }}>Share info loading...</Flex>
    else
        return(
            <>
                {contextHolder}
                <Card title={"Buy/Sell " + share.symbol} extra={"Last Update: "+timeAgoFromString(share.updatedAt)} style={{  minHeight:'93vh', textTransform:'capitalize' }} >
                <Layout className="shareContent">
                    <Header className="header">
                        <div className="shareTitle">{share.symbol}</div>
                        <div className="sharePrice">{share.price}$</div>
                    </Header>
                    <Content className="graph">
                    <Chart options={{...chartOptions,...{ xaxis: { type: 'datetime', categories: priceDates}}}} series={[{
                        name: share.symbol,
                        data: prices
                        }]}  type="area" height={500}/>
                    </Content>
                    <Footer className="footer" >
                        <div className="quantityBar">
                            <InputNumber  className="quantity" disabled={!user} size="large" min={1} max={100000} defaultValue={quantity} onChange={(event) => setQuantity(event || 1)} />
                            <div className="totalActionPrice">{(quantity*share.price).toFixed(2)}$</div>
                        </div>
                        <div className="buttons">
                            <Button type="primary" className="buyBtn" disabled={!user} onClick={() => tradeAction(TradeType.buy)}>Buy</Button>
                            <Button type="primary" danger className="sellBtn" disabled={!user} onClick={() => tradeAction(TradeType.sell)}>Sell</Button>
                        </div>
                        Last Trades:
                        <div className="trades">
                            <Table columns={tradeCols} dataSource={trades} style={{ width: '100%'}} pagination={false} rowKey={(row) => row.id}/>
                        </div>
                    </Footer>
                </Layout>
                </Card>
            </>
        );
}
export default Share;