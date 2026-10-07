import React, { useState, useMemo } from 'react';
import { ForeignLearner, LearnerProfession } from '../types';
import { Search, Filter, MapPin, Star, MessageSquare, Sparkles, CheckCircle2 } from 'lucide-react';

interface DiscoverPageProps {
  learners: ForeignLearner[];
  onSelectLearner: (learner: ForeignLearner) => void;
  lang: 'sw' | 'en';
}

export const DiscoverPage: React.FC<DiscoverPageProps> = ({
  learners,
  onSelectLearner,
  lang
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedCountry, setSelectedCountry] = useState<string>('all');

  const categories: { key: string; labelSw: string; labelEn: string }[] = [
    { key: 'all', labelSw: 'Wote (All)', labelEn: 'All' },
    { key: 'tourist', labelSw: 'Watalii (Tourists)', labelEn: 'Tourists' },
    { key: 'doctor', labelSw: 'Madaktari (Doctors)', labelEn: 'Doctors' },
    { key: 'college student', labelSw: 'Wanafunzi (Students)', labelEn: 'College Students' },
    { key: 'researcher', labelSw: 'Watafiti (Researchers)', labelEn: 'Researchers' },
    { key: 'engineer', labelSw: 'Wahandisi (Engineers)', labelEn: 'Engineers' }
  ];

  const countries = useMemo(() => {
    const list = Array.from(new Set(learners.map(l => l.country)));
    return ['all', ...list];
  }, [learners]);

  const filteredLearners = useMemo(() => {
    return learners.filter(l => {
      const matchSearch =
        searchQuery === '' ||
        l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.profession.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        l.bio.toLowerCase().includes(searchQuery.toLowerCase());

      const matchCategory =
        selectedCategory === 'all' || l.professionCategory === selectedCategory;

      const matchCountry =
        selectedCountry === 'all' || l.country === selectedCountry;

      return matchSearch && matchCategory && matchCountry;
    });
  }, [learners, searchQuery, selectedCategory, selectedCountry]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-24">
      
      {/* Title & Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center gap-2 text-xs font-bold text-[#0066FF] tracking-wider uppercase">
          <Sparkles className="w-4 h-4 text-[#0066FF]" />
          <span>Wageni Waliopo Hewani Kujifunza Kiswahili</span>
        </div>
        <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
          {lang === 'sw' ? 'Orodha ya Wazungu Waliopo Hewani' : 'Available Foreign Learners Directory'}
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 max-w-2xl leading-relaxed">
          {lang === 'sw'
            ? 'Chagua mgeni yeyote unayependa kuongea naye. Kila mazungumzo yanakamilika kwa dakika 10 na malipo ya papo hapo yataingia moja kwa moja kwenye mkoba wako.'
            : 'Select any learner to begin a 10-minute conversational exchange. Payouts are credited instantly to your wallet upon session completion.'}
        </p>

        {/* Live status badge */}
        <div className="pt-2 flex items-center gap-2 text-xs font-semibold text-emerald-700">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
          <span>{filteredLearners.length} Wazungu wako tayari kuanza mazungumzo sasa hivi</span>
        </div>
      </div>

      {/* Search & Filter Controls */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-xs space-y-4">
        
        {/* Search Input */}
        <div className="relative">
          <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder={
              lang === 'sw'
                ? 'Tafuta kwa jina, taaluma (Daktari, Mwanafunzi, Mtalii), au mji...'
                : 'Search by name, profession, or location...'
            }
            className="w-full pl-11 pr-4 py-3 rounded-xl border border-slate-300 focus:border-[#0066FF] focus:ring-2 focus:ring-blue-100 text-sm text-slate-900 outline-hidden transition-all placeholder:text-slate-400"
          />
        </div>

        {/* Interactive Filter Tabs for Categories */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
          {categories.map(cat => (
            <button
              key={cat.key}
              onClick={() => setSelectedCategory(cat.key)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                selectedCategory === cat.key
                  ? 'bg-[#0066FF] text-white shadow-xs'
                  : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
              }`}
            >
              {lang === 'sw' ? cat.labelSw : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Country Filter dropdown */}
        <div className="flex items-center gap-2 pt-1 border-t border-slate-100 text-xs">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <span className="font-bold text-slate-700">{lang === 'sw' ? 'Chuja kwa Nchi:' : 'Filter Country:'}</span>
          <select
            value={selectedCountry}
            onChange={e => setSelectedCountry(e.target.value)}
            className="bg-slate-50 border border-slate-300 rounded-lg px-2.5 py-1 text-slate-800 text-xs font-medium focus:ring-1 focus:ring-blue-500 outline-hidden"
          >
            <option value="all">{lang === 'sw' ? 'Nchi Zote (All Countries)' : 'All Countries'}</option>
            {countries.filter(c => c !== 'all').map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

      </div>

      {/* Learners Grid */}
      {filteredLearners.length === 0 ? (
        <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
          <p className="text-base font-bold text-slate-800">
            {lang === 'sw' ? 'Hakuna mgeni anayelingana na utafutaji wako' : 'No learners match your search filter'}
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('all');
              setSelectedCountry('all');
            }}
            className="text-xs font-bold text-[#0066FF] hover:underline"
          >
            {lang === 'sw' ? 'Ondoa vichujio vyote (Reset Filters)' : 'Reset all filters'}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredLearners.map(learner => (
            <div
              key={learner.id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg hover:border-blue-400 transition-all flex flex-col justify-between group"
            >
              <div>
                
                {/* Photo & Top Metadata */}
                <div className="relative h-52 w-full bg-slate-100 overflow-hidden">
                  <img
                    src={learner.avatarUrl}
                    alt={learner.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  
                  {/* Status Badge */}
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-full text-[11px] font-bold text-emerald-700 flex items-center gap-1 shadow-xs">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                    <span>Yuko Hewani</span>
                  </div>

                  {/* Flag */}
                  <div className="absolute top-3 right-3 text-2xl shadow-xs" title={learner.country}>
                    {learner.flag}
                  </div>

                  {/* Pay Rate Tag */}
                  <div className="absolute bottom-3 right-3 bg-slate-900/95 backdrop-blur-md text-white px-3 py-1 rounded-xl text-xs font-extrabold font-mono shadow-md border border-slate-700">
                    TZS {learner.payPer10Min.toLocaleString()}
                  </div>
                </div>

                {/* Details */}
                <div className="p-4 space-y-2.5">
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="font-extrabold text-slate-900 text-base group-hover:text-[#0066FF] transition-colors">
                        {learner.name}
                      </h3>
                      <p className="text-xs font-semibold text-[#0066FF]">{learner.profession}</p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-lg border border-amber-200 text-amber-800 text-xs font-bold">
                      <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                      <span>{learner.rating}</span>
                    </div>
                  </div>

                  <p className="text-[11px] text-slate-500 flex items-center gap-1 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{learner.location}</span>
                  </p>

                  <div className="bg-slate-50 rounded-xl p-2.5 border border-slate-100 text-xs text-slate-700 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
                      Lengo la Kujifunza:
                    </span>
                    <p className="line-clamp-2 text-slate-600 leading-snug">
                      {learner.learningGoal}
                    </p>
                  </div>

                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed italic">
                    "{learner.bio}"
                  </p>
                </div>

              </div>

              {/* Action Button */}
              <div className="p-4 pt-0">
                <button
                  onClick={() => onSelectLearner(learner)}
                  className="w-full bg-[#0066FF] hover:bg-[#0052CC] text-white font-extrabold py-3 px-4 rounded-xl text-xs flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>ONGEA NAYE SASA (TZS {learner.payPer10Min.toLocaleString()})</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};
