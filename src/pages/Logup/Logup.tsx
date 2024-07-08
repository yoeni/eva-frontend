import React, { useCallback, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Form, Input, notification } from 'antd';
import './Logup.css';
import { registerUser } from '../../services/userServices';

interface LogupProps {}

const Logup: React.FC<LogupProps> = () => {
    const navigate = useNavigate();
    const [api, contextHolder] = notification.useNotification();
    const openNotification = useCallback((message: string, isError?: boolean) => {
        api[isError ? 'error' : 'success']({
          message: isError ? 'Error': 'Success',
          description: message,
          placement: 'top',
          
        });
      }, [api]);



    const onFinish = async (values: any) => {
        console.log(values)
        if (
            values.username && 
            values.password &&
            values.passwordAgain &&
            values.password === values.passwordAgain &&
            values.mail) {
                console.log ('trying');
                const state = await registerUser(values.username, values.mail, values.password)
                if (state.status === 200)
                    openNotification('Successfully registered!');
                    return;
            }
        
        openNotification('An error occured!', true);
    };

    const onFinishFailed = (errorInfo: any) => {
        console.log('Failed:', errorInfo);
    };

    type FieldType = {
        username?: string;
        password?: string;
        passwordAgain?: string;
        mail?: string;

    };

    return (
        <div className='login-container'>
            {contextHolder}
            <div className='logo-title'>Eva</div>
            <Form
                name="basic"
                labelCol={{ span: 8 }}
                wrapperCol={{ span: 16 }}
                style={{ maxWidth: 600 }}
                initialValues={{ remember: true }}
                onFinish={onFinish}
                onFinishFailed={onFinishFailed}
                autoComplete="off"
            >
                <Form.Item<FieldType>
                    label="Username"
                    name="username"
                    rules={[{ required: true, message: 'Please input your username!' }]}
                >
                    <Input />
                </Form.Item>

                <Form.Item<FieldType>
                    label="Password"
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="Password Again"
                    name="passwordAgain"
                    rules={[{ required: true, message: 'Please input your password again!' }]}
                >
                    <Input.Password />
                </Form.Item>
                <Form.Item<FieldType>
                    label="E-mail"
                    name="mail"
                    rules={[{ required: true, message: 'Please input your mail!' }]}
                >
                    <Input type='mail' />
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
                    <Button type="primary" htmlType="submit">
                        Sign Up
                    </Button>
                    <Button type='link' onClick={() => navigate('/sign-in')}>Already have?</Button>
                </Form.Item>
            </Form>
        </div>
    );
};

export default Logup;
