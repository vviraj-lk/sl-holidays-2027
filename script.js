const holidays = [
    { date: '2027-01-15', display: '15 January, Friday', name: 'Tamil Thai Pongal Day', si: 'දෙමළ තෛයිපොංගල් දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-01-22', display: '22 January, Friday', name: 'Duruthu Full Moon Poya Day', si: 'දුරුතු පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-02-04', display: '04 February, Thursday', name: 'Independence Day', si: 'නිදහස් දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-02-20', display: '20 February, Saturday', name: 'Navam Full Moon Poya Day', si: 'නවම් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-03-06', display: '06 March, Saturday', name: 'Mahasivarathri Day', si: 'මහා ශිවරාත්‍රී දිනය', type: ['B', 'P'] },
    { date: '2027-03-10', display: '10 March, Wednesday', name: 'Eid-Ul-Fitr (Ramazan Festival Day)', si: 'රුමසාන් උත්සව දිනය', type: ['B', 'P'] },
    { date: '2027-03-22', display: '22 March, Monday', name: 'Medin Full Moon Poya Day', si: 'මැදින් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-03-26', display: '26 March, Friday', name: 'Good Friday', si: 'මහ සිකුරාදා දිනය', type: ['B', 'P'] },
    { date: '2027-04-13', display: '13 April, Tuesday', name: 'Day prior to Sinhala & Tamil New Year Day', si: 'අලුත් අවුරුදු දිනයට පෙර දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-04-14', display: '14 April, Wednesday', name: 'Sinhala & Tamil New Year Day', si: 'සිංහල හා දෙමළ අලුත් අවුරුදු දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-04-20', display: '20 April, Tuesday', name: 'Bak Full Moon Poya Day', si: 'බක් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-05-01', display: '01 May, Saturday', name: 'May Day (International Workers’ Day)', si: 'මැයි දිනය (කම්කරු දිනය)', type: ['B', 'P', 'M'] },
    { date: '2027-05-17', display: '17 May, Monday', name: 'Eid-Ul-Allha (Hadji Festival Day)', si: 'හජ්ජි උත්සව දිනය', type: ['B', 'P'] },
    { date: '2027-05-19', display: '19 May, Wednesday', name: 'Vesak Full Moon Poya Day', si: 'වෙසක් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-05-20', display: '20 May, Thursday', name: 'Day following Vesak Full Moon Poya Day', si: 'වෙසක් පෝය දිනයට පසු දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-06-18', display: '18 June, Friday', name: 'Poson Full Moon Poya Day', si: 'පොසොන් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-07-18', display: '18 July, Sunday', name: 'Esala Full Moon Poya Day', si: 'ඇසළ පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-08-15', display: '15 August, Sunday', name: 'Milad-Un-Nabi (Holy Prophet\'s Birthday)', si: 'නබිතුමාගේ උපන් දිනය', type: ['B', 'P', 'M'] },
    { date: '2027-08-16', display: '16 August, Monday', name: 'Nikini Full Moon Poya Day', si: 'නිකිණි පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-09-15', display: '15 September, Wednesday', name: 'Binara Full Moon Poya Day', si: 'බිනර පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-10-15', display: '15 October, Friday', name: 'Vap Full Moon Poya Day', si: 'වප් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-10-28', display: '28 October, Thursday', name: 'Deepawali Festival Day', si: 'දීපාවලි උත්සව දිනය', type: ['B', 'P'] },
    { date: '2027-11-13', display: '13 November, Saturday', name: 'Ill Full Moon Poya Day', si: 'ඉල් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-12-13', display: '13 December, Monday', name: 'Unduwap Full Moon Poya Day', si: 'උඳුවප් පුර පසළොස්වක පෝය දිනය', type: ['B', 'P'] },
    { date: '2027-12-25', display: '25 December, Saturday', name: 'Christmas Day', si: 'නත්තල් දිනය', type: ['B', 'P', 'M'] }
];

let currentMonth = 0; // January 2027
const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
];

const listView = document.getElementById('listView');
const calView = document.getElementById('calView');
const searchInput = document.getElementById('searchInput');

function switchTab(tab) {
    if(tab === 'list') {
        listView.classList.remove('hidden');
        calView.classList.add('hidden');
        document.getElementById('tabList').className = "flex-1 py-1.5 rounded-md font-semibold bg-indigo-600 text-white transition";
        document.getElementById('tabCal').className = "flex-1 py-1.5 rounded-md font-semibold text-indigo-300 transition";
    } else {
        listView.classList.add('hidden');
        calView.classList.remove('hidden');
        document.getElementById('tabCal').className = "flex-1 py-1.5 rounded-md font-semibold bg-indigo-600 text-white transition";
        document.getElementById('tabList').className = "flex-1 py-1.5 rounded-md font-semibold text-indigo-300 transition";
        renderCalendar();
    }
}

