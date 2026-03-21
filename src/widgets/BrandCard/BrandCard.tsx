import s from './BrandCard.module.scss'

interface BrandCardProps {
    name: string;
    image:string;
}

export function BrandCard(props: BrandCardProps){
    return (
        <div className={s.brandCard}>
            <img className={s.brandImage} src={props.image} alt={props.name} />
        </div>
    )
}