'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Users, Shield, Award, Download, Plus, LogOut, 
  Trash2, ToggleLeft, ToggleRight, Key, Sparkles,
  EyeOff,
  Eye
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';

interface BranchChief {
  id: number;
  branch_name: string;
  email: string;
  is_active: boolean;
  created_at: string;
}

interface Fighter {
  id: number;
  full_name: string;
  branch_chief_name?: string | null;
  address: string;
  height: number | string | null;
  weight: number | string | null;
  belt_color: string;
  belt_rank: string;
  international_registration_number: string;
  photo_url: string;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

interface Official {
  id: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  photo_url?: string | null;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

interface DanTest {
  id: number;
  full_name: string;
  position: string;
  email: string;
  phone: string;
  black_belt: string;
  dan: string;
  international_registration_number: string;
  passport_image_url?: string | null;
  branch_name: string;
  created_at: string;
}

const SHARED_BRANCH_CHIEF_PASSWORD = 'AllAsia2026#Kyoku!Access';

export default function AdminDashboardClient() {
  const router = useRouter();
  const [branchChiefs, setBranchChiefs] = useState<BranchChief[]>([]);
  const [fighters, setFighters] = useState<Fighter[]>([]);
  const [officials, setOfficials] = useState<Official[]>([]);
  const [danTests, setDanTests] = useState<DanTest[]>([]);
  const [loading, setLoading] = useState(true);
  
  // New branch chief form
  const [newBranchName, setNewBranchName] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [creating, setCreating] = useState(false);

  // Reset password
  const [resetPasswordId, setResetPasswordId] = useState<number | null>(null);
  const [resetPassword, setResetPassword] = useState('');
  const [showResetPassword, setShowResetPassword] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [chiefsRes, fightersRes, officialsRes, danTestsRes] = await Promise.all([
        fetch('/api/branch-chiefs'),
        fetch('/api/fighters'),
        fetch('/api/officials'),
        fetch('/api/dan-tests'),
      ]);

      if (chiefsRes.ok) {
        const data = await chiefsRes.json();
        setBranchChiefs(data.branchChiefs);
      }
      if (fightersRes.ok) {
        const data = await fightersRes.json();
        setFighters(data.fighters);
      }
      if (officialsRes.ok) {
        const data = await officialsRes.json();
        setOfficials(data.officials);
      }
      if (danTestsRes.ok) {
        const data = await danTestsRes.json();
        setDanTests(data.danTests);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/');
  };

  const handleCreateBranchChief = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);

    try {
      const res = await fetch('/api/branch-chiefs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branchName: newBranchName,
          email: newEmail,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setNewBranchName('');
        setNewEmail('');
        setCreateDialogOpen(false);
        alert(`Branch chief created. Shared password: ${data.sharedPassword || SHARED_BRANCH_CHIEF_PASSWORD}`);
        fetchData();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create branch chief');
      }
    } catch (error) {
      console.error('Create error:', error);
      alert('Failed to create branch chief');
    } finally {
      setCreating(false);
    }
  };

