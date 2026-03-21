import { MainLayout } from "@/widgets"
import s from './MainPage.module.scss'
import { CategoryCard, BrandCard } from "@/widgets"
import { categories, brands } from "@/shared"

export function MainPage(){
    return (
        <MainLayout>
            <div className={s.mainPageWrapper}>
                <h2>Популярные категории</h2>
                <div className={s.categoryCards}>
                    {categories.map((category) => (
                        <CategoryCard image={category.image} name={category.name}/>
                    ))}
                </div>
                <h2>Популярные бренды</h2>
                <div className={s.brandCards}>
                    {
                        brands.map((brand) => (
                            <BrandCard name={brand.name} image={brand.image} />
                        ))
                    }
                </div>
            </div>
        </MainLayout>
    )
}