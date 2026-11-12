import './global.css';
import React, { useMemo, useState } from 'react';
import {
  Calendar as CalendarIcon,
  List,
  Search,
  Moon,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  Palmtree,
  Filter,
  X,
  Maximize2,
} from 'lucide-react';
import { DAYS_SHORT, HOLIDAYS_2027, MONTHS, SINHALA_MONTHS, TYPE_META } from './src/holidays';

const FILTERS = [
  { id: 'ALL', label: 'All Holidays (25)' },
  { id: 'B', label: 'Bank (B)' },
  { id: 'P', label: 'Public (P)' },
  { id: 'M', label: 'Mercantile (M)' },
  { id: 'POYA', label: 'Poya Days' },
  { id: 'WEEKDAYS', label: 'Weekdays Only' },
];

function TypeBadge({ type, size = 'md' }) {
  const config = TYPE_META[type];
  if (!config) return null;

  if (size === 'cell') {
    return (
      <span className={`inline-flex items-center justify-center px-1.5 py-0.5 text-[10px] sm:text-[11px] font-extrabold rounded border ${config.cell}`}>
        {type}
      </span>
    );
  }

  if (size === 'xs') {
    return (
      <span className={`inline-flex items-center justify-center px-2 py-0.5 text-xs font-extrabold rounded-md border ${config.soft}`}>
        {type}
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 text-xs sm:text-sm font-bold rounded-full border ${config.soft}`}>
      <span className={`w-2 h-2 rounded-full ${config.dot}`} />
      <span>{config.label}</span>
    </span>
  );
}

function cellTone(holiday, isWeekend) {
  if (holiday?.types.includes('M')) {
    return 'bg-purple-50 border-2 border-purple-600 text-purple-950 shadow-sm';
  }
  if (holiday?.isPoya) {
    return 'bg-amber-50 border-2 border-amber-500 text-amber-950 shadow-sm';
  }
  if (holiday) {
    return 'bg-emerald-50 border-2 border-emerald-600 text-emerald-950 shadow-sm';
  }
  if (isWeekend) {
    return 'bg-blue-50 border border-blue-200 text-blue-950';
  }
  return 'bg-white border border-slate-200 text-slate-900';
}

export default function App() {
  const [viewMode, setViewMode] = useState('calendar');
  const [calendarSubMode, setCalendarSubMode] = useState('all12');
  const [focusedMonth, setFocusedMonth] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [selectedMonth, setSelectedMonth] = useState('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDateModal, setSelectedDateModal] = useState(null);
  const [showSinhala, setShowSinhala] = useState(true);

  const holidayByDate = useMemo(() => {
    const map = {};
    HOLIDAYS_2027.forEach((holiday) => {
      map[holiday.date] = holiday;
    });
    return map;
  }, []);

  const stats = useMemo(() => ({
    bankCount: HOLIDAYS_2027.filter((holiday) => holiday.types.includes('B')).length,
    publicCount: HOLIDAYS_2027.filter((holiday) => holiday.types.includes('P')).length,
    mercantileCount: HOLIDAYS_2027.filter((holiday) => holiday.types.includes('M')).length,
    poyaCount: HOLIDAYS_2027.filter((holiday) => holiday.isPoya).length,
    longWeekends: HOLIDAYS_2027.filter((holiday) => holiday.dayOfWeek === 'Friday' || holiday.dayOfWeek === 'Monday'),
  }), []);

  const filteredHolidays = useMemo(() => {
    return HOLIDAYS_2027.filter((holiday) => {
      if (selectedCategory === 'B' && !holiday.types.includes('B')) return false;
      if (selectedCategory === 'P' && !holiday.types.includes('P')) return false;
      if (selectedCategory === 'M' && !holiday.types.includes('M')) return false;
      if (selectedCategory === 'POYA' && !holiday.isPoya) return false;
      if (selectedCategory === 'WEEKDAYS' && (holiday.dayOfWeek === 'Saturday' || holiday.dayOfWeek === 'Sunday')) return false;
      if (selectedMonth !== 'ALL' && holiday.month !== Number(selectedMonth)) return false;
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        return (
          holiday.name.toLowerCase().includes(query) ||
          holiday.sinhalaName.toLowerCase().includes(query) ||
          holiday.shortName.toLowerCase().includes(query) ||
          MONTHS[holiday.month].toLowerCase().includes(query) ||
          holiday.dayOfWeek.toLowerCase().includes(query) ||
          holiday.date.includes(query)
        );
      }
      return true;
    });
  }, [selectedCategory, selectedMonth, searchQuery]);

  const getMonthGrid = (monthIndex) => {
    const firstDay = new Date(2027, monthIndex, 1).getDay();
    const daysInMonth = new Date(2027, monthIndex + 1, 0).getDate();
    const days = Array.from({ length: firstDay }, () => null);
    for (let day = 1; day <= daysInMonth; day += 1) {
      const dateStr = `2027-${String(monthIndex + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayOfWeekIndex = new Date(2027, monthIndex, day).getDay();
      days.push({
        day,
        dateStr,
        dayOfWeekIndex,
        isWeekend: dayOfWeekIndex === 0 || dayOfWeekIndex === 6,
        holiday: holidayByDate[dateStr] || null,
      });
    }
    return days;
  };

  const openDay = (cell, monthIndex) => {
    if (cell.holiday) {
      setSelectedDateModal(cell.holiday);
      return;
    }
    if (cell.isWeekend) {
      setSelectedDateModal({
        date: cell.dateStr,
        day: cell.day,
        month: monthIndex,
        dayOfWeek: cell.dayOfWeekIndex === 0 ? 'Sunday' : 'Saturday',
        name: 'Weekend Bank Holiday',
        sinhalaName: 'සති අන්ත බැංකු නිවාඩු දිනය',
        types: ['B'],
        isPoya: false,
        isWeekendOnly: true,
      });
    }
  };

  const tabs = [
    { id: 'calendar', label: 'Calendar Grid (කැලැන්ඩරය)', icon: CalendarIcon },
    { id: 'list', label: 'All Holidays List (සියලු නිවාඩු)', icon: List },
    { id: 'long-weekends', label: 'Long Weekends & Planning', icon: Palmtree },
  ];

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <header className="bg-gradient-to-r from-amber-900 via-red-900 to-amber-950 text-white shadow-lg">
        <div className="mx-auto max-w-7xl px-4 py-5 sm:px-6 lg:px-8">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/20 px-3 py-1 text-xs font-extrabold uppercase text-amber-200">
                <Sparkles className="h-3.5 w-3.5" />
                ශ්‍රී ලංකා නිවාඩු දින දර්ශනය 2027
              </div>
              <h1 className="text-2xl font-black tracking-tight sm:text-3xl">Sri Lanka 2027 Official Holiday Calendar</h1>
              <p className="mt-1 text-xs font-medium text-amber-100 sm:text-sm">
                සියලුම සෙනසුරාදා සහ ඉරිදා දිනයන් බැංකු නිවාඩු (B) ලෙස සැලකේ. All Saturdays and Sundays are Bank Holidays.
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button
                type="button"
                onClick={() => setShowSinhala((value) => !value)}
                className="rounded-xl border border-white/20 bg-white/10 px-3.5 py-2 text-xs font-bold"
              >
                {showSinhala ? 'සිංහල භාෂාව (ON)' : 'English Only'}
              </button>
              <div className="rounded-xl bg-amber-400 px-3.5 py-2 text-xs font-black text-slate-950 shadow">25 Official Holidays</div>
            </div>
          </div>

          <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-amber-800/60 pt-4">
            <div className="flex flex-wrap gap-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const active = viewMode === tab.id;
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setViewMode(tab.id)}
                    className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-extrabold sm:text-sm ${
                      active ? 'bg-amber-400 text-slate-950 shadow' : 'bg-amber-950/60 text-amber-100 hover:bg-amber-900/70'
                    }`}
                  >
                    <Icon className="h-4 w-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>
            <div className="hidden items-center gap-3 text-xs font-bold text-amber-200 xl:flex">
              <span>{stats.bankCount} Bank</span>
              <span>{stats.publicCount} Public</span>
              <span>{stats.mercantileCount} Mercantile</span>
              <span>{stats.poyaCount} Poyas</span>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-7xl space-y-6 px-4 py-8 sm:px-6 lg:px-8">
        {viewMode === 'list' && (
          <section className="space-y-4">
            <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <div className="flex flex-col items-center justify-between gap-3 lg:flex-row">
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <input
                    value={searchQuery}
                    onChange={(event) => setSearchQuery(event.target.value)}
                    placeholder="Search holidays (Vesak, New Year, Poya)..."
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-16 text-sm font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  {searchQuery ? (
                    <button type="button" onClick={() => setSearchQuery('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">
                      Clear
                    </button>
                  ) : null}
                </div>
                <div className="flex w-full items-center gap-2 lg:w-auto">
                  <Filter className="h-4 w-4 shrink-0 text-slate-500" />
                  <select
                    value={selectedMonth}
                    onChange={(event) => setSelectedMonth(event.target.value)}
                    className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="ALL">All Months (සියලු මාස)</option>
                    {MONTHS.map((month, index) => (
                      <option key={month} value={index}>{month} ({SINHALA_MONTHS[index]})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex flex-wrap items-center gap-2 border-t border-slate-100 pt-3">
                <span className="mr-1 text-xs font-extrabold uppercase text-slate-400">Filter:</span>
                {FILTERS.map((filter) => (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => setSelectedCategory(filter.id)}
                    className={`rounded-xl px-3.5 py-1.5 text-xs font-bold ${
                      selectedCategory === filter.id ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {filter.label}
                  </button>
                ))}
              </div>
            </div>

            {filteredHolidays.length === 0 ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center">
                <p className="font-bold text-slate-500">No holidays found matching your filter.</p>
                <button
                  type="button"
                  onClick={() => {
                    setSelectedCategory('ALL');
                    setSelectedMonth('ALL');
                    setSearchQuery('');
                  }}
                  className="mt-3 rounded-xl bg-slate-900 px-4 py-2 text-xs font-bold text-white"
                >
                  Reset Filters
                </button>
              </div>
            ) : (
              filteredHolidays.map((holiday) => (
                <button
                  key={holiday.id}
                  type="button"
                  onClick={() => setSelectedDateModal(holiday)}
                  className="flex w-full flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:shadow-md sm:flex-row sm:items-center sm:p-5"
                >
                  <div className="flex items-center gap-4">
                    <div className="flex h-14 w-14 shrink-0 flex-col items-center justify-center rounded-2xl bg-slate-900 text-white">
                      <span className="text-base font-black leading-none">{String(holiday.day).padStart(2, '0')}</span>
                      <span className="mt-1 text-[10px] font-extrabold uppercase text-amber-300">{MONTHS[holiday.month].slice(0, 3)}</span>
                    </div>
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <span className="rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-extrabold uppercase text-amber-900">{holiday.dayOfWeek}</span>
                        {holiday.isPoya ? (
                          <span className="inline-flex items-center gap-1 rounded-full border border-amber-200 bg-amber-50 px-2 py-0.5 text-xs font-extrabold text-amber-700">
                            <Moon className="h-3 w-3 fill-amber-500" /> Full Moon Poya
                          </span>
                        ) : null}
                      </div>
                      <h3 className="text-base font-black text-slate-900 sm:text-lg">{holiday.name}</h3>
                      {showSinhala ? <p className="text-sm font-semibold text-slate-600">{holiday.sinhalaName}</p> : null}
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {holiday.types.map((type) => <TypeBadge key={type} type={type} />)}
                  </div>
                </button>
              ))
            )}
          </section>
        )}

        {viewMode === 'calendar' && (
          <section className="space-y-6">
            <div className="flex flex-col items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:flex-row">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-extrabold uppercase text-slate-500">View Layout:</span>
                <button
                  type="button"
                  onClick={() => setCalendarSubMode('all12')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold ${calendarSubMode === 'all12' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'}`}
                >
                  All 12 Months Grid
                </button>
                <button
                  type="button"
                  onClick={() => setCalendarSubMode('single')}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-extrabold ${calendarSubMode === 'single' ? 'bg-amber-500 text-slate-950' : 'bg-slate-100 text-slate-600'}`}
                >
                  Extra-Large Month View
                </button>
              </div>
              <p className="text-xs font-bold text-slate-500">Click on any day box to inspect holiday details</p>
            </div>

            {calendarSubMode === 'single' ? (
              <MonthCard
                monthIndex={focusedMonth}
                days={getMonthGrid(focusedMonth)}
                showSinhala={showSinhala}
                large
                onOpenDay={openDay}
                onPrev={() => setFocusedMonth((month) => (month === 0 ? 11 : month - 1))}
                onNext={() => setFocusedMonth((month) => (month === 11 ? 0 : month + 1))}
              />
            ) : (
              <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                {MONTHS.map((monthName, monthIndex) => (
                  <MonthCard
                    key={monthName}
                    monthIndex={monthIndex}
                    days={getMonthGrid(monthIndex)}
                    showSinhala={showSinhala}
                    onOpenDay={openDay}
                    onExpand={() => {
                      setFocusedMonth(monthIndex);
                      setCalendarSubMode('single');
                    }}
                  />
                ))}
              </div>
            )}
          </section>
        )}

        {viewMode === 'long-weekends' && (
          <section className="space-y-6">
            <div className="rounded-2xl bg-gradient-to-r from-rose-600 to-amber-600 p-6 text-white shadow-md">
              <div className="inline-flex items-center gap-1.5 rounded-full bg-white/20 px-3 py-1 text-xs font-bold uppercase">
                <Sparkles className="h-3.5 w-3.5" /> 2027 Vacation & Leave Planner
              </div>
              <h2 className="mt-2 text-2xl font-extrabold">Long Weekends in 2027</h2>
              <p className="mt-1 text-sm text-rose-100">
                {stats.longWeekends.length} official holidays fall on a Friday or Monday. April New Year and the Vesak days add longer festive stretches.
              </p>
            </div>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {stats.longWeekends.map((holiday) => (
                <button
                  key={holiday.id}
                  type="button"
                  onClick={() => setSelectedDateModal(holiday)}
                  className="flex flex-col justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm hover:shadow-md"
                >
                  <div>
                    <div className="mb-2 flex items-center justify-between gap-2">
                      <span className="rounded-full bg-emerald-100 px-2.5 py-1 text-xs font-bold uppercase text-emerald-800">
                        3-Day Weekend ({holiday.dayOfWeek === 'Friday' ? 'Fri – Sun' : 'Sat – Mon'})
                      </span>
                      <span className="text-xs font-semibold text-slate-400">{MONTHS[holiday.month]}</span>
                    </div>
                    <h3 className="text-base font-bold text-slate-900">{holiday.name}</h3>
                    {showSinhala ? <p className="mt-1 text-xs text-slate-500">{holiday.sinhalaName}</p> : null}
                  </div>
                  <div className="flex items-center justify-between border-t border-slate-100 pt-3">
                    <span className="text-xs font-bold text-slate-700">{holiday.day} {MONTHS[holiday.month]} ({holiday.dayOfWeek})</span>
                    <span className="flex gap-1">
                      {holiday.types.map((type) => <TypeBadge key={type} type={type} size="xs" />)}
                    </span>
                  </div>
                </button>
              ))}
            </div>
          </section>
        )}
      </main>

      {selectedDateModal ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 p-4" onClick={() => setSelectedDateModal(null)}>
          <div className="w-full max-w-md space-y-5 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl" onClick={(event) => event.stopPropagation()}>
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="flex h-14 w-14 flex-col items-center justify-center rounded-2xl border border-amber-300 bg-amber-100 font-extrabold text-amber-950">
                  <span className="text-[10px] uppercase">{MONTHS[selectedDateModal.month].slice(0, 3)}</span>
                  <span className="text-xl leading-none">{selectedDateModal.day}</span>
                </div>
                <div>
                  <p className="text-xs font-bold uppercase text-amber-700">
                    {selectedDateModal.dayOfWeek}, {selectedDateModal.day} {MONTHS[selectedDateModal.month]} 2027
                  </p>
                  <h3 className="text-lg font-extrabold leading-snug text-slate-900">{selectedDateModal.name}</h3>
                  {showSinhala ? <p className="mt-0.5 text-xs text-slate-600">{selectedDateModal.sinhalaName}</p> : null}
                </div>
              </div>
              <button type="button" onClick={() => setSelectedDateModal(null)} className="rounded-full bg-slate-100 p-1.5 text-slate-500">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-xs font-bold uppercase text-slate-400">Holiday Status Breakdown</p>
              {['B', 'P', 'M'].map((type) => {
                const yes = selectedDateModal.types?.includes(type);
                return (
                  <div key={type} className="flex items-center justify-between text-sm">
                    <span className="flex items-center gap-2 font-semibold text-slate-700">
                      <span className={`flex h-5 w-5 items-center justify-center rounded text-xs font-bold text-white ${TYPE_META[type].dot}`}>{type}</span>
                      {TYPE_META[type].label} ({TYPE_META[type].sinhala})
                    </span>
                    {yes ? (
                      <span className="flex items-center gap-1 font-bold text-emerald-600"><CheckCircle2 className="h-4 w-4" /> Yes</span>
                    ) : (
                      <span className="font-semibold text-slate-400">No</span>
                    )}
                  </div>
                );
              })}
            </div>
            <button type="button" onClick={() => setSelectedDateModal(null)} className="w-full rounded-xl bg-slate-900 py-2.5 text-sm font-bold text-white">
              Close Details
            </button>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function MonthCard({ monthIndex, days, showSinhala, large = false, onOpenDay, onExpand, onPrev, onNext }) {
  const holidays = HOLIDAYS_2027.filter((holiday) => holiday.month === monthIndex);
  return (
    <article className={`overflow-hidden rounded-3xl border-2 border-slate-200 bg-white shadow-sm ${large ? 'border-slate-300 shadow-lg' : ''}`}>
      <div className="flex items-center justify-between gap-3 bg-slate-900 px-5 py-4 text-white">
        {onPrev ? (
          <button type="button" onClick={onPrev} className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-extrabold">
            <ChevronLeft className="h-4 w-4" /> Previous
          </button>
        ) : null}
        <div className={onPrev ? 'text-center' : 'text-left'}>
          <h3 className="text-lg font-extrabold tracking-tight sm:text-xl">{MONTHS[monthIndex]} 2027</h3>
          {showSinhala ? <p className="text-sm font-semibold text-amber-300">{SINHALA_MONTHS[monthIndex]}</p> : null}
        </div>
        <div className="flex items-center gap-2">
          {onNext ? (
            <button type="button" onClick={onNext} className="flex items-center gap-1 rounded-xl bg-white/10 px-3 py-2 text-xs font-extrabold">
              Next <ChevronRight className="h-4 w-4" />
            </button>
          ) : null}
          <span className="rounded-full bg-amber-400 px-3 py-1 text-xs font-bold text-slate-950 sm:text-sm">
            {holidays.length} {holidays.length === 1 ? 'Holiday' : 'Holidays'}
          </span>
          {onExpand ? (
            <button type="button" onClick={onExpand} title="Open extra-large view" className="rounded-xl bg-white/10 p-2">
              <Maximize2 className="h-4 w-4" />
            </button>
          ) : null}
        </div>
      </div>

      <div className="grid grid-cols-7 border-b border-slate-200 bg-slate-100 py-2.5 text-center text-xs font-extrabold uppercase text-slate-700 sm:text-sm">
        {DAYS_SHORT.map((day, index) => (
          <div key={day} className={index === 0 || index === 6 ? 'text-blue-700' : ''}>{day}</div>
        ))}
      </div>

      <div className={`grid grid-cols-7 bg-slate-50 ${large ? 'gap-2 p-3 sm:p-4' : 'gap-1.5 p-2.5 sm:p-3'}`}>
        {days.map((cell, index) => {
          if (!cell) return <div key={`empty-${monthIndex}-${index}`} className={large ? 'min-h-[110px] sm:min-h-[130px]' : 'min-h-[78px] sm:min-h-[96px]'} />;
          return (
            <button
              key={cell.dateStr}
              type="button"
              onClick={() => onOpenDay(cell, monthIndex)}
              className={`flex flex-col justify-between rounded-xl p-1.5 text-left sm:p-2 ${cellTone(cell.holiday, cell.isWeekend)} ${large ? 'min-h-[110px] sm:min-h-[130px]' : 'min-h-[78px] sm:min-h-[96px]'}`}
            >
              <span className="flex w-full items-center justify-between">
                <span className={`font-black leading-none ${large ? 'text-lg sm:text-2xl' : 'text-base sm:text-lg'}`}>{cell.day}</span>
                {cell.holiday?.isPoya ? <Moon className="h-3.5 w-3.5 shrink-0 fill-amber-500 text-amber-700" /> : null}
                {!cell.holiday && cell.isWeekend ? <span className="rounded bg-blue-200 px-1 text-[10px] font-extrabold text-blue-900">B</span> : null}
              </span>
              {cell.holiday ? (
                <span className="line-clamp-2 text-[11px] font-extrabold leading-tight text-slate-900 sm:text-xs">
                  {cell.holiday.shortName}
                </span>
              ) : <span />}
              {cell.holiday ? (
                <span className="flex flex-wrap gap-1">
                  {cell.holiday.types.map((type) => <TypeBadge key={type} type={type} size="cell" />)}
                </span>
              ) : <span className="h-4" />}
            </button>
          );
        })}
      </div>

      <div className="space-y-2 border-t-2 border-slate-200 bg-white p-4">
        <p className="text-xs font-extrabold uppercase tracking-wider text-slate-400">
          {MONTHS[monthIndex]} Holidays ({holidays.length})
        </p>
        {holidays.map((holiday) => (
          <button
            key={holiday.id}
            type="button"
            onClick={() => onOpenDay({ holiday, day: holiday.day, isWeekend: false }, monthIndex)}
            className="flex w-full flex-col items-start justify-between gap-2 rounded-xl border border-slate-200 bg-slate-50 p-2.5 text-left hover:bg-amber-50 sm:flex-row sm:items-center"
          >
            <span className="flex min-w-0 items-center gap-3">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-slate-900 text-sm font-extrabold text-white">
                {String(holiday.day).padStart(2, '0')}
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-extrabold text-slate-900">{holiday.name}</span>
                <span className="block text-xs font-semibold text-slate-600">
                  {holiday.dayOfWeek}{showSinhala ? ` · ${holiday.sinhalaName}` : ''}
                </span>
              </span>
            </span>
            <span className="flex gap-1.5">
              {holiday.types.map((type) => <TypeBadge key={type} type={type} size="xs" />)}
            </span>
          </button>
        ))}
      </div>
    </article>
  );
}
