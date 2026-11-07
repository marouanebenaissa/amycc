'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { TeamConfig, TeamMetricCard } from '@/lib/settings'
import { saveTeamConfiguration } from '@/lib/actions/admin'
import { useAdminLocale } from './AdminLocaleContext'

const DEFAULT_METRICS: TeamMetricCard[] = [
  {
    id: 'roles',
    labelAr: 'المكتب التنفيذي المنتخب',
    labelFr: 'Bureau Exécutif Élu',
    labelEn: 'Elected Executive Board',
    valueAr: '6 مناصب قانونية',
    valueFr: '6 Postes Statutaires',
    valueEn: '6 Statutory Roles',
    descriptionAr: 'تسيير إداري ومالي مطابق لظهير تأسيس الجمعيات بالمغرب',
    descriptionFr: 'Direction administrative conforme au Dahir associatif marocain',
    descriptionEn: 'Administrative management governed by Moroccan non-profit law.',
    accentColor: 'black',
    order: 1,
  },
  {
    id: 'hubs',
    labelAr: 'اللجان الميدانية المتخصصة',
    labelFr: 'Commissions Thématiques',
    labelEn: 'Specialized Commissions',
    valueAr: '6 محاور وظيفية',
    valueFr: '6 Pôles d’Action',
    valueEn: '6 Functional Hubs',
    descriptionAr: 'الفنون التشكيلية، المسرح، الموسيقى، الإعلام، والتطوع والتكوين',
    descriptionFr: 'Arts visuels, théâtre, musique, médias, volontariat et formation',
    descriptionEn: 'Visual arts, theatre, music, media, volunteering, and training.',
    accentColor: 'red',
    order: 2,
  },
  {
    id: 'volunteering',
    labelAr: 'روح العمل الجمعوي',
    labelFr: 'Engagement Associatif',
    labelEn: 'Civic Dedication',
    valueAr: '100% تطوع مدني',
    valueFr: '100% Volontariat',
    valueEn: '100% Civic Service',
    descriptionAr: 'عطاء غير ربحي تحركه المسؤولية الأخلاقية والوطنية تجاه الشباب',
    descriptionFr: 'Engagement désintéressé guidé par la passion culturelle',
    descriptionEn: 'Non-profit dedication driven by cultural passion and civic mission.',
    accentColor: 'gold',
    order: 3,
  },
  {
    id: 'scope',
    labelAr: 'النطاق والمقر',
    labelFr: 'Siège & Rayonnement',
    labelEn: 'Headquarters & Scope',
    valueAr: 'مراكش • جهات المغرب',
    valueFr: 'Marrakech • Maroc',
    valueEn: 'Marrakech • Morocco',
    descriptionAr: 'انطلاق من مراكش الحمراء مع الانفتاح على كافة جهات المملكة',
    descriptionFr: 'Ancrage à Marrakech avec extension vers toutes les régions',
    descriptionEn: 'Grounded in Marrakech with phased expansion across all regions.',
    accentColor: 'black',
    order: 4,
  },
]

interface TeamMetricsManagerProps {
  initialConfig: TeamConfig
  defaultMetrics?: TeamMetricCard[]
}

