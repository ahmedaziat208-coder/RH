import React, { useState } from 'react';
import { CalendarDays, Plus, Trash2 } from 'lucide-react';
import { OfficialHoliday } from '../types';
import { AppLanguage, getTranslation, TranslationDictionary } from '../i18n/translations';
import { getCurrentDateString } from '../utils/formatters';

type HolidayNameKey =
  | 'holidayNameNewYear'
  | 'holidayNameManifesto'
  | 'holidayNameAmazighNewYear'
  | 'holidayNameLabourDay'
  | 'holidayNameThroneDay'
  | 'holidayNameOuedEdDahab'
  | 'holidayNameRevolution'
  | 'holidayNameYouthDay'
  | 'holidayNameGreenMarch'
  | 'holidayNameIndependenceDay'
  | 'holidayNameIslamicNewYear'
  | 'holidayNameMawlid'
  | 'holidayNameEidAlFitr'
  | 'holidayNameEidAlAdha';

interface HolidayDefinition {
  month: number;
  day: number;
  nameKey: HolidayNameKey;
  category: NonNullable<OfficialHoliday['category']>;
}

type CalendarHoliday = Omit<OfficialHoliday, 'id'>;

const NATIONAL_HOLIDAYS: HolidayDefinition[] = [
  { month: 1, day: 1, nameKey: 'holidayNameNewYear', category: 'NATIONAL' },
  { month: 1, day: 11, nameKey: 'holidayNameManifesto', category: 'NATIONAL' },
  { month: 1, day: 14, nameKey: 'holidayNameAmazighNewYear', category: 'NATIONAL' },
  { month: 5, day: 1, nameKey: 'holidayNameLabourDay', category: 'NATIONAL' },
  { month: 7, day: 30, nameKey: 'holidayNameThroneDay', category: 'NATIONAL' },
  { month: 8, day: 14, nameKey: 'holidayNameOuedEdDahab', category: 'NATIONAL' },
  { month: 8, day: 20, nameKey: 'holidayNameRevolution', category: 'NATIONAL' },
  { month: 8, day: 21, nameKey: 'holidayNameYouthDay', category: 'NATIONAL' },
  { month: 11, day: 6, nameKey: 'holidayNameGreenMarch', category: 'NATIONAL' },
  { month: 11, day: 18, nameKey: 'holidayNameIndependenceDay', category: 'NATIONAL' },
];

const ISLAMIC_HOLIDAYS: Record<string, HolidayNameKey> = {
  '1-1': 'holidayNameIslamicNewYear',
  '3-12': 'holidayNameMawlid',
  '3-13': 'holidayNameMawlid',
  '10-1': 'holidayNameEidAlFitr',
  '10-2': 'holidayNameEidAlFitr',
  '12-10': 'holidayNameEidAlAdha',
  '12-11': 'holidayNameEidAlAdha',
};

function formatIsoDate(date: Date): string {
  return `${date.getUTCFullYear()}-${String(date.getUTCMonth() + 1).padStart(2, '0')}-${String(date.getUTCDate()).padStart(2, '0')}`;
}