function renderList(filter = '') {
    listView.innerHTML = '';
    const filtered = holidays.filter(h => 
        h.name.toLowerCase().includes(filter.toLowerCase()) || 
        h.si.includes(filter) || 
        h.display.toLowerCase().includes(filter.toLowerCase())
    );

    if(filtered.length === 0) {
        listView.innerHTML = '<p class="text-center text-slate-500 py-6 text-sm">කිසිදු නිවාඩු දිනයක් හමු නොවීය</p>';
        return;
    }

    filtered.forEach(h => {
        const item = document.createElement('div');
        item.className = 'bg-slate-900 border border-slate-800 p-3 rounded-xl flex justify-between items-center shadow-sm cursor-pointer hover:border-indigo-500 transition';
        item.onclick = () => showModal(h.display, h.name, h.si, h.type);
        item.innerHTML = `
            <div>
                <div class="text-xs font-semibold text-indigo-400">${h.display}</div>
                <div class="text-sm font-bold text-white mt-0.5">${h.name}</div>
                <div class="text-xs text-slate-400 mt-0.5">${h.si}</div>
            </div>
            <div class="bg-indigo-950 border border-indigo-800 text-indigo-200 text-xs font-bold px-2.5 py-1 rounded-lg">
                ${h.type.join(', ')}
            </div>
        `;
        listView.appendChild(item);
    });
}

function renderCalendar() {
    const grid = document.getElementById('calendarGrid');
    grid.innerHTML = '';
    document.getElementById('monthTitle').innerText = `${monthNames[currentMonth]} 2027`;

    const year = 2027;
    const firstDayIndex = new Date(year, currentMonth, 1).getDay();
    const totalDays = new Date(year, currentMonth + 1, 0).getDate();

    // Blank spaces for previous month days
    for(let i = 0; i < firstDayIndex; i++) {
        const emptyBox = document.createElement('div');
        grid.appendChild(emptyBox);
    }

    // Days of the month
    for(let day = 1; day <= totalDays; day++) {
        const formattedMonth = String(currentMonth + 1).padStart(2, '0');
        const formattedDay = String(day).padStart(2, '0');
        const dateStr = `2027-${formattedMonth}-${formattedDay}`;

        const dayOfWeek = new Date(year, currentMonth, day).getDay();
        const isWeekend = (dayOfWeek === 0 || dayOfWeek === 6);

        const holiday = holidays.find(h => h.date === dateStr);

        const box = document.createElement('div');
        let bgClass = 'bg-slate-900 border-slate-800 text-slate-200';
        
        if (holiday) {
            bgClass = 'bg-indigo-950 border-indigo-500 text-white font-bold ring-2 ring-indigo-500/50';
        } else if (isWeekend) {
            bgClass = 'bg-slate-900/60 border-slate-800/60 text-red-400';
        }

        box.className = `h-12 rounded-lg border flex flex-col items-center justify-center cursor-pointer text-xs transition hover:bg-indigo-900 ${bgClass}`;
        
        let badgesHtml = '';
        if (isWeekend || holiday) {
            let types = isWeekend ? ['B'] : [];
            if (holiday) types = holiday.type;
            badgesHtml = `<span class="text-[9px] text-indigo-300 font-semibold">${[...new Set(types)].join('')}</span>`;
        }

        box.innerHTML = `<span>${day}</span>${badgesHtml}`;

        box.onclick = () => {
            if (holiday) {
                showModal(holiday.display, holiday.name, holiday.si, holiday.type);
            } else if (isWeekend) {
                showModal(`${day} ${monthNames[currentMonth]} 2027`, isWeekend ? 'Weekend (Bank Holiday)' : 'Weekend', 'සෙනසුරාදා / ඉරිදා බැංකු නිවාඩුවක් ලෙස සැලකේ', ['B']);
            }
        };

        grid.appendChild(box);
    }
}

function changeMonth(direction) {
    currentMonth += direction;
    if (currentMonth > 11) currentMonth = 0;
    if (currentMonth < 0) currentMonth = 11;
    renderCalendar();
}

function showModal(date, name, si, types) {
    document.getElementById('modalDate').innerText = date;
    document.getElementById('modalTitle').innerText = name;
    document.getElementById('modalSi').innerText = si;
    
    const badgeContainer = document.getElementById('modalBadges');
    badgeContainer.innerHTML = '';
    types.forEach(t => {
        const b = document.createElement('span');
        b.className = 'bg-indigo-950 border border-indigo-700 text-indigo-200 text-xs font-bold px-3 py-1 rounded-lg';
        b.innerText = `Type: ${t}`;
        badgeContainer.appendChild(b);
    });

    document.getElementById('detailModal').classList.remove('hidden');
}

function closeModal() {
    document.getElementById('detailModal').classList.add('hidden');
}

searchInput.addEventListener('input', (e) => {
    renderList(e.target.value);
});

// Initial load
renderList();
