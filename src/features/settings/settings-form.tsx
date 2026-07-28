'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import {
  Building2, Palette, Bell, Users, Sun, Plus, Save, Upload,
} from 'lucide-react'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/badge'
import { Avatar } from '@/components/ui/avatar'
import { Modal } from '@/components/ui/modal'
import { useToast } from '@/components/ui/toast'
import { staggerContainer, fadeInUp } from '@/animations'

const users = [
  { id: '1', name: 'Alex Morgan', email: 'alex@fleetflow.com', role: 'admin' as const, status: 'active' as const },
  { id: '2', name: 'Sarah Chen', email: 'sarah@fleetflow.com', role: 'fleet_manager' as const, status: 'active' as const },
  { id: '3', name: 'Marcus Johnson', email: 'marcus@fleetflow.com', role: 'fleet_manager' as const, status: 'active' as const },
  { id: '4', name: 'Emily Rodriguez', email: 'emily@fleetflow.com', role: 'driver' as const, status: 'active' as const },
  { id: '5', name: 'David Kim', email: 'david@fleetflow.com', role: 'driver' as const, status: 'inactive' as const },
  { id: '6', name: 'Lisa Thompson', email: 'lisa@fleetflow.com', role: 'driver' as const, status: 'active' as const },
]

const roleColors: Record<string, 'primary' | 'success' | 'purple'> = {
  admin: 'purple',
  fleet_manager: 'primary',
  driver: 'success',
}

