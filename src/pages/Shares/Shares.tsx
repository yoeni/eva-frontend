import { useContext, useEffect, useState } from "react";
import { IShare, IState } from "../../reducer";
import { getCookie } from "../../utils/cookies";
import { useSelector } from "react-redux";
import {  Card, Flex, List } from "antd";
import './Shares.css';
import ShareComponent from "./components/shareComponent";
import { getAllShares } from "../../services/tradeServices";
import Search from "antd/es/input/Search";
import { WebsocketContext } from "../../utils/websocket-provider";
import { timeAgoFromString } from "../../utils/globalFuncs";
const Shares: React.FC = () => {
    const { socket } = useContext(WebsocketContext);
    const user = useSelector((state: IState) => state.user);
    const [shares, setShares] = useState<IShare[]>([]);
    const [filter, setFilter] = useState('');
    useEffect(() => {
        async function getShares() {
            const token = getCookie('token')
            if (token && user) {
              const response = await getAllShares(token);
              console.log(response);
              if (response.status === 200 && response.data?.result){
                setShares((response.data.result as IShare[]).sort((a, b) => a.symbol.localeCompare(b.symbol)));
              }
            }
        }
        getShares();
        
        if (!socket) {
            return
          }
          const startShareListener = (data: IShare[]) => {
            setShares(data.sort((a, b) => a.symbol.localeCompare(b.symbol)));
          }
          socket.on('shares', startShareListener);
            
    return () => {
        socket.off('shares');
      }
    }, [socket, user]);
    if (!user || shares.length === 0)
        return <Flex justify={'center'} align={'center'} style={{ height: '93vh', fontSize:'35px', color:'blue' }}>Shares loading...</Flex>
    else
        return(
            <>
                <Card title={"All Shares"} extra={"Last update: "+ timeAgoFromString(shares[0].updatedAt)} style={{  minHeight:'93vh', textTransform:'capitalize' }} >
                    <Search placeholder="input search text" allowClear onChange={(event) => {setFilter(event.target.value)}}  />
                    <List
                        className="demo-loadmore-list"
                        itemLayout="horizontal"
                        loading={!shares}
                        dataSource={shares.filter( share => share.symbol.toLowerCase().includes(filter.toLowerCase()))}
                        renderItem={(item: IShare) => (<ShareComponent share={item}/> )}
                    />
                </Card>
            </>
        );
}
export default Shares;