import { SendDelete, SendGet, SendPost, SendPut } from '../utils/request';

export const registerUser = async (username: string, email: string, password: string,) => {
    return await SendPost(
        'user/signup',
        {
            username,
            email,
            password
        },
    );
};
export const getUserById = async (id: string, token: string) =>{
    return await SendGet(
        'user/id/' + id,
        token,
    );
};
export const getUserByUsername = async (username: string, token: string) =>{
    return await SendGet(
        'user/username/' + username,
        token,
    );
};

export const getAllUsers = async (token: string) =>{
    return await SendGet(
        'users',
        token,
    );
};
export const updateUserPassword = async (id: string, oldPassword: string, newPassword:string, token: string) => {
    return await SendPut(
        'user/updatepassword',
        {
            id: id,
            oldPassword: oldPassword,
            newPassword: newPassword,
        },
        token,
    );
};
export const deleteUser = async (id:string, token: string) => {
    return await SendDelete(
        'user/id/'+id,{},
        token,
    );
};
