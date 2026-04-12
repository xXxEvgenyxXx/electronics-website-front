import { AdminLayout, AdminStatsCard } from "@/widgets";
import { useAdminStats } from "@/shared";
import s from './AdminPanelPage.module.scss';

export function AdminPanelPage() {
  const { stats, loading, error } = useAdminStats();

  return (
    <AdminLayout>
      <div className={s.stats}>
        <h1>Статистика</h1>
        <div className={s.statsWrapper}>
          {!loading && !error && stats.map((stat, idx) => (
            <AdminStatsCard
              key={idx}
              name={stat.name}
              icon={<stat.icon />}
              statsNumber={stat.statsNumber!}
            />
          ))}
        </div>
      </div>
    </AdminLayout>
  );
}