export function SettingsForm() {
  const { addToast } = useToast()
  const [activeTab, setActiveTab] = useState('general')
  const [companyName, setCompanyName] = useState('FleetFlow Corp')
  const [industry, setIndustry] = useState('Transport')
  const [address, setAddress] = useState('123 Fleet Street')
  const [city, setCity] = useState('San Francisco')
  const [state, setState] = useState('CA')
  const [zip, setZip] = useState('94105')
  const [country, setCountry] = useState('United States')
  const [phone, setPhone] = useState('+1 (555) 000-0000')
  const [website, setWebsite] = useState('https://fleetflow.ai')
  const [darkMode, setDarkMode] = useState(true)
  const [theme, setTheme] = useState('dark')
  const [sidebarMode, setSidebarMode] = useState('always')
  const [compactMode, setCompactMode] = useState(false)
  const [fontSize, setFontSize] = useState('medium')
  const [primaryColor, setPrimaryColor] = useState('blue')
  const [notifMaintenance, setNotifMaintenance] = useState(true)
  const [notifInspection, setNotifInspection] = useState(true)
  const [notifLicense, setNotifLicense] = useState(true)
  const [notifInsurance, setNotifInsurance] = useState(true)
  const [notifFuel, setNotifFuel] = useState(false)
  const [notifWeekly, setNotifWeekly] = useState(true)
  const [showAddUser, setShowAddUser] = useState(false)

  const handleSave = () => {
    addToast({ title: 'Settings saved', description: 'Your settings have been updated successfully.', type: 'success' })
  }

  return (
    <motion.div variants={staggerContainer} initial="hidden" animate="visible">
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-6">
          <TabsTrigger value="general"><Building2 className="w-4 h-4 mr-2" />General</TabsTrigger>
          <TabsTrigger value="branding"><Palette className="w-4 h-4 mr-2" />Branding</TabsTrigger>
          <TabsTrigger value="notifications"><Bell className="w-4 h-4 mr-2" />Notifications</TabsTrigger>
          <TabsTrigger value="users"><Users className="w-4 h-4 mr-2" />Users & Roles</TabsTrigger>
          <TabsTrigger value="appearance"><Sun className="w-4 h-4 mr-2" />Appearance</TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Company Information</CardTitle>
                <CardDescription>Manage your workspace details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Company Name</label>
                    <input type="text" value={companyName} onChange={(e) => setCompanyName(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Industry</label>
                    <select value={industry} onChange={(e) => setIndustry(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors">
                      <option>Transport</option><option>Mining</option><option>Construction</option><option>Logistics</option><option>Delivery</option><option>Municipal</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Address</label>
                  <input type="text" value={address} onChange={(e) => setAddress(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                </div>
                <div className="grid grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">City</label>
                    <input type="text" value={city} onChange={(e) => setCity(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">State</label>
                    <input type="text" value={state} onChange={(e) => setState(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">ZIP</label>
                    <input type="text" value={zip} onChange={(e) => setZip(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Country</label>
                    <input type="text" value={country} onChange={(e) => setCountry(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Phone</label>
                    <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-neutral-300 mb-1.5">Website</label>
                    <input type="url" value={website} onChange={(e) => setWebsite(e.target.value)} className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="branding">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Branding</CardTitle>
                <CardDescription>Customize your workspace appearance</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-1.5">Company Logo</label>
                  <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-xl bg-blue-500/20 flex items-center justify-center">
                      <Building2 className="w-6 h-6 text-blue-400" />
                    </div>
                    <Button variant="outline" size="sm"><Upload className="w-4 h-4 mr-2" />Upload Logo</Button>
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-neutral-300 mb-3">Primary Color</label>
                  <div className="flex gap-3">
                    {['blue', 'emerald', 'purple', 'amber', 'red', 'cyan'].map((color) => (
                      <button
                        key={color}
                        onClick={() => setPrimaryColor(color)}
                        className={`w-8 h-8 rounded-full transition-all ${primaryColor === color ? 'ring-2 ring-white ring-offset-2 ring-offset-neutral-950 scale-110' : ''}`}
                        style={{ backgroundColor: color === 'blue' ? '#3b82f6' : color === 'emerald' ? '#10b981' : color === 'purple' ? '#8b5cf6' : color === 'amber' ? '#f59e0b' : color === 'red' ? '#ef4444' : '#06b6d4' }}
                      />
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-neutral-200">Dark Mode</p>
                      <p className="text-xs text-neutral-400">Use dark theme by default</p>
                    </div>
                    <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-300 mb-3">Preview</p>
                  <div className="p-6 rounded-xl bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-lg" style={{ backgroundColor: primaryColor === 'blue' ? '#3b82f6' : primaryColor === 'emerald' ? '#10b981' : primaryColor === 'purple' ? '#8b5cf6' : '#f59e0b' }} />
                      <span className="text-lg font-bold text-neutral-100">FleetFlow</span>
                    </div>
                    <div className="space-y-2">
                      <div className="h-2 w-48 rounded-full bg-neutral-800" />
                      <div className="h-2 w-32 rounded-full bg-neutral-800" />
                    </div>
                  </div>
                </div>
                <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="notifications">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Notification Preferences</CardTitle>
                <CardDescription>Choose what notifications to receive</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Maintenance Reminders</p>
                    <p className="text-xs text-neutral-400">Get notified about upcoming and overdue maintenance</p>
                  </div>
                  <Switch checked={notifMaintenance} onChange={() => setNotifMaintenance(!notifMaintenance)} />
                </div>
                <div className="border-t border-neutral-800" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Inspection Alerts</p>
                    <p className="text-xs text-neutral-400">Get notified about upcoming inspections</p>
                  </div>
                  <Switch checked={notifInspection} onChange={() => setNotifInspection(!notifInspection)} />
                </div>
                <div className="border-t border-neutral-800" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">License Expiry Alerts</p>
                    <p className="text-xs text-neutral-400">Get notified when driver licenses are expiring</p>
                  </div>
                  <Switch checked={notifLicense} onChange={() => setNotifLicense(!notifLicense)} />
                </div>
                <div className="border-t border-neutral-800" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Insurance Expiry Alerts</p>
                    <p className="text-xs text-neutral-400">Get notified about insurance renewals</p>
                  </div>
                  <Switch checked={notifInsurance} onChange={() => setNotifInsurance(!notifInsurance)} />
                </div>
                <div className="border-t border-neutral-800" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Fuel Anomaly Alerts</p>
                    <p className="text-xs text-neutral-400">Get notified about unusual fuel consumption</p>
                  </div>
                  <Switch checked={notifFuel} onChange={() => setNotifFuel(!notifFuel)} />
                </div>
                <div className="border-t border-neutral-800" />
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-neutral-200">Weekly Reports</p>
                    <p className="text-xs text-neutral-400">Receive weekly fleet performance reports via email</p>
                  </div>
                  <Switch checked={notifWeekly} onChange={() => setNotifWeekly(!notifWeekly)} />
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Preferences</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>

        <TabsContent value="users">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Users & Roles</CardTitle>
                    <CardDescription>Manage team members and permissions</CardDescription>
                  </div>
                  <Button size="sm" onClick={() => setShowAddUser(true)}><Plus className="w-4 h-4 mr-2" />Add User</Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {users.map((user) => (
                    <div key={user.id} className="flex items-center justify-between p-3 rounded-lg hover:bg-neutral-900/50 transition-colors">
                      <div className="flex items-center gap-3">
                        <Avatar name={user.name} size="sm" />
                        <div>
                          <p className="text-sm font-medium text-neutral-200">{user.name}</p>
                          <p className="text-xs text-neutral-400">{user.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <Badge variant={roleColors[user.role] || 'default'}>{user.role.replace('_', ' ')}</Badge>
                        <div className={`w-2 h-2 rounded-full ${user.status === 'active' ? 'bg-emerald-500' : 'bg-neutral-600'}`} />
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>

          <Modal isOpen={showAddUser} onClose={() => setShowAddUser(false)} title="Add User" description="Invite a new team member">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Full Name</label>
                <input type="text" placeholder="John Doe" className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Email</label>
                <input type="email" placeholder="john@company.com" className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors" />
              </div>
              <div>
                <label className="block text-sm font-medium text-neutral-300 mb-1.5">Role</label>
                <select className="w-full px-3 py-2 rounded-lg bg-neutral-900 border border-neutral-800 text-neutral-100 focus:outline-none focus:ring-2 focus:ring-blue-500/50 transition-colors">
                  <option>Admin</option>
                  <option>Fleet Manager</option>
                  <option>Driver</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="outline" onClick={() => setShowAddUser(false)}>Cancel</Button>
                <Button onClick={() => { setShowAddUser(false); addToast({ title: 'User invited', description: 'Invitation sent successfully.', type: 'success' }) }}>Send Invitation</Button>
              </div>
            </div>
          </Modal>
        </TabsContent>

        <TabsContent value="appearance">
          <motion.div variants={fadeInUp}>
            <Card>
              <CardHeader>
                <CardTitle>Appearance</CardTitle>
                <CardDescription>Customize your workspace look and feel</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <p className="text-sm font-medium text-neutral-200 mb-3">Theme</p>
                  <div className="flex gap-4">
                    {['dark', 'light', 'system'].map((t) => (
                      <button
                        key={t}
                        onClick={() => setTheme(t)}
                        className={`flex items-center gap-2 px-4 py-3 rounded-lg border transition-all ${theme === t ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                      >
                        <Sun className="w-4 h-4" />
                        <span className="text-sm capitalize">{t}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200 mb-3">Sidebar Behavior</p>
                  <div className="flex gap-4">
                    {[{ value: 'always', label: 'Always Show' }, { value: 'collapsed', label: 'Collapsed' }, { value: 'auto', label: 'Auto Hide' }].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => setSidebarMode(opt.value)}
                        className={`px-4 py-3 rounded-lg border transition-all ${sidebarMode === opt.value ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                      >
                        <span className="text-sm">{opt.label}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-neutral-200">Compact Mode</p>
                      <p className="text-xs text-neutral-400">Reduce spacing for a denser layout</p>
                    </div>
                    <Switch checked={compactMode} onChange={() => setCompactMode(!compactMode)} />
                  </div>
                </div>
                <div>
                  <p className="text-sm font-medium text-neutral-200 mb-3">Font Size</p>
                  <div className="flex gap-4">
                    {['small', 'medium', 'large'].map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`px-4 py-3 rounded-lg border transition-all ${fontSize === size ? 'bg-blue-500/10 border-blue-500/50 text-blue-400' : 'bg-neutral-900 border-neutral-800 text-neutral-400 hover:border-neutral-700'}`}
                      >
                        <span className="text-sm capitalize">{size}</span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="pt-2">
                  <Button onClick={handleSave}><Save className="w-4 h-4 mr-2" />Save Changes</Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </TabsContent>
      </Tabs>
    </motion.div>
  )
}
