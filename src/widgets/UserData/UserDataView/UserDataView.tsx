import s from './UserDataView.module.scss'

export function UserDataView(){
    const user = JSON.parse(localStorage.getItem('user')!);
    return (
        <div className={s.userDataView}>
            <h1>{user.surname} {user.name} {user.patronymic}</h1>
            <h2>{user.login}</h2>
        </div>
    )
}