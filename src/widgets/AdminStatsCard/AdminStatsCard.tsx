import s from './AdminStatsCard.module.scss'

interface AdminStatsCardProps {
    name: string;
    statsNumber: number;
    icon: React.ReactNode;
}

export function AdminStatsCard({ name, statsNumber, icon }: AdminStatsCardProps) {
    return (
        <div className={s.adminStatsCard}>
            <div className={s.iconWrapper}>{icon}</div>
            <div className={s.info}>
                <span className={s.name}>{name}</span>
                <span className={s.statsNumber}>{statsNumber}</span>
            </div>
        </div>
    )
}