  const handleToggleActive = async (id: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ isActive: !currentStatus }),
      });

      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const handleResetPassword = async (id: number) => {
    if (!resetPassword) return;

    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: resetPassword }),
      });

      if (res.ok) {
        setResetPasswordId(null);
        setResetPassword('');
        alert('Password updated successfully');
      }
    } catch (error) {
      console.error('Reset password error:', error);
    }
  };

  const handleDeleteBranchChief = async (id: number) => {
    if (!confirm('Are you sure? This will also delete all fighters and officials registered by this branch.')) {
      return;
    }

    try {
      const res = await fetch(`/api/branch-chiefs/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const handleDeleteFighter = async (id: number) => {
    if (!confirm('Are you sure you want to delete this fighter?')) return;

    try {
      const res = await fetch(`/api/fighters/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete fighter error:', error);
    }
  };

  const handleDeleteOfficial = async (id: number) => {
    if (!confirm('Are you sure you want to delete this official?')) return;

    try {
      const res = await fetch(`/api/officials/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete official error:', error);
    }
  };

  const handleDeleteDanTest = async (id: number) => {
    if (!confirm('Are you sure you want to delete this dan test registration?')) return;

    try {
      const res = await fetch(`/api/dan-tests/${id}`, { method: 'DELETE' });
      if (res.ok) {
        fetchData();
      }
    } catch (error) {
      console.error('Delete dan test error:', error);
    }
  };

  const exportCSV = (type: string) => {
    window.open(`/api/export?type=${type}`, '_blank');
  };

  const formatWholeNumber = (value: number | string | null | undefined, unit: string) => {
    if (value === null || value === undefined || value === '') return '-';
    const numericValue = Number(value);
    if (Number.isNaN(numericValue)) return '-';
    return `${Math.trunc(numericValue)} ${unit}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[radial-linear(circle_at_top,hsl(var(--primary)/0.15),hsl(var(--background))_35%)]">
        <div className="rounded-2xl border bg-card/80 backdrop-blur px-6 py-4 text-muted-foreground shadow-lg">
          Loading admin portal...
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-[radial-linear(circle_at_top,hsl(var(--primary)/0.18),hsl(var(--background))_42%)]">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -left-20 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
        <div className="absolute top-40 -right-16 h-80 w-80 rounded-full bg-chart-1/10 blur-3xl" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-border/60 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between px-4 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-chart-3 shadow-lg shadow-primary/30">
              <Shield className="h-5 w-5 text-primary-foreground" />
            </div>
            <div>
              <h1 className="text-lg font-semibold tracking-tight text-foreground">Admin Portal</h1>
              <p className="text-xs text-muted-foreground">18th All Asia Open Karate Championship 2026</p>
            </div>
          </div>
          <Button variant="outline" size="sm" className="rounded-xl bg-card/70" onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Logout
          </Button>
        </div>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-8 md:py-10">
        <div className="mb-8 flex items-start justify-between gap-4 rounded-2xl border border-border/60 bg-card/70 p-5 shadow-sm backdrop-blur-sm">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.16em] text-primary">Control Center</p>
            <h2 className="mt-1 text-2xl font-semibold tracking-tight">Competition Operations Dashboard</h2>
            <p className="text-sm text-muted-foreground">Monitor registrations, manage credentials, and export records.</p>
          </div>
          <div className="hidden rounded-xl border border-primary/30 bg-primary/10 px-3 py-2 text-primary md:flex md:items-center md:gap-2">
            <Sparkles className="h-4 w-4" />
            <span className="text-xs font-medium">Live Admin Mode</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mb-8">
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Branch Chiefs</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{branchChiefs.length}</div>
              <p className="text-xs text-muted-foreground">
                {branchChiefs.filter(b => b.is_active).length} active
              </p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Fighters</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{fighters.length}</div>
              <p className="text-xs text-muted-foreground">Registered fighters</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Officials</CardTitle>
              <Shield className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{officials.length}</div>
              <p className="text-xs text-muted-foreground">Registered officials</p>
            </CardContent>
          </Card>
          <Card className="border-border/60 bg-card/75 shadow-sm backdrop-blur-sm">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">Dan Tests</CardTitle>
              <Award className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-foreground">{danTests.length}</div>
              <p className="text-xs text-muted-foreground">Dan test candidates</p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="branch-chiefs" className="space-y-4">
          <TabsList className="grid w-full grid-cols-4 rounded-xl border border-border/60 bg-card/80 p-1 backdrop-blur-sm md:w-fit md:min-w-140">
            <TabsTrigger value="branch-chiefs">Branch Chiefs</TabsTrigger>
            <TabsTrigger value="fighters">Fighters</TabsTrigger>
            <TabsTrigger value="officials">Officials</TabsTrigger>
            <TabsTrigger value="dan-tests">Dan Test</TabsTrigger>
          </TabsList>

          {/* Branch Chiefs Tab */}
          <TabsContent value="branch-chiefs">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Branch Chiefs</CardTitle>
                  <CardDescription>Manage branch chief accounts</CardDescription>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('branch_chiefs')}>
                    <Download className="mr-2 h-4 w-4" />
                    Export CSV
                  </Button>
                  <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm" className="rounded-xl">
                        <Plus className="mr-2 h-4 w-4" />
                        Add Branch Chief
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Create Branch Chief Account</DialogTitle>
                        <DialogDescription>
                          Create a new login for a branch chief to register their fighters.
                        </DialogDescription>
                      </DialogHeader>
                      <form onSubmit={handleCreateBranchChief} className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="branchName">Branch Name</Label>
                          <Input
                            id="branchName"
                            placeholder="e.g., Tokyo Branch"
                            value={newBranchName}
                            onChange={(e) => setNewBranchName(e.target.value)}
                            required
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <div className="flex items-center gap-0 border border-input rounded-md overflow-hidden">
                            <Input
                              id="email"
                              type="text"
                              placeholder="username"
                              value={newEmail}
                              onChange={(e) => setNewEmail(e.target.value.split('@')[0])}
                              className="border-0 focus:ring-0"
                              required
                            />
                            <span className="px-3 py-2 bg-muted text-muted-foreground font-medium whitespace-nowrap">@kyokushinbd.com</span>
                          </div>
                          <p className="text-xs text-muted-foreground">Enter username only</p>
                        </div>
                        <div className="space-y-2">
                          <Label>Shared Password</Label>
                          <div className="rounded-md border border-input bg-muted/40 px-3 py-2 text-sm font-medium text-foreground">
                            {SHARED_BRANCH_CHIEF_PASSWORD}
                          </div>
                          <p className="text-xs text-muted-foreground">This same strong password will be used for every branch chief account.</p>
                        </div>
                        <Button type="submit" className="w-full" disabled={creating}>
                          {creating ? 'Creating...' : 'Create Account'}
                        </Button>
                      </form>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Branch Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Created</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {branchChiefs.map((chief) => (
                      <TableRow key={chief.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{chief.branch_name}</TableCell>
                        <TableCell>{chief.email}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                            chief.is_active 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {chief.is_active ? 'Active' : 'Inactive'}
                          </span>
                        </TableCell>
                        <TableCell>{new Date(chief.created_at).toLocaleDateString()}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleToggleActive(chief.id, chief.is_active)}
                              title={chief.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {chief.is_active ? (
                                <ToggleRight className="h-4 w-4 text-green-600" />
                              ) : (
                                <ToggleLeft className="h-4 w-4 text-muted-foreground" />
                              )}
                            </Button>
                            <Dialog open={resetPasswordId === chief.id} onOpenChange={(open) => !open && setResetPasswordId(null)}>
                              <DialogTrigger asChild>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setResetPasswordId(chief.id)}
                                  title="Reset Password"
                                >
                                  <Key className="h-4 w-4" />
                                </Button>
                              </DialogTrigger>
                              <DialogContent>
                                <DialogHeader>
                                  <DialogTitle>Reset Password</DialogTitle>
                                  <DialogDescription>
                                    Set a new password for {chief.branch_name}
                                  </DialogDescription>
                                </DialogHeader>
                                <div className="space-y-4">
                                  <div className="space-y-2">
                                    <Label htmlFor="resetPassword">New Password</Label>
                                    <div className="relative">
                                      <Input
                                        id="resetPassword"
                                        type={showResetPassword ? 'text' : 'password'}
                                        value={resetPassword}
                                        onChange={(e) => setResetPassword(e.target.value)}
                                      />
                                      <button
                                        type="button"
                                        onClick={() => setShowResetPassword(!showResetPassword)}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                                      >
                                        {showResetPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                      </button>
                                    </div>
                                  </div>
                                  <Button onClick={() => handleResetPassword(chief.id)} className="w-full">
                                    Update Password
                                  </Button>
                                </div>
                              </DialogContent>
                            </Dialog>
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteBranchChief(chief.id)}
                              title="Delete"
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {branchChiefs.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center text-muted-foreground py-8">
                          No branch chiefs registered yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Fighters Tab */}
          <TabsContent value="fighters">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Fighters</CardTitle>
                  <CardDescription>All fighters registered for the championship</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('fighters')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                {fighters.length > 0 ? (
                  <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                    {fighters.map((fighter) => (
                      <div
                        key={fighter.id}
                        className="rounded-2xl border border-border/60 bg-background/70 p-4 shadow-sm transition-colors hover:bg-muted/30"
                      >
                        <div className="mb-4 flex items-start justify-between gap-3">
                          <div className="flex items-center gap-3">
                            {fighter.photo_url ? (
                              <img
                                src={fighter.photo_url}
                                alt={fighter.full_name}
                                className="h-12 w-12 rounded-full border border-border object-cover"
                              />
                            ) : (
                              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                                <Users className="h-5 w-5 text-muted-foreground" />
                              </div>
                            )}
                            <div>
                              <p className="text-sm font-semibold leading-tight">{fighter.full_name}</p>
                              <p className="text-xs text-muted-foreground">{fighter.branch_name}</p>
                              {fighter.branch_chief_name && (
                                <p className="text-[11px] text-muted-foreground">Chief: {fighter.branch_chief_name}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-1">
                            {fighter.photo_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={fighter.photo_url}
                                  download={`fighter-${fighter.id}-photo`}
                                  aria-label={`Download photo of ${fighter.full_name}`}
                                >
                                  <Download className="h-4 w-4" />
                                </a>
                              </Button>
                            )}
                            {fighter.passport_image_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={fighter.passport_image_url}
                                  download={`fighter-${fighter.id}-passport`}
                                  aria-label={`Download passport image of ${fighter.full_name}`}
                                >
                                  <span className="text-xs">P</span>
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteFighter(fighter.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div className="rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Height</p>
                            <p className="font-medium">{formatWholeNumber(fighter.height, 'cm')}</p>
                          </div>
                          <div className="rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Weight</p>
                            <p className="font-medium">{formatWholeNumber(fighter.weight, 'kg')}</p>
                          </div>
                          <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Belt</p>
                            <p className="font-medium">
                              {fighter.belt_color || '-'} {fighter.belt_rank ? `(${fighter.belt_rank})` : ''}
                            </p>
                          </div>
                          <div className="col-span-2 rounded-lg bg-muted/40 px-3 py-2">
                            <p className="text-[11px] uppercase tracking-wide text-muted-foreground">Intl. Reg. No.</p>
                            <p className="font-medium break-all">{fighter.international_registration_number || '-'}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="py-8 text-center text-muted-foreground">
                    No fighters registered yet
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* Officials Tab */}
          <TabsContent value="officials">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Registered Officials</CardTitle>
                  <CardDescription>All officials registered for the championship</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('officials')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border/60">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Full Name</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Branch</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {officials.map((official) => (
                      <TableRow key={official.id} className="hover:bg-muted/40">
                        <TableCell className="font-medium">{official.full_name}</TableCell>
                        <TableCell>{official.position || '-'}</TableCell>
                        <TableCell>{official.email || '-'}</TableCell>
                        <TableCell>{official.phone || '-'}</TableCell>
                        <TableCell>{official.branch_name}</TableCell>
                        <TableCell className="text-right">
                          {official.photo_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={official.photo_url}
                                download={`official-${official.id}-photo`}
                                aria-label={`Download photo of ${official.full_name}`}
                              >
                                <Download className="h-4 w-4" />
                              </a>
                            </Button>
                          )}
                          {official.passport_image_url && (
                            <Button variant="ghost" size="sm" asChild>
                              <a
                                href={official.passport_image_url}
                                download={`official-${official.id}-passport`}
                                aria-label={`Download passport image of ${official.full_name}`}
                              >
                                <span className="text-xs">P</span>
                              </a>
                            </Button>
                          )}
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteOfficial(official.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    {officials.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center text-muted-foreground py-8">
                          No officials registered yet
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Dan Test Tab */}
          <TabsContent value="dan-tests">
            <Card className="border-border/60 bg-card/80 shadow-sm backdrop-blur-sm">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Dan Test Candidates</CardTitle>
                  <CardDescription>All dan test candidates registered for the championship</CardDescription>
                </div>
                <Button variant="outline" size="sm" className="rounded-xl" onClick={() => exportCSV('dan_tests')}>
                  <Download className="mr-2 h-4 w-4" />
                  Export CSV
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto rounded-xl border border-border/60">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Full Name</TableHead>
                        <TableHead>Position</TableHead>
                        <TableHead>Black Belt</TableHead>
                        <TableHead>Dan</TableHead>
                        <TableHead>Intl. Reg. No.</TableHead>
                        <TableHead>Branch</TableHead>
                        <TableHead className="text-right">Actions</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {danTests.map((danTest) => (
                        <TableRow key={danTest.id} className="hover:bg-muted/40">
                          <TableCell className="font-medium">{danTest.full_name}</TableCell>
                          <TableCell>{danTest.position || '-'}</TableCell>
                          <TableCell>{danTest.black_belt || '-'}</TableCell>
                          <TableCell>{danTest.dan || '-'}</TableCell>
                          <TableCell>{danTest.international_registration_number || '-'}</TableCell>
                          <TableCell>{danTest.branch_name}</TableCell>
                          <TableCell className="text-right">
                            {danTest.passport_image_url && (
                              <Button variant="ghost" size="sm" asChild>
                                <a
                                  href={danTest.passport_image_url}
                                  download={`dan-test-${danTest.id}-passport`}
                                  aria-label={`Download passport image of ${danTest.full_name}`}
                                >
                                  <span className="text-xs">P</span>
                                </a>
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="sm"
                              onClick={() => handleDeleteDanTest(danTest.id)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                      {danTests.length === 0 && (
                        <TableRow>
                          <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                            No dan test registrations yet
                          </TableCell>
                        </TableRow>
                      )}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
