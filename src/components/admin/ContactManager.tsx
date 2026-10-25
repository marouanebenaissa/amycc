'use client'

import { useState } from 'react'
import Link from 'next/link'
import type { ContactConfig, ContactFormTopicConfig } from '@/lib/settings'
import { saveContactConfiguration } from '@/lib/actions/admin'

interface ContactManagerProps {
  initialConfig: ContactConfig
  defaultConfig?: ContactConfig
}

export function ContactManager({ initialConfig, defaultConfig }: ContactManagerProps) {
  const [config, setConfig] = useState<ContactConfig>(initialConfig)
  const [activeTab, setActiveTab] = useState<'channels' | 'hero' | 'topics' | 'social'>('channels')
  const [activeLangTab, setActiveLangTab] = useState<'ar' | 'fr' | 'en'>('ar')
  const [saving, setSaving] = useState(false)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)

  function updateHero(field: keyof ContactConfig['hero'], val: string) {
    setConfig((prev) => ({
      ...prev,
      hero: { ...prev.hero, [field]: val },
    }))
  }

  function updateChannel(field: keyof ContactConfig['channels'], val: string) {
    setConfig((prev) => ({
      ...prev,
      channels: { ...prev.channels, [field]: val },
    }))
  }

  function updateSocial(field: keyof ContactConfig['social'], val: string) {
    setConfig((prev) => ({
      ...prev,
      social: { ...prev.social, [field]: val },
    }))
  }

  function updateTopic(id: string, updates: Partial<ContactFormTopicConfig>) {
    setConfig((prev) => ({
      ...prev,
      formTopics: prev.formTopics.map((t) => (t.id === id ? { ...t, ...updates } : t)),
    }))
  }

  function addTopic() {
    const newId = `topic-${Date.now()}`
    const newTopic: ContactFormTopicConfig = {
      id: newId,
      labelAr: 'موضوع استفسار جديد',
      labelFr: 'Nouveau sujet de demande',
      labelEn: 'New inquiry subject',
    }
    setConfig((prev) => ({ ...prev, formTopics: [...prev.formTopics, newTopic] }))
  }

  function removeTopic(id: string) {
    if (config.formTopics.length <= 1) {
      alert('يجب الإبقاء على موضوع واحد على الأقل للاستمارة.')
      return
    }
    setConfig((prev) => ({
      ...prev,
      formTopics: prev.formTopics.filter((t) => t.id !== id),
    }))
  }

  function handleReset() {
    if (!defaultConfig) return
    if (confirm('هل ترغب حقاً في استعادة بيانات التواصل الافتراضية بالكامل؟')) {
      setConfig({ ...defaultConfig })
      setFeedback({
        type: 'success',
        message: 'تمت استعادة الإعدادات الافتراضية. اضغط على "حفظ كافة بيانات التواصل" لتثبيتها.',
      })
    }
  }

  async function handleSave() {
    setSaving(true)
    setFeedback(null)

    try {
      const res = await saveContactConfiguration(config)
      if (!res.success) {
        throw new Error(res.error || 'فشل حفظ الإعدادات')
      }

      setFeedback({
        type: 'success',
        message: 'تم حفظ كافة بيانات وصفحة اتصل بنا بنجاح! تم تحديث الموقع مباشرة.',
      })
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'تعذر حفظ الإعدادات'
      setFeedback({ type: 'error', message: msg })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      {/* Alert Banner */}
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
            className="text-xs opacity-60 hover:opacity-100"
          >
            ✕
          </button>
        </div>
      )}

      {/* Main CMS Sub-Navigation Tabs */}
      <div className="flex flex-wrap items-center gap-2 p-1.5 bg-white rounded-2xl border border-[#e5e0d6] shadow-2xs">
        <button
          type="button"
          onClick={() => setActiveTab('channels')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'channels'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>📞</span>
          <span>قنوات الاتصال والعناوين</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('hero')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'hero'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🖼️</span>
          <span>واجهة ورأس الصفحة (Hero)</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('topics')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'topics'
              ? 'bg-[#99620b] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>📋</span>
          <span>مواضيع الاستمارة ({config.formTopics.length})</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('social')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all cursor-pointer ${
            activeTab === 'social'
              ? 'bg-[#0d3b43] text-white shadow-xs'
              : 'text-[#445457] hover:text-[#08242a] hover:bg-[#faf7f2]'
          }`}
        >
          <span>🌐</span>
          <span>منصات التواصل الاجتماعي</span>
        </button>
      </div>

      {/* ============================================================
          TAB 1: OFFICIAL CHANNELS & ADDRESSES
          ============================================================ */}
      {activeTab === 'channels' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="border-b border-[#f0ebe1] pb-4">
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>📞</span>
              <span>قنوات الاتصال المباشرة ومقر الجمعية</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              إدارة عناوين البريد الرسمي، أرقام الهاتف والواتساب، والعنوان الجغرافي للمقر بمراكش وجهات المملكة.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Primary Email */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                البريد الإلكتروني الرسمي الأساسي (Primary Email) *
              </label>
              <input
                type="email"
                value={config.channels.primaryEmail}
                onChange={(e) => updateChannel('primaryEmail', e.target.value)}
                placeholder="contact@amycc.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Secondary Email */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                بريد الإدارة / المراسلات المؤسساتية (Secondary / Bureau Email)
              </label>
              <input
                type="email"
                value={config.channels.secondaryEmail ?? ''}
                onChange={(e) => updateChannel('secondaryEmail', e.target.value)}
                placeholder="direction@amycc.org"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Official Phone */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رقم الهاتف الرسمي (Official Phone) *
              </label>
              <input
                type="text"
                value={config.channels.phone}
                onChange={(e) => updateChannel('phone', e.target.value)}
                placeholder="+212 5 24 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* WhatsApp Number */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رقم الواتساب للتواصل السريع (WhatsApp Business)
              </label>
              <input
                type="text"
                value={config.channels.whatsapp ?? ''}
                onChange={(e) => updateChannel('whatsapp', e.target.value)}
                placeholder="+212 6 00 00 00 00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Address AR */}
            <div className="md:col-span-2">
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                العنوان الجغرافي للمقر (بالعربية) *
              </label>
              <input
                type="text"
                value={config.channels.addressAr}
                onChange={(e) => updateChannel('addressAr', e.target.value)}
                placeholder="شارع محمد السادس، جليز، مراكش، المملكة المغربية"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Address FR & EN */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                العنوان الجغرافي (Français)
              </label>
              <input
                type="text"
                value={config.channels.addressFr ?? ''}
                onChange={(e) => updateChannel('addressFr', e.target.value)}
                placeholder="Avenue Mohammed VI, Guéliz, Marrakech, Maroc"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                العنوان الجغرافي (English)
              </label>
              <input
                type="text"
                value={config.channels.addressEn ?? ''}
                onChange={(e) => updateChannel('addressEn', e.target.value)}
                placeholder="Mohammed VI Avenue, Gueliz, Marrakech, Morocco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Working Hours AR */}
            <div className="md:col-span-2">
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                أوقات وساعات العمل والاستقبال (بالعربية) *
              </label>
              <input
                type="text"
                value={config.channels.workingHoursAr}
                onChange={(e) => updateChannel('workingHoursAr', e.target.value)}
                placeholder="من الاثنين إلى الجمعة: 09:00 - 18:00 (السبت للورشات الميدانية)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Working Hours FR & EN */}
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                أوقات العمل (Français)
              </label>
              <input
                type="text"
                value={config.channels.workingHoursFr ?? ''}
                onChange={(e) => updateChannel('workingHoursFr', e.target.value)}
                placeholder="Du Lundi au Vendredi : 09h00 - 18h00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                أوقات العمل (English)
              </label>
              <input
                type="text"
                value={config.channels.workingHoursEn ?? ''}
                onChange={(e) => updateChannel('workingHoursEn', e.target.value)}
                placeholder="Monday to Friday: 09:00 - 18:00"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Response Time SLA */}
            <div className="md:col-span-2">
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                متوسط وقت الرد المتوقع (Response Time SLA)
              </label>
              <input
                type="text"
                value={config.channels.responseTimeAr}
                onChange={(e) => updateChannel('responseTimeAr', e.target.value)}
                placeholder="خلال 24 إلى 48 ساعة كحد أقصى (أيام العمل الرسمية)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            {/* Google Maps Link */}
            <div className="md:col-span-2">
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رابط خرائط Google المباشر (Google Maps URL)
              </label>
              <input
                type="url"
                value={config.channels.mapLinkUrl ?? ''}
                onChange={(e) => updateChannel('mapLinkUrl', e.target.value)}
                placeholder="https://maps.google.com/?q=Marrakech,Morocco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 2: HERO BANNER & HEADER
          ============================================================ */}
      {activeTab === 'hero' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ebe1] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
                <span>🖼️</span>
                <span>رأس وواجهة صفحة اتصل بنا (Hero Banner)</span>
              </h2>
              <p className="text-xs text-[#5f7174] mt-1">
                تخصيص الشارة، العنوان الكبير، والفقرة الترحيبية في واجهة الصفحة.
              </p>
            </div>

            {/* Language Switcher */}
            <div className="flex items-center gap-1.5 p-1 bg-[#faf7f2] rounded-xl border border-[#e5e0d6]">
              <button
                type="button"
                onClick={() => setActiveLangTab('ar')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeLangTab === 'ar'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'text-[#5f7174] hover:text-[#08242a]'
                }`}
              >
                العربية (AR)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('fr')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeLangTab === 'fr'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'text-[#5f7174] hover:text-[#08242a]'
                }`}
              >
                Français (FR)
              </button>
              <button
                type="button"
                onClick={() => setActiveLangTab('en')}
                className={`px-3 py-1.5 rounded-lg text-xs font-black transition-all cursor-pointer ${
                  activeLangTab === 'en'
                    ? 'bg-[#0d3b43] text-white shadow-xs'
                    : 'text-[#5f7174] hover:text-[#08242a]'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>

          {/* Trilingual Inputs */}
          <div className="space-y-4">
            {activeLangTab === 'ar' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      الوسم العلوي (Eyebrow Tag)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagAr ?? ''}
                      onChange={(e) => updateHero('tagAr', e.target.value)}
                      placeholder="بوابة التواصل والإنصات المؤسسي"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      شارة الاعتماد (Statutory Badge)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeAr ?? ''}
                      onChange={(e) => updateHero('badgeAr', e.target.value)}
                      placeholder="المملكة المغربية • جمعية روح الفنون والثقافة"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    العنوان الرئيسي (Headline Title)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleAr ?? ''}
                    onChange={(e) => updateHero('titleAr', e.target.value)}
                    placeholder="يسعدنا التواصل معكم وبناء جسور التعاون الثقافي والفني"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    الفقرة التقديمية (Description)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionAr ?? ''}
                    onChange={(e) => updateHero('descriptionAr', e.target.value)}
                    placeholder="فريق إدارة الجمعية ومكاتب التنسيق في خدمتكم..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'fr' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Tag Supérieur (Français)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagFr ?? ''}
                      onChange={(e) => updateHero('tagFr', e.target.value)}
                      placeholder="CANAL DE COMMUNICATION OFFICIEL"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Badge (Français)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeFr ?? ''}
                      onChange={(e) => updateHero('badgeFr', e.target.value)}
                      placeholder="Royaume du Maroc • AMYCC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Titre Principal (Français)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleFr ?? ''}
                    onChange={(e) => updateHero('titleFr', e.target.value)}
                    placeholder="Contactez-nous & Développons la Création Culturelle"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Description (Français)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionFr ?? ''}
                    onChange={(e) => updateHero('descriptionFr', e.target.value)}
                    placeholder="L'équipe de direction de l'AMYCC est à votre disposition..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </>
            )}

            {activeLangTab === 'en' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Eyebrow Tag (English)
                    </label>
                    <input
                      type="text"
                      value={config.hero.tagEn ?? ''}
                      onChange={(e) => updateHero('tagEn', e.target.value)}
                      placeholder="OFFICIAL CONTACT GATEWAY"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                  <div>
                    <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                      Badge (English)
                    </label>
                    <input
                      type="text"
                      value={config.hero.badgeEn ?? ''}
                      onChange={(e) => updateHero('badgeEn', e.target.value)}
                      placeholder="Kingdom of Morocco • AMYCC"
                      className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Headline Title (English)
                  </label>
                  <textarea
                    rows={2}
                    value={config.hero.titleEn ?? ''}
                    onChange={(e) => updateHero('titleEn', e.target.value)}
                    placeholder="Connect with Us & Co-Create Cultural Impact in Morocco"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>

                <div>
                  <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                    Description (English)
                  </label>
                  <textarea
                    rows={3}
                    value={config.hero.descriptionEn ?? ''}
                    onChange={(e) => updateHero('descriptionEn', e.target.value)}
                    placeholder="The AMYCC leadership team is at your disposal..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] focus:bg-white focus:outline-none focus:border-[#0d3b43]"
                  />
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 3: FORM TOPIC CATEGORIES
          ============================================================ */}
      {activeTab === 'topics' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f0ebe1] pb-4">
            <div>
              <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
                <span>📋</span>
                <span>مواضيع وتصنيفات استمارة المراسلة</span>
              </h2>
              <p className="text-xs text-[#5f7174] mt-1">
                تحديد الخيارات التي تظهر في القائمة المنسدلة لزوار الموقع عند إرسال رسالة تواصل.
              </p>
            </div>

            <button
              type="button"
              onClick={addTopic}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#99620b] hover:bg-[#805008] text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
            >
              <span>+</span>
              <span>إضافة موضوع جديد</span>
            </button>
          </div>

          <div className="space-y-3">
            {config.formTopics.map((topic, index) => (
              <div
                key={topic.id}
                className="p-4 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3 flex-1">
                  <span className="w-6 h-6 rounded-md bg-[#0d3b43]/10 text-[#0d3b43] font-bold text-2xs flex items-center justify-center shrink-0">
                    {index + 1}
                  </span>
                  <input
                    type="text"
                    value={topic.labelAr}
                    onChange={(e) => updateTopic(topic.id, { labelAr: e.target.value })}
                    placeholder="نص الموضوع بالعربية..."
                    className="flex-1 px-3 py-2 rounded-lg bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={topic.labelFr ?? ''}
                    onChange={(e) => updateTopic(topic.id, { labelFr: e.target.value })}
                    placeholder="Sujet (FR)..."
                    className="w-48 px-3 py-2 rounded-lg bg-white border border-[#e5e0d6] text-xs text-[#08242a]"
                  />
                  <button
                    type="button"
                    onClick={() => removeTopic(topic.id)}
                    className="px-2.5 py-2 rounded-lg text-rose-600 hover:bg-rose-50 text-xs font-bold transition-colors cursor-pointer"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ============================================================
          TAB 4: SOCIAL MEDIA CHANNELS
          ============================================================ */}
      {activeTab === 'social' && (
        <div className="p-6 sm:p-8 rounded-3xl bg-white border border-[#e5e0d6] shadow-subtle space-y-6">
          <div className="border-b border-[#f0ebe1] pb-4">
            <h2 className="text-xl font-black text-[#08242a] tracking-tight flex items-center gap-2">
              <span>🌐</span>
              <span>روابط الحسابات الرسمية على مواقع التواصل</span>
            </h2>
            <p className="text-xs text-[#5f7174] mt-1">
              يتم ربط هذه الروابط مباشرة في صفحة اتصل بنا وفي شريط الفوتر السفلي للموقع.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رابط صفحة فيسبوك (Facebook URL)
              </label>
              <input
                type="url"
                value={config.social.facebook ?? ''}
                onChange={(e) => updateSocial('facebook', e.target.value)}
                placeholder="https://facebook.com/amycc.morocco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رابط حساب إنستغرام (Instagram URL)
              </label>
              <input
                type="url"
                value={config.social.instagram ?? ''}
                onChange={(e) => updateSocial('instagram', e.target.value)}
                placeholder="https://instagram.com/amycc.morocco"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رابط حساب لينكد إن (LinkedIn URL)
              </label>
              <input
                type="url"
                value={config.social.linkedin ?? ''}
                onChange={(e) => updateSocial('linkedin', e.target.value)}
                placeholder="https://linkedin.com/company/amycc"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>

            <div>
              <label className="block text-2xs font-bold text-[#5f7174] uppercase tracking-wider mb-1">
                رابط قناة يوتيوب (YouTube Channel URL)
              </label>
              <input
                type="url"
                value={config.social.youtube ?? ''}
                onChange={(e) => updateSocial('youtube', e.target.value)}
                placeholder="https://youtube.com/@amycc"
                className="w-full px-3.5 py-2.5 rounded-xl bg-[#faf7f2] border border-[#e5e0d6] text-xs text-[#08242a] font-mono focus:bg-white focus:outline-none focus:border-[#0d3b43]"
              />
            </div>
          </div>
        </div>
      )}

      {/* Sticky Bottom Action Bar */}
      <div className="sticky bottom-4 z-20 p-4 rounded-2xl bg-white/95 backdrop-blur-md border border-[#e5e0d6] shadow-xl flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/ar/contact"
            target="_blank"
            className="px-3 py-1.5 rounded-xl bg-[#faf7f2] hover:bg-[#f0ebe1] text-xs font-bold text-[#0d3b43] border border-[#e5e0d6] transition-colors"
          >
            معاينة صفحة اتصل بنا ↗
          </Link>
          <button
            type="button"
            onClick={handleReset}
            className="text-xs text-[#819598] hover:text-[#c85a32] underline cursor-pointer"
          >
            استعادة الافتراضي
          </button>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0d3b43] hover:bg-[#08242a] text-white text-xs sm:text-sm font-black transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
        >
          <span>{saving ? '⏳' : '💾'}</span>
          <span>{saving ? 'جارٍ الحفظ...' : 'حفظ كافة بيانات التواصل'}</span>
        </button>
      </div>
    </div>
  )
}
