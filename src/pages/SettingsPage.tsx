import React, { useState } from 'react';
import { User, Key, Bell, Shield, Check } from 'lucide-react';
import { Card } from '../components/Card';
import { Badge } from '../components/Badge';
import { Button } from '../components/Button';
import { Input } from '../components/Input';
import { Dropdown } from '../components/Dropdown';

export const SettingsPage: React.FC = () => {
  const [profile, setProfile] = useState({
    name: 'Devin Architect',
    email: 'architect@marketpulse.ai',
    role: 'Principal SaaS Consultant',
    organization: 'NielsenIQ Analytics Partner'
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setSaved(false);
    }, 2000);
  };

  return (
    <div className="py-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 border-b-4 border-[#111111] pb-5">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Badge variant="blue">Preferences</Badge>
            <Badge variant="pink">Profile Setup</Badge>
          </div>
          <h2 className="text-3xl font-black font-display uppercase tracking-tight text-[#111111] m-0">
            Platform Settings
          </h2>
          <p className="text-sm font-semibold text-gray-500">
            Configure your enterprise workspace, API endpoints, and credential details.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
        {/* Profile Settings Card */}
        <Card variant="white" hoverable={false} className="lg:col-span-2 border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-6 space-y-5">
          <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3">
            <User className="w-5 h-5 text-[#4F7DF9] stroke-[2.5]" />
            <h3 className="font-display font-bold uppercase text-sm tracking-wide text-[#111111]">
              Consultant Profile Credentials
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Full Name"
              value={profile.name}
              onChange={e => setProfile({...profile, name: e.target.value})}
            />
            <Input 
              label="Email Address"
              value={profile.email}
              onChange={e => setProfile({...profile, email: e.target.value})}
            />
            <Input 
              label="Enterprise Role"
              value={profile.role}
              onChange={e => setProfile({...profile, role: e.target.value})}
            />
            <Input 
              label="Organization"
              value={profile.organization}
              onChange={e => setProfile({...profile, organization: e.target.value})}
            />
          </div>

          <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
            <span className="text-xs font-semibold text-gray-500">
              Changes reflect across your reports header.
            </span>
            <Button variant="yellow" size="sm" onClick={handleSave}>
              {saved ? (
                <>
                  <Check className="w-4 h-4 mr-1.5 stroke-[3]" /> Saved!
                </>
              ) : 'Save Credentials'}
            </Button>
          </div>
        </Card>

        {/* API connection settings card */}
        <Card variant="white" hoverable={false} className="border-4 border-[#111111] shadow-[4px_4px_0px_0px_#111111] p-6 space-y-4">
          <div className="flex items-center gap-2 border-b-2 border-gray-100 pb-3">
            <Key className="w-5 h-5 text-[#FFB347] stroke-[2.5]" />
            <h3 className="font-display font-bold uppercase text-sm tracking-wide text-[#111111]">
              FastAPI Connection
            </h3>
          </div>

          <div className="space-y-4">
            <Dropdown 
              label="Environment"
              value="mock"
              options={[
                { value: 'mock', label: 'Local Seed Mock (Offline)' },
                { value: 'dev', label: 'FastAPI Dev (localhost:8000)' },
                { value: 'prod', label: 'Production API Gateway' }
              ]}
              disabled
            />
            <Input 
              label="API Connection Endpoint"
              value="http://localhost:8000/api/v1"
              disabled
            />
            <div className="p-3 border-2 border-[#111111] rounded-xl bg-gray-50 text-[10px] font-semibold text-gray-500 leading-relaxed">
              🚩 Decoupled Service structure is ready to bind. Switch Environment to dev once FastAPI backend container is operational.
            </div>
          </div>
        </Card>
      </div>

      {/* Permissions and security card */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5 space-y-3">
          <h4 className="text-sm font-black font-display uppercase tracking-tight flex items-center gap-2">
            <Bell className="w-4.5 h-4.5 stroke-[2.5] text-[#FF9ECF]" /> Notification Configurations
          </h4>
          <p className="text-xs font-semibold text-gray-500">
            Set alerts when regional consumer volume indicators fall below specific growth thresholds.
          </p>
        </Card>

        <Card variant="white" hoverable={false} className="border-3 border-[#111111] p-5 space-y-3">
          <h4 className="text-sm font-black font-display uppercase tracking-tight flex items-center gap-2">
            <Shield className="w-4.5 h-4.5 stroke-[2.5] text-[#6EE7B7]" /> Enterprise Security
          </h4>
          <p className="text-xs font-semibold text-gray-500">
            Logs audit traces of CSV downloads and report generations across organization roles.
          </p>
        </Card>
      </div>
    </div>
  );
};
export default SettingsPage;
