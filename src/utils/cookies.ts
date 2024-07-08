export const setCookie = (name: string, value: any, expirationDays: number) => {
    const date = new Date();
    date.setTime(date.getTime() + (expirationDays * 24 * 60 * 60 * 1000));
    const expires = 'expires=' + date.toUTCString();
  
    document.cookie = name + '=' + value + ';' + expires + ';path=/';
};

export const getCookie = (name: string) => {
    const cookieString = document.cookie;
    const cookies = cookieString.split(';');

    for (let i = 0; i < cookies.length; i++) {
        const cookie = cookies[i].trim();

        if (cookie.startsWith(name + '=')) {
            return cookie.substring(name.length + 1);
        }
    }

    return null;
};