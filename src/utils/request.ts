import axios from 'axios';
import { config } from './config';
interface ResponseData {
    success: boolean;
    message?: string;
    result?: any;
}
interface Response {
    data?: ResponseData;
    headers?: any;
    status: number;
}
export const SendPost = async (page: string, data: any, token: string | undefined = undefined): Promise<Response> => {
    let headers: any = { 'Content-Type': 'application/json' };
    if (token)
        headers =  { 'Content-Type': 'application/json', 'x-auth-token': token };
    
    try {
        const response = await axios({
            method: 'post',
            headers: headers,
            url: config.api_url + page,
            data: data,
        });
        return response;
    } catch (error: any) {
        console.error(error.response);
        return error.response;
    }
};

export const SendGet = async (page: string, token: string | undefined = undefined): Promise<Response> => {
    let headers: any = { 'Content-Type': 'application/json' };
    if (token)
        headers =  { 'Content-Type': 'application/json', 'x-auth-token': token };
    try {
        const response = await axios({
            method: 'get',
            headers: headers,
            url: config.api_url + page,
        });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        console.error(error);
        return { status: 404 };
    }
};
export const SendPut = async (page: string, data: any, token: string | undefined = undefined): Promise<Response> => {
    let headers: any = { 'Content-Type': 'application/json' };
    if (token)
        headers =  { 'Content-Type': 'application/json', 'x-auth-token': token };
    try {
        const response = await axios({
            method: 'put',
            headers: headers,
            url: config.api_url + page,
            data: data,
        });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        console.error(error);
        return { status: 404 };
    }
};

export const SendDelete = async (page: string, data: any, token: string | undefined = undefined): Promise<Response> => {
    let headers: any = { 'Content-Type': 'application/json' };
    if (token)
        headers =  { 'Content-Type': 'application/json', 'x-auth-token': token };
    try {
        const response = await axios({
            method: 'delete',
            headers: headers,
            url: config.api_url + page,
            data: data,
        });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        console.error(error);
        return { status: 404 };
    }
};

export const SendAuth = async () => {
    const headers =  { 
        'Content-Type': 'application/json', 
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': config.api_url,
        'Access-Control-Allow-Headers': true,
    };
    
    try {
        const response = await axios({
            method: 'get',
            headers: headers,
            url: config.api_url + 'auth/google/success',
        });
        return { data: response.data, headers: response.headers, status: response.status };
    } catch (error: any) {
        return { status: 404 };
    }
};