const STRINGS = {
  ar: {
    title: 'إدارة بطاقات ومؤشرات الهيكلة المؤسسية (Capacity & Metrics Strip)',
    subtitle: 'تخصيص البطاقات الأربعة التي تظهر أسفل رأس صفحة فريق العمل والهيكلة، وتحديد عناوينها وقيمها وألوانها باللغات الثلاث.',
    previewSite: 'معاينة شريط البطاقات في الموقع ↗',
    saveBtn: 'حفظ بطاقات الهيكلة',
    savingBtn: 'جارٍ الحفظ...',
    addCardBtn: '+ إضافة بطاقة جديدة',
    livePreviewTitle: 'معاينة حية لشريط البطاقات (Live Simulation)',
    livePreviewHint: 'تظهر البطاقات بهذا الشكل التفاعلي تماماً في صفحة فريق العمل العامة وفق اللغة المختارة أعلاه.',
    langSelectorLabel: 'لغة التحرير والمعاينة:',
    colorLabel: 'اللون التمييزي للبطاقة:',
    colorBlack: 'داكن مؤسساتي (#231f20)',
    colorRed: 'أحمر مغربي (#bd3227)',
    colorGold: 'أصفر ذهبي (#d2a82b)',
    colorEmerald: 'أخضر زمردي (#047857)',
    colorBlue: 'أزرق كحلي (#1d4ed8)',
    labelField: 'العنوان التمهيدي الصغير (Top Label)',
    valueField: 'العنوان البارز / القيمة الرقمية (Big Headline)',
    descField: 'الوصف التوضيحي للبطاقة (Description)',
    cardNum: 'البطاقة',
    deleteCard: 'حذف البطاقة',
    moveUp: 'تحريك لأعلى',
    moveDown: 'تحريك لأسفل',
    saveSuccess: 'تم حفظ وتحديث بطاقات ومؤشرات الهيكلة بنجاح وتطبيقها في الموقع مباشرة!',
    saveError: 'تعذر حفظ البطاقات، يرجى المحاولة مرة أخرى.',
    confirmDelete: 'هل ترغب في حذف هذه البطاقة؟',
  },
  fr: {
    title: 'Bandeau des Indicateurs Institutionnels (Capacity & Metrics Strip)',
    subtitle: 'Personnalisation des 4 cartes d\'indicateurs sous l\'en-tête de la page Équipe (bureau, commissions, engagement, rayonnement).',
    previewSite: 'Voir le bandeau en direct ↗',
    saveBtn: 'Enregistrer les cartes',
    savingBtn: 'Enregistrement...',
    addCardBtn: '+ Ajouter une carte',
    livePreviewTitle: 'Aperçu en direct (Simulation)',
    livePreviewHint: 'Ces cartes s\'affichent exactement ainsi sur la page publique Équipe selon la langue sélectionnée.',
    langSelectorLabel: 'Langue d\'édition & aperçu :',
    colorLabel: 'Couleur d\'accentuation de la carte :',
    colorBlack: 'Sombre institutionnel (#231f20)',
    colorRed: 'Rouge marocain (#bd3227)',
    colorGold: 'Or ambré (#d2a82b)',
    colorEmerald: 'Vert émeraude (#047857)',
    colorBlue: 'Bleu royal (#1d4ed8)',
    labelField: 'Surtitre de la carte (Top Label)',
    valueField: 'Titre principal / Chiffre clé (Big Headline)',
    descField: 'Description explicative (Description)',
    cardNum: 'Carte',
    deleteCard: 'Supprimer',
    moveUp: 'Monter',
    moveDown: 'Descendre',
    saveSuccess: 'Indicateurs institutionnels enregistrés avec succès sur le site !',
    saveError: 'Erreur lors de l\'enregistrement des indicateurs.',
    confirmDelete: 'Voulez-vous supprimer cette carte ?',
  },
  en: {
    title: 'Institutional Capacity & Metrics Strip (4 Cards)',
    subtitle: 'Manage the 4 key indicator cards displayed below the hero header on the Team page (statutory roles, functional hubs, volunteering, scope).',
    previewSite: 'Preview Cards on Site ↗',
    saveBtn: 'Save Capacity Cards',
    savingBtn: 'Saving...',
    addCardBtn: '+ Add New Card',
    livePreviewTitle: 'Live Simulation Preview',
    livePreviewHint: 'These cards will render on the public Team page in the active selected language.',
    langSelectorLabel: 'Editing & Preview Language:',
    colorLabel: 'Card Accent Color:',
    colorBlack: 'Institutional Dark (#231f20)',
    colorRed: 'Moroccan Red (#bd3227)',
    colorGold: 'Golden Amber (#d2a82b)',
    colorEmerald: 'Emerald Green (#047857)',
    colorBlue: 'Royal Blue (#1d4ed8)',
    labelField: 'Card Top Label',
    valueField: 'Main Headline / Key Stat',
    descField: 'Card Description',
    cardNum: 'Card',
    deleteCard: 'Delete',
    moveUp: 'Move Up',
    moveDown: 'Move Down',
    saveSuccess: 'Institutional capacity cards saved and published successfully!',
    saveError: 'Failed to save cards, please try again.',
    confirmDelete: 'Are you sure you want to delete this card?',
  },
}

