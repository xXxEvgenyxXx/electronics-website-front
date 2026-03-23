// UserDataView.tsx
import s from './UserDataView.module.scss';

interface UserDataViewProps {
  data: {
    name: string;
    surname: string;
    patronymic?: string;
    login: string;
    email: string;
  };
}

export function UserDataView({ data }: UserDataViewProps) {
  return (
    <div className={s.userDataView}>
      <h1>{data.surname} {data.name} {data.patronymic}</h1>
      <h2>{data.login}</h2>
    </div>
  );
}