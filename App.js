import React, { useMemo, useState } from 'react';
import {
  FlatList,
  Modal,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { DAYS_SHORT, HOLIDAYS_2027, MONTHS, SINHALA_MONTHS } from './src/holidays';

const TYPE_COLOR = { B: '#2563EB', P: '#059669', M: '#7C3AED' };

export default function App() {
  const [activeTab, setActiveTab] = useState('calendar');
  const [currentMonth, setCurrentMonth] = useState(0);
  const [filterType, setFilterType] = useState('ALL');
  const [search, setSearch] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);

  const holidayMap = useMemo(() => {
    const map = {};
    HOLIDAYS_2027.forEach((holiday) => {
      map[holiday.date] = holiday;
    });
    return map;
  }, []);

  const monthCells = useMemo(() => {
    const firstDay = new Date(2027, currentMonth, 1).getDay();
    const totalDays = new Date(2027, currentMonth + 1, 0).getDate();
    const cells = Array.from({ length: firstDay }, () => null);
    for (let day = 1; day <= totalDays; day += 1) {
      const dateStr = `2027-${String(currentMonth + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dow = new Date(2027, currentMonth, day).getDay();
      cells.push({
        day,
        dateStr,
        isWeekend: dow === 0 || dow === 6,
        holiday: holidayMap[dateStr] || null,
      });
    }
    return cells;
  }, [currentMonth, holidayMap]);

  const filteredList = useMemo(() => {
    return HOLIDAYS_2027.filter((holiday) => {
      if (filterType === 'M' && !holiday.types.includes('M')) return false;
      if (filterType === 'POYA' && !holiday.isPoya) return false;
      if (filterType === 'LONG' && holiday.dayOfWeek !== 'Friday' && holiday.dayOfWeek !== 'Monday') return false;
      if (search.trim()) {
        const query = search.toLowerCase();
        return holiday.name.toLowerCase().includes(query) || holiday.sinhalaName.includes(search) || holiday.shortName.toLowerCase().includes(query);
      }
      return true;
    });
  }, [filterType, search]);

  const monthHolidays = HOLIDAYS_2027.filter((holiday) => holiday.month === currentMonth);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#78350F" />
      <View style={styles.header}>
        <Text style={styles.headerBadge}>SRI LANKA OFFICIAL CALENDAR 2027</Text>
        <Text style={styles.headerTitle}>2027 නිවාඩු දින දර්ශනය</Text>
        <Text style={styles.headerSub}>All Saturdays and Sundays are Bank Holidays (B)</Text>
      </View>

      {activeTab === 'calendar' ? (
        <ScrollView style={styles.content} contentContainerStyle={styles.contentInner}>
          <View style={styles.monthBar}>
            <TouchableOpacity onPress={() => setCurrentMonth((month) => (month === 0 ? 11 : month - 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>◀</Text>
            </TouchableOpacity>
            <View style={styles.monthTitles}>
              <Text style={styles.monthTitle}>{MONTHS[currentMonth]} 2027</Text>
              <Text style={styles.monthSub}>{SINHALA_MONTHS[currentMonth]}</Text>
            </View>
            <TouchableOpacity onPress={() => setCurrentMonth((month) => (month === 11 ? 0 : month + 1))} style={styles.navBtn}>
              <Text style={styles.navBtnText}>▶</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.weekHeader}>
            {DAYS_SHORT.map((day, index) => (
              <Text key={day} style={[styles.weekDayText, (index === 0 || index === 6) && styles.weekendLabel]}>{day}</Text>
            ))}
          </View>

          <View style={styles.grid}>
            {monthCells.map((cell, index) => {
              if (!cell) return <View key={`empty-${index}`} style={styles.dayCellEmpty} />;
              const isMercantile = cell.holiday?.types.includes('M');
              return (
                <TouchableOpacity
                  key={cell.dateStr}
                  style={[
                    styles.dayCell,
                    cell.isWeekend && !cell.holiday && styles.dayCellWeekend,
                    cell.holiday && styles.dayCellHoliday,
                    cell.holiday?.isPoya && styles.dayCellPoya,
                    isMercantile && styles.dayCellMercantile,
                  ]}
                  onPress={() => cell.holiday && setSelectedItem(cell.holiday)}
                >
                  <Text style={styles.dayNumber}>{cell.day}</Text>
                  {cell.holiday ? (
                    <>
                      <Text style={styles.shortName} numberOfLines={2}>{cell.holiday.shortName}</Text>
                      <View style={styles.badgeRow}>
                        {cell.holiday.types.map((type) => (
                          <View key={type} style={[styles.miniBadge, { backgroundColor: TYPE_COLOR[type] }]}>
                            <Text style={styles.miniBadgeText}>{type}</Text>
                          </View>
                        ))}
                      </View>
                    </>
                  ) : cell.isWeekend ? <Text style={styles.weekendB}>B</Text> : null}
                </TouchableOpacity>
              );
            })}
          </View>

          <Text style={styles.sectionTitle}>{MONTHS[currentMonth]} Holidays</Text>
          {monthHolidays.map((holiday) => (
            <HolidayCard key={holiday.id} holiday={holiday} onPress={() => setSelectedItem(holiday)} />
          ))}
        </ScrollView>
      ) : (
        <View style={styles.listWrap}>
          <View style={styles.searchBar}>
            <TextInput
              value={search}
              onChangeText={setSearch}
              placeholder="Search holiday (Vesak, New Year, Poya)..."
              placeholderTextColor="#94A3B8"
              style={styles.input}
            />
            <View style={styles.filterRow}>
              {[
                ['ALL', 'All'],
                ['M', 'Mercantile'],
                ['POYA', 'Poya'],
                ['LONG', 'Long weekends'],
              ].map(([id, label]) => (
                <TouchableOpacity key={id} onPress={() => setFilterType(id)} style={[styles.filterChip, filterType === id && styles.filterChipOn]}>
                  <Text style={[styles.filterChipText, filterType === id && styles.filterChipTextOn]}>{label}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
          <FlatList
            data={filteredList}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            renderItem={({ item }) => <HolidayCard holiday={item} onPress={() => setSelectedItem(item)} showMonth />}
          />
        </View>
      )}

      <View style={styles.bottomNav}>
        <TouchableOpacity style={styles.tabItem} onPress={() => setActiveTab('calendar')}>
          <Text style={[styles.tabText, activeTab === 'calendar' && styles.tabActive]}>Calendar</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('list'); setFilterType('ALL'); }}>
          <Text style={[styles.tabText, activeTab === 'list' && filterType !== 'LONG' && styles.tabActive]}>All 25 Holidays</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.tabItem} onPress={() => { setActiveTab('list'); setFilterType('LONG'); setSearch(''); }}>
          <Text style={[styles.tabText, filterType === 'LONG' && activeTab === 'list' && styles.tabActive]}>Long Weekends</Text>
        </TouchableOpacity>
      </View>

      <Modal visible={!!selectedItem} transparent animationType="slide" onRequestClose={() => setSelectedItem(null)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalBox}>
            <Text style={styles.modalDate}>
              {selectedItem?.day} {MONTHS[selectedItem?.month || 0]} 2027 ({selectedItem?.dayOfWeek})
            </Text>
            <Text style={styles.modalTitle}>{selectedItem?.name}</Text>
            <Text style={styles.modalSinhala}>{selectedItem?.sinhalaName}</Text>
            <View style={styles.statusBlock}>
              <Text style={styles.statusLine}>Bank Holiday (B): Yes</Text>
              <Text style={styles.statusLine}>Public Holiday (P): {selectedItem?.types.includes('P') ? 'Yes' : 'No'}</Text>
              <Text style={styles.statusLine}>Mercantile Holiday (M): {selectedItem?.types.includes('M') ? 'Yes' : 'No'}</Text>
            </View>
            <TouchableOpacity style={styles.closeBtn} onPress={() => setSelectedItem(null)}>
              <Text style={styles.closeBtnText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

function HolidayCard({ holiday, onPress, showMonth = false }) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <View style={styles.dateBox}>
        <Text style={styles.dateBoxNum}>{String(holiday.day).padStart(2, '0')}</Text>
        <Text style={styles.dateBoxDay}>{showMonth ? MONTHS[holiday.month].slice(0, 3) : holiday.dayOfWeek.slice(0, 3)}</Text>
      </View>
      <View style={styles.cardBody}>
        <Text style={styles.cardTitle}>{holiday.name}</Text>
        <Text style={styles.cardSub}>{holiday.sinhalaName}</Text>
      </View>
      <View style={styles.badgeRow}>
        {holiday.types.map((type) => (
          <View key={type} style={[styles.typePill, { backgroundColor: TYPE_COLOR[type] }]}>
            <Text style={styles.typePillText}>{type}</Text>
          </View>
        ))}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { backgroundColor: '#78350F', padding: 16, paddingTop: Platform.OS === 'android' ? 20 : 12 },
  headerBadge: { color: '#FDE68A', fontSize: 11, fontWeight: '800' },
  headerTitle: { color: '#FFFFFF', fontSize: 22, fontWeight: '900', marginTop: 2 },
  headerSub: { color: '#FEF3C7', fontSize: 12, marginTop: 4 },
  content: { flex: 1 },
  contentInner: { padding: 12, paddingBottom: 28 },
  monthBar: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#0F172A', padding: 14, borderRadius: 16, marginBottom: 10 },
  monthTitles: { alignItems: 'center' },
  navBtn: { padding: 8, backgroundColor: '#334155', borderRadius: 10 },
  navBtnText: { color: '#FFF', fontWeight: 'bold', fontSize: 16 },
  monthTitle: { color: '#FFF', fontSize: 18, fontWeight: '900' },
  monthSub: { color: '#FBBF24', fontSize: 13, fontWeight: '700' },
  weekHeader: { flexDirection: 'row', paddingVertical: 8, backgroundColor: '#E2E8F0', borderRadius: 10 },
  weekDayText: { width: '14.28%', textAlign: 'center', fontWeight: '800', fontSize: 12, color: '#334155' },
  weekendLabel: { color: '#1D4ED8' },
  grid: { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6 },
  dayCellEmpty: { width: '14.28%', height: 72 },
  dayCell: { width: '14.28%', height: 72, borderWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', padding: 3, justifyContent: 'space-between' },
  dayCellWeekend: { backgroundColor: '#EFF6FF', borderColor: '#BFDBFE' },
  dayCellHoliday: { backgroundColor: '#ECFDF5', borderColor: '#10B981', borderWidth: 2 },
  dayCellPoya: { backgroundColor: '#FFFBEB', borderColor: '#F59E0B' },
  dayCellMercantile: { backgroundColor: '#FAF5FF', borderColor: '#9333EA' },
  dayNumber: { fontSize: 13, fontWeight: '900', color: '#0F172A' },
  shortName: { fontSize: 8, fontWeight: '800', color: '#0F172A' },
  badgeRow: { flexDirection: 'row', gap: 2 },
  miniBadge: { paddingHorizontal: 3, borderRadius: 3 },
  miniBadgeText: { color: '#FFF', fontSize: 8, fontWeight: '900' },
  weekendB: { fontSize: 10, fontWeight: '800', color: '#1D4ED8' },
  sectionTitle: { fontSize: 16, fontWeight: '800', color: '#1E293B', marginTop: 18, marginBottom: 8 },
  card: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', padding: 12, borderRadius: 14, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0' },
  dateBox: { width: 48, height: 48, borderRadius: 12, backgroundColor: '#0F172A', alignItems: 'center', justifyContent: 'center' },
  dateBoxNum: { color: '#FFF', fontSize: 16, fontWeight: '900' },
  dateBoxDay: { color: '#FBBF24', fontSize: 10, fontWeight: '700' },
  cardBody: { flex: 1, marginLeft: 12, marginRight: 8 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#0F172A' },
  cardSub: { fontSize: 12, color: '#475569', marginTop: 2 },
  typePill: { paddingHorizontal: 6, paddingVertical: 3, borderRadius: 6 },
  typePillText: { color: '#FFF', fontSize: 11, fontWeight: '900' },
  listWrap: { flex: 1 },
  searchBar: { padding: 12, backgroundColor: '#FFF' },
  input: { backgroundColor: '#F1F5F9', padding: 12, borderRadius: 12, fontSize: 14, color: '#0F172A' },
  filterRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 10 },
  filterChip: { paddingHorizontal: 10, paddingVertical: 6, borderRadius: 999, backgroundColor: '#F1F5F9' },
  filterChipOn: { backgroundColor: '#0F172A' },
  filterChipText: { fontSize: 12, fontWeight: '700', color: '#475569' },
  filterChipTextOn: { color: '#FFF' },
  listContent: { padding: 12 },
  bottomNav: { flexDirection: 'row', borderTopWidth: 1, borderColor: '#E2E8F0', backgroundColor: '#FFF', paddingVertical: 12 },
  tabItem: { flex: 1, alignItems: 'center' },
  tabText: { fontSize: 13, fontWeight: '700', color: '#64748B', textAlign: 'center' },
  tabActive: { color: '#D97706', fontWeight: '900' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'center', padding: 20 },
  modalBox: { backgroundColor: '#FFF', borderRadius: 24, padding: 22 },
  modalDate: { color: '#D97706', fontWeight: '800', fontSize: 12 },
  modalTitle: { fontSize: 18, fontWeight: '900', color: '#0F172A', marginTop: 4 },
  modalSinhala: { fontSize: 14, color: '#475569', marginTop: 2 },
  statusBlock: { marginVertical: 14, gap: 6 },
  statusLine: { fontSize: 14, fontWeight: '700', color: '#1E293B' },
  closeBtn: { backgroundColor: '#0F172A', padding: 14, borderRadius: 14, alignItems: 'center', marginTop: 10 },
  closeBtnText: { color: '#FFF', fontWeight: '800' },
});
