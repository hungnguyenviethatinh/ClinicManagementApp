import { GLOBALITEMS } from '../configs';

const IsAuthenticated = () => {
    const credential = JSON.parse(localStorage.getItem(GLOBALITEMS.CREDENTIAL));
    if (!credential) {
        return false;
    }
    
    return credential.IsLogined && new Date().getTime() < credential.ExpiredAt;
}

export default {
    IsAuthenticated
}