const COLOR_OPTIONS: { key: 'black' | 'red' | 'gold' | 'emerald' | 'blue'; labelKey: keyof typeof STRINGS.ar; colorHex: string; textColor: string; borderHover: string }[] = [
  { key: 'black', labelKey: 'colorBlack', colorHex: '#231f20', textColor: 'text-[#231f20]', borderHover: 'hover:border-[#231f20]/30' },
  { key: 'red', labelKey: 'colorRed', colorHex: '#bd3227', textColor: 'text-[#bd3227]', borderHover: 'hover:border-[#bd3227]/30' },
  { key: 'gold', labelKey: 'colorGold', colorHex: '#d2a82b', textColor: 'text-[#d2a82b]', borderHover: 'hover:border-[#d2a82b]/30' },
  { key: 'emerald', labelKey: 'colorEmerald', colorHex: '#047857', textColor: 'text-emerald-700', borderHover: 'hover:border-emerald-600/30' },
  { key: 'blue', labelKey: 'colorBlue', colorHex: '#1d4ed8', textColor: 'text-blue-700', borderHover: 'hover:border-blue-600/30' },
]

export function TeamMetricsManager({
  initialConfig,
  defaultMetrics = DEFAULT_METRICS,
}: TeamMetricsManagerProps) {
  const { locale, dir } = useAdminLocale()
  const tr = STRINGS[locale] || STRINGS.ar

  const [metrics, setMetrics] = useState<TeamMetricCard[]>(
    initialConfig.metrics && initialConfig.metrics.length > 0
      ? initialConfig.metrics
      : defaultMetrics
  )
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>(locale)
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function updateCard(index: number, field: keyof TeamMetricCard, val: string) {
    setMetrics((prev) => {
      const next = [...prev]
      if (next[index]) {
        next[index] = { ...next[index], [field]: val }
      }
      return next
    })
  }

  function handleAddCard() {
    const newCard: TeamMetricCard = {
      id: `metric-${Date.now()}`,
      labelAr: 'عنوان البطاقة',
      labelFr: 'Titre de la carte',
      labelEn: 'Card Title',
      valueAr: 'قيمة جديدة',
      valueFr: 'Nouvelle valeur',
      valueEn: 'New Value',
      descriptionAr: 'أدخل تفاصيل ووصف هذا المؤشر الهيكلي...',
      descriptionFr: 'Description de cet indicateur...',
      descriptionEn: 'Details and description for this indicator...',
      accentColor: 'red',
      order: metrics.length + 1,
    }
    setMetrics((prev) => [...prev, newCard])
  }

  function handleDeleteCard(index: number) {
    if (!confirm(tr.confirmDelete)) return
    setMetrics((prev) => prev.filter((_, idx) => idx !== index))
  }

  function handleMove(index: number, direction: 'up' | 'down') {
    const targetIdx = direction === 'up' ? index - 1 : index + 1
    if (targetIdx < 0 || targetIdx >= metrics.length) return
    setMetrics((prev) => {
      const next = [...prev]
      const temp = next[index]
      next[index] = next[targetIdx]
      next[targetIdx] = temp
      return next.map((c, idx) => ({ ...c, order: idx + 1 }))
    })
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const updatedConfig: TeamConfig = {
        ...initialConfig,
        metrics,
      }

      const res = await saveTeamConfiguration(updatedConfig)
      if (!res.success) {
        throw new Error(res.error || tr.saveError)
      }

      setFeedback({
        type: 'success',
        message: tr.saveSuccess,
      })
    } catch (err: unknown) {
      setFeedback({
        type: 'error',
        message: err instanceof Error ? err.message : tr.saveError,
      })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8" dir={dir}>
      {/* Top Banner Alert */}
      {feedback && (
        <div
          className={`p-4 rounded-2xl text-xs sm:text-sm font-bold flex items-center justify-between gap-3 shadow-xs transition-all ${
            feedback.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
              : 'bg-rose-50 text-rose-800 border border-rose-200'
          }`}
        >
          <div className="flex items-center gap-2">
            <span>{feedback.type === 'success' ? '✓' : '⚠'}</span>
            <span>{feedback.message}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedback(null)}
            className="text-xs opacity-70 hover:opacity-100 cursor-pointer"
          >
            ✕
          </button>
        </div>
      )}

      {/* Action Header Card */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 p-5 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#bd3227]/10 text-[#bd3227] flex items-center justify-center text-2xl shrink-0">
            📊
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-black text-[#231f20]">
              {tr.title}
            </h2>
            <p className="text-3xs sm:text-xs text-[#5C5A55] mt-0.5">
              {tr.subtitle}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 flex-wrap">
          <Link
            href={`/${locale}/team#metrics`}
            target="_blank"
            className="px-3.5 py-2 rounded-xl text-xs font-bold text-[#231f20] bg-[#FAF8F5] hover:bg-[#F4EFE6] border border-[#e5e0d6] transition-all flex items-center gap-1.5"
          >
            <span>{tr.previewSite}</span>
          </Link>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="px-6 py-2.5 rounded-xl bg-[#231f20] text-white text-xs sm:text-sm font-bold hover:bg-[#d2a82b] active:scale-98 transition-all shadow-md disabled:opacity-50 cursor-pointer flex items-center gap-2"
          >
            {saving ? (
              <>
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>{tr.savingBtn}</span>
              </>
            ) : (
              <>
                <span>💾</span>
                <span>{tr.saveBtn}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Language Switcher Sub-Bar for Live Simulation & Editing */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-2xl bg-white border border-[#e5e0d6] shadow-2xs">
        <div className="flex items-center gap-2 text-xs font-bold text-[#231f20]">
          <span>🌐</span>
          <span>{tr.langSelectorLabel}</span>
        </div>
        <div className="flex items-center gap-1.5 bg-[#FAF8F5] p-1 rounded-xl border border-[#e5e0d6] w-fit">
          {(['ar', 'fr', 'en'] as const).map((lang) => (
            <button
              key={lang}
              type="button"
              onClick={() => setActiveLangTab(lang)}
              className={`px-4 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                activeLangTab === lang
                  ? 'bg-[#231f20] text-white shadow-xs'
                  : 'text-[#5C5A55] hover:text-[#231f20]'
              }`}
            >
              {lang === 'ar' ? 'العربية (AR)' : lang === 'fr' ? 'Français (FR)' : 'English (EN)'}
            </button>
          ))}
        </div>
      </div>

      {/* ============================================================
          LIVE SIMULATION: 4 CARDS AS THEY APPEAR ON THE SITE
          ============================================================ */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#e5e0d6] pb-4">
          <div>
            <h3 className="text-sm font-black text-[#231f20] flex items-center gap-2">
              <span>👁️</span>
              <span>{tr.livePreviewTitle}</span>
            </h3>
            <p className="text-3xs sm:text-xs text-[#5C5A55] mt-0.5">
              {tr.livePreviewHint}
            </p>
          </div>
          <span className="text-3xs font-extrabold px-3 py-1 rounded-full bg-[#FAF8F5] border border-[#e5e0d6] text-[#bd3227]">
            {activeLangTab.toUpperCase()}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {metrics.map((card, idx) => {
            const cardLabel =
              activeLangTab === 'ar'
                ? card.labelAr
                : activeLangTab === 'fr'
                ? card.labelFr || card.labelAr
                : card.labelEn || card.labelAr

            const cardValue =
              activeLangTab === 'ar'
                ? card.valueAr
                : activeLangTab === 'fr'
                ? card.valueFr || card.valueAr
                : card.valueEn || card.valueAr

            const cardDesc =
              activeLangTab === 'ar'
                ? card.descriptionAr
                : activeLangTab === 'fr'
                ? card.descriptionFr || card.descriptionAr
                : card.descriptionEn || card.descriptionAr

            const colorOpt =
              COLOR_OPTIONS.find((c) => c.key === card.accentColor) || COLOR_OPTIONS[0]

            return (
              <div
                key={card.id || idx}
                className={`p-5 sm:p-6 rounded-3xl bg-[#FAF8F5] border border-[#e5e0d6] ${colorOpt.borderHover} transition-all text-center flex flex-col justify-between group shadow-2xs overflow-hidden relative`}
              >
                <span className="absolute top-3 end-3 text-4xs font-bold text-gray-400">
                  #{idx + 1}
                </span>
                <span className="text-xs font-bold text-[#5C5A55] block mb-1">
                  {cardLabel || '—'}
                </span>
                <div className="min-h-[3.25rem] flex items-center justify-center px-1">
                  <span
                    className={`text-lg sm:text-xl xl:text-2xl font-black ${colorOpt.textColor} group-hover:scale-105 transition-transform block text-center leading-tight`}
                  >
                    {cardValue || '—'}
                  </span>
                </div>
                <p className="text-xs text-[#5C5A55] leading-relaxed mt-2 text-balance">
                  {cardDesc || '—'}
                </p>
              </div>
            )
          })}
        </div>
      </div>

      {/* ============================================================
          CARD-BY-CARD FORM EDITORS
          ============================================================ */}
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-black text-[#231f20] flex items-center gap-2">
            <span>✏️</span>
            <span>تعديل محتوى وبيانات كل بطاقة بالتفصيل ({metrics.length})</span>
          </h3>

          <button
            type="button"
            onClick={handleAddCard}
            className="px-4 py-2 rounded-xl text-xs font-bold bg-[#FAF8F5] hover:bg-[#F4EFE6] text-[#231f20] border border-[#e5e0d6] transition-colors cursor-pointer"
          >
            {tr.addCardBtn}
          </button>
        </div>

        <div className="space-y-5">
          {metrics.map((card, index) => {
            return (
              <div
                key={card.id || index}
                className="p-6 rounded-3xl bg-white border border-[#e5e0d6] shadow-2xs space-y-5"
              >
                {/* Card Top Action Bar */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#e5e0d6] pb-3">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-[#231f20] text-white flex items-center justify-center font-black text-xs">
                      #{index + 1}
                    </span>
                    <span className="text-sm font-black text-[#231f20]">
                      {card.labelAr || `${tr.cardNum} ${index + 1}`}
                    </span>
                    <span className="text-xs font-extrabold text-[#bd3227]">
                      ({card.valueAr || 'بدون عنوان'})
                    </span>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'up')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#cfc7b9] text-[#5C5A55] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                      title={tr.moveUp}
                    >
                      ▲
                    </button>
                    <button
                      type="button"
                      disabled={index === metrics.length - 1}
                      onClick={() => handleMove(index, 'down')}
                      className="px-2.5 py-1 text-xs rounded-lg border border-[#cfc7b9] text-[#5C5A55] hover:bg-[#FAF8F5] disabled:opacity-30 cursor-pointer"
                      title={tr.moveDown}
                    >
                      ▼
                    </button>

                    {metrics.length > 1 && (
                      <button
                        type="button"
                        onClick={() => handleDeleteCard(index)}
                        className="px-3 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                      >
                        {tr.deleteCard}
                      </button>
                    )}
                  </div>
                </div>

                {/* Accent Color Selector */}
                <div className="space-y-2">
                  <label className="block text-3xs font-extrabold text-[#5C5A55] uppercase tracking-wider">
                    {tr.colorLabel}
                  </label>
                  <div className="flex flex-wrap items-center gap-2">
                    {COLOR_OPTIONS.map((opt) => {
                      const isSelected = (card.accentColor || 'black') === opt.key
                      return (
                        <button
                          key={opt.key}
                          type="button"
                          onClick={() => updateCard(index, 'accentColor', opt.key)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-2 border transition-all cursor-pointer ${
                            isSelected
                              ? 'bg-[#231f20] text-white border-[#231f20] shadow-xs'
                              : 'bg-white text-[#5C5A55] border-[#e5e0d6] hover:bg-[#FAF8F5]'
                          }`}
                        >
                          <span
                            className="w-3.5 h-3.5 rounded-full shrink-0 border border-white"
                            style={{ backgroundColor: opt.colorHex }}
                          />
                          <span>{tr[opt.labelKey]}</span>
                        </button>
                      )
                    })}
                  </div>
                </div>

                {/* Inputs for Current Selected Language */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                  {/* Label (Top small) */}
                  <div>
                    <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                      {tr.labelField} ({activeLangTab.toUpperCase()})
                    </label>
                    {activeLangTab === 'ar' ? (
                      <input
                        type="text"
                        value={card.labelAr}
                        onChange={(e) => updateCard(index, 'labelAr', e.target.value)}
                        placeholder="المكتب التنفيذي المنتخب"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white font-arabic"
                      />
                    ) : activeLangTab === 'fr' ? (
                      <input
                        type="text"
                        dir="ltr"
                        value={card.labelFr}
                        onChange={(e) => updateCard(index, 'labelFr', e.target.value)}
                        placeholder="Bureau Exécutif Élu"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans"
                      />
                    ) : (
                      <input
                        type="text"
                        dir="ltr"
                        value={card.labelEn}
                        onChange={(e) => updateCard(index, 'labelEn', e.target.value)}
                        placeholder="Elected Executive Board"
                        className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans"
                      />
                    )}
                  </div>

                  {/* Value / Headline (Big text) */}
                  <div>
                    <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                      {tr.valueField} ({activeLangTab.toUpperCase()})
                    </label>
                    {activeLangTab === 'ar' ? (
                      <input
                        type="text"
                        value={card.valueAr}
                        onChange={(e) => updateCard(index, 'valueAr', e.target.value)}
                        placeholder="6 مناصب قانونية"
                        className="w-full px-3.5 py-2 text-xs font-black rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white font-arabic text-[#bd3227]"
                      />
                    ) : activeLangTab === 'fr' ? (
                      <input
                        type="text"
                        dir="ltr"
                        value={card.valueFr}
                        onChange={(e) => updateCard(index, 'valueFr', e.target.value)}
                        placeholder="6 Postes Statutaires"
                        className="w-full px-3.5 py-2 text-xs font-black rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans text-[#bd3227]"
                      />
                    ) : (
                      <input
                        type="text"
                        dir="ltr"
                        value={card.valueEn}
                        onChange={(e) => updateCard(index, 'valueEn', e.target.value)}
                        placeholder="6 Statutory Roles"
                        className="w-full px-3.5 py-2 text-xs font-black rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans text-[#bd3227]"
                      />
                    )}
                  </div>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-3xs font-bold text-[#5C5A55] mb-1">
                    {tr.descField} ({activeLangTab.toUpperCase()})
                  </label>
                  {activeLangTab === 'ar' ? (
                    <textarea
                      rows={2}
                      value={card.descriptionAr}
                      onChange={(e) => updateCard(index, 'descriptionAr', e.target.value)}
                      placeholder="تسيير إداري ومالي مطابق لظهير تأسيس الجمعيات بالمغرب..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white font-arabic leading-relaxed"
                    />
                  ) : activeLangTab === 'fr' ? (
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={card.descriptionFr}
                      onChange={(e) => updateCard(index, 'descriptionFr', e.target.value)}
                      placeholder="Direction administrative conforme au Dahir associatif marocain..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans leading-relaxed"
                    />
                  ) : (
                    <textarea
                      rows={2}
                      dir="ltr"
                      value={card.descriptionEn}
                      onChange={(e) => updateCard(index, 'descriptionEn', e.target.value)}
                      placeholder="Administrative management governed by Moroccan non-profit law..."
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#e5e0d6] outline-none focus:border-[#231f20] bg-white text-left font-sans leading-relaxed"
                    />
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
