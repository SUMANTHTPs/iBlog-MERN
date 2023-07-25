import { createContext, useState } from "react";

export const UserContext = createContext();

export const UserState = (props) => {
    const [userInfo, setUserInfo] = useState({});
    return (
        <UserContext.Provider value={{ userInfo, setUserInfo }}>
            {props.children}
        </UserContext.Provider>
    )
}