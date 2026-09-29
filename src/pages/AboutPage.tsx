import React from 'react';
import { Info, Zap } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';

export const AboutPage: React.FC = () => {
  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="blue">Documentation</Badge>
            <Badge variant="yellow">v1.0.0-Beta</Badge>
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            About MarketPulse AI
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Learn more about the flagship consumer product consumption analytical platform.
          </p>
        </div>
      </div>

      {/* Main Description */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card variant="white" hoverable={false} className="lg:col-span-2 border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3">
            <Info className="w-5 h-5 text-[#4F7DF9] stroke-[2.5]" />
            <h3 className="font-display font-bold uppercase text-sm tracking-wide text-[#111111]">
              Executive Summary
            </h3>
          </div>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            MarketPulse AI helps businesses analyze consumer product consumption across India. The platform allows researchers, product managers, and executives to drill down from India &rarr; State &rarr; City &rarr; Product category, revealing core demographic affinities and growth trends.
          </p>
          <p className="text-sm text-gray-600 font-medium leading-relaxed">
            By combining high-fidelity interactive geographic visualization selector panels with detailed Recharts timeline indices, MarketPulse AI eliminates guesswork. The entire architecture is built to support sub-second query performance and is fully decoupled to connect to an enterprise FastAPI python backend.
          </p>
        </Card>

        {/* Tech Stack Card */}
        <Card variant="yellow" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-6">
          <div className="flex items-center gap-2 border-b-2 border-[#111111] pb-3 mb-4">
            <Zap className="w-5 h-5 stroke-[2.5]" />
            <h3 className="font-display font-black uppercase text-sm tracking-wide">
              Architectural Stack
            </h3>
          </div>
          <ul className="space-y-3 text-xs font-bold uppercase">
            <li className="flex items-center justify-between border-b border-yellow-600/40 pb-1.5"><span>Core Engine:</span><span>React + TS</span></li>
            <li className="flex items-center justify-between border-b border-yellow-600/40 pb-1.5"><span>Styling System:</span><span>Tailwind CSS</span></li>
            <li className="flex items-center justify-between border-b border-yellow-600/40 pb-1.5"><span>Charts Engine:</span><span>Recharts</span></li>
            <li className="flex items-center justify-between border-b border-yellow-600/40 pb-1.5"><span>Mapping Framework:</span><span>React Leaflet</span></li>
            <li className="flex items-center justify-between border-b border-yellow-600/40 pb-1.5"><span>Animations:</span><span>Framer Motion</span></li>
            <li className="flex items-center justify-between"><span>Branding Theme:</span><span>Neo-Brutalism</span></li>
          </ul>
        </Card>
      </div>

      {/* Feature Highlights Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
          <h4 className="text-sm font-black font-display uppercase text-[#4F7DF9] mb-2">Deterministic Mocking</h4>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">
            Generates 2,500+ records covering 11 states and cities using a seeded pseudo-random engine, ensuring robust seasonal trends and Diwali spikes.
          </p>
        </Card>

        <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
          <h4 className="text-sm font-black font-display uppercase text-[#FF6B6B] mb-2">Decoupled Services</h4>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">
            Data aggregates are filtered and processed inside an isolated service layer. Ready to connect to Axios endpoints in minutes.
          </p>
        </Card>

        <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5">
          <h4 className="text-sm font-black font-display uppercase text-[#6EE7B7] mb-2">Print Ready Reports</h4>
          <p className="text-xs font-semibold text-gray-500 leading-relaxed">
            The reports and ledger logs are configured with print stylesheets, auto-formatting tables to fit pages neatly during PDF downloads.
          </p>
        </Card>
      </div>
    </div>
  );
};
export default AboutPage;
