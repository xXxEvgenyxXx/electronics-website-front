import s from './CategoryCard.module.scss'

interface CategoryCardProps {
    name: string;
    image: string
}

export function CategoryCard(props: CategoryCardProps){
    return (
        <div className={s.categoryCard}>
            <img className={s.image} src={props.image} alt={props.name}/>
            <p className={s.name}>{props.name}</p>
        </div>
    )
}