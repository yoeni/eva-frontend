import React, { useEffect, useState } from "react";
import {
  DesktopOutlined,
  LogoutOutlined,
  PieChartOutlined,
  ProfileFilled,
} from "@ant-design/icons";
import { Flex, MenuProps } from "antd";
import { Button, Layout, Menu, theme } from "antd";
import { useNavigate } from "react-router-dom";
import { getCookie, setCookie } from "../utils/cookies";
import { useDispatch, useSelector } from "react-redux";
import { verifyToken } from "../services/authServices";
import { IState } from "../reducer";
import './Layout.css';
import { WebsocketProvider } from "../utils/websocket-provider";

interface pageLayoutProps {
  children: JSX.Element;
  title: string;
  data?: any;
  requireAuth?: boolean;
}


const { Header, Content, Footer, Sider } = Layout;

type MenuItem = Required<MenuProps>["items"][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[]
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
  } as MenuItem;
}

const getMenuItems = () => {
  const items: MenuItem[] = [
    getItem("Portfolio", "/dashboard", <PieChartOutlined />),
    getItem("Trades", "/Trades", <PieChartOutlined />),
    getItem("Shares", "/Shares", <DesktopOutlined />)
  ];


  return items;
};

const ContentLayout = (props: pageLayoutProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userSelector = useSelector((state: IState) => state.user);
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();


  useEffect(() => {
    setCurrentPath(window.location.pathname);
  }, [])


  useEffect(() => {
    async function loginCheck() {
      const token = getCookie('token');
      if (props.requireAuth && !token) {
        navigate('/sign-in');
      }
      if (token && userSelector === undefined) {

        const verifiedState = await verifyToken(token);
        if (verifiedState.status === 200 && verifiedState.data) {
          dispatch({ type: 'setUser', payload: verifiedState.data.result });

          setComp(props.children);
        } else
          navigate('/sign-in');
      } else {
        setComp(props.children);
      }
    }
    loginCheck();
  }, [dispatch, navigate, currentPath,props, userSelector]);

  const signOut = () => {
    setCookie('token', undefined, 1); 
    dispatch({ type: 'setUser', payload: undefined });
    navigate('/sign-in');
  }
  const [comp, setComp] = useState(<Flex justify={'center'} align={'center'} style={{ height: '93vh', fontWeight:'bolder', fontSize:'50px', color:'blue' }}>LOADING..</Flex>);
  return (
    <main>
      <Layout style={{ height: '100vh'}}>
        <Header style={{ display: "flex", alignItems: "center", justifyContent:'space-between' }}>
          <div className="demo-logo" style={{ fontFamily: 'Agency Fb', fontSize: '35px', color: 'white' }}>Eva</div>
            <div className="layoutPageTile">
              {props.title}
            </div>
          <div >
            <Button type="primary" danger style={{ float: 'right' }} onClick={signOut}><LogoutOutlined /></Button>
            <Button style={{ float: 'right', marginRight: '5px' }} ><ProfileFilled />{userSelector?.username}</Button>
          </div>
        </Header>
        <Content>
          <Layout
            style={{
              padding: "0px 0",
              background: colorBgContainer,
              borderRadius: borderRadiusLG,
              height: '100%',
            }}
          >
            <Sider
              collapsible
              collapsed={collapsed}
              onCollapse={(value) => setCollapsed(value)}
            >
              <Menu
                theme="dark"
                defaultSelectedKeys={['/' + currentPath]}
                mode="inline"
                items={getMenuItems()}
                onClick={(e) => { navigate(e.key) }}
              />
            </Sider>
            <Content
              style={{
                overflowY: 'auto',
              }}
            >
              <div style={{ width: '100%'}}>
              <WebsocketProvider>{comp}</WebsocketProvider>
              </div>
              <Footer style={{ textAlign: "center" }}>
                Created by Sezer YILDIRIM
              </Footer>
            </Content>
          </Layout>
        </Content>
      </Layout>
    </main>
  );
};

export default ContentLayout;