function getAnnualHolidayCalendar(year: number, t: TranslationDictionary): CalendarHoliday[] {
  const nationalHolidays = NATIONAL_HOLIDAYS.map(holiday => ({
    name: t[holiday.nameKey],
    date: `${year}-${String(holiday.month).padStart(2, '0')}-${String(holiday.day).padStart(2, '0')}`,
    category: holiday.category,
  }));

  const islamicDateFormatter = new Intl.DateTimeFormat('en-US-u-ca-islamic-civil-nu-latn', {
    month: 'numeric',
    day: 'numeric',
    timeZone: 'UTC',
  });
  const start = new Date(Date.UTC(year, 0, 1));
  const end = new Date(Date.UTC(year + 1, 0, 1));
  const religiousHolidays: CalendarHoliday[] = [];

  for (const date = new Date(start); date < end; date.setUTCDate(date.getUTCDate() + 1)) {
    const parts = islamicDateFormatter.formatToParts(date);
    const month = Number(parts.find(part => part.type === 'month')?.value);
    const day = Number(parts.find(part => part.type === 'day')?.value);
    const nameKey = ISLAMIC_HOLIDAYS[`${month}-${day}`];
    if (nameKey) {
      religiousHolidays.push({
        name: t[nameKey],
        date: formatIsoDate(date),
        category: 'RELIGIOUS',
        notes: t.holidayCalendarNote,
      });
    }
  }

  return [...nationalHolidays, ...religiousHolidays].sort((a, b) => a.date.localeCompare(b.date));
}

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
  const [category, setCategory] = useState<OfficialHoliday['category'] | ''>('');
  const currentYear = Number(getCurrentDateString().slice(0, 4));
  const [yearInput, setYearInput] = useState(String(currentYear));
  const yearValue = Number(yearInput);
  const year = /^\d{4}$/.test(yearInput) && yearValue >= 1900 && yearValue <= 2200
    ? yearValue
    : currentYear;
  const annualHolidays = getAnnualHolidayCalendar(year, t);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const holidayName = name.trim();
    if (!holidayName || !date) return;

    onAddHoliday({
      name: holidayName,
      date,
      category: category || undefined,
      notes: notes.trim() || undefined,
    });
    setName('');
    setDate('');
    setNotes('');
    setCategory('');
  };

  const addCalendarHoliday = (holiday: CalendarHoliday) => {
    onAddHoliday(holiday);
  };

  const isHolidayAdded = (holiday: CalendarHoliday) =>
    holidays.some(saved => saved.date === holiday.date && saved.category === holiday.category);

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
        <label className="space-y-2 text-xs font-semibold text-slate-300">
          <span>{t.holidayCategory}</span>
          <select
            value={category}
            onChange={event => {
              const value = event.target.value;
              if (value === '' || value === 'NATIONAL' || value === 'RELIGIOUS') {
                setCategory(value);
              }
            }}
            className="w-full rounded-xl border border-slate-700 bg-slate-900 px-3 py-2.5 text-sm text-white outline-none focus:border-amber-500"
          >
            <option value="">{t.holidayCategoryOther}</option>
            <option value="NATIONAL">{t.holidayCategoryNational}</option>
            <option value="RELIGIOUS">{t.holidayCategoryReligious}</option>
          </select>
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

      <section className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-850">
        <div className="flex flex-col gap-3 border-b border-slate-800 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="font-bold text-white">{t.holidayCalendarTitle}</h2>
            <p className="mt-1 text-xs leading-relaxed text-amber-300/80">{t.holidayCalendarNote}</p>
          </div>
          <label className="flex shrink-0 items-center gap-2 text-sm font-semibold text-slate-300">
            <span>{t.holidayYear}</span>
            <input
              type="number"
              min="1900"
              max="2200"
              value={yearInput}
              onChange={event => {
                const value = event.target.value;
                if (value === '' || /^\d{1,4}$/.test(value)) setYearInput(value);
              }}
              className="w-24 rounded-xl border border-slate-700 bg-slate-900 px-3 py-2 text-center text-white outline-none focus:border-amber-500"
            />
          </label>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[620px] text-right text-sm">
            <thead className="bg-slate-900/70 text-xs text-slate-400">
              <tr>
                <th className="px-5 py-3 font-semibold">{t.holidayDate}</th>
                <th className="px-5 py-3 font-semibold">{t.holidayName}</th>
                <th className="px-5 py-3 font-semibold">{t.holidayCategory}</th>
                <th className="px-5 py-3 text-center font-semibold">{t.colActions}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {annualHolidays.map(holiday => {
                const alreadyAdded = isHolidayAdded(holiday);
                return (
                  <tr key={`${holiday.date}-${holiday.category}-${holiday.name}`} className="hover:bg-slate-800/40">
                    <td className="whitespace-nowrap px-5 py-3 text-amber-300" dir="ltr">
                      {new Intl.DateTimeFormat(locale, {
                        dateStyle: 'long',
                        timeZone: 'UTC',
                      }).format(new Date(`${holiday.date}T00:00:00Z`))}
                    </td>
                    <td className="px-5 py-3 font-semibold text-white">{holiday.name}</td>
                    <td className="px-5 py-3">
                      <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                        holiday.category === 'NATIONAL'
                          ? 'bg-sky-500/10 text-sky-300'
                          : 'bg-violet-500/10 text-violet-300'
                      }`}>
                        {holiday.category === 'NATIONAL' ? t.holidayCategoryNational : t.holidayCategoryReligious}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-center">
                      <button
                        type="button"
                        disabled={alreadyAdded}
                        onClick={() => addCalendarHoliday(holiday)}
                        className="inline-flex items-center gap-1.5 rounded-lg bg-amber-500/10 px-3 py-2 text-xs font-bold text-amber-300 transition-colors hover:bg-amber-500/20 disabled:cursor-default disabled:bg-emerald-500/10 disabled:text-emerald-300"
                      >
                        {alreadyAdded ? t.holidayAlreadyAdded : (
                          <>
                            <Plus className="h-3.5 w-3.5" />
                            {t.holidayAddToList}
                          </>
                        )}
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

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
                  {holiday.category && (
                    <span className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${
                      holiday.category === 'NATIONAL'
                        ? 'bg-sky-500/10 text-sky-300'
                        : 'bg-violet-500/10 text-violet-300'
                    }`}>
                      {holiday.category === 'NATIONAL' ? t.holidayCategoryNational : t.holidayCategoryReligious}
                    </span>
                  )}
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
