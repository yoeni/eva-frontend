import { useCallback, useEffect, useState } from "react";
import { IShare, IState, ITrade, TradeType } from "../../reducer";
import { getCookie } from "../../utils/cookies";
import { useSelector } from "react-redux";
import {  Card, Flex, notification, Table, TableProps, Tag } from "antd";
import Search from "antd/es/input/Search";
import { timeAgoFromString } from "../../utils/globalFuncs";
import { getPortfoliioTrades, getUserPortfolio } from "../../services/portfolioServices";


const tradeCols: TableProps<ITrade>['columns'] = [
    {
      title: 'Share',
      key: 'share',
      dataIndex: 'share',
      render: (share: IShare) => (<Tag color={'blue'} >{share.symbol}</Tag>)
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Trade Price',
      dataIndex: 'tradePrice',
      key: 'tradePrice',
      render: (text) => <>{text}$</>,
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

const Trades: React.FC = () => {
    const [api, contextHolder] = notification.useNotification();
    const openNotification = useCallback((message: string, isError?: boolean) => {
        api[isError ? 'error' : 'success']({
          message: isError ? 'Error': 'Success',
          description: message,
          placement: 'top',
          
        });
      }, [api]);
    const user = useSelector((state: IState) => state.user);
    const [trades, setTrades] = useState<ITrade[]>([]);
    const [filter, setFilter] = useState('');
    useEffect(() => {
        async function getTrades() {
            const token = getCookie('token')
            if (token && user) {
                const pResponse = await getUserPortfolio(user.id, token);
                if (pResponse.status === 200 && pResponse.data?.result) {
                    const response = await getPortfoliioTrades(pResponse.data.result[0].id, token);
                    if (response.status === 200 && response.data?.result) {
                        setTrades(response.data.result);
                    } else {
                        openNotification('Cant get porfolio trades!', true);
                    }
                } else {
                    openNotification('Cant get porfolio!', true);
                }
            }
        }
        getTrades();
    }, [user, openNotification]);
    if (!user)
        return <Flex justify={'center'} align={'center'} style={{ height: '93vh', fontSize:'35px', color:'blue' }}>Cant get Trades...</Flex>
    else
        return(
            <>
                {contextHolder}
                <Card title={"All Trades"}  style={{  minHeight:'93vh', textTransform:'capitalize' }} >
                    <Search placeholder="input search text" allowClear onChange={(event) => {setFilter(event.target.value)}}  />
                    <Table columns={tradeCols} dataSource={trades.filter(trade => trade.share.symbol.toLowerCase().includes(filter.toLocaleLowerCase()))} style={{ width: '100%'}} pagination={false} rowKey={(row) => row.id}/>
                </Card>
            </>
        );
}
export default Trades;