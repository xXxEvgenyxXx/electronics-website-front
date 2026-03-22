import s from './UserData.module.scss'
import { UserOutlined } from "@ant-design/icons";
import { UserDataView } from './UserDataView/UserDataView';

export function UserData(){
    return (
        <div className={s.userDataWrapper}>
            <UserOutlined className={s.avatar}/>
            <UserDataView/>
        </div>
    )
}