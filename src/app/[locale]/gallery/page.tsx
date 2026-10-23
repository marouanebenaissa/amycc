import { getDictionary } from '@/lib/i18n/dictionaries'
import { Header } from '@/components/layout/Header'
import { Footer } from '@/components/layout/Footer'

export default async function GalleryPage(props: { params: Promise<{ locale: string }> }) {
  const { locale } = await props.params
  const dict = await getDictionary(locale)

  return (
    <>
      <Header locale={locale} dict={dict} />
      <main id="main-content" className="flex-1 bg-white">
        <div className="bg-slate-50 border-b border-slate-100 py-16 text-center">
          <div className="max-w-4xl mx-auto px-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#0068ff]">AMYCC</span>
            <h1 className="text-3xl sm:text-5xl font-extrabold text-[#0a0f1d] mt-2 mb-4">
              {dict.gallery.title}
            </h1>
            <p className="text-base text-slate-600 max-w-xl mx-auto">
              {locale === 'ar'
                ? 'توثيق بصري للأنشطة الثقافية والورشات الفنية'
                : locale === 'fr'
                ? 'Documentation visuelle des activités culturelles et ateliers'
                : 'Visual documentation of cultural activities and workshops'}
            </p>
          </div>
        </div>

        <div className="max-w-5xl mx-auto px-4 py-20 text-center">
          <div className="p-12 rounded-2xl border border-slate-200/80 bg-slate-50/50">
            <div className="w-16 h-16 rounded-full bg-blue-50 text-[#0068ff] flex items-center justify-center text-2xl mx-auto mb-4">
              🖼️
            </div>
            <p className="text-sm text-slate-600 max-w-md mx-auto">
              {locale === 'ar'
                ? 'سيتم نشر الصور والتسجيلات المعتمدة للأنشطة والفعاليات بعد انطلاقها وتوثيقها رسمياً.'
                : 'Approved media from official association activities will be published here.'}
            </p>
          </div>
        </div>
      </main>
      <Footer locale={locale} dict={dict} />
    </>
  )
}
