import { SendGet, SendPost } from '../utils/request';

export const loginWithEmail = async (email: string, password: string) => {
    return await SendPost(
        'auth/email',
        {
            'email': email,
            'password': password,
        },
    );
};

export const loginWithUsername = async (username: string, password: string) => {
    return await SendPost(
        'auth/username',
        {   
            'username': username,
            'password': password,
        },
    );
};
export const logup = async (name: string, username: string, password: string, mail: string) => {
    
}

export const verifyToken = async (token: string) => {
    return await SendGet(
        'auth/verify', token,
    );
};
