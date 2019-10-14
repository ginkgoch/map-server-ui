import { Requests } from "./shared/Requests";

export class UsersService {
    static async signup(user) {
        const response = await Requests.post('/users/signup', user);
        if (response.status === 200) {
            return response.data;
        }
        else {
            throw new Error('User not registered. ' + response.data);
        }
    }
}