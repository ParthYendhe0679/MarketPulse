import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { Badge } from '../components/Badge';
import { IndiaSvgMap } from '../maps/IndiaSvgMap';
import { getMockData } from '../services/dataService';
import { STATES_AND_CITIES } from '../constants';
import { MapPin, ArrowRight } from 'lucide-react';

export const HomeMapPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState<string>('');
  const [selectedCity, setSelectedCity] = useState<string>('');
  const data = getMockData();

  // Reset helper
  const handleReset = () => {
    setSelectedState('');
    setSelectedCity('');
  };

  // Select State handler
  const handleSelectState = (state: string) => {
    setSelectedState(state);
    setSelectedCity(''); // clear selected city when state changes
  };

  // Launch dashboard with URL query parameters
  const handleOpenDashboard = () => {
    if (selectedState && selectedCity) {
      navigate(`/dashboard?state=${encodeURIComponent(selectedState)}&city=${encodeURIComponent(selectedCity)}`);
    } else if (selectedState) {
      navigate(`/dashboard?state=${encodeURIComponent(selectedState)}`);
    } else {
      navigate('/dashboard');
    }
  };

  // List of cities for the selected state
  const cities = selectedState ? STATES_AND_CITIES[selectedState] || [] : [];

  return (
    <div className="py-6 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="blue">Spatial Drilldown Flow</Badge>
            {selectedState && <Badge variant="yellow">{selectedState}</Badge>}
            {selectedCity && <Badge variant="pink">{selectedCity}</Badge>}
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Market Discovery Portal
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Drill down from India to specific States and Cities to launch granular consumption analytics.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="white" size="sm" onClick={handleReset} disabled={!selectedState}>
            Reset Selection
          </Button>
          <Button variant="dark" size="sm" onClick={() => navigate('/dashboard')}>
            Skip to All India <ArrowRight className="w-4 h-4 ml-1.5 stroke-[3]" />
          </Button>
        </div>
      </div>

      {/* Visual Navigation Steps */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 border-3 border-[#111111] rounded-xl bg-white shadow-[3px_3px_0px_0px_#111111] flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-[#4F7DF9] text-white border-2 border-[#111111] flex items-center justify-center font-black">
            1
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase">START POINT</span>
            <strong className="text-xs font-black uppercase text-[#111111]">INDIA PORTFOLIO</strong>
          </div>
        </div>

        <div className={`p-4 border-3 border-[#111111] rounded-xl shadow-[3px_3px_0px_0px_#111111] flex items-center gap-3 transition-colors ${selectedState ? 'bg-[#6EE7B7]/20' : 'bg-white opacity-60'}`}>
          <div className="w-8 h-8 rounded-full bg-[#6EE7B7] text-[#111111] border-2 border-[#111111] flex items-center justify-center font-black">
            2
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase">SELECT STATE</span>
            <strong className="text-xs font-black uppercase text-[#111111]">
              {selectedState || "Pending..."}
            </strong>
          </div>
        </div>

        <div className={`p-4 border-3 border-[#111111] rounded-xl shadow-[3px_3px_0px_0px_#111111] flex items-center gap-3 transition-colors ${selectedCity ? 'bg-[#FF9ECF]/20' : 'bg-white opacity-60'}`}>
          <div className="w-8 h-8 rounded-full bg-[#FF9ECF] text-[#111111] border-2 border-[#111111] flex items-center justify-center font-black">
            3
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase">SELECT CITY</span>
            <strong className="text-xs font-black uppercase text-[#111111]">
              {selectedCity || "Pending..."}
            </strong>
          </div>
        </div>

        <div className={`p-4 border-3 border-[#111111] rounded-xl shadow-[3px_3px_0px_0px_#111111] flex items-center gap-3 transition-colors ${selectedState && selectedCity ? 'bg-[#FFD54A]/20' : 'bg-white opacity-60'}`}>
          <div className="w-8 h-8 rounded-full bg-[#FFD54A] text-[#111111] border-2 border-[#111111] flex items-center justify-center font-black">
            4
          </div>
          <div>
            <span className="text-[10px] font-bold text-gray-400 block uppercase">OPEN PLATFORM</span>
            <strong className="text-xs font-black uppercase text-[#111111]">READY TO ANALYSIS</strong>
          </div>
        </div>
      </div>

      {/* Main Map Drilldown Grid */}
      <div className="space-y-6">
        <IndiaSvgMap 
          data={data}
          selectedState={selectedState}
          onSelectState={handleSelectState}
        />

        {/* Step 3: Select City block if state is selected */}
        {selectedState && (
          <Card variant="white" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-6 space-y-4">
            <div className="flex items-center justify-between border-b-3 border-[#111111] pb-3">
              <div>
                <h4 className="text-lg font-bold font-display uppercase tracking-tight text-[#111111]">
                  Step 3: Select City within {selectedState}
                </h4>
                <p className="text-xs font-semibold text-gray-500">
                  Select a specific metropolitan area to inspect city-level data.
                </p>
              </div>
              <Badge variant="pink">{cities.length} Cities Available</Badge>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {cities.map((city) => {
                const isCitySelected = selectedCity === city;
                return (
                  <button
                    key={city}
                    onClick={() => setSelectedCity(city)}
                    className={`
                      py-3.5 px-5 font-bold font-display uppercase text-xs tracking-wider border-3 border-[#111111] rounded-xl transition-all flex items-center justify-between
                      ${isCitySelected 
                        ? 'bg-[#FF9ECF] shadow-[3px_3px_0px_0px_#111111] translate-x-[-1.5px] translate-y-[-1.5px]' 
                        : 'bg-white shadow-[2px_2px_0px_0px_#111111] hover:shadow-[3.5px_3.5px_0px_0px_#111111] hover:translate-x-[-1.5px] hover:translate-y-[-1.5px]'
                      }
                    `}
                  >
                    <span>{city}</span>
                    <MapPin className={`w-4 h-4 stroke-[2.5] ${isCitySelected ? 'fill-[#111111]' : 'text-gray-400'}`} />
                  </button>
                );
              })}
            </div>

            {/* Launch Dashboard Bar */}
            <div className="pt-4 border-t-2 border-dashed border-gray-300 flex flex-col sm:flex-row items-center justify-between gap-4">
              <p className="text-xs font-bold text-gray-600">
                {selectedCity 
                  ? `Selected: ${selectedCity}, ${selectedState}. Launch to view revenue charts, demographics, and product splits.`
                  : `Please click on a city above to lock your selection.`
                }
              </p>
              <Button
                variant={selectedCity ? 'yellow' : 'white'}
                onClick={handleOpenDashboard}
                disabled={!selectedCity}
                className="w-full sm:w-auto shadow-[4px_4px_0px_0px_#111111]"
              >
                Launch Intelligence Dashboard <ArrowRight className="w-4 h-4 ml-2 stroke-[3]" />
              </Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};
export default HomeMapPage;
