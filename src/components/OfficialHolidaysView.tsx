import React, { useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { OfficialHoliday } from '../types';
import { AppLanguage, getTranslation } from '../i18n/translations';
import { getCurrentDateString } from '../utils/formatters';

interface OfficialHolidaysViewProps {
  holidays: OfficialHoliday[];
  language?: AppLanguage;
  onAddHoliday: (holiday: Omit<OfficialHoliday, 'id'>) => void;
  onDeleteHoliday: (id: string) => void;
}

export const OfficialHolidaysView: React.FC<OfficialHolidaysViewProps> = ({
  holidays,
  language = 'ar',
  onAddHoliday,
  onDeleteHoliday,
}) => {
  const t = getTranslation(language);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const holidayName = name.trim();
    if (!holidayName || !date) return;

    onAddHoliday({ name: holidayName, date, notes: notes.trim() || undefined });
    setName('');
    setDate('');
    setNotes('');
  };

  const sortedHolidays = [...holidays].sort((a, b) => a.date.localeCompare(b.date));
  const today = getCurrentDateString();
  const locale = language === 'ar' ? 'ar-MA' : language === 'fr' ? 'fr-MA' : 'en';

  return (
    <section className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-white flex items-center gap-3">
          <CalendarDays className="w-6 h-6 text-amber-400" />
          {t.holidaysTitle}
        </h1>
        <p className="text-sm text-slate-400 mt-2">{t.holidaysDescription}</p>
      </header>

      <form
        onSubmit={handleSubmit}
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-3 bg-slate-850 border border-slate-800 rounded-2xl p-5"
      >
        <label className="space-y-2 text-xs font-semibold text-slate-300">
          <span>{t.holidayName}</span>
          <input
            required
            value={name}
            onChange={event => setName(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            placeholder={t.holidayName}
          />
        </label>
        <label className="space-y-2 text-xs font-semibold text-slate-300">
          <span>{t.holidayDate}</span>
          <input
            required
            type="date"
            value={date}
            onChange={event => setDate(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          />
        </label>
        <label className="space-y-2 text-xs font-semibold text-slate-300 md:col-span-2">
          <span>{t.holidayNotes}</span>
          <input
            value={notes}
            onChange={event => setNotes(event.target.value)}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
            placeholder={t.holidayNotes}
          />
        </label>
        <div className="md:col-span-2 xl:col-span-4 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-slate-950 transition-colors hover:bg-amber-400"
          >
            <Plus className="w-4 h-4" />
            {t.addHoliday}
          </button>
        </div>
      </form>

      {sortedHolidays.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-700 bg-slate-850/50 p-10 text-center text-sm text-slate-400">
          {t.noHolidays}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {sortedHolidays.map(holiday => {
            const isPast = holiday.date < today;
            return (
              <article
                key={holiday.id}
                className="flex items-start justify-between gap-4 rounded-2xl border border-slate-800 bg-slate-850 p-5"
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <CalendarDays className="w-4 h-4 shrink-0 text-amber-400" />
                    <h2 className="truncate font-bold text-white">{holiday.name}</h2>
                  </div>
                  <p className="mt-2 text-sm font-semibold text-amber-300" dir="ltr">
                    {new Intl.DateTimeFormat(locale, {
                      dateStyle: 'long',
                      timeZone: 'UTC',
                    }).format(new Date(`${holiday.date}T00:00:00Z`))}
                  </p>
                  {holiday.notes && (
                    <p className="mt-2 text-xs text-slate-400">{holiday.notes}</p>
                  )}
                  <span
                    className={`mt-3 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      isPast
                        ? 'bg-slate-700/60 text-slate-300'
                        : 'bg-emerald-500/10 text-emerald-300'
                    }`}
                  >
                    {isPast ? t.holidayPast : t.holidayUpcoming}
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onDeleteHoliday(holiday.id)}
                  title={t.deleteHoliday}
                  aria-label={`${t.deleteHoliday}: ${holiday.name}`}
                  className="rounded-lg p-2 text-slate-500 transition-colors hover:bg-rose-500/10 hover:text-rose-400"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
};
