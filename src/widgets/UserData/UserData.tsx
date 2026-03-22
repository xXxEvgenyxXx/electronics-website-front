import s from './UserData.module.scss'
import { UserOutlined } from "@ant-design/icons";
import { UserDataView } from './UserDataView/UserDataView';
import { Button } from 'antd';
import { EditOutlined, SaveOutlined, CloseOutlined } from '@ant-design/icons';
import { useState } from 'react';
import { UserDataEdit } from './UserDataEdit/UserDataEdit';

export function UserData(){

    const [isEditable, toggleProfileEditability] = useState(false);

    function handleClick(){
        toggleProfileEditability(!isEditable)
    }
    
    function handleSave(){
        handleClick()
    }

    return (
        <div className={s.userDataWrapper}>
            <UserOutlined className={s.avatar}/>
            {!isEditable && (
                <>
                    <UserDataView/>
                    <Button onClick={handleClick} icon={<EditOutlined/>}>Редактировать профиль</Button>
                </>
            )}
            {isEditable && (
                <>
                    <UserDataEdit/>
                    <div className={s.buttonsWrapper}>
                        <Button onClick={handleSave} icon={<SaveOutlined/>}>Сохранить</Button>
                        <Button onClick={handleClick} icon={<CloseOutlined/>}>Отмена</Button>
                    </div>
                </>
            )}
        </div>
    )
}